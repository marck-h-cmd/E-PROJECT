import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { createErrorResponse } from '@/lib/respuestas';

export function validateBody(schema: ZodSchema) {
  return async function(request: NextRequest) {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      (request as any).validatedBody = validated;
      return null; // Continuar
    } catch (error) {
      if (error instanceof ZodError) {
        return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, error.errors);
      }
      return createErrorResponse('INVALID_REQUEST', 'Error al procesar la solicitud', 400);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async function(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const params = Object.fromEntries(searchParams.entries());
      const validated = schema.parse(params);
      (request as any).validatedQuery = validated;
      return null; // Continuar
    } catch (error) {
      if (error instanceof ZodError) {
        return createErrorResponse('VALIDATION_ERROR', 'Parámetros inválidos', 400, error.errors);
      }
      return createErrorResponse('INVALID_REQUEST', 'Error al procesar la solicitud', 400);
    }
  };
}