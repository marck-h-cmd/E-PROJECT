export const DatabaseConfig = {
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  nombre: process.env.DB_NAME || 'unt_horarios',
  usuario: process.env.DB_USER || 'unt_admin',
  password: process.env.DB_PASSWORD,
  
  pool: {
    min: 2,
    max: 10,
  },
  
  logging: process.env.NODE_ENV === 'development',
};