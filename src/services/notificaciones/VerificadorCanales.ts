import { prisma } from '@/lib/prisma';
import { ServicioCorreo } from './ServicioCorreo';
import { ServicioWhatsApp } from './ServicioWhatsApp';
import { ServicioTelegram } from './ServicioTelegram';
import { AppError } from '@/services/auth/AuthService';

export interface ResultadoVerificacion {
  canal: string;
  disponible: boolean;
  mensaje: string;
  error?: string;
}

export class VerificadorCanales {
  private servicioCorreo: ServicioCorreo;
  private servicioWhatsApp: ServicioWhatsApp;
  private servicioTelegram: ServicioTelegram;

  constructor() {
    this.servicioCorreo = new ServicioCorreo();
    this.servicioWhatsApp = new ServicioWhatsApp();
    this.servicioTelegram = new ServicioTelegram();
  }

  /**
   * Verifica todos los canales de notificación
   */
  async verificarTodos(): Promise<ResultadoVerificacion[]> {
    const resultados: ResultadoVerificacion[] = [];

    // Verificar correo
    const correoOk = await this.servicioCorreo.verificarConexion();
    resultados.push({
      canal: 'CORREO',
      disponible: correoOk,
      mensaje: correoOk ? 'Servicio de correo configurado correctamente' : 'Error en la configuración de correo',
    });

    // Verificar WhatsApp
    const whatsappOk = await this.servicioWhatsApp.verificarConexion();
    resultados.push({
      canal: 'WHATSAPP',
      disponible: whatsappOk,
      mensaje: whatsappOk ? 'API de WhatsApp conectada' : 'API de WhatsApp no disponible',
    });

    // Verificar Telegram
    const telegramOk = await this.servicioTelegram.verificarConexion();
    resultados.push({
      canal: 'TELEGRAM',
      disponible: telegramOk,
      mensaje: telegramOk ? 'Bot de Telegram conectado' : 'Bot de Telegram no configurado',
    });

    // Sistema siempre disponible
    resultados.push({
      canal: 'SISTEMA',
      disponible: true,
      mensaje: 'Notificaciones del sistema disponibles',
    });

    return resultados;
  }

  /**
   * Verifica un canal específico para un docente
   */
  async verificarCanalDocente(
    docenteId: string,
    canal: string
  ): Promise<ResultadoVerificacion> {
    const docente = await prisma.docente.findUnique({
      where: { id: docenteId },
      include: {
        usuario: { select: { email: true } },
        preferenciasNotificacion: true,
      },
    });

    if (!docente) {
      throw new AppError('Docente no encontrado', 404, 'DOCENTE_NOT_FOUND');
    }

    switch (canal) {
      case 'CORREO':
        return {
          canal: 'CORREO',
          disponible: !!docente.usuario.email,
          mensaje: docente.usuario.email 
            ? `Correo registrado: ${docente.usuario.email}` 
            : 'No tiene correo registrado',
        };

      case 'WHATSAPP':
        return {
          canal: 'WHATSAPP',
          disponible: !!(docente.whatsapp && docente.verificadoWhatsapp),
          mensaje: docente.verificadoWhatsapp 
            ? 'WhatsApp verificado' 
            : 'WhatsApp no verificado',
        };

      case 'TELEGRAM':
        return {
          canal: 'TELEGRAM',
          disponible: !!(docente.telegramId && docente.verificadoTelegram),
          mensaje: docente.verificadoTelegram 
            ? 'Telegram verificado' 
            : 'Telegram no verificado',
        };

      default:
        return {
          canal,
          disponible: true,
          mensaje: 'Canal disponible',
        };
    }
  }

  /**
   * Envía una verificación al docente (ej: código por WhatsApp)
   */
  async enviarVerificacion(
    docenteId: string,
    canal: string,
    destino: string
  ): Promise<string> {
    // Generar código de verificación
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar en Redis con expiración
    const key = `verificacion:${canal}:${docenteId}`;
    await redis.setex(key, 600, codigo); // 10 minutos

    // Enviar según el canal
    switch (canal) {
      case 'WHATSAPP':
        await this.servicioWhatsApp.enviar({
          usuarioId: docenteId,
          tipo: 'SISTEMA',
          titulo: 'Verificación de WhatsApp',
          mensaje: `Su código de verificación es: *${codigo}*\n\nVálido por 10 minutos.`,
          prioridad: 'ALTA',
          canal: 'WHATSAPP',
        });
        break;

      case 'TELEGRAM':
        await this.servicioTelegram.enviar({
          usuarioId: docenteId,
          tipo: 'SISTEMA',
          titulo: 'Verificación de Telegram',
          mensaje: `Su código de verificación es: ${codigo}\n\nVálido por 10 minutos.`,
          prioridad: 'ALTA',
          canal: 'TELEGRAM',
        });
        break;

      default:
        throw new AppError('Canal no soportado para verificación', 400, 'CANAL_NO_SOPORTADO');
    }

    return codigo;
  }

  /**
   * Confirma la verificación de un canal
   */
  async confirmarVerificacion(
    docenteId: string,
    canal: string,
    codigo: string
  ): Promise<boolean> {
    const key = `verificacion:${canal}:${docenteId}`;
    const codigoGuardado = await redis.get(key);

    if (!codigoGuardado || codigoGuardado !== codigo) {
      throw new AppError('Código de verificación inválido o expirado', 400, 'CODIGO_INVALIDO');
    }

    // Marcar como verificado
    switch (canal) {
      case 'WHATSAPP':
        await prisma.docente.update({
          where: { id: docenteId },
          data: { verificadoWhatsapp: true },
        });
        break;

      case 'TELEGRAM':
        await prisma.docente.update({
          where: { id: docenteId },
          data: { verificadoTelegram: true },
        });
        break;
    }

    // Eliminar código de verificación
    await redis.del(key);

    return true;
  }
}

import { redis } from '@/lib/redis';