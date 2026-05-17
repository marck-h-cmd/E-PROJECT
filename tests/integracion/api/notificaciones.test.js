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
var ServicioCorreo_1 = require("@/services/notificaciones/ServicioCorreo");
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
                apellidos: 'Pérez',
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
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
var redis_1 = require("@/lib/redis");
(0, vitest_1.describe)('Sistema de Notificaciones - Integración', function () {
    var gestor;
    (0, vitest_1.beforeEach)(function () {
        gestor = new GestorNotificaciones_1.GestorNotificaciones();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Flujo completo de notificación', function () {
        (0, vitest_1.it)('debe encolar, procesar y registrar una notificación', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 1. Enviar notificación
                    return [4 /*yield*/, gestor.enviarNotificacion({
                            usuarioId: 'user-1',
                            tipo: 'CONFIRMACION_HORARIO',
                            titulo: 'Horario confirmado',
                            mensaje: 'Su horario ha sido confirmado para el período 2024-II.',
                            prioridad: 'ALTA',
                            canal: 'CORREO',
                        })];
                    case 1:
                        // 1. Enviar notificación
                        _a.sent();
                        // 2. Verificar que se encoló
                        (0, vitest_1.expect)(redis_1.redis.lpush).toHaveBeenCalledWith('notificaciones:alta', vitest_1.expect.stringContaining('Horario confirmado'));
                        // 3. Verificar que se registró en BD
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.objectContaining({
                                titulo: 'Horario confirmado',
                                estado: 'PENDIENTE',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe enviar múltiples notificaciones en lote', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gestor.enviarMultiplesNotificaciones(['user-1', 'user-2', 'user-3'], {
                            tipo: 'SISTEMA',
                            titulo: 'Mantenimiento programado',
                            mensaje: 'El sistema estará en mantenimiento el sábado.',
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
    (0, vitest_1.describe)('GestorPlantillas', function () {
        var gestorPlantillas;
        (0, vitest_1.beforeEach)(function () {
            gestorPlantillas = new GestorPlantillas_1.GestorPlantillas();
        });
        (0, vitest_1.it)('debe crear y recuperar plantillas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var plantilla;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        redis_1.redis.get.mockResolvedValueOnce('[]'); // Sin plantillas previas
                        return [4 /*yield*/, gestorPlantillas.crearPlantilla({
                                nombre: 'Confirmación Horario',
                                tipo: 'CONFIRMACION_HORARIO',
                                canal: 'CORREO',
                                asunto: 'Horario confirmado - {{periodo}}',
                                cuerpo: 'Estimado {{nombreDocente}}, su horario en {{periodo}} ha sido confirmado.',
                                variables: ['nombreDocente', 'periodo'],
                            })];
                    case 1:
                        plantilla = _a.sent();
                        (0, vitest_1.expect)(plantilla.id).toBeDefined();
                        (0, vitest_1.expect)(plantilla.nombre).toBe('Confirmación Horario');
                        (0, vitest_1.expect)(plantilla.variables).toContain('nombreDocente');
                        (0, vitest_1.expect)(plantilla.variables).toContain('periodo');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe procesar plantillas reemplazando variables', function () { return __awaiter(void 0, void 0, void 0, function () {
            var plantilla, resultado;
            return __generator(this, function (_a) {
                plantilla = {
                    id: 't1',
                    nombre: 'Test',
                    tipo: 'TEST',
                    canal: 'CORREO',
                    cuerpo: 'Hola {{nombre}}, tu curso es {{curso}}.',
                    variables: ['nombre', 'curso'],
                    creadaEn: new Date().toISOString(),
                };
                resultado = gestorPlantillas.procesarPlantilla(plantilla, {
                    nombre: 'Juan',
                    curso: 'Programación',
                });
                (0, vitest_1.expect)(resultado).toBe('Hola Juan, tu curso es Programación.');
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('debe eliminar variables no proporcionadas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var plantilla, resultado;
            return __generator(this, function (_a) {
                plantilla = {
                    id: 't2',
                    nombre: 'Test',
                    tipo: 'TEST',
                    canal: 'CORREO',
                    cuerpo: 'Hola {{nombre}}, {{extra}}.',
                    variables: ['nombre', 'extra'],
                    creadaEn: new Date().toISOString(),
                };
                resultado = gestorPlantillas.procesarPlantilla(plantilla, {
                    nombre: 'María',
                });
                (0, vitest_1.expect)(resultado).toBe('Hola María, .');
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('ServicioCorreo', function () {
        var servicioCorreo;
        (0, vitest_1.beforeEach)(function () {
            servicioCorreo = new ServicioCorreo_1.ServicioCorreo();
        });
        (0, vitest_1.it)('debe generar HTML con los datos de la notificación', function () { return __awaiter(void 0, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                html = servicioCorreo.generarHTML({
                    titulo: 'Test',
                    mensaje: 'Mensaje de prueba',
                    metadata: { detalle: 'Información adicional' },
                });
                (0, vitest_1.expect)(html).toContain('Test');
                (0, vitest_1.expect)(html).toContain('Mensaje de prueba');
                (0, vitest_1.expect)(html).toContain('Información adicional');
                (0, vitest_1.expect)(html).toContain('<!DOCTYPE html>');
                (0, vitest_1.expect)(html).toContain('UNT');
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('debe intentar enviar correo y registrar resultado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var datos, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        datos = {
                            usuarioId: 'user-1',
                            tipo: 'SISTEMA',
                            titulo: 'Prueba',
                            mensaje: 'Test',
                            prioridad: 'BAJA',
                            canal: 'CORREO',
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, servicioCorreo.enviar(datos)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        // Verificar que se creó la notificación
                        (0, vitest_1.expect)(prisma_1.prisma.notificacion.create).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
