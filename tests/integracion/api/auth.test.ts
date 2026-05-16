import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService, AppError } from '@/services/auth/AuthService';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
    sesion: {
      create: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

describe('AuthService - Integración', () => {
  let authService: AuthService;

  const mockUsuario = {
    id: 'user-1',
    email: 'docente@unitru.edu.pe',
    password: '',
    nombre: 'Juan',
    apellidos: 'Pérez',
    rol: 'DOCENTE' as const,
    activo: true,
    verificado: true,
    tokenVersion: 0,
    ultimoAcceso: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    authService = new AuthService();
    vi.clearAllMocks();
    
    // Generar hash de contraseña real para pruebas
    const hash = await bcrypt.hash('Password123!', 12);
    mockUsuario.password = hash;
  });

  describe('login', () => {
    it('debe autenticar con credenciales válidas', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);
      (prisma.sesion.create as any).mockResolvedValueOnce({
        id: 'sesion-1',
        usuarioId: 'user-1',
        token: 'token-123',
        refreshToken: 'refresh-123',
        expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        activa: true,
      });
      (prisma.usuario.update as any).mockResolvedValueOnce({
        ...mockUsuario,
        ultimoAcceso: new Date(),
      });

      const resultado = await authService.login(
        'docente@unitru.edu.pe',
        'Password123!'
      );

      expect(resultado.usuario).toBeDefined();
      expect(resultado.usuario.email).toBe('docente@unitru.edu.pe');
      expect(resultado.tokens.accessToken).toBeDefined();
      expect(resultado.tokens.refreshToken).toBeDefined();
      // No debe incluir password
      expect((resultado.usuario as any).password).toBeUndefined();
    });

    it('debe crear una sesión al hacer login con los datos correctos', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);
      (prisma.sesion.create as any).mockResolvedValueOnce({});
      (prisma.usuario.update as any).mockResolvedValueOnce({});

      await authService.login('docente@unitru.edu.pe', 'Password123!');

      // Verificar que se llamó a create con los datos que realmente envía el servicio
      // El servicio envía: usuarioId, token (refreshToken), refreshToken, expiraEn, ipAddress, userAgent
      // NO envía activa explícitamente porque tiene default true en el esquema
      expect(prisma.sesion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            usuarioId: 'user-1',
            refreshToken: expect.any(String),
            expiraEn: expect.any(Date),
          }),
        })
      );

      // Verificar que los datos enviados son coherentes
      const createArgs = (prisma.sesion.create as any).mock.calls[0][0];
      expect(createArgs.data.usuarioId).toBe('user-1');
      expect(createArgs.data.refreshToken).toBeTruthy();
      expect(createArgs.data.token).toBe(createArgs.data.refreshToken); // token = refreshToken
      expect(createArgs.data.expiraEn).toBeInstanceOf(Date);
    });

    it('debe actualizar último acceso al hacer login', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);
      (prisma.sesion.create as any).mockResolvedValueOnce({});

      await authService.login('docente@unitru.edu.pe', 'Password123!');

      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({
            ultimoAcceso: expect.any(Date),
          }),
        })
      );
    });

    it('debe pasar IP y User-Agent a la sesión', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);
      (prisma.sesion.create as any).mockResolvedValueOnce({});
      (prisma.usuario.update as any).mockResolvedValueOnce({});

      await authService.login(
        'docente@unitru.edu.pe',
        'Password123!',
        '192.168.1.1',
        'Mozilla/5.0 Test'
      );

      expect(prisma.sesion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0 Test',
          }),
        })
      );
    });

    it('debe rechazar con credenciales inválidas', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);

      await expect(
        authService.login('docente@unitru.edu.pe', 'WrongPassword123!')
      ).rejects.toThrow(AppError);

      await expect(
        authService.login('docente@unitru.edu.pe', 'WrongPassword123!')
      ).rejects.toMatchObject({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    });

    it('debe rechazar si la cuenta está desactivada', async () => {
      const usuarioInactivo = { ...mockUsuario, activo: false };
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(usuarioInactivo);

      await expect(
        authService.login('docente@unitru.edu.pe', 'Password123!')
      ).rejects.toMatchObject({
        statusCode: 403,
        code: 'ACCOUNT_DISABLED',
      });
    });

    it('debe rechazar si el email no existe', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(null);

      await expect(
        authService.login('noexiste@unitru.edu.pe', 'Password123!')
      ).rejects.toMatchObject({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    });
  });

  describe('refreshToken', () => {
    it('debe renovar tokens con refresh token válido', async () => {
      const sesionValida = {
        id: 'sesion-1',
        usuarioId: 'user-1',
        token: 'refresh-token-123',
        refreshToken: 'refresh-token-123',
        expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        activa: true,
        ipAddress: null,
        userAgent: null,
        usuario: { ...mockUsuario },
      };

      (prisma.sesion.findUnique as any).mockResolvedValueOnce(sesionValida);
      (prisma.sesion.update as any).mockResolvedValueOnce({});
      (prisma.sesion.create as any).mockResolvedValueOnce({});

      const tokens = await authService.refreshToken('refresh-token-123');

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      // Debe invalidar la sesión anterior
      expect(prisma.sesion.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'sesion-1' },
          data: { activa: false },
        })
      );
    });

    it('debe rechazar refresh token expirado', async () => {
      const sesionExpirada = {
        id: 'sesion-2',
        usuarioId: 'user-1',
        token: 'refresh-token-expired',
        refreshToken: 'refresh-token-expired',
        expiraEn: new Date(Date.now() - 1000), // Ya expiró
        activa: true,
        ipAddress: null,
        userAgent: null,
        usuario: mockUsuario,
      };

      (prisma.sesion.findUnique as any).mockResolvedValueOnce(sesionExpirada);

      await expect(
        authService.refreshToken('refresh-token-expired')
      ).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });

  describe('logout', () => {
    it('debe invalidar sesiones activas del usuario', async () => {
      (prisma.sesion.updateMany as any).mockResolvedValueOnce({ count: 2 });

      await authService.logout('user-1', 'access-token-123');

      expect(prisma.sesion.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            usuarioId: 'user-1',
            activa: true,
          },
          data: { activa: false },
        })
      );
    });
  });

  describe('cambiarPassword', () => {
    it('debe cambiar contraseña con datos correctos', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);
      (prisma.usuario.update as any).mockResolvedValueOnce({});
      (prisma.sesion.updateMany as any).mockResolvedValueOnce({ count: 1 });

      await authService.cambiarPassword('user-1', 'Password123!', 'NewPassword456!');

      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({
            password: expect.any(String),
            tokenVersion: mockUsuario.tokenVersion + 1,
          }),
        })
      );

      // Debe invalidar todas las sesiones
      expect(prisma.sesion.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { usuarioId: 'user-1', activa: true },
          data: { activa: false },
        })
      );
    });

    it('debe rechazar si la contraseña actual es incorrecta', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(mockUsuario);

      await expect(
        authService.cambiarPassword('user-1', 'WrongPassword!', 'NewPassword456!')
      ).rejects.toMatchObject({
        statusCode: 400,
        code: 'INVALID_CURRENT_PASSWORD',
      });
    });

    it('debe rechazar si el usuario no existe', async () => {
      (prisma.usuario.findUnique as any).mockResolvedValueOnce(null);

      await expect(
        authService.cambiarPassword('no-existe', 'Password123!', 'NewPassword456!')
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    });
  });
});