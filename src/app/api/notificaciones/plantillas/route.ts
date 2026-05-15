import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const PLANTILLAS_KEY = 'config:plantillas:notificaciones';

const plantillaSchema = z.object({
  nombre: z.string().min(1).max(100),
  tipo: z.string(),
  canal: z.enum(['CORREO', 'WHATSAPP', 'TELEGRAM', 'SISTEMA']),
  asunto: z.string().optional(),
  cuerpo: z.string(),
  variables: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const plantillasStr = await redis.get(PLANTILLAS_KEY);
    const plantillas = plantillasStr ? JSON.parse(plantillasStr) : [];

    return createSuccessResponse(plantillas);
  } catch (error: any) {
    console.error('Error obteniendo plantillas:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener plantillas', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = plantillaSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const plantillasStr = await redis.get(PLANTILLAS_KEY);
    const plantillas = plantillasStr ? JSON.parse(plantillasStr) : [];

    const nuevaPlantilla = {
      id: Date.now().toString(),
      ...validation.data,
      creadaEn: new Date().toISOString(),
    };

    plantillas.push(nuevaPlantilla);
    await redis.set(PLANTILLAS_KEY, JSON.stringify(plantillas));

    return createSuccessResponse(nuevaPlantilla, undefined, 201);
  } catch (error: any) {
    console.error('Error creando plantilla:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear plantilla', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...datos } = body;

    if (!id) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID de la plantilla', 400);
    }

    const plantillasStr = await redis.get(PLANTILLAS_KEY);
    const plantillas = plantillasStr ? JSON.parse(plantillasStr) : [];

    const indice = plantillas.findIndex((p: any) => p.id === id);
    if (indice === -1) {
      return createErrorResponse('NOT_FOUND', 'Plantilla no encontrada', 404);
    }

    plantillas[indice] = { ...plantillas[indice], ...datos, actualizadaEn: new Date().toISOString() };
    await redis.set(PLANTILLAS_KEY, JSON.stringify(plantillas));

    return createSuccessResponse(plantillas[indice]);
  } catch (error: any) {
    console.error('Error actualizando plantilla:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar plantilla', 500);
  }
}