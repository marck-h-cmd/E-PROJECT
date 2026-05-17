import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { v4 as uuidv4 } from 'uuid';
import { Usuario, Rol } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
  rol: Rol;
  tokenVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-me';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{
    usuario: Omit<Usuario, 'password'>;
    tokens: TokenPair;
  }> {
    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
    }

    if (!usuario.activo) {
      throw new AppError('Cuenta desactivada', 403, 'ACCOUNT_DISABLED');
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
    }

    // Generar tokens
    const tokens = await this.generateTokens(usuario);

    // Guardar sesión
    await this.createSession(usuario.id, tokens.refreshToken, ipAddress, userAgent);

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() },
    });

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verificar en base de datos
    const sesion = await prisma.sesion.findUnique({
      where: { refreshToken },
      include: { usuario: true },
    });

    if (!sesion || !sesion.activa || sesion.expiraEn < new Date()) {
      throw new AppError('Token de refresco inválido o expirado', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Invalidar sesión anterior
    await prisma.sesion.update({
      where: { id: sesion.id },
      data: { activa: false },
    });

    // Generar nuevos tokens
    const tokens = await this.generateTokens(sesion.usuario);

    // Crear nueva sesión
    await this.createSession(
      sesion.usuarioId,
      tokens.refreshToken,
      sesion.ipAddress || undefined,
      sesion.userAgent || undefined
    );

    return tokens;
  }

  async logout(userId: string, accessToken: string): Promise<void> {
    // Invalidar todas las sesiones del usuario o solo la actual
    await prisma.sesion.updateMany({
      where: {
        usuarioId: userId,
        activa: true,
      },
      data: {
        activa: false,
      },
    });

    // Agregar token a lista negra en Redis (con TTL)
    const tokenExpiry = this.getTokenExpiryFromJWT(accessToken);
    if (tokenExpiry) {
      await redis.set(
        `blacklist:${accessToken}`,
        '1',
        'EX',
        Math.ceil((tokenExpiry.getTime() - Date.now()) / 1000)
      );
    }
  }

  async cambiarPassword(
    userId: string,
    passwordActual: string,
    nuevaPassword: string
  ): Promise<void> {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    const isValidPassword = await bcrypt.compare(passwordActual, usuario.password);
    if (!isValidPassword) {
      throw new AppError('Contraseña actual incorrecta', 400, 'INVALID_CURRENT_PASSWORD');
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 12);

    await prisma.usuario.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: usuario.tokenVersion + 1, // Invalidar todos los tokens existentes
      },
    });

    // Invalidar todas las sesiones
    await prisma.sesion.updateMany({
      where: { usuarioId: userId, activa: true },
      data: { activa: false },
    });
  }

  async recuperarPassword(email: string): Promise<void> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      // Por seguridad, no revelamos si el email existe
      return;
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en Redis
    await redis.set(
      `password-reset:${resetToken}`,
      usuario.id,
      'EX',
      3600
    );

    // Aquí se enviaría el email con el token
    // Por ahora, solo retornamos (se implementará con el servicio de notificaciones)
  }

  async verificarTokenRecuperacion(token: string): Promise<string> {
    const userId = await redis.get(`password-reset:${token}`);
    if (!userId) {
      throw new AppError('Token inválido o expirado', 400, 'INVALID_RESET_TOKEN');
    }
    return userId;
  }

  async restablecerPassword(token: string, nuevaPassword: string): Promise<void> {
    const userId = await this.verificarTokenRecuperacion(token);

    const hashedPassword = await bcrypt.hash(nuevaPassword, 12);

    await prisma.usuario.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    // Invalidar todas las sesiones
    await prisma.sesion.updateMany({
      where: { usuarioId: userId, activa: true },
      data: { activa: false },
    });

    // Eliminar token de recuperación
    await redis.del(`password-reset:${token}`);
  }

  async verifyToken(accessToken: string): Promise<TokenPayload> {
    // Verificar si está en lista negra
    const isBlacklisted = await redis.get(`blacklist:${accessToken}`);
    if (isBlacklisted) {
      throw new AppError('Token inválido', 401, 'TOKEN_BLACKLISTED');
    }

    try {
      const decoded = jwt.verify(accessToken, this.jwtSecret) as TokenPayload;

      // Verificar que el usuario aún existe y está activo
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
      });

      if (!usuario || !usuario.activo) {
        throw new AppError('Usuario no encontrado o inactivo', 401, 'USER_INACTIVE');
      }

      // Verificar versión del token
      if (usuario.tokenVersion !== decoded.tokenVersion) {
        throw new AppError('Token expirado por cambio de credenciales', 401, 'TOKEN_VERSION_MISMATCH');
      }

      return decoded;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Token inválido o expirado', 401, 'INVALID_TOKEN');
    }
  }

  private async generateTokens(usuario: Usuario): Promise<TokenPair> {
    const payload: TokenPayload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      tokenVersion: usuario.tokenVersion,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { userId: usuario.id, type: 'refresh' },
      this.jwtRefreshSecret,
      { expiresIn: this.refreshTokenExpiry } as jwt.SignOptions
    );

    // Calcular expiración en segundos
    const expiresInMatch = this.accessTokenExpiry.match(/(\d+)([hd])/);
    let expiresIn = 86400; // default 24h
    if (expiresInMatch) {
      const value = parseInt(expiresInMatch[1]);
      const unit = expiresInMatch[2];
      expiresIn = unit === 'h' ? value * 3600 : value * 86400;
    }

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private async createSession(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const expiraEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await prisma.sesion.create({
      data: {
        usuarioId: userId,
        token: refreshToken,
        refreshToken,
        expiraEn,
        ipAddress,
        userAgent,
      },
    });
  }

  private getTokenExpiryFromJWT(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Error personalizado para la aplicación
export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 400, code: string = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}