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
var ServicioHorario_1 = require("@/services/horarios/ServicioHorario");
var MotorAsignacion_1 = require("@/services/horarios/MotorAsignacion");
// Mock de Prisma
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        horario: {
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
            findUnique: vitest_1.vi.fn().mockResolvedValue(null),
            create: vitest_1.vi.fn().mockResolvedValue({}),
            update: vitest_1.vi.fn().mockResolvedValue({}),
            updateMany: vitest_1.vi.fn().mockResolvedValue({ count: 1 }),
            delete: vitest_1.vi.fn().mockResolvedValue({}),
            count: vitest_1.vi.fn().mockResolvedValue(0),
        },
        curso: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'curso-1',
                codigo: 'IS101',
                nombre: 'Introducción a la Programación',
                creditos: 4,
                horasTeoria: 2,
                horasPractica: 4,
                horasLaboratorio: 0,
            }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        docente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'docente-1',
                codigo: 'DOC001',
                categoria: 'PRINCIPAL',
                usuario: { id: 'user-1', nombre: 'Juan', apellidos: 'Pérez' },
            }),
        },
        ambiente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'ambiente-1',
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
                docenteId: 'docente-1',
                horasAsignadas: 6,
            }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        grupo: {
            findFirst: vitest_1.vi.fn().mockResolvedValue(null),
        },
        configuracionPeriodo: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                horasMaxDiariasDocente: 8,
                horasMaxContinuas: 4,
                descansoMinEntreHoras: 1,
            }),
        },
        disponibilidadDocente: {
            findFirst: vitest_1.vi.fn().mockResolvedValue(null),
        },
        mantenimientoAmbiente: {
            findFirst: vitest_1.vi.fn().mockResolvedValue(null),
        },
        diaNoLaborable: {
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
        },
        validacionHorario: {
            create: vitest_1.vi.fn().mockResolvedValue({}),
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
(0, vitest_1.describe)('ServicioHorario - Integración', function () {
    var servicio;
    (0, vitest_1.beforeEach)(function () {
        servicio = new ServicioHorario_1.ServicioHorario();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('listar', function () {
        (0, vitest_1.it)('debe listar horarios con paginación', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany.mockResolvedValueOnce([
                            {
                                id: 'h1',
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                                estado: 'CONFIRMADO',
                                curso: { id: 'c1', codigo: 'IS101', nombre: 'Programación' },
                                docente: {
                                    usuario: { id: 'u1', nombre: 'Juan', apellidos: 'Pérez' },
                                },
                                grupo: { id: 'g1', nombre: 'A' },
                                ambiente: { id: 'a1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' },
                                periodo: { id: 'p1', nombre: '2024-II' },
                            },
                        ]);
                        prisma_1.prisma.horario.count.mockResolvedValueOnce(1);
                        return [4 /*yield*/, servicio.listar({ periodoId: 'periodo-1' }, { page: 1, limit: 20 })];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.data).toHaveLength(1);
                        (0, vitest_1.expect)(resultado.meta.total).toBe(1);
                        (0, vitest_1.expect)(resultado.data[0].curso.nombre).toBe('Programación');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe aplicar filtros correctamente', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany.mockResolvedValueOnce([]);
                        prisma_1.prisma.horario.count.mockResolvedValueOnce(0);
                        return [4 /*yield*/, servicio.listar({
                                periodoId: 'periodo-1',
                                docenteId: 'docente-1',
                                diaSemana: 'LUNES',
                                estado: 'CONFIRMADO',
                            }, { page: 1, limit: 20 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.horario.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: vitest_1.expect.objectContaining({
                                periodoId: 'periodo-1',
                                docenteId: 'docente-1',
                                diaSemana: 'LUNES',
                                estado: 'CONFIRMADO',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('crear', function () {
        var datosCrear = {
            periodoId: 'periodo-1',
            cursoId: 'curso-1',
            docenteId: 'docente-1',
            grupoId: undefined,
            ambienteId: 'ambiente-1',
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '10:00',
        };
        (0, vitest_1.it)('debe crear horario exitosamente', function () { return __awaiter(void 0, void 0, void 0, function () {
            var horario;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.create.mockResolvedValueOnce(__assign(__assign({ id: 'horario-nuevo' }, datosCrear), { estado: 'BORRADOR', curso: { codigo: 'IS101', nombre: 'Programación' }, docente: {
                                usuario: { nombre: 'Juan', apellidos: 'Pérez' },
                            }, grupo: null, ambiente: { codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' }, periodo: { nombre: '2024-II' } }));
                        return [4 /*yield*/, servicio.crear(datosCrear, 'user-admin')];
                    case 1:
                        horario = _a.sent();
                        (0, vitest_1.expect)(horario).toBeDefined();
                        (0, vitest_1.expect)(horario.id).toBe('horario-nuevo');
                        (0, vitest_1.expect)(horario.estado).toBe('BORRADOR');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si el período no está activo', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.periodoAcademico.findUnique.mockResolvedValueOnce({
                            id: 'periodo-1',
                            estado: 'FINALIZADO',
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(servicio.crear(datosCrear, 'user-admin')).rejects.toThrow('El período no está activo')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si el docente no tiene el curso asignado', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(servicio.crear(datosCrear, 'user-admin')).rejects.toThrow('El docente no tiene asignado este curso')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si el ambiente no existe', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ambiente.findUnique.mockResolvedValueOnce(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(servicio.crear(datosCrear, 'user-admin')).rejects.toThrow('Ambiente no encontrado')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('obtenerPorDocente', function () {
        (0, vitest_1.it)('debe retornar horarios ordenados de un docente', function () { return __awaiter(void 0, void 0, void 0, function () {
            var horarios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany.mockResolvedValueOnce([
                            {
                                id: 'h1',
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                                curso: { id: 'c1', codigo: 'IS101', nombre: 'Programación', creditos: 4 },
                                grupo: { id: 'g1', nombre: 'A' },
                                ambiente: { id: 'a1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' },
                            },
                            {
                                id: 'h2',
                                diaSemana: 'LUNES',
                                horaInicio: '10:00',
                                horaFin: '12:00',
                                curso: { id: 'c2', codigo: 'IS201', nombre: 'Estructuras', creditos: 4 },
                                grupo: { id: 'g2', nombre: 'B' },
                                ambiente: { id: 'a2', codigo: 'A102', nombre: 'Aula 102', tipo: 'AULA' },
                            },
                        ]);
                        return [4 /*yield*/, servicio.obtenerPorDocente('docente-1', 'periodo-1')];
                    case 1:
                        horarios = _a.sent();
                        (0, vitest_1.expect)(horarios).toHaveLength(2);
                        (0, vitest_1.expect)(horarios[0].horaInicio).toBe('08:00');
                        (0, vitest_1.expect)(horarios[1].horaInicio).toBe('10:00');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
(0, vitest_1.describe)('MotorAsignacion - Integración', function () {
    var motor;
    (0, vitest_1.beforeEach)(function () {
        motor = new MotorAsignacion_1.MotorAsignacion();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('asignarHorario', function () {
        var solicitud = {
            periodoId: 'periodo-1',
            cursoId: 'curso-1',
            docenteId: 'docente-1',
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '10:00',
        };
        (0, vitest_1.it)('debe asignar horario cuando no hay conflictos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce({
                            cursoId: 'curso-1',
                            docenteId: 'docente-1',
                        });
                        prisma_1.prisma.ambiente.findMany.mockResolvedValueOnce([
                            { id: 'amb-1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA', capacidad: 40 },
                        ]);
                        prisma_1.prisma.horario.count.mockResolvedValue(0); // Sin conflictos
                        prisma_1.prisma.horario.create.mockResolvedValueOnce({
                            id: 'horario-asignado',
                            curso: { codigo: 'IS101', nombre: 'Programación' },
                            docente: { usuario: { nombre: 'Juan', apellidos: 'Pérez' } },
                            ambiente: { codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' },
                            grupo: null,
                        });
                        return [4 /*yield*/, motor.asignarHorario(solicitud)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(true);
                        (0, vitest_1.expect)(resultado.horarioId).toBeDefined();
                        (0, vitest_1.expect)(resultado.mensaje).toContain('Horario asignado exitosamente');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe buscar mejor docente cuando no se especifica', function () { return __awaiter(void 0, void 0, void 0, function () {
            var solicitudSinDocente, resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        solicitudSinDocente = __assign(__assign({}, solicitud), { docenteId: undefined });
                        prisma_1.prisma.cursoDocente.findMany.mockResolvedValueOnce([
                            {
                                docente: {
                                    id: 'doc-1',
                                    codigo: 'DOC001',
                                    categoria: 'PRINCIPAL',
                                    usuario: { id: 'u1', nombre: 'Juan', apellidos: 'Pérez' },
                                },
                            },
                        ]);
                        prisma_1.prisma.horario.count.mockResolvedValue(0);
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce({
                            cursoId: 'curso-1',
                            docenteId: 'doc-1',
                        });
                        prisma_1.prisma.ambiente.findMany.mockResolvedValueOnce([
                            { id: 'amb-1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA', capacidad: 40 },
                        ]);
                        prisma_1.prisma.horario.create.mockResolvedValueOnce({
                            id: 'h1',
                            curso: { codigo: 'IS101', nombre: 'Programación' },
                            docente: { usuario: { nombre: 'Juan', apellidos: 'Pérez' } },
                            ambiente: { codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA' },
                            grupo: null,
                        });
                        return [4 /*yield*/, motor.asignarHorario(solicitudSinDocente)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe retornar conflicto cuando no hay disponibilidad de ambiente', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.cursoDocente.findUnique.mockResolvedValueOnce({
                            cursoId: 'curso-1',
                            docenteId: 'docente-1',
                        });
                        // No hay ambientes disponibles
                        prisma_1.prisma.ambiente.findMany.mockResolvedValueOnce([]);
                        return [4 /*yield*/, motor.asignarHorario(solicitud)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.exitoso).toBe(false);
                        (0, vitest_1.expect)(resultado.conflicto).toBeDefined();
                        (0, vitest_1.expect)(resultado.conflicto.tipo).toBe('CRUCE_AULA');
                        (0, vitest_1.expect)(resultado.mensaje).toContain('No se encontró ningún aula disponible');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
