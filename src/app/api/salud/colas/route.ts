import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    // Verificar estado de las colas
    const keys = await redis.keys('bull:*');
    const colas: any = {};

    for (const key of keys) {
      const tipo = await redis.type(key);
      const cantidad = tipo === 'list' ? await redis.llen(key) : 
                       tipo === 'zset' ? await redis.zcard(key) : 0;
      
      const nombreCola = key.replace('bull:', '');
      colas[nombreCola] = {
        tipo,
        elementosPendientes: cantidad,
        estado: 'active',
      };
    }

    return createSuccessResponse({
      totalColas: Object.keys(colas).length,
      colas,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error verificando colas:', error);
    return createErrorResponse('QUEUE_CHECK_FAILED', 'Error verificando estado de colas', 500);
  }
}