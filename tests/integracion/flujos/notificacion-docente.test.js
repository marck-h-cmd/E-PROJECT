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
var GestorNotificaciones_1 = require("@/services/notificaciones/GestorNotificaciones");
var GestorPlantillas_1 = require("@/services/notificaciones/GestorPlantillas");
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        notificacion: {
            create: vitest_1.vi.fn().mockResolvedValue({ id: 'notif-1' }),
            createMany: vitest_1.vi.fn().mockResolvedValue({ count: 1 }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
            count: vitest_1.vi.fn().mockResolvedValue(0),
            update: vitest_1.vi.fn().mockResolvedValue({}),
        },
        envioNotificacion: {
            create: vitest_1.vi.fn().mockResolvedValue({}),
        },
        usuario: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'user-1',
                email: 'docente@unitru.edu.pe',
                nombre: 'Juan',
                apellidos: 'Pérez García',
            }),
        },
        docente: {
            findFirst: vitest_1.vi.fn().mockResolvedValue({
                id: 'doc-1',
                whatsapp: '51999123456',
                verificadoWhatsapp: true,
                telegramId: '123456789',
                verificadoTelegram: true,
            }),
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                id: 'doc-1',
                codigo: 'DOC001',
                categoria: 'PRINCIPAL',
                usuario: { id: 'user-1', email: 'docente@unitru.edu.pe' },
            }),
        },
        preferenciasNotificacion: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                correoActivo: true,
                whatsappActivo: true,
                telegramActivo: true,
                sistemaActivo: true,
                frecuenciaMaxDiaria: 10,
            }),
            upsert: vitest_1.vi.fn().mockResolvedValue({}),
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
var redis_1 = require("@/lib/redis");
(0, vitest_1.describe)('Flujo de Notificación a Docente - Integración', function () {
    var gestor;
    var gestorPlantillas;
    (0, vitest_1.beforeEach)(function () {
        gestor = new GestorNotificaciones_1.GestorNotificaciones();
        gestorPlantillas = new GestorPlantillas_1.GestorPlantillas();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Notificación de confirmación de horario', function () {
        (0, vitest_1.it)('debe encolar y registrar notificación de confirmación', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarNotificacion({
                            usuarioId: 'user-1',
                            tipo: 'CONFIRMACION_HORARIO',
                            titulo: 'Horario Confirmado',
                            mensaje: 'Su horario para el período 2024-II ha sido confirmado.',
                            prioridad: 'ALTA',
                            canal: 'CORREO',
                            metadata: {
                                periodoId: 'periodo-1',
                                cursoCodigo: 'IS101',
                            },
                        })];
                    case 1:
                        _a.sent();
                        // Verificar encolado
                        (0, vitest_1.expect)(redis_1.redis.lpush).toHaveBeenCalledWith('notificaciones:alta', vitest_1.expect.stringContaining('Horario Confirmado'));
                        // Verificar registro en BD
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.objectContaining({
                                usuarioId: 'user-1',
                                tipo: 'CONFIRMACION_HORARIO',
                                titulo: 'Horario Confirmado',
                                estado: 'PENDIENTE',
                                canal: 'CORREO',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Notificación de ventana de atención', function () {
        (0, vitest_1.it)('debe enviar notificación de ventana a múltiples docentes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var docentesIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        docentesIds = ['user-1', 'user-2', 'user-3'];
                        return [4 /*yield*/, gestor.enviarMultiplesNotificaciones(docentesIds, {
                                tipo: 'VENTANA_ATENCION',
                                titulo: 'Ventana de Atención Abierta',
                                mensaje: 'La ventana de atención para docentes PRINCIPAL está abierta.',
                                prioridad: 'URGENTE',
                                canal: 'WHATSAPP',
                                metadata: {
                                    ventanaId: 'ventana-1',
                                    categoria: 'PRINCIPAL',
                                },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.createMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.arrayContaining([
                                vitest_1.expect.objectContaining({
                                    usuarioId: 'user-1',
                                    tipo: 'VENTANA_ATENCION',
                                    prioridad: 'URGENTE',
                                }),
                                vitest_1.expect.objectContaining({
                                    usuarioId: 'user-2',
                                }),
                                vitest_1.expect.objectContaining({
                                    usuarioId: 'user-3',
                                }),
                            ]),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Flujo con plantillas', function () {
        (0, vitest_1.it)('debe usar plantilla para notificación de cambio de horario', function () { return __awaiter(void 0, void 0, void 0, function () {
            var plantillas, mensaje;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Configurar plantilla mock
                        redis_1.redis.get.mockResolvedValueOnce(JSON.stringify([
                            {
                                id: 'plantilla-1',
                                nombre: 'Cambio de Horario',
                                tipo: 'CAMBIO_HORARIO',
                                canal: 'CORREO',
                                asunto: 'Cambio de Horario - {{periodo}}',
                                cuerpo: 'Estimado/a {{nombreDocente}}, su horario de {{curso}} ha cambiado a {{nuevoHorario}}.',
                                variables: ['nombreDocente', 'periodo', 'curso', 'nuevoHorario'],
                                creadaEn: new Date().toISOString(),
                            },
                        ]));
                        return [4 /*yield*/, gestorPlantillas.listarPlantillas('CAMBIO_HORARIO')];
                    case 1:
                        plantillas = _a.sent();
                        (0, vitest_1.expect)(plantillas).toHaveLength(1);
                        (0, vitest_1.expect)(plantillas[0].nombre).toBe('Cambio de Horario');
                        (0, vitest_1.expect)(plantillas[0].variables).toContain('nombreDocente');
                        (0, vitest_1.expect)(plantillas[0].variables).toContain('curso');
                        (0, vitest_1.expect)(plantillas[0].variables).toContain('nuevoHorario');
                        mensaje = gestorPlantillas.procesarPlantilla(plantillas[0], {
                            nombreDocente: 'Juan Pérez',
                            periodo: '2024-II',
                            curso: 'Programación',
                            nuevoHorario: 'Lunes 10:00-12:00',
                        });
                        (0, vitest_1.expect)(mensaje).toContain('Juan Pérez');
                        (0, vitest_1.expect)(mensaje).toContain('Programación');
                        (0, vitest_1.expect)(mensaje).toContain('Lunes 10:00-12:00');
                        (0, vitest_1.expect)(mensaje).not.toContain('{{'); // Sin variables sin reemplazar
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Preferencias de notificación', function () {
        (0, vitest_1.it)('debe respetar preferencias del docente', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Docente con solo correo activo
                        prisma_1.prisma.preferenciasNotificacion.findUnique.mockResolvedValueOnce({
                            correoActivo: true,
                            whatsappActivo: false,
                            telegramActivo: false,
                            sistemaActivo: true,
                            frecuenciaMaxDiaria: 5,
                        });
                        // Enviar notificación
                        return [4 /*yield*/, gestor.enviarNotificacion({
                                usuarioId: 'user-1',
                                tipo: 'RECORDATORIO',
                                titulo: 'Recordatorio',
                                mensaje: 'Recuerde verificar su horario.',
                                prioridad: 'MEDIA',
                                canal: 'CORREO',
                            })];
                    case 1:
                        // Enviar notificación
                        _a.sent();
                        // La notificación se encoló correctamente
                        (0, vitest_1.expect)(redis_1.redis.lpush).toHaveBeenCalled();
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.create).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Historial de notificaciones del docente', function () {
        (0, vitest_1.it)('debe recuperar historial filtrado por usuario', function () { return __awaiter(void 0, void 0, void 0, function () {
            var historialMock, resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        historialMock = [
                            {
                                id: 'n1',
                                tipo: 'CONFIRMACION_HORARIO',
                                titulo: 'Horario confirmado',
                                mensaje: 'Confirmado',
                                prioridad: 'ALTA',
                                canal: 'CORREO',
                                estado: 'ENVIADA',
                                createdAt: new Date(),
                                envios: [],
                                usuario: { email: 'docente@unitru.edu.pe', nombre: 'Juan', apellidos: 'Pérez' },
                            },
                            {
                                id: 'n2',
                                tipo: 'CAMBIO_HORARIO',
                                titulo: 'Cambio realizado',
                                mensaje: 'Cambiado',
                                prioridad: 'MEDIA',
                                canal: 'SISTEMA',
                                estado: 'LEIDA',
                                createdAt: new Date(),
                                envios: [],
                                usuario: { email: 'docente@unitru.edu.pe', nombre: 'Juan', apellidos: 'Pérez' },
                            },
                        ];
                        prisma_1.prisma.notificacion.findMany.mockResolvedValueOnce(historialMock);
                        prisma_1.prisma.notificacion.count.mockResolvedValueOnce(2);
                        return [4 /*yield*/, gestor.obtenerHistorial('user-1', undefined, undefined, 1, 10)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.data).toHaveLength(2);
                        (0, vitest_1.expect)(resultado.meta.total).toBe(2);
                        (0, vitest_1.expect)(resultado.data[0].titulo).toBe('Horario confirmado');
                        (0, vitest_1.expect)(resultado.data[1].estado).toBe('LEIDA');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
