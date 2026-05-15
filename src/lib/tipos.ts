import { Rol, CategoriaDocente, TipoAmbiente, DiaSemana, EstadoPeriodo, EstadoHorario, EstadoVentana, PrioridadNotificacion, CanalNotificacion } from '@prisma/client';

// Tipos para respuestas API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Tipos para autenticación
export interface TokenPayload {
  userId: string;
  email: string;
  rol: Rol;
  tokenVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserSession {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: Rol;
  docenteId?: string;
}

// Tipos para docentes
export interface DocenteFiltros {
  search?: string;
  categoria?: CategoriaDocente;
  departamento?: string;
  activo?: boolean;
}

export interface DocenteCreateInput {
  email: string;
  nombre: string;
  apellidos: string;
  codigo: string;
  categoria: CategoriaDocente;
  departamento?: string;
  telefono?: string;
  whatsapp?: string;
}

export interface DocenteUpdateInput extends Partial<DocenteCreateInput> {
  activo?: boolean;
}

// Tipos para cursos
export interface CursoFiltros {
  search?: string;
  ciclo?: number;
  activo?: boolean;
}

export interface CursoCreateInput {
  codigo: string;
  nombre: string;
  creditos: number;
  horasTeoria: number;
  horasPractica: number;
  horasLaboratorio: number;
  ciclo: number;
  planEstudios?: string;
}

export interface CursoUpdateInput extends Partial<CursoCreateInput> {
  activo?: boolean;
}

// Tipos para ambientes
export interface AmbienteFiltros {
  tipo?: TipoAmbiente;
  search?: string;
  activo?: boolean;
}

export interface AmbienteCreateInput {
  codigo: string;
  nombre: string;
  tipo: TipoAmbiente;
  capacidad: number;
  ubicacion?: string;
}

// Tipos para horarios
export interface HorarioFiltros {
  periodoId?: string;
  docenteId?: string;
  cursoId?: string;
  ambienteId?: string;
  diaSemana?: DiaSemana;
  estado?: EstadoHorario;
  publicado?: boolean;
}

export interface HorarioCreateInput {
  periodoId: string;
  cursoId: string;
  docenteId: string;
  grupoId?: string;
  ambienteId: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

// Tipos para períodos
export interface PeriodoCreateInput {
  nombre: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
}

// Tipos para notificaciones
export interface NotificacionCreateInput {
  usuarioId: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  prioridad: PrioridadNotificacion;
  canal: CanalNotificacion;
  metadata?: any;
}

// Tipos para reportes
export interface ReporteParams {
  periodoId: string;
  formato?: 'pdf' | 'excel';
  tipo?: string;
  docenteId?: string;
  ambienteId?: string;
}

// Tipos para WebSocket
export interface WebSocketMessage {
  type: string;
  channel: string;
  data: any;
  timestamp: string;
}

export interface WebSocketEvent {
  event: string;
  payload: any;
}