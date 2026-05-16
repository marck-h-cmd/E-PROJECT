import { describe, it, expect } from 'vitest';
import { Formateadores } from '@/lib/formateadores';

describe('Formateadores', () => {
  describe('nombreCompleto', () => {
    it('debe unir nombre y apellidos', () => {
      expect(Formateadores.nombreCompleto('Juan', 'Pérez')).toBe('Juan Pérez');
    });

    it('debe manejar apellidos compuestos', () => {
      expect(Formateadores.nombreCompleto('María', 'López García')).toBe('María López García');
    });
  });

  describe('nombreUsuario', () => {
    it('debe formatear como Apellidos, Nombre', () => {
      const usuario = { nombre: 'Juan', apellidos: 'Pérez' };
      expect(Formateadores.nombreUsuario(usuario)).toBe('Pérez, Juan');
    });
  });

  describe('creditos', () => {
    it('debe formatear créditos con abreviatura', () => {
      expect(Formateadores.creditos(4)).toBe('4 créd.');
    });
  });

  describe('horas', () => {
    it('debe formatear horas con h', () => {
      expect(Formateadores.horas(5)).toBe('5h');
    });

    it('debe manejar cero', () => {
      expect(Formateadores.horas(0)).toBe('0h');
    });
  });

  describe('capacidad', () => {
    it('debe formatear con personas', () => {
      expect(Formateadores.capacidad(40)).toBe('40 personas');
    });
  });

  describe('categoriaDocente', () => {
    it('debe traducir PRINCIPAL', () => {
      expect(Formateadores.categoriaDocente('PRINCIPAL')).toBe('Principal');
    });

    it('debe traducir ASOCIADO', () => {
      expect(Formateadores.categoriaDocente('ASOCIADO')).toBe('Asociado');
    });

    it('debe traducir AUXILIAR', () => {
      expect(Formateadores.categoriaDocente('AUXILIAR')).toBe('Auxiliar');
    });

    it('debe traducir CONTRATADO', () => {
      expect(Formateadores.categoriaDocente('CONTRATADO')).toBe('Contratado');
    });

    it('debe devolver el mismo valor si no hay traducción', () => {
      expect(Formateadores.categoriaDocente('DESCONOCIDO')).toBe('DESCONOCIDO');
    });
  });

  describe('tipoAmbiente', () => {
    it('debe traducir AULA', () => {
      expect(Formateadores.tipoAmbiente('AULA')).toBe('Aula');
    });

    it('debe traducir LABORATORIO', () => {
      expect(Formateadores.tipoAmbiente('LABORATORIO')).toBe('Laboratorio');
    });
  });

  describe('estadoHorario', () => {
    it('debe traducir BORRADOR', () => {
      expect(Formateadores.estadoHorario('BORRADOR')).toBe('Borrador');
    });

    it('debe traducir PUBLICADO', () => {
      expect(Formateadores.estadoHorario('PUBLICADO')).toBe('Publicado');
    });
  });

  describe('estadoPeriodo', () => {
    it('debe traducir ACTIVO', () => {
      expect(Formateadores.estadoPeriodo('ACTIVO')).toBe('Activo');
    });

    it('debe traducir FINALIZADO', () => {
      expect(Formateadores.estadoPeriodo('FINALIZADO')).toBe('Finalizado');
    });
  });

  describe('prioridadNotificacion', () => {
    it('debe traducir ALTA', () => {
      expect(Formateadores.prioridadNotificacion('ALTA')).toBe('Alta');
    });

    it('debe traducir URGENTE', () => {
      expect(Formateadores.prioridadNotificacion('URGENTE')).toBe('Urgente');
    });
  });

  describe('canalNotificacion', () => {
    it('debe traducir CORREO', () => {
      expect(Formateadores.canalNotificacion('CORREO')).toBe('Correo electrónico');
    });

    it('debe traducir WHATSAPP', () => {
      expect(Formateadores.canalNotificacion('WHATSAPP')).toBe('WhatsApp');
    });
  });

  describe('rolUsuario', () => {
    it('debe traducir ADMINISTRADOR', () => {
      expect(Formateadores.rolUsuario('ADMINISTRADOR')).toBe('Administrador');
    });

    it('debe traducir DOCENTE', () => {
      expect(Formateadores.rolUsuario('DOCENTE')).toBe('Docente');
    });
  });

  describe('ciclo', () => {
    it('debe formatear con símbolo de grado', () => {
      expect(Formateadores.ciclo(5)).toBe('5° Ciclo');
    });
  });

  describe('email', () => {
    it('debe convertir a minúsculas y trim', () => {
      expect(Formateadores.email('  Juan.PEREZ@UNITRU.EDU.PE  ')).toBe('juan.perez@unitru.edu.pe');
    });
  });

  describe('codigo', () => {
    it('debe convertir a mayúsculas y trim', () => {
      expect(Formateadores.codigo('  is101  ')).toBe('IS101');
    });
  });

  describe('colorEstado', () => {
    it('debe retornar color para ACTIVO', () => {
      expect(Formateadores.colorEstado('ACTIVO')).toBe('green');
    });

    it('debe retornar color para CANCELADO', () => {
      expect(Formateadores.colorEstado('CANCELADO')).toBe('red');
    });

    it('debe retornar gray para estado desconocido', () => {
      expect(Formateadores.colorEstado('DESCONOCIDO')).toBe('gray');
    });
  });
});