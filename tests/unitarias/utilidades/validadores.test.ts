import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  codigoDocenteSchema,
  codigoCursoSchema,
  horaSchema,
  uuidSchema,
  telefonoSchema,
  fechaSchema,
  paginacionSchema,
  crearDocenteSchema,
  crearCursoSchema,
  crearHorarioSchema,
  crearPeriodoSchema,
} from '@/lib/validadores';

describe('Validadores - Schemas Zod', () => {
  describe('emailSchema', () => {
    it('debe validar email correcto', () => {
      expect(() => emailSchema.parse('docente@unitru.edu.pe')).not.toThrow();
    });

    it('debe rechazar email sin @', () => {
      expect(() => emailSchema.parse('docentegmail.com')).toThrow();
    });

    it('debe rechazar email sin dominio', () => {
      expect(() => emailSchema.parse('docente@')).toThrow();
    });

    it('debe rechazar string vacío', () => {
      expect(() => emailSchema.parse('')).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('debe validar contraseña fuerte', () => {
      expect(() => passwordSchema.parse('MiPassword123!')).not.toThrow();
    });

    it('debe rechazar contraseña corta', () => {
      expect(() => passwordSchema.parse('Abc1!')).toThrow('al menos 8 caracteres');
    });

    it('debe rechazar contraseña sin mayúscula', () => {
      expect(() => passwordSchema.parse('mipassword123!')).toThrow('mayúscula');
    });

    it('debe rechazar contraseña sin número', () => {
      expect(() => passwordSchema.parse('MiPassword!')).toThrow('número');
    });

    it('debe rechazar contraseña sin especial', () => {
      expect(() => passwordSchema.parse('MiPassword123')).toThrow('carácter especial');
    });
  });

  describe('codigoDocenteSchema', () => {
    it('debe validar código de docente', () => {
      expect(() => codigoDocenteSchema.parse('DOC001')).not.toThrow();
    });

    it('debe rechazar código muy corto', () => {
      expect(() => codigoDocenteSchema.parse('AB')).toThrow();
    });

    it('debe rechazar código con minúsculas', () => {
      expect(() => codigoDocenteSchema.parse('abc001')).toThrow();
    });

    it('debe rechazar código muy largo', () => {
      expect(() => codigoDocenteSchema.parse('DOC00123456')).toThrow();
    });
  });

  describe('codigoCursoSchema', () => {
    it('debe validar código de curso', () => {
      expect(() => codigoCursoSchema.parse('IS101')).not.toThrow();
    });

    it('debe rechazar formato inválido', () => {
      expect(() => codigoCursoSchema.parse('101IS')).toThrow();
    });

    it('debe rechazar solo números', () => {
      expect(() => codigoCursoSchema.parse('12345')).toThrow();
    });
  });

  describe('horaSchema', () => {
    it('debe validar hora correcta', () => {
      expect(() => horaSchema.parse('08:00')).not.toThrow();
    });

    it('debe validar hora sin cero inicial', () => {
      expect(() => horaSchema.parse('8:00')).not.toThrow();
    });

    it('debe rechazar hora inválida', () => {
      expect(() => horaSchema.parse('25:00')).toThrow();
    });

    it('debe rechazar formato incorrecto', () => {
      expect(() => horaSchema.parse('8-00')).toThrow();
    });

    it('debe rechazar minutos inválidos', () => {
      expect(() => horaSchema.parse('08:60')).toThrow();
    });
  });

  describe('uuidSchema', () => {
    it('debe validar UUID', () => {
      expect(() => uuidSchema.parse('550e8400-e29b-41d4-a716-446655440000')).not.toThrow();
    });

    it('debe rechazar string no UUID', () => {
      expect(() => uuidSchema.parse('not-a-uuid')).toThrow();
    });
  });

  describe('telefonoSchema', () => {
    it('debe validar teléfono de 9 dígitos', () => {
      expect(() => telefonoSchema.parse('999123456')).not.toThrow();
    });

    it('debe validar teléfono con código de país', () => {
      expect(() => telefonoSchema.parse('+51999123456')).not.toThrow();
    });

    it('debe rechazar teléfono muy corto', () => {
      expect(() => telefonoSchema.parse('12345')).toThrow();
    });
  });

  describe('fechaSchema', () => {
    it('debe validar fecha correcta', () => {
      expect(() => fechaSchema.parse('2024-09-01')).not.toThrow();
    });

    it('debe rechazar formato incorrecto', () => {
      expect(() => fechaSchema.parse('01/09/2024')).toThrow();
    });

    it('debe rechazar fecha inválida', () => {
      expect(() => fechaSchema.parse('2024-13-01')).toThrow();
    });
  });

  describe('paginacionSchema', () => {
    it('debe usar defaults cuando no se envían valores', () => {
      const result = paginacionSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('debe transformar strings a números', () => {
      const result = paginacionSchema.parse({ page: '3', limit: '10' });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
    });
  });

  describe('crearDocenteSchema', () => {
    const datosValidos = {
      email: 'docente@unitru.edu.pe',
      password: 'MiPassword123!',
      nombre: 'Juan',
      apellidos: 'Pérez',
      codigo: 'DOC001',
      categoria: 'PRINCIPAL' as const,
    };

    it('debe validar datos completos correctos', () => {
      expect(() => crearDocenteSchema.parse(datosValidos)).not.toThrow();
    });

    it('debe validar con campos opcionales', () => {
      const conOpcionales = {
        ...datosValidos,
        departamento: 'Ingeniería',
        telefono: '999123456',
        whatsapp: '999123456',
      };
      expect(() => crearDocenteSchema.parse(conOpcionales)).not.toThrow();
    });

    it('debe rechazar sin email', () => {
      const { email, ...sinEmail } = datosValidos;
      expect(() => crearDocenteSchema.parse(sinEmail)).toThrow();
    });

    it('debe rechazar categoría inválida', () => {
      expect(() => crearDocenteSchema.parse({
        ...datosValidos,
        categoria: 'INVALIDO',
      })).toThrow();
    });
  });

  describe('crearCursoSchema', () => {
    const datosValidos = {
      codigo: 'IS101',
      nombre: 'Introducción a la Programación',
      creditos: 4,
      horasTeoria: 2,
      horasPractica: 4,
      horasLaboratorio: 0,
      ciclo: 1,
    };

    it('debe validar datos completos', () => {
      expect(() => crearCursoSchema.parse(datosValidos)).not.toThrow();
    });

    it('debe rechazar créditos cero', () => {
      expect(() => crearCursoSchema.parse({ ...datosValidos, creditos: 0 })).toThrow();
    });

    it('debe rechazar créditos negativos', () => {
      expect(() => crearCursoSchema.parse({ ...datosValidos, creditos: -1 })).toThrow();
    });

    it('debe rechazar ciclo cero', () => {
      expect(() => crearCursoSchema.parse({ ...datosValidos, ciclo: 0 })).toThrow();
    });
  });

  describe('crearHorarioSchema', () => {
    const datosValidos = {
      periodoId: '550e8400-e29b-41d4-a716-446655440000',
      cursoId: '550e8400-e29b-41d4-a716-446655440001',
      docenteId: '550e8400-e29b-41d4-a716-446655440002',
      ambienteId: '550e8400-e29b-41d4-a716-446655440003',
      diaSemana: 'LUNES' as const,
      horaInicio: '08:00',
      horaFin: '10:00',
    };

    it('debe validar horario correcto', () => {
      expect(() => crearHorarioSchema.parse(datosValidos)).not.toThrow();
    });

    it('debe rechazar horaFin menor que horaInicio', () => {
      expect(() => crearHorarioSchema.parse({
        ...datosValidos,
        horaInicio: '10:00',
        horaFin: '08:00',
      })).toThrow('hora de inicio debe ser menor');
    });

    it('debe aceptar grupoId opcional', () => {
      const conGrupo = {
        ...datosValidos,
        grupoId: '550e8400-e29b-41d4-a716-446655440004',
      };
      expect(() => crearHorarioSchema.parse(conGrupo)).not.toThrow();
    });

    it('debe rechazar diaSemana inválido', () => {
      expect(() => crearHorarioSchema.parse({
        ...datosValidos,
        diaSemana: 'FERIADO',
      })).toThrow();
    });
  });

  describe('crearPeriodoSchema', () => {
    const datosValidos = {
      nombre: '2024-II',
      fechaInicio: '2024-09-01',
      fechaFin: '2025-01-31',
    };

    it('debe validar período correcto', () => {
      expect(() => crearPeriodoSchema.parse(datosValidos)).not.toThrow();
    });

    it('debe rechazar fechaFin menor que fechaInicio', () => {
      expect(() => crearPeriodoSchema.parse({
        nombre: '2024-II',
        fechaInicio: '2025-01-31',
        fechaFin: '2024-09-01',
      })).toThrow('fecha de inicio debe ser menor');
    });
  });
});