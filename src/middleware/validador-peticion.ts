import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError, ZodType } from 'zod';
import { createErrorResponse } from '@/lib/respuestas';

// Extender NextRequest para incluir datos validados
declare module 'next/server' {
  interface NextRequest {
    validatedBody?: any;
    validatedQuery?: any;
    validatedParams?: any;
  }
}

/**
 * Valida el body de una petición contra un esquema Zod.
 * Si la validación falla, retorna 400 con los errores detallados.
 * Si es exitoso, inyecta el body validado en request.validatedBody.
 * 
 * Uso:
 * ```typescript
 * import { z } from 'zod';
 * 
 * const crearHorarioSchema = z.object({
 *   periodoId: z.string().uuid(),
 *   cursoId: z.string().uuid(),
 *   // ...
 * });
 * 
 * export async function POST(request: NextRequest) {
 *   const validacion = await validateBody(request, crearHorarioSchema);
 *   if (validacion) return validacion; // Error de validación
 *   
 *   const datos = (request as any).validatedBody;
 *   // datos está tipado correctamente
 * }
 * ```
 */
export async function validateBody(
  request: NextRequest,
  schema: ZodSchema
): Promise<NextResponse | null> {
  try {
    let body: any;

    // Intentar parsear el body como JSON
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(
        'INVALID_JSON',
        'El cuerpo de la petición no es un JSON válido.',
        400
      );
    }

    // Validar contra el esquema
    const validated = schema.parse(body);
    
    // Inyectar el body validado en el request
    (request as any).validatedBody = validated;

    return null; // Sin error, continuar
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Los datos enviados no cumplen con el formato requerido.',
        400,
        error.errors.map(e => ({
          campo: e.path.join('.'),
          mensaje: e.message,
          codigo: e.code,
        }))
      );
    }

    console.error('Error inesperado en validateBody:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Error al procesar la validación de datos.',
      500
    );
  }
}

/**
 * Valida los query params de una petición contra un esquema Zod.
 * 
 * Uso:
 * ```typescript
 * const filtrosSchema = z.object({
 *   page: z.string().optional().default('1'),
 *   limit: z.string().optional().default('20'),
 *   search: z.string().optional(),
 * });
 * 
 * export async function GET(request: NextRequest) {
 *   const validacion = await validateQuery(request, filtrosSchema);
 *   if (validacion) return validacion;
 *   
 *   const query = (request as any).validatedQuery;
 * }
 * ```
 */
export async function validateQuery(
  request: NextRequest,
  schema: ZodSchema
): Promise<NextResponse | null> {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Convertir URLSearchParams a objeto plano
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Validar contra el esquema
    const validated = schema.parse(params);
    
    (request as any).validatedQuery = validated;

    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Los parámetros de consulta no cumplen con el formato requerido.',
        400,
        error.errors.map(e => ({
          parametro: e.path.join('.'),
          mensaje: e.message,
        }))
      );
    }

    console.error('Error inesperado en validateQuery:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Error al procesar la validación de parámetros.',
      500
    );
  }
}

/**
 * Valida tanto body como query params.
 * Útil para endpoints que reciben datos en ambos lugares.
 */
export async function validateBodyAndQuery(
  request: NextRequest,
  bodySchema: ZodSchema,
  querySchema: ZodSchema
): Promise<NextResponse | null> {
  // Validar query primero
  const queryResult = await validateQuery(request, querySchema);
  if (queryResult) return queryResult;

  // Luego validar body
  const bodyResult = await validateBody(request, bodySchema);
  if (bodyResult) return bodyResult;

  return null;
}

/**
 * Crea un middleware de validación preconfigurado.
 * 
 * Uso:
 * ```typescript
 * const validarCrearHorario = createBodyValidator(crearHorarioSchema);
 * 
 * export const POST = async (request: NextRequest) => {
 *   const error = await validarCrearHorario(request);
 *   if (error) return error;
 *   // ...
 * };
 * ```
 */
export function createBodyValidator(schema: ZodSchema) {
  return (request: NextRequest) => validateBody(request, schema);
}

/**
 * Crea un middleware de validación de query preconfigurado.
 */
export function createQueryValidator(schema: ZodSchema) {
  return (request: NextRequest) => validateQuery(request, schema);
}

/**
 * Valida datos genéricos contra un esquema Zod.
 * Útil para validar dentro de servicios, no solo en middleware.
 * Retorna los datos validados o lanza error de validación.
 */
export function validarConZod<T>(schema: ZodSchema<T>, datos: unknown): T {
  try {
    return schema.parse(datos);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(
        'Datos inválidos',
        error.errors.map(e => ({
          campo: e.path.join('.'),
          mensaje: e.message,
        }))
      );
    }
    throw error;
  }
}

/**
 * Error personalizado para validaciones
 */
export class ValidationError extends Error {
  public detalles: Array<{ campo: string; mensaje: string }>;

  constructor(mensaje: string, detalles: Array<{ campo: string; mensaje: string }>) {
    super(mensaje);
    this.name = 'ValidationError';
    this.detalles = detalles;
  }
}

/**
 * Esquemas comunes reutilizables
 */
export const esquemasComunes = {
  /** UUID válido */
  uuid: () => import('zod').then(z => z.string().uuid('UUID inválido')),
  
  /** Email válido */
  email: () => import('zod').then(z => z.string().email('Email inválido')),
  
  /** Hora en formato HH:mm */
  hora: () => import('zod').then(z => 
    z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)')
  ),
  
  /** Paginación estándar */
  paginacion: () => import('zod').then(z => z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
  })),
};