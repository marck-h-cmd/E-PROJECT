import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    // Obtener configuración general del sistema desde Redis
    const configStr = await redis.get('config:sistema');
    const config = configStr ? JSON.parse(configStr) : {
      nombreApp: 'Sistema de Gestión de Horarios - UNT',
      version: '1.0.0',
      maxIntentosLogin: 5,
      tiempoBloqueoMinutos: 30,
      notificacionesActivas: true,
      auditoriaActiva: true,
    };

    return createSuccessResponse(config);
  } catch (error: any) {
    console.error('Error obteniendo configuración:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener configuración', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    await redis.set('config:sistema', JSON.stringify(body));

    return createSuccessResponse({ message: 'Configuración actualizada exitosamente' });
  } catch (error: any) {
    console.error('Error actualizando configuración:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar configuración', 500);
  }
}