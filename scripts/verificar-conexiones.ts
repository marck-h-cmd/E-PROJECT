import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import axios from 'axios';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);

async function verificarConexiones() {
  console.log('🔍 Verificando conexiones...\n');

  // Verificar PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL: Conectado');
  } catch (error) {
    console.error('❌ PostgreSQL: Error de conexión:', error);
  }

  // Verificar Redis
  try {
    const ping = await redis.ping();
    if (ping === 'PONG') {
      console.log('✅ Redis: Conectado');
    } else {
      console.error('❌ Redis: Respuesta inesperada:', ping);
    }
  } catch (error) {
    console.error('❌ Redis: Error de conexión:', error);
  }

  // Verificar SMTP
  if (process.env.SMTP_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      await transporter.verify();
      console.log('✅ SMTP: Conectado');
    } catch (error) {
      console.error('❌ SMTP: Error de conexión:', error);
    }
  } else {
    console.log('⚠️  SMTP: No configurado');
  }

  // Verificar WhatsApp API
  if (process.env.WHATSAPP_API_KEY) {
    try {
      const response = await axios.get(`${process.env.WHATSAPP_API_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
        },
      });
      console.log('✅ WhatsApp API: Conectado');
    } catch (error) {
      console.error('❌ WhatsApp API: Error de conexión:', error);
    }
  } else {
    console.log('⚠️  WhatsApp API: No configurado');
  }

  // Verificar Telegram
  if (process.env.TELEGRAM_BOT_TOKEN) {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`
      );
      console.log('✅ Telegram Bot: Conectado -', response.data.result.username);
    } catch (error) {
      console.error('❌ Telegram Bot: Error de conexión:', error);
    }
  } else {
    console.log('⚠️  Telegram Bot: No configurado');
  }

  console.log('\n🏁 Verificación completada');
}

verificarConexiones()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });