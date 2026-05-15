export const RedisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  
  prefijos: {
    sesion: 'sesion:',
    cache: 'cache:',
    cola: 'bull:',
    seleccion: 'seleccion:',
    disponibilidad: 'disponibilidad:',
    ws: 'ws:',
  },
  
  ttl: {
    sesion: 86400, // 24 horas
    cache: 3600,   // 1 hora
    seleccion: 1800, // 30 minutos
    disponibilidad: 300, // 5 minutos
  },
};