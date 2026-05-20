import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const notificarSchema = z.object({
  periodoId: z.string().uuid(),
});

const gestorNotificaciones = new GestorNotificaciones();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = notificarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const { periodoId } = validation.data;

    // 1. Obtener todas las ventanas activas o programadas del periodo
    const ventanas = await prisma.ventanaAtencion.findMany({
      where: {
        periodoId,
        estado: { in: ['PROGRAMADA', 'ABIERTA', 'EN_CURSO'] }
      },
      include: {
        atenciones: {
          where: { estado: 'ESPERANDO' },
          include: {
            docente: {
              include: {
                usuario: { select: { id: true, nombre: true, apellidos: true } }
              }
            }
          },
          orderBy: { posicion: 'asc' }
        }
      }
    });

    let notificacionesEnviadas = 0;

    for (const w of ventanas) {
      const timeInicio = w.fechaInicio.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      const fechaLegible = w.fechaInicio.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      for (const atencion of w.atenciones) {
        const nombreDocente = `${atencion.docente.usuario.nombre} ${atencion.docente.usuario.apellidos}`;

        // Enviar notificación de sistema
        try {
          await gestorNotificaciones.enviarNotificacion({
            usuarioId: atencion.docente.usuario.id,
            tipo: 'RECORDATORIO',
            titulo: 'Recordatorio de Turno de Atención',
            prioridad: 'MEDIA',
            canal: 'SISTEMA',
            mensaje: `Estimado(a) ${nombreDocente}, recuerde que tiene programada su atención para selección de horarios en la ventana "${w.nombre}" el día ${fechaLegible} a partir de las ${timeInicio}. Su posición actual en cola es la N° ${atencion.posicion}.`,
          });
        } catch (err) {
          console.error('Error enviando recordatorio por sistema:', err);
        }

        // Enviar notificación de correo
        try {
          await gestorNotificaciones.enviarNotificacion({
            usuarioId: atencion.docente.usuario.id,
            tipo: 'RECORDATORIO',
            titulo: 'Recordatorio: Turno de Atención para Registro de Horarios',
            prioridad: 'MEDIA',
            canal: 'CORREO',
            mensaje: `Estimado(a) ${nombreDocente},\n\nLe recordamos la programación de su turno de atención para el registro de sus horarios del período académico:\n\nVentana de Atención: ${w.nombre}\nFecha: ${fechaLegible}\nHora de Inicio: ${timeInicio}\nPosición de Atención: N° ${atencion.posicion}\n\nPor favor, conéctese a la plataforma a la hora indicada para realizar su selección.\n\nAtentamente,\nEscuela de Ingeniería de Sistemas - UNT`,
          });
        } catch (err) {
          console.error('Error enviando recordatorio por correo:', err);
        }

        notificacionesEnviadas++;
      }
    }

    return createSuccessResponse({
      mensaje: `Notificaciones de recordatorio enviadas a ${notificacionesEnviadas} docentes en espera.`,
      cantidad: notificacionesEnviadas,
    });

  } catch (error: any) {
    console.error('Error enviando notificaciones masivas:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al enviar notificaciones masivas', 500);
  }
}
