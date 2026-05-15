import axios from 'axios';
import { ServicioNotificacionBase, DatosNotificacion } from './ServicioNotificacionBase';
import { CanalNotificacion } from '@prisma/client';

export class ServicioWhatsApp extends ServicioNotificacionBase {
  protected canal: CanalNotificacion = 'WHATSAPP';
  private apiUrl: string;
  private apiKey: string;
  private phoneNumberId: string;

  constructor() {
    super();
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/v1';
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async enviar(datos: DatosNotificacion): Promise<boolean> {
    try {
      const notificacion = await this.crearNotificacion(datos);

      // Obtener número de WhatsApp del usuario
      const telefono = await this.obtenerTelefonoUsuario(datos.usuarioId);
      if (!telefono) {
        await this.registrarEnvio(notificacion.id, false, 'Usuario sin WhatsApp registrado');
        return false;
      }

      // Enviar mensaje
      const response = await axios.post(
        `${this.apiUrl}/messages`,
        {
          to: telefono,
          type: 'text',
          text: {
            body: this.formatearMensaje(datos),
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const exito = response.status === 200 || response.status === 201;
      await this.registrarEnvio(notificacion.id, exito);

      return exito;
    } catch (error: any) {
      console.error('Error enviando WhatsApp:', error);
      await this.registrarEnvio('', false, error.message);
      return false;
    }
  }

  async verificarConexion(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/health`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async verificarNumero(telefono: string): Promise<boolean> {
    try {
      // Verificar si el número tiene WhatsApp
      const response = await axios.post(
        `${this.apiUrl}/contacts`,
        {
          contacts: [telefono],
        },
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
        }
      );
      
      const contact = response.data.contacts?.[0];
      return contact?.status === 'valid';
    } catch {
      return false;
    }
  }

  async enviarPlantilla(
    telefono: string,
    plantillaNombre: string,
    parametros: string[]
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/messages`,
        {
          to: telefono,
          type: 'template',
          template: {
            name: plantillaNombre,
            language: { code: 'es' },
            components: [
              {
                type: 'body',
                parameters: parametros.map(text => ({ type: 'text', text })),
              },
            ],
          },
        },
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error enviando plantilla WhatsApp:', error);
      return false;
    }
  }

  private async obtenerTelefonoUsuario(usuarioId: string): Promise<string | null> {
    const docente = await prisma.docente.findFirst({
      where: { usuarioId },
      select: { whatsapp: true, verificadoWhatsapp: true },
    });

    return docente?.verificadoWhatsapp ? docente.whatsapp : null;
  }

  private formatearMensaje(datos: DatosNotificacion): string {
    let mensaje = `📋 *${datos.titulo}*\n\n`;
    mensaje += datos.mensaje;
    
    if (datos.metadata?.detalle) {
      mensaje += `\n\n📌 ${datos.metadata.detalle}`;
    }

    mensaje += '\n\n---\n';
    mensaje += '🏫 *Escuela de Ingeniería de Sistemas - UNT*\n';
    mensaje += '📅 Sistema de Gestión de Horarios';

    return mensaje;
  }
}

import { prisma } from '@/lib/prisma';