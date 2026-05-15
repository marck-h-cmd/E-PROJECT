export const AppConfig = {
  nombre: process.env.APP_NAME || 'Sistema de Gestión de Horarios - UNT',
  url: process.env.APP_URL || 'http://localhost:3000',
  puerto: parseInt(process.env.APP_PORT || '3000'),
  entorno: process.env.NODE_ENV || 'development',
  
  jwt: {
    secreto: process.env.JWT_SECRET || 'default-secret',
    expiracion: process.env.JWT_EXPIRES_IN || '24h',
    refrescoSecreto: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refrescoExpiracion: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  cors: {
    origen: process.env.CORS_ORIGIN || '*',
  },
  
  rateLimit: {
    ventana: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxPeticiones: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  
  logging: {
    nivel: process.env.LOG_LEVEL || 'info',
  },
};