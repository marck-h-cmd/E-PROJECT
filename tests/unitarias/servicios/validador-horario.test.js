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
var ValidadorConflictos_1 = require("@/services/horarios/ValidadorConflictos");
// Mock de Prisma
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        horario: {
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
            count: vitest_1.vi.fn().mockResolvedValue(0),
        },
        curso: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({ nombre: 'Curso Test' }),
        },
        docente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                usuario: { nombre: 'Juan', apellidos: 'Pérez' },
            }),
        },
        ambiente: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                nombre: 'Aula 101',
                tipo: 'AULA',
                codigo: 'A101',
            }),
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
(0, vitest_1.describe)('ValidadorConflictos', function () {
    var validador;
    var opcionesBase = {
        periodoId: 'periodo-1',
        docenteId: 'docente-1',
        cursoId: 'curso-1',
        ambienteId: 'ambiente-1',
        grupoId: 'grupo-1',
        diaSemana: 'LUNES',
        horaInicio: '08:00',
        horaFin: '10:00',
    };
    (0, vitest_1.beforeEach)(function () {
        validador = new ValidadorConflictos_1.ValidadorConflictos();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('validarTodo', function () {
        (0, vitest_1.it)('debe retornar válido cuando no hay conflictos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, validador.validarTodo(opcionesBase)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.valido).toBe(true);
                        (0, vitest_1.expect)(resultado.totalConflictos).toBe(0);
                        (0, vitest_1.expect)(resultado.conflictos).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe detectar cruce de docente en el mismo día y hora', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado, conflictoDocente;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany.mockResolvedValueOnce([
                            {
                                id: 'horario-conflicto-1',
                                curso: { id: 'c2', codigo: 'IS201', nombre: 'Otro Curso' },
                                docente: {
                                    usuario: { nombre: 'Juan', apellidos: 'Pérez' },
                                },
                                ambiente: {
                                    id: 'a2', codigo: 'A102', nombre: 'Aula 102', tipo: 'AULA',
                                },
                                grupo: { id: 'g2', nombre: 'B' },
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            },
                        ]);
                        return [4 /*yield*/, validador.validarTodo(opcionesBase)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.valido).toBe(false);
                        (0, vitest_1.expect)(resultado.totalConflictos).toBeGreaterThan(0);
                        conflictoDocente = resultado.conflictos.find(function (c) { return c.tipo === 'CRUCE_DOCENTE'; });
                        (0, vitest_1.expect)(conflictoDocente).toBeDefined();
                        (0, vitest_1.expect)(conflictoDocente.severidad).toBe('ERROR');
                        (0, vitest_1.expect)(conflictoDocente.mensaje).toContain('Juan Pérez');
                        (0, vitest_1.expect)(conflictoDocente.mensaje).toContain('ya tiene asignado');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe detectar cruce de aula en el mismo día y hora', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado, conflictoAula;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Primera llamada: cruce docente (vacío)
                        prisma_1.prisma.horario.findMany
                            .mockResolvedValueOnce([]) // docente
                            .mockResolvedValueOnce([
                            {
                                id: 'hc-2',
                                curso: { id: 'c3', codigo: 'IS301', nombre: 'Base de Datos' },
                                docente: {
                                    usuario: { nombre: 'María', apellidos: 'López' },
                                },
                                ambiente: {
                                    id: 'a1', codigo: 'A101', nombre: 'Aula 101', tipo: 'AULA',
                                },
                                grupo: { id: 'g3', nombre: 'A' },
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            },
                        ]);
                        return [4 /*yield*/, validador.validarTodo(opcionesBase)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.valido).toBe(false);
                        conflictoAula = resultado.conflictos.find(function (c) { return c.tipo === 'CRUCE_AULA'; });
                        (0, vitest_1.expect)(conflictoAula).toBeDefined();
                        (0, vitest_1.expect)(conflictoAula.mensaje).toContain('Aula 101');
                        (0, vitest_1.expect)(conflictoAula.mensaje).toContain('ya está ocupado');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe detectar cruce de laboratorio', function () { return __awaiter(void 0, void 0, void 0, function () {
            var opcionesLab, resultado, conflictoLab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opcionesLab = __assign(__assign({}, opcionesBase), { ambienteId: 'lab-1' });
                        prisma_1.prisma.ambiente.findUnique.mockResolvedValue({
                            nombre: 'Lab Cómputo 1',
                            tipo: 'LABORATORIO',
                            codigo: 'L301',
                        });
                        prisma_1.prisma.horario.findMany
                            .mockResolvedValueOnce([])
                            .mockResolvedValueOnce([
                            {
                                id: 'hc-lab',
                                curso: { id: 'c4', codigo: 'IS501', nombre: 'Sistemas Operativos' },
                                docente: {
                                    usuario: { nombre: 'Carlos', apellidos: 'Rodríguez' },
                                },
                                ambiente: {
                                    id: 'lab-1', codigo: 'L301', nombre: 'Lab Cómputo 1', tipo: 'LABORATORIO',
                                },
                                grupo: null,
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            },
                        ]);
                        return [4 /*yield*/, validador.validarTodo(opcionesLab)];
                    case 1:
                        resultado = _a.sent();
                        conflictoLab = resultado.conflictos.find(function (c) { return c.tipo === 'CRUCE_LABORATORIO'; });
                        (0, vitest_1.expect)(conflictoLab).toBeDefined();
                        (0, vitest_1.expect)(conflictoLab.mensaje).toContain('laboratorio');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe detectar cruce de grupo/sección', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado, conflictoGrupo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany
                            .mockResolvedValueOnce([]) // docente
                            .mockResolvedValueOnce([]) // ambiente
                            .mockResolvedValueOnce([
                            {
                                id: 'hc-grupo',
                                curso: { id: 'c5', codigo: 'IS601', nombre: 'Redes' },
                                docente: {
                                    usuario: { nombre: 'Ana', apellidos: 'Martínez' },
                                },
                                ambiente: {
                                    id: 'a3', codigo: 'A201', nombre: 'Aula 201', tipo: 'AULA',
                                },
                                grupo: { id: 'grupo-1', nombre: 'A' },
                                diaSemana: 'LUNES',
                                horaInicio: '08:00',
                                horaFin: '10:00',
                            },
                        ]);
                        return [4 /*yield*/, validador.validarTodo(opcionesBase)];
                    case 1:
                        resultado = _a.sent();
                        conflictoGrupo = resultado.conflictos.find(function (c) { return c.tipo === 'CRUCE_GRUPO'; });
                        (0, vitest_1.expect)(conflictoGrupo).toBeDefined();
                        (0, vitest_1.expect)(conflictoGrupo.mensaje).toContain('grupo');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe excluir el horario propio en ediciones', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, validador.validarTodo(__assign(__assign({}, opcionesBase), { horarioIdExcluir: 'horario-propio-1' }))];
                    case 1:
                        resultado = _a.sent();
                        // Verificar que se pasó el filtro de exclusión
                        (0, vitest_1.expect)(prisma_1.prisma.horario.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: vitest_1.expect.objectContaining({
                                id: { not: 'horario-propio-1' },
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe retornar resumen correcto de tipos de conflicto', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany
                            .mockResolvedValueOnce([
                            {
                                id: 'h1',
                                curso: { id: 'c10', codigo: 'X01', nombre: 'Curso X' },
                                docente: { usuario: { nombre: 'A', apellidos: 'B' } },
                                ambiente: { id: 'ax', codigo: 'AX', nombre: 'AX', tipo: 'AULA' },
                                grupo: null,
                                diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '10:00',
                            },
                        ])
                            .mockResolvedValueOnce([
                            {
                                id: 'h2',
                                curso: { id: 'c11', codigo: 'X02', nombre: 'Curso Y' },
                                docente: { usuario: { nombre: 'C', apellidos: 'D' } },
                                ambiente: { id: 'a1', codigo: 'A101', nombre: 'A101', tipo: 'AULA' },
                                grupo: null,
                                diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '10:00',
                            },
                        ])
                            .mockResolvedValueOnce([]);
                        return [4 /*yield*/, validador.validarTodo(opcionesBase)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.resumen.cruceDocente).toBe(1);
                        (0, vitest_1.expect)(resultado.resumen.cruceAula).toBe(1);
                        (0, vitest_1.expect)(resultado.resumen.cruceLaboratorio).toBe(0);
                        (0, vitest_1.expect)(resultado.resumen.cruceGrupo).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('validarCruceDocente', function () {
        (0, vitest_1.it)('debe retornar lista vacía si no hay conflicto', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, validador.validarTodo(__assign(__assign({}, opcionesBase), { validarAmbiente: false, validarGrupo: false }))];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.conflictos.filter(function (c) { return c.tipo === 'CRUCE_DOCENTE'; })).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe detectar solapamiento parcial (inicio dentro de otro)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.findMany.mockResolvedValueOnce([
                            {
                                id: 'h-parcial',
                                curso: { id: 'c20', codigo: 'Z01', nombre: 'Curso Z' },
                                docente: { usuario: { nombre: 'X', apellidos: 'Y' } },
                                ambiente: { id: 'az', codigo: 'AZ', nombre: 'AZ', tipo: 'AULA' },
                                grupo: null,
                                diaSemana: 'LUNES',
                                horaInicio: '09:00', // Empieza durante nuestro horario
                                horaFin: '11:00',
                            },
                        ]);
                        return [4 /*yield*/, validador.validarTodo(__assign(__assign({}, opcionesBase), { validarAmbiente: false, validarGrupo: false }))];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.conflictos).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('estaLibreDocente', function () {
        (0, vitest_1.it)('debe retornar true si el docente está libre', function () { return __awaiter(void 0, void 0, void 0, function () {
            var libre;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.count.mockResolvedValue(0);
                        return [4 /*yield*/, validador.estaLibreDocente('periodo-1', 'docente-1', 'LUNES', '08:00', '10:00')];
                    case 1:
                        libre = _a.sent();
                        (0, vitest_1.expect)(libre).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe retornar false si el docente está ocupado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var libre;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.count.mockResolvedValue(1);
                        return [4 /*yield*/, validador.estaLibreDocente('periodo-1', 'docente-1', 'LUNES', '08:00', '10:00')];
                    case 1:
                        libre = _a.sent();
                        (0, vitest_1.expect)(libre).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('estaLibreAmbiente', function () {
        (0, vitest_1.it)('debe retornar true si el ambiente está libre', function () { return __awaiter(void 0, void 0, void 0, function () {
            var libre;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.horario.count.mockResolvedValue(0);
                        return [4 /*yield*/, validador.estaLibreAmbiente('periodo-1', 'ambiente-1', 'LUNES', '08:00', '10:00')];
                    case 1:
                        libre = _a.sent();
                        (0, vitest_1.expect)(libre).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
