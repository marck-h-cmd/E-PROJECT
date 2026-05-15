import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';
import { parse } from 'url';
import { redis } from '@/lib/redis';

// Mapa de conexiones activas
const conexionesActivas = new Map<string, Set<WebSocket>>();

export function setupWebSocket(server: HTTPServer) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url || '', true);

    if (pathname === '/api/websocket') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws: WebSocket, request: any) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    const channel = url.searchParams.get('channel') || 'general';

    // Verificar token (simplificado)
    if (!token) {
      ws.close(4001, 'Token requerido');
      return;
    }

    // Registrar conexión
    if (!conexionesActivas.has(channel)) {
      conexionesActivas.set(channel, new Set());
    }
    conexionesActivas.get(channel)!.add(ws);

    console.log(`🔌 Cliente conectado al canal: ${channel}`);

    // Manejar mensajes
    ws.on('message', (data: string) => {
      try {
        const mensaje = JSON.parse(data);
        
        // Publicar en Redis para que otras instancias lo reciban
        redis.publish(`ws:${channel}`, JSON.stringify({
          channel,
          data: mensaje,
          timestamp: new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
      }
    });

    // Manejar desconexión
    ws.on('close', () => {
      const canal = conexionesActivas.get(channel);
      if (canal) {
        canal.delete(ws);
        if (canal.size === 0) {
          conexionesActivas.delete(channel);
        }
      }
      console.log(`🔌 Cliente desconectado del canal: ${channel}`);
    });

    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({
      type: 'connected',
      channel,
      message: 'Conectado al servidor WebSocket',
      timestamp: new Date().toISOString(),
    }));
  });

  // Suscribirse a eventos de Redis para reenviar mensajes
  redis.subscribe('ws:*', (err, count) => {
    if (err) {
      console.error('Error suscribiéndose a Redis:', err);
    } else {
      console.log(`📡 Suscrito a ${count} canales de Redis`);
    }
  });

  redis.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);
      const wsChannel = data.channel;
      
      const conexiones = conexionesActivas.get(wsChannel);
      if (conexiones) {
        conexiones.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
          }
        });
      }
    } catch (error) {
      console.error('Error reenviando mensaje de Redis:', error);
    }
  });

  return wss;
}

// Endpoint para emitir eventos desde HTTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, event, data } = body;

    if (!channel || !event) {
      return new Response('Faltan parámetros', { status: 400 });
    }

    // Publicar en Redis
    await redis.publish(`ws:${channel}`, JSON.stringify({
      type: event,
      channel,
      data,
      timestamp: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error emitiendo evento WebSocket:', error);
    return new Response('Error interno', { status: 500 });
  }
}