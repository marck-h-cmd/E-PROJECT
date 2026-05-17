"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var validadores_1 = require("@/lib/validadores");
(0, vitest_1.describe)('Validadores - Schemas Zod', function () {
    (0, vitest_1.describe)('emailSchema', function () {
        (0, vitest_1.it)('debe validar email correcto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.emailSchema.parse('docente@unitru.edu.pe'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar email sin @', function () {
            (0, vitest_1.expect)(function () { return validadores_1.emailSchema.parse('docentegmail.com'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar email sin dominio', function () {
            (0, vitest_1.expect)(function () { return validadores_1.emailSchema.parse('docente@'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar string vacío', function () {
            (0, vitest_1.expect)(function () { return validadores_1.emailSchema.parse(''); }).toThrow();
        });
    });
    (0, vitest_1.describe)('passwordSchema', function () {
        (0, vitest_1.it)('debe validar contraseña fuerte', function () {
            (0, vitest_1.expect)(function () { return validadores_1.passwordSchema.parse('MiPassword123!'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar contraseña corta', function () {
            (0, vitest_1.expect)(function () { return validadores_1.passwordSchema.parse('Abc1!'); }).toThrow('al menos 8 caracteres');
        });
        (0, vitest_1.it)('debe rechazar contraseña sin mayúscula', function () {
            (0, vitest_1.expect)(function () { return validadores_1.passwordSchema.parse('mipassword123!'); }).toThrow('mayúscula');
        });
        (0, vitest_1.it)('debe rechazar contraseña sin número', function () {
            (0, vitest_1.expect)(function () { return validadores_1.passwordSchema.parse('MiPassword!'); }).toThrow('número');
        });
        (0, vitest_1.it)('debe rechazar contraseña sin especial', function () {
            (0, vitest_1.expect)(function () { return validadores_1.passwordSchema.parse('MiPassword123'); }).toThrow('carácter especial');
        });
    });
    (0, vitest_1.describe)('codigoDocenteSchema', function () {
        (0, vitest_1.it)('debe validar código de docente', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoDocenteSchema.parse('DOC001'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar código muy corto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoDocenteSchema.parse('AB'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar código con minúsculas', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoDocenteSchema.parse('abc001'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar código muy largo', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoDocenteSchema.parse('DOC00123456'); }).toThrow();
        });
    });
    (0, vitest_1.describe)('codigoCursoSchema', function () {
        (0, vitest_1.it)('debe validar código de curso', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoCursoSchema.parse('IS101'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar formato inválido', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoCursoSchema.parse('101IS'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar solo números', function () {
            (0, vitest_1.expect)(function () { return validadores_1.codigoCursoSchema.parse('12345'); }).toThrow();
        });
    });
    (0, vitest_1.describe)('horaSchema', function () {
        (0, vitest_1.it)('debe validar hora correcta', function () {
            (0, vitest_1.expect)(function () { return validadores_1.horaSchema.parse('08:00'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe validar hora sin cero inicial', function () {
            (0, vitest_1.expect)(function () { return validadores_1.horaSchema.parse('8:00'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar hora inválida', function () {
            (0, vitest_1.expect)(function () { return validadores_1.horaSchema.parse('25:00'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar formato incorrecto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.horaSchema.parse('8-00'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar minutos inválidos', function () {
            (0, vitest_1.expect)(function () { return validadores_1.horaSchema.parse('08:60'); }).toThrow();
        });
    });
    (0, vitest_1.describe)('uuidSchema', function () {
        (0, vitest_1.it)('debe validar UUID', function () {
            (0, vitest_1.expect)(function () { return validadores_1.uuidSchema.parse('550e8400-e29b-41d4-a716-446655440000'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar string no UUID', function () {
            (0, vitest_1.expect)(function () { return validadores_1.uuidSchema.parse('not-a-uuid'); }).toThrow();
        });
    });
    (0, vitest_1.describe)('telefonoSchema', function () {
        (0, vitest_1.it)('debe validar teléfono de 9 dígitos', function () {
            (0, vitest_1.expect)(function () { return validadores_1.telefonoSchema.parse('999123456'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe validar teléfono con código de país', function () {
            (0, vitest_1.expect)(function () { return validadores_1.telefonoSchema.parse('+51999123456'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar teléfono muy corto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.telefonoSchema.parse('12345'); }).toThrow();
        });
    });
    (0, vitest_1.describe)('fechaSchema', function () {
        (0, vitest_1.it)('debe validar fecha correcta', function () {
            (0, vitest_1.expect)(function () { return validadores_1.fechaSchema.parse('2024-09-01'); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar formato incorrecto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.fechaSchema.parse('01/09/2024'); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar fecha inválida', function () {
            (0, vitest_1.expect)(function () { return validadores_1.fechaSchema.parse('2024-13-01'); }).toThrow();
        });
    });
    (0, vitest_1.describe)('paginacionSchema', function () {
        (0, vitest_1.it)('debe usar defaults cuando no se envían valores', function () {
            var result = validadores_1.paginacionSchema.parse({});
            (0, vitest_1.expect)(result.page).toBe(1);
            (0, vitest_1.expect)(result.limit).toBe(20);
        });
        (0, vitest_1.it)('debe transformar strings a números', function () {
            var result = validadores_1.paginacionSchema.parse({ page: '3', limit: '10' });
            (0, vitest_1.expect)(result.page).toBe(3);
            (0, vitest_1.expect)(result.limit).toBe(10);
        });
    });
    (0, vitest_1.describe)('crearDocenteSchema', function () {
        var datosValidos = {
            email: 'docente@unitru.edu.pe',
            password: 'MiPassword123!',
            nombre: 'Juan',
            apellidos: 'Pérez',
            codigo: 'DOC001',
            categoria: 'PRINCIPAL',
        };
        (0, vitest_1.it)('debe validar datos completos correctos', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearDocenteSchema.parse(datosValidos); }).not.toThrow();
        });
        (0, vitest_1.it)('debe validar con campos opcionales', function () {
            var conOpcionales = __assign(__assign({}, datosValidos), { departamento: 'Ingeniería', telefono: '999123456', whatsapp: '999123456' });
            (0, vitest_1.expect)(function () { return validadores_1.crearDocenteSchema.parse(conOpcionales); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar sin email', function () {
            var email = datosValidos.email, sinEmail = __rest(datosValidos, ["email"]);
            (0, vitest_1.expect)(function () { return validadores_1.crearDocenteSchema.parse(sinEmail); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar categoría inválida', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearDocenteSchema.parse(__assign(__assign({}, datosValidos), { categoria: 'INVALIDO' })); }).toThrow();
        });
    });
    (0, vitest_1.describe)('crearCursoSchema', function () {
        var datosValidos = {
            codigo: 'IS101',
            nombre: 'Introducción a la Programación',
            creditos: 4,
            horasTeoria: 2,
            horasPractica: 4,
            horasLaboratorio: 0,
            ciclo: 1,
        };
        (0, vitest_1.it)('debe validar datos completos', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearCursoSchema.parse(datosValidos); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar créditos cero', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearCursoSchema.parse(__assign(__assign({}, datosValidos), { creditos: 0 })); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar créditos negativos', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearCursoSchema.parse(__assign(__assign({}, datosValidos), { creditos: -1 })); }).toThrow();
        });
        (0, vitest_1.it)('debe rechazar ciclo cero', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearCursoSchema.parse(__assign(__assign({}, datosValidos), { ciclo: 0 })); }).toThrow();
        });
    });
    (0, vitest_1.describe)('crearHorarioSchema', function () {
        var datosValidos = {
            periodoId: '550e8400-e29b-41d4-a716-446655440000',
            cursoId: '550e8400-e29b-41d4-a716-446655440001',
            docenteId: '550e8400-e29b-41d4-a716-446655440002',
            ambienteId: '550e8400-e29b-41d4-a716-446655440003',
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '10:00',
        };
        (0, vitest_1.it)('debe validar horario correcto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearHorarioSchema.parse(datosValidos); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar horaFin menor que horaInicio', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearHorarioSchema.parse(__assign(__assign({}, datosValidos), { horaInicio: '10:00', horaFin: '08:00' })); }).toThrow('hora de inicio debe ser menor');
        });
        (0, vitest_1.it)('debe aceptar grupoId opcional', function () {
            var conGrupo = __assign(__assign({}, datosValidos), { grupoId: '550e8400-e29b-41d4-a716-446655440004' });
            (0, vitest_1.expect)(function () { return validadores_1.crearHorarioSchema.parse(conGrupo); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar diaSemana inválido', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearHorarioSchema.parse(__assign(__assign({}, datosValidos), { diaSemana: 'FERIADO' })); }).toThrow();
        });
    });
    (0, vitest_1.describe)('crearPeriodoSchema', function () {
        var datosValidos = {
            nombre: '2024-II',
            fechaInicio: '2024-09-01',
            fechaFin: '2025-01-31',
        };
        (0, vitest_1.it)('debe validar período correcto', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearPeriodoSchema.parse(datosValidos); }).not.toThrow();
        });
        (0, vitest_1.it)('debe rechazar fechaFin menor que fechaInicio', function () {
            (0, vitest_1.expect)(function () { return validadores_1.crearPeriodoSchema.parse({
                nombre: '2024-II',
                fechaInicio: '2025-01-31',
                fechaFin: '2024-09-01',
            }); }).toThrow('fecha de inicio debe ser menor');
        });
    });
});
