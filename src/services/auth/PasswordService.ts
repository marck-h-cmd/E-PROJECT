import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { AppError } from './AuthService';

export class PasswordService {
  private readonly SALT_ROUNDS = 12;
  private readonly MIN_LENGTH = 8;
  private readonly RESET_TOKEN_EXPIRY = 3600; // 1 hora en segundos

  /**
   * Hashea una contraseña usando bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    this.validatePasswordStrength(password);
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verifica si una contraseña coincide con su hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Valida la fortaleza de una contraseña
   */
  validatePasswordStrength(password: string): void {
    const errors: string[] = [];

    if (password.length < this.MIN_LENGTH) {
      errors.push(`La contraseña debe tener al menos ${this.MIN_LENGTH} caracteres`);
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }

    if (errors.length > 0) {
      throw new AppError(errors.join('. '), 400, 'WEAK_PASSWORD');
    }
  }

  /**
   * Genera un token de recuperación de contraseña
   */
  async generateResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Guardar token hasheado en Redis
    await redis.setex(
      `password-reset:${hashedToken}`,
      this.RESET_TOKEN_EXPIRY,
      userId
    );

    return token;
  }

  /**
   * Verifica un token de recuperación de contraseña
   */
  async verifyResetToken(token: string): Promise<string> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const userId = await redis.get(`password-reset:${hashedToken}`);

    if (!userId) {
      throw new AppError('Token de recuperación inválido o expirado', 400, 'INVALID_RESET_TOKEN');
    }

    return userId;
  }

  /**
   * Invalida un token de recuperación después de usarlo
   */
  async invalidateResetToken(token: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    await redis.del(`password-reset:${hashedToken}`);
  }

  /**
   * Verifica si una contraseña ha sido comprometida (simplificado)
   */
  async isPasswordCompromised(password: string): Promise<boolean> {
    // Lista de contraseñas comunes que no deberían usarse
    const commonPasswords = [
      '12345678', 'password', '123456789', '1234567890',
      'qwerty123', 'admin123', 'unt123456', 'sistemas2024',
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Genera una contraseña aleatoria segura
   */
  generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Asegurar al menos uno de cada tipo
    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    // Completar el resto
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Mezclar los caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Verifica el historial de contraseñas para evitar reutilización
   */
  async isPasswordReused(userId: string, newPassword: string): Promise<boolean> {
    // En una implementación real, se mantendría un historial de hashes
    // Por ahora, solo verificamos contra la contraseña actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!usuario) return false;

    return bcrypt.compare(newPassword, usuario.password);
  }

  /**
   * Calcula la fortaleza de una contraseña (0-100)
   */
  calculatePasswordStrength(password: string): number {
    let score = 0;

    // Longitud
    if (password.length >= 12) score += 25;
    else if (password.length >= 10) score += 20;
    else if (password.length >= 8) score += 15;

    // Complejidad
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

    // Variedad de caracteres
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 10) score += 10;
    else if (uniqueChars >= 7) score += 5;

    return Math.min(100, score);
  }

  /**
   * Obtiene una descripción de la fortaleza de la contraseña
   */
  getPasswordStrengthLabel(strength: number): string {
    if (strength >= 80) return 'Muy Fuerte';
    if (strength >= 60) return 'Fuerte';
    if (strength >= 40) return 'Moderada';
    if (strength >= 20) return 'Débil';
    return 'Muy Débil';
  }
}