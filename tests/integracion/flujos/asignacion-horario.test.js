"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var MotorAsignacion_1 = require("@/services/horarios/MotorAsignacion");
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        horario: {
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
            findUnique: vitest_1.vi.fn().mockResolvedValue(null),
            create: vitest_1.vi.fn(),
            update: vitest_1.vi.fn().mockResolvedValue({}),
            delete: vitest_1.vi.fn().mockResolvedValue({}),
            count: vitest_1.vi.fn().mockResolvedValue(0),
        },
        curso: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'curso-1',
                codigo: 'IS101',
                nombre: 'Programación',
                creditos: 4,
                horasTeoria: 2,
                horasPractica: 4,
                horasLaboratorio: 0,
            }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        docente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'doc-1',
                codigo: 'DOC001',
                categoria: 'PRINCIPAL',
                activo: true,
                usuario: { id: 'user-1', nombre: 'Juan', apellidos: 'Pérez' },
            }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        ambiente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'amb-1',
                codigo: 'A101',
                nombre: 'Aula 101',
                tipo: 'AULA',
                capacidad: 40,
                activo: true,
            }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        periodoAcademico: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'periodo-1',
                nombre: '2024-II',
                estado: 'ACTIVO',
                activo: true,
            }),
        },
        cursoDocente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                cursoId: 'curso-1',
                docenteId: 'doc-1',
                horasAsignadas: 6,
            }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        grupo: {
            findFirst: vitest_1.vi.fn().mockResolvedValue(null),
        },
        validacionHorario: {
            create: vitest_1.vi.fn().mockResolvedValue({}),
        },
        configuracionPeriodo: {
            findUnique: vitest_1.vi.fn().mockResolvedValue(null),
        },
        mantenimientoAmbiente: {
            findFirst: vitest_1.vi.fn().mockResolvedValue(null),
        },
        disponibilidadDocente: {
            findFirst: vitest_1.vi.fn().mockResolvedValue(null),
        },
        diaNoLaborable: {
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
(0, vitest_1.describe)('Flujo de Asignación de Horario - Integración', function () {
    var motor;
    (0, vitest_1.beforeEach)(function () {
        motor = new MotorAsignacion_1.MotorAsignacion();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Flujo exitoso: asignación sin conflictos', function () {
        (0, vitest_1.it)('debe completar el flujo completo de asignación', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 1. El docente tiene el curso asignado
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce({
                            cursoId: 'curso-1',
                            docenteId: 'doc-1',
                            horasAsignadas: 6,
                        });
                        // 2. Hay ambiente disponible
                        prisma_1.prisma.ambiente.findMany.mockResolvedValueOnce([
                            { id: 'amb-1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA', capacidad: 40 },
                        ]);
                        // 3. No hay conflictos
                        prisma_1.prisma.horario.count.mockResolvedValue(0);
                        prisma_1.prisma.horario.findMany.mockResolvedValue([]);
                        // 4. Se crea el horario exitosamente
                        prisma_1.prisma.horario.create.mockResolvedValueOnce({
                            id: 'horario-nuevo-1',
                            periodoId: 'periodo-1',
                            cursoId: 'curso-1',
                            docenteId: 'doc-1',
                            ambienteId: 'amb-1',
                            diaSemana: 'LUNES',
                            horaInicio: '08:00',
                            horaFin: '10:00',
                            estado: 'BORRADOR',
                            curso: { codigo: 'IS101', nombre: 'Programación' },
                            docente: {
                                usuario: { nombre: 'Juan', apellidos: 'Pérez' },
                            },
                            ambiente: { codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' },
                            grupo: null,
                        });
                        return [4 /*yield*/, motor.asignarHorario({
                                periodoId: 'periodo-1',
                                cursoId: 'curso-1',
                                docenteId: 'doc-1',
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            })];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(true);
                        (0, vitest_1.expect)(resultado.horarioId).toBe('horario-nuevo-1');
                        (0, vitest_1.expect)(resultado.mensaje).toContain('Horario asignado exitosamente');
                        (0, vitest_1.expect)(prisma_1.prisma.horario.create).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Flujo con conflicto: docente ocupado', function () {
        (0, vitest_1.it)('debe detectar conflicto de docente y retornar alternativa', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce({
                            cursoId: 'curso-1',
                            docenteId: 'doc-1',
                            horasAsignadas: 6,
                        });
                        // Ambiente disponible
                        prisma_1.prisma.ambiente.findMany.mockResolvedValueOnce([
                            { id: 'amb-2', codigo: 'A102', nombre: 'Aula 102', tipo: 'AULA', capacidad: 35 },
                        ]);
                        // Docente ocupado en ese horario
                        prisma_1.prisma.horario.findMany
                            .mockResolvedValueOnce([
                            {
                                id: 'horario-conflicto',
                                curso: { id: 'c-otro', codigo: 'IS201', nombre: 'Otro Curso' },
                                docente: {
                                    usuario: { nombre: 'Juan', apellidos: 'Pérez' },
                                },
                                ambiente: { id: 'amb-x', codigo: 'A103', nombre: 'Aula 103', tipo: 'AULA' },
                                grupo: null,
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            },
                        ])
                            .mockResolvedValueOnce([]) // 2. Cruce docente (Llamada para el curso alternativo)
                            .mockResolvedValueOnce([]) // 3. Cruce grupo (Libre)
                            .mockResolvedValueOnce([]) // 4. Cruce ambiente (Libre)
                            .mockResolvedValueOnce([]) // 5. Alternativa: ambiente (Libre)
                            .mockResolvedValueOnce([]); // 6. Alternativa: docente (Libre)
                        // El ambiente alternativo está libre
                        prisma_1.prisma.horario.count
                            .mockResolvedValueOnce(1) // docente ocupado
                            .mockResolvedValueOnce(0) // ambiente alt libre
                            .mockResolvedValueOnce(0) // docente en alt libre
                            .mockResolvedValue(0);
                        return [4 /*yield*/, motor.asignarHorario({
                                periodoId: 'periodo-1',
                                cursoId: 'curso-1',
                                docenteId: 'doc-1',
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            })];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(false);
                        // El conflicto debe existir
                        (0, vitest_1.expect)(resultado.conflicto).toBeDefined();
                        (0, vitest_1.expect)(resultado.conflicto.tipo).toBe('CRUCE_DOCENTE');
                        (0, vitest_1.expect)(resultado.mensaje).toContain('Conflicto detectado');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Flujo: asignación automática de docente por jerarquía', function () {
        (0, vitest_1.it)('debe seleccionar el mejor docente disponible según jerarquía', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Docentes del curso ordenados por jerarquía
                        prisma_1.prisma.cursoDocente.findMany.mockResolvedValueOnce([
                            {
                                docente: {
                                    id: 'doc-principal',
                                    codigo: 'DOC001',
                                    categoria: 'PRINCIPAL',
                                    activo: true,
                                    usuario: { id: 'u1', nombre: 'Juan', apellidos: 'Principal' },
                                },
                            },
                            {
                                docente: {
                                    id: 'doc-asociado',
                                    codigo: 'DOC002',
                                    categoria: 'ASOCIADO',
                                    activo: true,
                                    usuario: { id: 'u2', nombre: 'María', apellidos: 'Asociado' },
                                },
                            },
                        ]);
                        // El principal está libre
                        prisma_1.prisma.horario.count
                            .mockResolvedValueOnce(0) // principal libre
                            .mockResolvedValue(0);
                        // Asignación del curso
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce({
                            cursoId: 'curso-1',
                            docenteId: 'doc-principal',
                        });
                        // Ambiente disponible
                        prisma_1.prisma.ambiente.findMany.mockResolvedValueOnce([
                            { id: 'amb-1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA', capacidad: 40 },
                        ]);
                        // Crear horario
                        prisma_1.prisma.horario.create.mockResolvedValueOnce({
                            id: 'horario-jerarquia',
                            curso: { codigo: 'IS101', nombre: 'Programación' },
                            docente: { usuario: { nombre: 'Juan', apellidos: 'Principal' } },
                            ambiente: { codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' },
                            grupo: null,
                        });
                        return [4 /*yield*/, motor.asignarHorario({
                                periodoId: 'periodo-1',
                                cursoId: 'curso-1',
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            })];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Flujo: sin docentes disponibles', function () {
        (0, vitest_1.it)('debe retornar error cuando no hay docentes para el curso', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.cursoDocente.findMany.mockResolvedValueOnce([]);
                        return [4 /*yield*/, motor.asignarHorario({
                                periodoId: 'periodo-1',
                                cursoId: 'curso-1',
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            })];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(false);
                        (0, vitest_1.expect)(resultado.mensaje).toContain('No se encontró ningún docente disponible');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
