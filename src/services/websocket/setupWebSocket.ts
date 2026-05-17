import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { parse } from 'url';
import { redis } from '@/lib/redis';

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

  wss.on('connection', (ws: WebSocket, request: { url?: string; headers: { host?: string } }) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    const channel = url.searchParams.get('channel') || 'general';

    if (!token) {
      ws.close(4001, 'Token requerido');
      return;
    }

    if (!conexionesActivas.has(channel)) {
      conexionesActivas.set(channel, new Set());
    }
    conexionesActivas.get(channel)!.add(ws);

    ws.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
      try {
        const mensaje = JSON.parse(data.toString());
        redis.publish(
          `ws:${channel}`,
          JSON.stringify({
            channel,
            data: mensaje,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
      }
    });

    ws.on('close', () => {
      const canal = conexionesActivas.get(channel);
      if (canal) {
        canal.delete(ws);
        if (canal.size === 0) {
          conexionesActivas.delete(channel);
        }
      }
    });

    ws.send(
      JSON.stringify({
        type: 'connected',
        channel,
        message: 'Conectado al servidor WebSocket',
        timestamp: new Date().toISOString(),
      })
    );
  });

  redis.subscribe('ws:*', (err, count) => {
    if (err) {
      console.error('Error suscribiéndose a Redis:', err);
    } else {
      console.log(`Suscrito a ${count} canales de Redis`);
    }
  });

  redis.on('message', (_channel, message) => {
    try {
      const data = JSON.parse(message);
      const wsChannel = data.channel;
      const conexiones = conexionesActivas.get(wsChannel);
      if (conexiones) {
        conexiones.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (error) {
      console.error('Error reenviando mensaje de Redis:', error);
    }
  });

  return wss;
}
