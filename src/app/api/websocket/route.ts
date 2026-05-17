import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, event, data } = body;

    if (!channel || !event) {
      return new Response('Faltan parámetros', { status: 400 });
    }

    await redis.publish(
      `ws:${channel}`,
      JSON.stringify({
        type: event,
        channel,
        data,
        timestamp: new Date().toISOString(),
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error emitiendo evento WebSocket:', error);
    return new Response('Error interno', { status: 500 });
  }
}
