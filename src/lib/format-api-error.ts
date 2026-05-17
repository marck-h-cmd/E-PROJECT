import { ApiClientError } from '@/lib/api-client';

export function formatApiError(error: unknown, fallback = 'Ocurrió un error'): string {
  if (!(error instanceof ApiClientError)) {
    return error instanceof Error ? error.message : fallback;
  }

  const details = error.details;
  if (Array.isArray(details) && details.length > 0) {
    const messages = details
      .map((d: { message?: string; path?: (string | number)[] }) => {
        const field = d.path?.join('.') ?? '';
        return field ? `${field}: ${d.message}` : d.message;
      })
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join('. ');
    }
  }

  return error.message || fallback;
}

/** Normaliza "8:00" → "08:00" para cumplir validación HH:mm del API */
export function normalizeTimeHHmm(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value.trim();
  const hours = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const minutes = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
