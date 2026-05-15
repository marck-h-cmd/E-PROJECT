import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { parse } from 'url';
import { redis } from '@/lib/redis';
import { TokenService } from '@/services/auth/TokenService';

export interface WSCliente {
  ws: WebSocket;
  userId: string;
  rol: string;
  canales: Set<string>;
}

export class ServidorWebSocket {
  private wss: WebSocketServer | null = null;
  private clientes: Map<string, WSCliente> = new Map();
  private canales: Map<string, Set<string>> = new Map(); // canal -> Set<clientId>
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  inicializar(server: HTTPServer): void {
    this.wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
      const { pathname } = parse(request.url || '', true);

      if (pathname === '/api/websocket') {
        this.wss!.handleUpgrade(request, socket, head, (ws) => {
          this.wss!.emit('connection', ws, request);
        });
      }
    });

    this.wss.on('connection', (ws: WebSocket, request: any) => {
      this.manejarConexion(ws, request);
    });

    this.suscribirRedis();
  }

  private async manejarConexion(ws: WebSocket, request: any): Promise<void> {
    try {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(4001, 'Token requerido');
        return;
      }

      // Verificar token
      const payload = await this.tokenService.validateToken(token);
      const clientId = `${payload.userId}-${Date.now()}`;

      // Registrar cliente
      const cliente: WSCliente = {
        ws,
        userId: payload.userId,
        rol: payload.rol,
        canales: new Set(),
      };

      this.clientes.set(clientId, cliente);

      // Suscribir a canales por defecto
      this.suscribirACanal(clientId, `usuario:${payload.userId}`);
      this.suscribirACanal(clientId, `rol:${payload.rol}`);
      this.suscribirACanal(clientId, 'general');

      ws.send(JSON.stringify({
        type: 'conectado',
        clientId,
        mensaje: 'Conectado al servidor WebSocket',
        timestamp: new Date().toISOString(),
      }));

      ws.on('message', (data: string) => {
        this.manejarMensaje(clientId, data);
      });

      ws.on('close', () => {
        this.manejarDesconexion(clientId);
      });

      ws.on('error', (error) => {
        console.error(`Error WebSocket cliente ${clientId}:`, error);
        this.manejarDesconexion(clientId);
      });

      // Enviar heartbeat cada 30 segundos
      const heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          clearInterval(heartbeat);
        }
      }, 30000);

    } catch (error) {
      console.error('Error en conexión WebSocket:', error);
      ws.close(4001, 'Error de autenticación');
    }
  }

  private manejarMensaje(clientId: string, data: string): void {
    try {
      const cliente = this.clientes.get(clientId);
      if (!cliente) return;

      const mensaje = JSON.parse(data);

      switch (mensaje.tipo) {
        case 'suscribir':
          if (mensaje.canal) {
            this.suscribirACanal(clientId, mensaje.canal);
          }
          break;

        case 'desuscribir':
          if (mensaje.canal) {
            this.desuscribirDeCanal(clientId, mensaje.canal);
          }
          break;

        case 'mensaje':
          if (mensaje.canal && mensaje.datos) {
            this.enviarACanal(mensaje.canal, {
              type: 'mensaje',
              from: clientId,
              data: mensaje.datos,
              timestamp: new Date().toISOString(),
            });
          }
          break;

        default:
          cliente.ws.send(JSON.stringify({
            type: 'error',
            mensaje: 'Tipo de mensaje no reconocido',
          }));
      }
    } catch (error) {
      console.error('Error procesando mensaje WebSocket:', error);
    }
  }

  private manejarDesconexion(clientId: string): void {
    const cliente = this.clientes.get(clientId);
    if (!cliente) return;

    // Eliminar de todos los canales
    for (const canal of cliente.canales) {
      const suscriptores = this.canales.get(canal);
      if (suscriptores) {
        suscriptores.delete(clientId);
        if (suscriptores.size === 0) {
          this.canales.delete(canal);
        }
      }
    }

    this.clientes.delete(clientId);
    console.log(`Cliente WebSocket desconectado: ${clientId}`);
  }

  private suscribirACanal(clientId: string, canal: string): void {
    const cliente = this.clientes.get(clientId);
    if (!cliente) return;

    if (!this.canales.has(canal)) {
      this.canales.set(canal, new Set());
    }

    this.canales.get(canal)!.add(clientId);
    cliente.canales.add(canal);

    // Suscribir en Redis para recibir mensajes de otras instancias
    redis.subscribe(`ws:${canal}`).catch(console.error);
  }

  private desuscribirDeCanal(clientId: string, canal: string): void {
    const cliente = this.clientes.get(clientId);
    if (!cliente) return;

    const suscriptores = this.canales.get(canal);
    if (suscriptores) {
      suscriptores.delete(clientId);
      if (suscriptores.size === 0) {
        this.canales.delete(canal);
        redis.unsubscribe(`ws:${canal}`).catch(console.error);
      }
    }

    cliente.canales.delete(canal);
  }

  enviarACanal(canal: string, mensaje: any): void {
    // Enviar a clientes locales
    const suscriptores = this.canales.get(canal);
    if (suscriptores) {
      const data = JSON.stringify(mensaje);
      for (const clientId of suscriptores) {
        const cliente = this.clientes.get(clientId);
        if (cliente && cliente.ws.readyState === WebSocket.OPEN) {
          cliente.ws.send(data);
        }
      }
    }

    // Publicar en Redis para otras instancias
    redis.publish(`ws:${canal}`, JSON.stringify(mensaje)).catch(console.error);
  }

  enviarAUsuario(userId: string, mensaje: any): void {
    this.enviarACanal(`usuario:${userId}`, mensaje);
  }

  enviarARol(rol: string, mensaje: any): void {
    this.enviarACanal(`rol:${rol}`, mensaje);
  }

  private suscribirRedis(): void {
    redis.on('message', (canal, mensaje) => {
      try {
        const canalNombre = canal.replace('ws:', '');
        const data = JSON.parse(mensaje);
        
        // Reenviar a clientes locales (evitar duplicados de Redis pub/sub)
        const suscriptores = this.canales.get(canalNombre);
        if (suscriptores) {
          const mensajeStr = JSON.stringify(data);
          for (const clientId of suscriptores) {
            const cliente = this.clientes.get(clientId);
            if (cliente && cliente.ws.readyState === WebSocket.OPEN) {
              cliente.ws.send(mensajeStr);
            }
          }
        }
      } catch (error) {
        console.error('Error reenviando mensaje de Redis:', error);
      }
    });
  }

  getEstadisticas(): {
    clientesConectados: number;
    canalesActivos: number;
    totalSuscripciones: number;
  } {
    return {
      clientesConectados: this.clientes.size,
      canalesActivos: this.canales.size,
      totalSuscripciones: Array.from(this.canales.values())
        .reduce((total, s) => total + s.size, 0),
    };
  }
}