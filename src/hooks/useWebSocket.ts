import { useEffect, useRef, useCallback, useState } from 'react';
import type { WebSocketMessage } from '@/lib/tipos';

interface UseWebSocketOptions {
  url: string;
  onMensaje?: (msg: WebSocketMessage) => void;
  autoConectar?: boolean;
}

export function useWebSocket({ url, onMensaje, autoConectar = true }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [conectado, setConectado] = useState(false);

  const conectar = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket(url);
    ws.onopen = () => setConectado(true);
    ws.onclose = () => setConectado(false);
    ws.onmessage = (e) => {
      try {
        const msg: WebSocketMessage = JSON.parse(e.data);
        onMensaje?.(msg);
      } catch {}
    };
    wsRef.current = ws;
  }, [url, onMensaje]);

  const desconectar = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const enviar = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (autoConectar) conectar();
    return () => desconectar();
  }, [autoConectar, conectar, desconectar]);

  return { conectado, conectar, desconectar, enviar };
}