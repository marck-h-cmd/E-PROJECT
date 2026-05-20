import { NextRequest } from 'next/server';
import { GestorVentanasAtencion } from '@/services/ventanas/GestorVentanasAtencion';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorVentanas = new GestorVentanasAtencion();
const gestorNotificaciones = new GestorNotificaciones();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resultado = await gestorVentanas.llamarSiguienteDocente(params.id);
    
    // Si se llamó a alguien, enviarle las notificaciones correspondientes
    if (!resultado.ventanaCerrada && resultado.atencion) {
      const { docente } = resultado.atencion;
      const usuarioId = docente.usuario.id;
      const nombreDocente = `${docente.usuario.nombre} ${docente.usuario.apellidos}`;
      const ventana = await gestorVentanas.obtenerVentana(params.id);

      // Enviar notificación por SISTEMA
      try {
        await gestorNotificaciones.enviarNotificacion({
          usuarioId,
          tipo: 'VENTANA_ATENCION',
          titulo: 'Es su turno de atención',
          mensaje: `Estimado(a) ${nombreDocente}, es su turno de atención en la ventana "${ventana.nombre}". Por favor, acérquese para registrar sus horarios.`,
          prioridad: 'URGENTE',
          canal: 'SISTEMA',
          metadata: { ventanaId: params.id, docenteId: docente.id },
        });
      } catch (error) {
        console.error('Error enviando notificación sistema:', error);
      }

      // Enviar notificación por CORREO
      try {
        await gestorNotificaciones.enviarNotificacion({
          usuarioId,
          tipo: 'VENTANA_ATENCION',
          titulo: 'Turno de atención - Gestión de Horarios',
          mensaje: `Estimado(a) ${nombreDocente},\n\nLe informamos que es su turno de atención en la ventana "${ventana.nombre}".\nPor favor, acérquese para registrar sus horarios.\n\nAtentamente,\nEscuela de Ingeniería de Sistemas - UNT`,
          prioridad: 'URGENTE',
          canal: 'CORREO',
          metadata: { ventanaId: params.id, docenteId: docente.id },
        });
      } catch (error) {
        console.error('Error enviando notificación correo:', error);
      }
    }

    return createSuccessResponse(resultado);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error llamando siguiente docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al llamar al siguiente docente', 500);
  }
}
