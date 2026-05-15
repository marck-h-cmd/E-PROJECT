import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const checks = {
      server: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    };

    // Verificar base de datos
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.services.database = 'healthy';
    } catch (error) {
      checks.services.database = 'unhealthy';
    }

    // Verificar Redis
    try {
      const ping = await redis.ping();
      checks.services.redis = ping === 'PONG' ? 'healthy' : 'unhealthy';
    } catch (error) {
      checks.services.redis = 'unhealthy';
    }

    const isHealthy = Object.values(checks.services).every(s => s === 'healthy');
    
    return createSuccessResponse(checks, undefined, isHealthy ? 200 : 503);
  } catch (error) {
    console.error('Error en health check:', error);
    return createErrorResponse('HEALTH_CHECK_FAILED', 'Error verificando salud del sistema', 500);
  }
}