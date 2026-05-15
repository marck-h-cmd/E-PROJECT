import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { AppError } from './AuthService';

export interface TokenPayload {
  userId: string;
  email: string;
  rol: string;
  tokenVersion: number;
}

export class TokenService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret';
  }

  async validateToken(token: string): Promise<TokenPayload> {
    // Check blacklist
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('Token has been revoked', 401, 'TOKEN_REVOKED');
    }

    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    // Increment token version to invalidate all existing tokens
    await prisma.usuario.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });

    // Deactivate all sessions
    await prisma.sesion.updateMany({
      where: { usuarioId: userId, activa: true },
      data: { activa: false },
    });
  }
}