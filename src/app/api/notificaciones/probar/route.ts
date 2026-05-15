import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { ServicioCorreo } from '@/services/notificaciones/ServicioCorreo';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const gestorNotificaciones = new GestorNotificaciones();
const servicioCorreo = new ServicioCorreo();

const probarSchema = z.object({
  usuarioId: z.string().uuid(),
  canal: z.enum(['CORREO', 'WHATSAPP', 'TELEGRAM', 'SISTEMA']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = probarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const { usuarioId, canal } = validation.data;

    let resultado = false;
    let mensaje = '';

    if (canal === 'CORREO') {
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: { email: true, nombre: true },
      });

      resultado = await servicioCorreo.enviar({
        usuarioId,
        tipo: 'SISTEMA',
        titulo: 'Prueba de notificación - Sistema de Horarios UNT',
        mensaje: `Hola ${usuario?.nombre || 'Usuario'}, esta es una prueba de notificación del Sistema de Gestión de Horarios de la UNT. Si recibes este mensaje, la configuración de notificaciones por correo está funcionando correctamente.`,
        prioridad: 'BAJA',
        canal: 'CORREO',
        metadata: { tipo: 'prueba' },
      });

      mensaje = resultado 
        ? `Correo de prueba enviado exitosamente a ${usuario?.email}`
        : 'Error al enviar correo de prueba';
    } else {
      // Para otros canales, encolar notificación de prueba
      await gestorNotificaciones.enviarNotificacion({
        usuarioId,
        tipo: 'SISTEMA',
        titulo: 'Prueba de notificación',
        mensaje: 'Esta es una prueba de notificación del Sistema de Gestión de Horarios de la UNT.',
        prioridad: 'BAJA',
        canal,
        metadata: { tipo: 'prueba' },
      });

      resultado = true;
      mensaje = `Notificación de prueba encolada para canal ${canal}`;
    }

    return createSuccessResponse({
      exito: resultado,
      mensaje,
    });
  } catch (error: any) {
    console.error('Error probando notificación:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al probar notificación', 500);
  }
}

// Importación al final
import { prisma } from '@/lib/prisma';