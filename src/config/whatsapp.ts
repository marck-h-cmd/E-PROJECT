/**
 * Configuración de WhatsApp Business API (Meta Cloud API)
 * 
 * Variables de entorno requeridas:
 * - WHATSAPP_API_URL: URL base de la API de WhatsApp
 * - WHATSAPP_TOKEN: Token de acceso de la API
 * - WHATSAPP_NUMERO_TELEFONO_ID: ID del número de teléfono de WhatsApp Business
 */

export interface WhatsAppConfig {
  /** URL base de la API de WhatsApp Cloud */
  apiUrl: string;
  /** Token de acceso permanente */
  token: string;
  /** ID del número de teléfono de WhatsApp Business */
  numeroTelefonoId: string;
  /** Si la API está correctamente configurada */
  configurado: boolean;
  /** Versión de la API */
  version: string;
  /** URL completa para enviar mensajes */
  mensajesUrl: string;
  /** URL para verificar contactos */
  contactosUrl: string;
}

/**
 * Carga la configuración de WhatsApp desde variables de entorno.
 * Si no hay credenciales configuradas, registra advertencia pero no rompe la app.
 */
function cargarConfiguracion(): WhatsAppConfig {
  const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com';
  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_KEY || '';
  const numeroTelefonoId = process.env.WHATSAPP_NUMERO_TELEFONO_ID || 
                            process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const version = 'v18.0'; // Versión estable de la API

  const configurado = Boolean(token && numeroTelefonoId);

  if (!configurado) {
    console.warn(
      '⚠️ [WhatsApp] API de WhatsApp no configurada. ' +
      'Las notificaciones por WhatsApp no estarán disponibles. ' +
      'Configure WHATSAPP_TOKEN y WHATSAPP_NUMERO_TELEFONO_ID en las variables de entorno.'
    );
  } else {
    console.log(
      `✅ [WhatsApp] API configurada | ` +
      `Phone ID: ${numeroTelefonoId.substring(0, 6)}... | ` +
      `API: ${apiUrl}/${version}`
    );
  }

  return {
    apiUrl,
    token,
    numeroTelefonoId,
    configurado,
    version,
    mensajesUrl: `${apiUrl}/${version}/${numeroTelefonoId}/messages`,
    contactosUrl: `${apiUrl}/${version}/${numeroTelefonoId}/contacts`,
  };
}

// Singleton de configuración
let _config: WhatsAppConfig | null = null;

export function getWhatsAppConfig(): WhatsAppConfig {
  if (!_config) {
    _config = cargarConfiguracion();
  }
  return _config;
}

/**
 * Verifica si la API de WhatsApp está disponible
 */
export function isWhatsAppAvailable(): boolean {
  return getWhatsAppConfig().configurado;
}

/**
 * Obtiene los headers de autorización para la API
 */
export function getWhatsAppHeaders(): Record<string, string> {
  const config = getWhatsAppConfig();
  return {
    'Authorization': `Bearer ${config.token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Tipos de mensaje soportados por WhatsApp
 */
export const WHATSAPP_MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  DOCUMENT: 'document',
  TEMPLATE: 'template',
  INTERACTIVE: 'interactive',
} as const;

/**
 * Plantillas de mensaje predefinidas para WhatsApp
 */
export const WHATSAPP_TEMPLATES = {
  CONFIRMACION_HORARIO: 'confirmacion_horario_unt',
  RECORDATORIO_VENTANA: 'recordatorio_ventana_unt',
  CAMBIO_HORARIO: 'cambio_horario_unt',
} as const;

/**
 * Estructura de un mensaje de texto para WhatsApp
 */
export interface WhatsAppTextMessage {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text';
  text: {
    preview_url: boolean;
    body: string;
  };
}

/**
 * Crea un mensaje de texto para WhatsApp
 */
export function crearMensajeTexto(telefono: string, texto: string): WhatsAppTextMessage {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: telefono,
    type: 'text',
    text: {
      preview_url: false,
      body: texto,
    },
  };
}

/**
 * Crea un mensaje de plantilla para WhatsApp
 */
export function crearMensajePlantilla(
  telefono: string,
  nombrePlantilla: string,
  parametros?: string[]
): any {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: telefono,
    type: 'template',
    template: {
      name: nombrePlantilla,
      language: { code: 'es' },
      components: parametros ? [
        {
          type: 'body',
          parameters: parametros.map(text => ({ type: 'text', text })),
        },
      ] : undefined,
    },
  };
}

/**
 * Formatea un número de teléfono para WhatsApp
 * Asegura el formato internacional sin + ni espacios
 */
export function formatearTelefonoWhatsApp(telefono: string): string {
  // Eliminar espacios, guiones, paréntesis y el signo +
  let limpio = telefono.replace(/[\s\-\(\)\+]/g, '');
  
  // Si empieza con 51 (Perú), asegurar que tenga 11 dígitos
  if (limpio.startsWith('51') && limpio.length === 11) {
    return limpio;
  }
  
  // Si es un número peruano de 9 dígitos, agregar código de país
  if (limpio.length === 9) {
    return `51${limpio}`;
  }
  
  return limpio;
}