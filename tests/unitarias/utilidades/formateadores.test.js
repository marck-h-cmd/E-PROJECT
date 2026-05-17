"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var formateadores_1 = require("@/lib/formateadores");
(0, vitest_1.describe)('Formateadores', function () {
    (0, vitest_1.describe)('nombreCompleto', function () {
        (0, vitest_1.it)('debe unir nombre y apellidos', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.nombreCompleto('Juan', 'Pérez')).toBe('Juan Pérez');
        });
        (0, vitest_1.it)('debe manejar apellidos compuestos', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.nombreCompleto('María', 'López García')).toBe('María López García');
        });
    });
    (0, vitest_1.describe)('nombreUsuario', function () {
        (0, vitest_1.it)('debe formatear como Apellidos, Nombre', function () {
            var usuario = { nombre: 'Juan', apellidos: 'Pérez' };
            (0, vitest_1.expect)(formateadores_1.Formateadores.nombreUsuario(usuario)).toBe('Pérez, Juan');
        });
    });
    (0, vitest_1.describe)('creditos', function () {
        (0, vitest_1.it)('debe formatear créditos con abreviatura', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.creditos(4)).toBe('4 créd.');
        });
    });
    (0, vitest_1.describe)('horas', function () {
        (0, vitest_1.it)('debe formatear horas con h', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.horas(5)).toBe('5h');
        });
        (0, vitest_1.it)('debe manejar cero', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.horas(0)).toBe('0h');
        });
    });
    (0, vitest_1.describe)('capacidad', function () {
        (0, vitest_1.it)('debe formatear con personas', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.capacidad(40)).toBe('40 personas');
        });
    });
    (0, vitest_1.describe)('categoriaDocente', function () {
        (0, vitest_1.it)('debe traducir PRINCIPAL', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.categoriaDocente('PRINCIPAL')).toBe('Principal');
        });
        (0, vitest_1.it)('debe traducir ASOCIADO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.categoriaDocente('ASOCIADO')).toBe('Asociado');
        });
        (0, vitest_1.it)('debe traducir AUXILIAR', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.categoriaDocente('AUXILIAR')).toBe('Auxiliar');
        });
        (0, vitest_1.it)('debe traducir CONTRATADO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.categoriaDocente('CONTRATADO')).toBe('Contratado');
        });
        (0, vitest_1.it)('debe devolver el mismo valor si no hay traducción', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.categoriaDocente('DESCONOCIDO')).toBe('DESCONOCIDO');
        });
    });
    (0, vitest_1.describe)('tipoAmbiente', function () {
        (0, vitest_1.it)('debe traducir AULA', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.tipoAmbiente('AULA')).toBe('Aula');
        });
        (0, vitest_1.it)('debe traducir LABORATORIO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.tipoAmbiente('LABORATORIO')).toBe('Laboratorio');
        });
    });
    (0, vitest_1.describe)('estadoHorario', function () {
        (0, vitest_1.it)('debe traducir BORRADOR', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.estadoHorario('BORRADOR')).toBe('Borrador');
        });
        (0, vitest_1.it)('debe traducir PUBLICADO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.estadoHorario('PUBLICADO')).toBe('Publicado');
        });
    });
    (0, vitest_1.describe)('estadoPeriodo', function () {
        (0, vitest_1.it)('debe traducir ACTIVO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.estadoPeriodo('ACTIVO')).toBe('Activo');
        });
        (0, vitest_1.it)('debe traducir FINALIZADO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.estadoPeriodo('FINALIZADO')).toBe('Finalizado');
        });
    });
    (0, vitest_1.describe)('prioridadNotificacion', function () {
        (0, vitest_1.it)('debe traducir ALTA', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.prioridadNotificacion('ALTA')).toBe('Alta');
        });
        (0, vitest_1.it)('debe traducir URGENTE', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.prioridadNotificacion('URGENTE')).toBe('Urgente');
        });
    });
    (0, vitest_1.describe)('canalNotificacion', function () {
        (0, vitest_1.it)('debe traducir CORREO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.canalNotificacion('CORREO')).toBe('Correo electrónico');
        });
        (0, vitest_1.it)('debe traducir WHATSAPP', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.canalNotificacion('WHATSAPP')).toBe('WhatsApp');
        });
    });
    (0, vitest_1.describe)('rolUsuario', function () {
        (0, vitest_1.it)('debe traducir ADMINISTRADOR', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.rolUsuario('ADMINISTRADOR')).toBe('Administrador');
        });
        (0, vitest_1.it)('debe traducir DOCENTE', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.rolUsuario('DOCENTE')).toBe('Docente');
        });
    });
    (0, vitest_1.describe)('ciclo', function () {
        (0, vitest_1.it)('debe formatear con símbolo de grado', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.ciclo(5)).toBe('5° Ciclo');
        });
    });
    (0, vitest_1.describe)('email', function () {
        (0, vitest_1.it)('debe convertir a minúsculas y trim', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.email('  Juan.PEREZ@UNITRU.EDU.PE  ')).toBe('juan.perez@unitru.edu.pe');
        });
    });
    (0, vitest_1.describe)('codigo', function () {
        (0, vitest_1.it)('debe convertir a mayúsculas y trim', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.codigo('  is101  ')).toBe('IS101');
        });
    });
    (0, vitest_1.describe)('colorEstado', function () {
        (0, vitest_1.it)('debe retornar color para ACTIVO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.colorEstado('ACTIVO')).toBe('green');
        });
        (0, vitest_1.it)('debe retornar color para CANCELADO', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.colorEstado('CANCELADO')).toBe('red');
        });
        (0, vitest_1.it)('debe retornar gray para estado desconocido', function () {
            (0, vitest_1.expect)(formateadores_1.Formateadores.colorEstado('DESCONOCIDO')).toBe('gray');
        });
    });
});
