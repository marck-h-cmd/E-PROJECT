import { z } from 'zod';

// Validador de email
export const emailSchema = z.string().email('Email inválido');

// Validador de contraseña
export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un carácter especial');

// Validador de código de docente
export const codigoDocenteSchema = z.string()
  .min(3, 'El código debe tener al menos 3 caracteres')
  .max(10, 'El código no puede tener más de 10 caracteres')
  .regex(/^[A-Z0-9]+$/, 'Solo letras mayúsculas y números');

// Validador de código de curso
export const codigoCursoSchema = z.string()
  .min(4, 'El código debe tener al menos 4 caracteres')
  .max(10, 'El código no puede tener más de 10 caracteres')
  .regex(/^[A-Z]{2}\d{3}$/, 'Formato: 2 letras mayúsculas + 3 números (ej: IS101)');

// Validador de hora (formato HH:mm)
export const horaSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)');

// Validador de UUID
export const uuidSchema = z.string().uuid('UUID inválido');

// Validador de teléfono
export const telefonoSchema = z.string()
  .regex(/^\+?[0-9]{9,15}$/, 'Número de teléfono inválido');

// Validador de página y límite
export const paginacionSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
});

// Validador de fechas
export const fechaSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
  .refine((fecha) => !isNaN(Date.parse(fecha)), 'Fecha inválida');

// Función para crear esquema de búsqueda
export function createSearchSchema() {
  return z.object({
    search: z.string().optional(),
    ...paginacionSchema.shape,
  });
}

// Validador de IDs de entidades
export const entidadIdSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

// Validador compuesto para crear docentes
export const crearDocenteSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nombre: z.string().min(2, 'Nombre muy corto').max(100),
  apellidos: z.string().min(2, 'Apellidos muy cortos').max(100),
  codigo: codigoDocenteSchema,
  categoria: z.enum(['PRINCIPAL', 'ASOCIADO', 'AUXILIAR', 'CONTRATADO', 'INVITADO']),
  departamento: z.string().optional(),
  telefono: telefonoSchema.optional(),
  whatsapp: telefonoSchema.optional(),
});

// Validador compuesto para crear cursos
export const crearCursoSchema = z.object({
  codigo: codigoCursoSchema,
  nombre: z.string().min(3, 'Nombre muy corto').max(200),
  creditos: z.number().int().min(1).max(10),
  horasTeoria: z.number().int().min(0).max(10),
  horasPractica: z.number().int().min(0).max(10),
  horasLaboratorio: z.number().int().min(0).max(10),
  ciclo: z.number().int().min(1).max(10),
  planEstudios: z.string().optional(),
});

// Validador compuesto para crear ambientes
export const crearAmbienteSchema = z.object({
  codigo: z.string().min(2).max(20),
  nombre: z.string().min(3).max(100),
  tipo: z.enum(['AULA', 'LABORATORIO', 'AUDITORIO', 'SALA_CONFERENCIAS']),
  capacidad: z.number().int().min(1).max(500),
  ubicacion: z.string().optional(),
});

// Validador compuesto para crear horarios
export const crearHorarioSchema = z.object({
  periodoId: uuidSchema,
  cursoId: uuidSchema,
  docenteId: uuidSchema,
  grupoId: uuidSchema.optional(),
  ambienteId: uuidSchema,
  diaSemana: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']),
  horaInicio: horaSchema,
  horaFin: horaSchema,
}).refine(
  (data) => data.horaInicio < data.horaFin,
  { message: 'La hora de inicio debe ser menor a la hora de fin', path: ['horaFin'] }
);

// Validador compuesto para crear períodos
export const crearPeriodoSchema = z.object({
  nombre: z.string().min(3).max(100),
  fechaInicio: fechaSchema,
  fechaFin: fechaSchema,
}).refine(
  (data) => data.fechaInicio < data.fechaFin,
  { message: 'La fecha de inicio debe ser menor a la fecha de fin', path: ['fechaFin'] }
);

// Validador para importar datos
export const importarSchema = z.object({
  tipo: z.enum(['docentes', 'cursos']),
  archivo: z.any(), // Se validará en el servicio
  sobrescribir: z.boolean().optional().default(false),
});