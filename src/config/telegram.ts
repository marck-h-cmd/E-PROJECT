/**
 * Configuración del Bot de Telegram para notificaciones
 * 
 * Variables de entorno requeridas:
 * - TELEGRAM_BOT_TOKEN: Token del bot obtenido de @BotFather
 * - TELEGRAM_BOT_USERNAME: Nombre de usuario del bot (sin @)
 * - TELEGRAM_WEBHOOK_URL: URL pública para recibir actualizaciones (opcional)
 */

export interface TelegramConfig {
  /** Token del bot de Telegram */
  botToken: string;
  /** Nombre de usuario del bot */
  botUsername: string;
  /** URL del webhook para recibir mensajes */
  webhookUrl: string;
  /** Si el bot está correctamente configurado */
  configurado: boolean;
  /** URL base de la API de Telegram */
  apiUrl: string;
  /** URL del webhook de la API */
  apiWebhookUrl: string;
}

/**
 * Carga la configuración de Telegram desde variables de entorno.
 * Si no hay token configurado, registra advertencia pero no rompe la app.
 */
function cargarConfiguracion(): TelegramConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || '';
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL || '';

  const configurado = Boolean(botToken && botUsername);

  if (!configurado) {
    console.warn(
      '⚠️ [Telegram] Bot de Telegram no configurado. ' +
      'Las notificaciones por Telegram no estarán disponibles. ' +
      'Configure TELEGRAM_BOT_TOKEN y TELEGRAM_BOT_USERNAME en las variables de entorno.'
    );
  } else {
    console.log(
      `✅ [Telegram] Bot configurado: @${botUsername}` +
      (webhookUrl ? ` | Webhook: ${webhookUrl}` : ' (sin webhook)')
    );
  }

  return {
    botToken,
    botUsername,
    webhookUrl,
    configurado,
    apiUrl: `https://api.telegram.org/bot${botToken}`,
    apiWebhookUrl: `https://api.telegram.org/bot${botToken}/setWebhook`,
  };
}

// Singleton de configuración
let _config: TelegramConfig | null = null;

export function getTelegramConfig(): TelegramConfig {
  if (!_config) {
    _config = cargarConfiguracion();
  }
  return _config;
}

/**
 * Verifica si el bot de Telegram está disponible
 */
export function isTelegramAvailable(): boolean {
  return getTelegramConfig().configurado;
}

/**
 * Obtiene la URL de la API de Telegram para un método específico
 */
export function getTelegramApiUrl(metodo: string): string {
  const config = getTelegramConfig();
  return `${config.apiUrl}/${metodo}`;
}

/**
 * Comandos predefinidos del bot
 */
export const TELEGRAM_COMMANDS = {
  START: '/start',
  HELP: '/help',
  VERIFICAR: '/verificar',
  HORARIO: '/horario',
  NOTIFICACIONES: '/notificaciones',
  PREFERENCIAS: '/preferencias',
} as const;

/**
 * Mensajes predefinidos del bot
 */
export const TELEGRAM_MESSAGES = {
  BIENVENIDA: 
    '👋 ¡Bienvenido al Sistema de Gestión de Horarios de la UNT!\n\n' +
    'Use /verificar para vincular su cuenta.\n' +
    'Use /horario para consultar su horario.\n' +
    'Use /notificaciones para gestionar notificaciones.\n' +
    'Use /help para ver todos los comandos.',
  
  AYUDA:
    '📋 *Comandos disponibles:*\n\n' +
    '/start - Iniciar el bot\n' +
    '/verificar - Vincular su cuenta de docente\n' +
    '/horario - Consultar su horario actual\n' +
    '/notificaciones - Activar/desactivar notificaciones\n' +
    '/preferencias - Configurar preferencias\n' +
    '/help - Mostrar esta ayuda',
  
  NO_VERIFICADO:
    '⚠️ Su cuenta aún no está verificada. Use /verificar para vincular su cuenta de docente.',
  
  VERIFICACION_EXITOSA:
    '✅ ¡Cuenta verificada exitosamente! Ahora recibirá notificaciones de sus horarios.',
};