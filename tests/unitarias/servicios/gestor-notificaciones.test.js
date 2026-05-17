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
var GestorNotificaciones_1 = require("@/services/notificaciones/GestorNotificaciones");
// Mock de Prisma
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        notificacion: {
            create: vitest_1.vi.fn().mockResolvedValue({
                id: 'notif-1',
                usuarioId: 'user-1',
                tipo: 'SISTEMA',
                titulo: 'Test',
                mensaje: 'Test mensaje',
                prioridad: 'MEDIA',
                canal: 'CORREO',
                estado: 'PENDIENTE',
            }),
            createMany: vitest_1.vi.fn().mockResolvedValue({ count: 3 }),
            findMany: vitest_1.vi.fn().mockResolvedValue([]),
            count: vitest_1.vi.fn().mockResolvedValue(0),
            update: vitest_1.vi.fn().mockResolvedValue({}),
            findUnique: vitest_1.vi.fn().mockResolvedValue(null),
        },
        envioNotificacion: {
            create: vitest_1.vi.fn().mockResolvedValue({}),
        },
        usuario: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({ email: 'test@unitru.edu.pe' }),
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
var redis_1 = require("@/lib/redis");
(0, vitest_1.describe)('GestorNotificaciones', function () {
    var gestor;
    var datosNotificacion = {
        usuarioId: 'user-1',
        tipo: 'SISTEMA',
        titulo: 'Notificación de prueba',
        mensaje: 'Este es un mensaje de prueba',
        prioridad: 'MEDIA',
        canal: 'CORREO',
        metadata: { origen: 'test' },
    };
    (0, vitest_1.beforeEach)(function () {
        gestor = new GestorNotificaciones_1.GestorNotificaciones();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('enviarNotificacion', function () {
        (0, vitest_1.it)('debe encolar la notificación en Redis', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarNotificacion(datosNotificacion)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(redis_1.redis.lpush).toHaveBeenCalledWith('notificaciones:media', vitest_1.expect.any(String));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe registrar la notificación en base de datos', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarNotificacion(datosNotificacion)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.objectContaining({
                                usuarioId: 'user-1',
                                titulo: 'Notificación de prueba',
                                estado: 'PENDIENTE',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe encolar en cola ALTA para prioridad URGENTE', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarNotificacion(__assign(__assign({}, datosNotificacion), { prioridad: 'URGENTE' }))];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(redis_1.redis.lpush).toHaveBeenCalledWith('notificaciones:alta', vitest_1.expect.any(String));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe encolar en cola BAJA para prioridad BAJA', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarNotificacion(__assign(__assign({}, datosNotificacion), { prioridad: 'BAJA' }))];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(redis_1.redis.lpush).toHaveBeenCalledWith('notificaciones:baja', vitest_1.expect.any(String));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('enviarMultiplesNotificaciones', function () {
        (0, vitest_1.it)('debe encolar múltiples notificaciones', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarMultiplesNotificaciones(['user-1', 'user-2', 'user-3'], {
                            tipo: 'SISTEMA',
                            titulo: 'Notificación masiva',
                            mensaje: 'Mensaje para todos',
                            prioridad: 'MEDIA',
                            canal: 'CORREO',
                        })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.createMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.arrayContaining([
                                vitest_1.expect.objectContaining({ usuarioId: 'user-1' }),
                                vitest_1.expect.objectContaining({ usuarioId: 'user-2' }),
                                vitest_1.expect.objectContaining({ usuarioId: 'user-3' }),
                            ]),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('obtenerHistorial', function () {
        (0, vitest_1.it)('debe retornar historial paginado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.notificacion.findMany.mockResolvedValueOnce([
                            { id: 'n1', titulo: 'Test 1' },
                            { id: 'n2', titulo: 'Test 2' },
                        ]);
                        prisma_1.prisma.notificacion.count.mockResolvedValueOnce(2);
                        return [4 /*yield*/, gestor.obtenerHistorial('user-1', undefined, undefined, 1, 20)];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.data).toHaveLength(2);
                        (0, vitest_1.expect)(resultado.meta.total).toBe(2);
                        (0, vitest_1.expect)(resultado.meta.page).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe filtrar por usuario', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.obtenerHistorial('user-1', undefined, undefined, 1, 20)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: vitest_1.expect.objectContaining({
                                usuarioId: 'user-1',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe filtrar por tipo', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.obtenerHistorial(undefined, 'VENTANA_ATENCION', undefined, 1, 20)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: vitest_1.expect.objectContaining({
                                tipo: 'VENTANA_ATENCION',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('obtenerEstadoColas', function () {
        (0, vitest_1.it)('debe retornar el estado de todas las colas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var estado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        redis_1.redis.llen
                            .mockResolvedValueOnce(5) // alta
                            .mockResolvedValueOnce(25) // media
                            .mockResolvedValueOnce(0); // baja
                        return [4 /*yield*/, gestor.obtenerEstadoColas()];
                    case 1:
                        estado = _a.sent();
                        (0, vitest_1.expect)(estado.ALTA.pendientes).toBe(5);
                        (0, vitest_1.expect)(estado.MEDIA.pendientes).toBe(25);
                        (0, vitest_1.expect)(estado.BAJA.pendientes).toBe(0);
                        (0, vitest_1.expect)(estado.MEDIA.estado).toBe('normal');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('limpiarColas', function () {
        (0, vitest_1.it)('debe eliminar todas las colas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.limpiarColas()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(redis_1.redis.del).toHaveBeenCalledWith('notificaciones:alta');
                        (0, vitest_1.expect)(redis_1.redis.del).toHaveBeenCalledWith('notificaciones:media');
                        (0, vitest_1.expect)(redis_1.redis.del).toHaveBeenCalledWith('notificaciones:baja');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
