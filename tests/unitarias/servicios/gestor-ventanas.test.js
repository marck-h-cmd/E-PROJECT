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
var GestorVentanasAtencion_1 = require("@/services/ventanas/GestorVentanasAtencion");
// Mock de Prisma
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        ventanaAtencion: {
            findMany: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            findFirst: vitest_1.vi.fn(),
            create: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
            updateMany: vitest_1.vi.fn(),
        },
        atencionVentana: {
            findMany: vitest_1.vi.fn(),
            findFirst: vitest_1.vi.fn(),
            create: vitest_1.vi.fn(),
            createMany: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
            updateMany: vitest_1.vi.fn(),
        },
        periodoAcademico: {
            findUnique: vitest_1.vi.fn(),
        },
        docente: {
            findMany: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
        },
    },
}); });
vitest_1.vi.mock('@/lib/redis', function () { return ({
    redis: {
        publish: vitest_1.vi.fn().mockResolvedValue(1),
        get: vitest_1.vi.fn().mockResolvedValue(null),
        set: vitest_1.vi.fn().mockResolvedValue('OK'),
        setex: vitest_1.vi.fn().mockResolvedValue('OK'),
        del: vitest_1.vi.fn().mockResolvedValue(1),
        exists: vitest_1.vi.fn().mockResolvedValue(0),
        expire: vitest_1.vi.fn().mockResolvedValue(1),
        ttl: vitest_1.vi.fn().mockResolvedValue(1800),
        keys: vitest_1.vi.fn().mockResolvedValue([]),
        ping: vitest_1.vi.fn().mockResolvedValue('PONG'),
        incr: vitest_1.vi.fn().mockResolvedValue(1),
        lpush: vitest_1.vi.fn().mockResolvedValue(1),
        rpop: vitest_1.vi.fn().mockResolvedValue(null),
        llen: vitest_1.vi.fn().mockResolvedValue(0),
        lrange: vitest_1.vi.fn().mockResolvedValue([]),
        zadd: vitest_1.vi.fn().mockResolvedValue(1),
        zcard: vitest_1.vi.fn().mockResolvedValue(0),
        zrangebyscore: vitest_1.vi.fn().mockResolvedValue([]),
        zrem: vitest_1.vi.fn().mockResolvedValue(1),
        pipeline: vitest_1.vi.fn(function () { return ({
            lpush: vitest_1.vi.fn(),
            exec: vitest_1.vi.fn().mockResolvedValue([]),
        }); }),
        subscribe: vitest_1.vi.fn(),
        unsubscribe: vitest_1.vi.fn(),
        on: vitest_1.vi.fn(),
    },
}); });
var prisma_1 = require("@/lib/prisma");
var redis_1 = require("@/lib/redis");
(0, vitest_1.describe)('GestorVentanasAtencion', function () {
    var gestor;
    // Datos mock completos para findUnique con include
    var ventanaCompletaMock = {
        id: 'ventana-1',
        periodoId: 'periodo-1',
        nombre: 'Ventana Test',
        categoria: 'PRINCIPAL',
        fechaInicio: new Date('2024-09-01'),
        fechaFin: new Date('2024-09-15'),
        estado: 'PROGRAMADA',
        ordenAtencion: ['PRINCIPAL', 'ASOCIADO', 'AUXILIAR'],
        createdAt: new Date(),
        updatedAt: new Date(),
        periodo: {
            id: 'periodo-1',
            nombre: '2024-II',
        },
        atenciones: [],
    };
    var ventanaAbiertaMock = __assign(__assign({}, ventanaCompletaMock), { estado: 'ABIERTA' });
    var ventanaEnCursoMock = __assign(__assign({}, ventanaCompletaMock), { estado: 'EN_CURSO' });
    var atencionMock = {
        id: 'atencion-1',
        ventanaId: 'ventana-1',
        docenteId: 'doc-1',
        posicion: 1,
        estado: 'ESPERANDO',
        horaInicio: null,
        horaFin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        docente: {
            id: 'doc-1',
            codigo: 'DOC001',
            categoria: 'PRINCIPAL',
            departamento: 'Ingeniería',
            usuario: {
                id: 'user-1',
                nombre: 'Juan',
                apellidos: 'Pérez García',
                email: 'juan.perez@unitru.edu.pe',
            },
            preferenciasNotificacion: {
                sistemaActivo: true,
                correoActivo: true,
                whatsappActivo: false,
                telegramActivo: false,
            },
        },
    };
    (0, vitest_1.beforeEach)(function () {
        gestor = new GestorVentanasAtencion_1.GestorVentanasAtencion();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('listarVentanas', function () {
        (0, vitest_1.it)('debe listar ventanas sin filtros', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ventanas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findMany.mockResolvedValueOnce([
                            {
                                id: 'v1',
                                nombre: 'Ventana Principal',
                                categoria: 'PRINCIPAL',
                                estado: 'PROGRAMADA',
                                fechaInicio: new Date(),
                                fechaFin: new Date(),
                                periodo: { id: 'p1', nombre: '2024-II' },
                                _count: { atenciones: 0 },
                            },
                        ]);
                        return [4 /*yield*/, gestor.listarVentanas()];
                    case 1:
                        ventanas = _a.sent();
                        (0, vitest_1.expect)(ventanas).toHaveLength(1);
                        (0, vitest_1.expect)(ventanas[0].nombre).toBe('Ventana Principal');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe filtrar por período', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findMany.mockResolvedValueOnce([]);
                        return [4 /*yield*/, gestor.listarVentanas('periodo-1')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.ventanaAtencion.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: vitest_1.expect.objectContaining({ periodoId: 'periodo-1' }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe filtrar por estado', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findMany.mockResolvedValueOnce([]);
                        return [4 /*yield*/, gestor.listarVentanas(undefined, 'ABIERTA')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.ventanaAtencion.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: vitest_1.expect.objectContaining({ estado: 'ABIERTA' }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('crearVentana', function () {
        var datosCrear = {
            periodoId: 'periodo-1',
            nombre: 'Ventana Principal 2024-II',
            categoria: 'PRINCIPAL',
            fechaInicio: '2024-09-01',
            fechaFin: '2024-09-15',
            ordenAtencion: ['PRINCIPAL', 'ASOCIADO', 'AUXILIAR'],
        };
        (0, vitest_1.it)('debe crear una ventana exitosamente', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ventana;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.periodoAcademico.findUnique.mockResolvedValueOnce({
                            id: 'periodo-1',
                            nombre: '2024-II',
                            estado: 'ACTIVO',
                        });
                        prisma_1.prisma.ventanaAtencion.findFirst.mockResolvedValueOnce(null);
                        prisma_1.prisma.ventanaAtencion.create.mockResolvedValueOnce(__assign(__assign({ id: 'ventana-nueva' }, datosCrear), { fechaInicio: new Date(datosCrear.fechaInicio), fechaFin: new Date(datosCrear.fechaFin), estado: 'PROGRAMADA', ordenAtencion: datosCrear.ordenAtencion, periodo: { id: 'periodo-1', nombre: '2024-II' }, createdAt: new Date(), updatedAt: new Date() }));
                        return [4 /*yield*/, gestor.crearVentana(datosCrear)];
                    case 1:
                        ventana = _a.sent();
                        (0, vitest_1.expect)(ventana).toBeDefined();
                        (0, vitest_1.expect)(ventana.id).toBe('ventana-nueva');
                        (0, vitest_1.expect)(ventana.nombre).toBe('Ventana Principal 2024-II');
                        (0, vitest_1.expect)(prisma_1.prisma.ventanaAtencion.create).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si el período no existe', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.periodoAcademico.findUnique.mockResolvedValueOnce(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(gestor.crearVentana(datosCrear)).rejects.toThrow('Período no encontrado')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si ya existe ventana activa para la misma categoría', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.periodoAcademico.findUnique.mockResolvedValueOnce({
                            id: 'periodo-1',
                            nombre: '2024-II',
                        });
                        prisma_1.prisma.ventanaAtencion.findFirst.mockResolvedValueOnce({
                            id: 'ventana-existente',
                            estado: 'ABIERTA',
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(gestor.crearVentana(datosCrear)).rejects.toThrow('Ya existe una ventana activa')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('obtenerVentana', function () {
        (0, vitest_1.it)('debe retornar ventana con sus relaciones', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ventana;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValueOnce(ventanaCompletaMock);
                        return [4 /*yield*/, gestor.obtenerVentana('ventana-1')];
                    case 1:
                        ventana = _a.sent();
                        (0, vitest_1.expect)(ventana).toBeDefined();
                        (0, vitest_1.expect)(ventana.id).toBe('ventana-1');
                        (0, vitest_1.expect)(ventana.periodo.nombre).toBe('2024-II');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe lanzar error si no existe', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValueOnce(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(gestor.obtenerVentana('no-existe')).rejects.toThrow('Ventana de atención no encontrada')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('abrirVentana', function () {
        (0, vitest_1.it)('debe abrir una ventana programada y generar cola de docentes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock findUnique para obtenerVentana (llamado internamente)
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValue(ventanaCompletaMock);
                        // Mock docentes de la categoría
                        prisma_1.prisma.docente.findMany.mockResolvedValueOnce([
                            { id: 'doc-1', categoria: 'PRINCIPAL', activo: true, usuario: { activo: true } },
                            { id: 'doc-2', categoria: 'PRINCIPAL', activo: true, usuario: { activo: true } },
                        ]);
                        // Mock createMany de atenciones
                        prisma_1.prisma.atencionVentana.createMany.mockResolvedValueOnce({ count: 2 });
                        // Mock update para cambiar estado
                        prisma_1.prisma.ventanaAtencion.update.mockResolvedValueOnce(__assign(__assign({}, ventanaCompletaMock), { estado: 'ABIERTA', atenciones: [
                                __assign(__assign({}, atencionMock), { posicion: 1 }),
                                __assign(__assign({}, atencionMock), { id: 'atencion-2', posicion: 2, docenteId: 'doc-2' }),
                            ] }));
                        return [4 /*yield*/, gestor.abrirVentana('ventana-1')];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado).toBeDefined();
                        (0, vitest_1.expect)(resultado.estado).toBe('ABIERTA');
                        (0, vitest_1.expect)(prisma_1.prisma.docente.findMany).toHaveBeenCalled();
                        (0, vitest_1.expect)(prisma_1.prisma.atencionVentana.createMany).toHaveBeenCalled();
                        (0, vitest_1.expect)(prisma_1.prisma.ventanaAtencion.update).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: { id: 'ventana-1' },
                            data: { estado: 'ABIERTA' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si la ventana no está programada', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValueOnce(__assign(__assign({}, ventanaCompletaMock), { estado: 'ABIERTA' }));
                        return [4 /*yield*/, (0, vitest_1.expect)(gestor.abrirVentana('ventana-1')).rejects.toThrow('no está programada')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('cerrarVentana', function () {
        (0, vitest_1.it)('debe cerrar una ventana abierta y marcar docentes como ausentes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValue(ventanaAbiertaMock);
                        prisma_1.prisma.atencionVentana.updateMany.mockResolvedValueOnce({ count: 3 });
                        prisma_1.prisma.ventanaAtencion.update.mockResolvedValueOnce(__assign(__assign({}, ventanaAbiertaMock), { estado: 'CERRADA' }));
                        return [4 /*yield*/, gestor.cerrarVentana('ventana-1')];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado).toBeDefined();
                        (0, vitest_1.expect)(resultado.estado).toBe('CERRADA');
                        (0, vitest_1.expect)(prisma_1.prisma.atencionVentana.updateMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: {
                                ventanaId: 'ventana-1',
                                estado: { in: ['ESPERANDO', 'EN_ATENCION'] },
                            },
                            data: { estado: 'AUSENTE' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si la ventana no está abierta', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValueOnce(__assign(__assign({}, ventanaCompletaMock), { estado: 'PROGRAMADA' }));
                        return [4 /*yield*/, (0, vitest_1.expect)(gestor.cerrarVentana('ventana-1')).rejects.toThrow('no está abierta')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('llamarSiguienteDocente', function () {
        (0, vitest_1.it)('debe llamar al siguiente docente en espera', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Ventana en estado ABIERTA
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValue(ventanaAbiertaMock);
                        // Siguiente docente en espera
                        prisma_1.prisma.atencionVentana.findFirst.mockResolvedValueOnce(atencionMock);
                        // Actualizar atención a EN_ATENCION
                        prisma_1.prisma.atencionVentana.update.mockResolvedValueOnce(__assign(__assign({}, atencionMock), { estado: 'EN_ATENCION', horaInicio: new Date() }));
                        // Actualizar ventana a EN_CURSO
                        prisma_1.prisma.ventanaAtencion.update.mockResolvedValueOnce(__assign(__assign({}, ventanaAbiertaMock), { estado: 'EN_CURSO' }));
                        return [4 /*yield*/, gestor.llamarSiguienteDocente('ventana-1')];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.ventanaCerrada).toBe(false);
                        (0, vitest_1.expect)(resultado.mensaje).toContain('Docente llamado exitosamente');
                        (0, vitest_1.expect)(resultado.atencion).toBeDefined();
                        (0, vitest_1.expect)(resultado.atencion.docente.usuario.nombre).toBe('Juan');
                        (0, vitest_1.expect)(prisma_1.prisma.atencionVentana.update).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: { id: 'atencion-1' },
                            data: vitest_1.expect.objectContaining({
                                estado: 'EN_ATENCION',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe cerrar ventana si no hay más docentes en espera', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValue(ventanaEnCursoMock);
                        // No hay docentes en espera
                        prisma_1.prisma.atencionVentana.findFirst.mockResolvedValueOnce(null);
                        // Mock del cierre
                        prisma_1.prisma.atencionVentana.updateMany.mockResolvedValueOnce({ count: 0 });
                        prisma_1.prisma.ventanaAtencion.update.mockResolvedValueOnce(__assign(__assign({}, ventanaEnCursoMock), { estado: 'CERRADA' }));
                        return [4 /*yield*/, gestor.llamarSiguienteDocente('ventana-1')];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.ventanaCerrada).toBe(true);
                        (0, vitest_1.expect)(resultado.mensaje).toContain('No hay más docentes');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe notificar vía WebSocket al llamar docente', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.ventanaAtencion.findUnique.mockResolvedValue(ventanaAbiertaMock);
                        prisma_1.prisma.atencionVentana.findFirst.mockResolvedValueOnce(atencionMock);
                        prisma_1.prisma.atencionVentana.update.mockResolvedValueOnce(__assign(__assign({}, atencionMock), { estado: 'EN_ATENCION' }));
                        prisma_1.prisma.ventanaAtencion.update.mockResolvedValueOnce(__assign(__assign({}, ventanaAbiertaMock), { estado: 'EN_CURSO' }));
                        return [4 /*yield*/, gestor.llamarSiguienteDocente('ventana-1')];
                    case 1:
                        _a.sent();
                        // Verificar que se publicó en WebSocket
                        (0, vitest_1.expect)(redis_1.redis.publish).toHaveBeenCalledWith('ws:ventanas', vitest_1.expect.stringContaining('LLAMANDO_DOCENTE'));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('obtenerCola', function () {
        (0, vitest_1.it)('debe retornar la cola con estadísticas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cola;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.atencionVentana.findMany.mockResolvedValueOnce([
                            __assign(__assign({}, atencionMock), { estado: 'ATENDIDO', posicion: 1 }),
                            __assign(__assign({}, atencionMock), { id: 'at-2', estado: 'EN_ATENCION', posicion: 2 }),
                            __assign(__assign({}, atencionMock), { id: 'at-3', estado: 'ESPERANDO', posicion: 3 }),
                            __assign(__assign({}, atencionMock), { id: 'at-4', estado: 'ESPERANDO', posicion: 4 }),
                            __assign(__assign({}, atencionMock), { id: 'at-5', estado: 'AUSENTE', posicion: 5 }),
                        ]);
                        return [4 /*yield*/, gestor.obtenerCola('ventana-1')];
                    case 1:
                        cola = _a.sent();
                        (0, vitest_1.expect)(cola.total).toBe(5);
                        (0, vitest_1.expect)(cola.enEspera).toBe(2);
                        (0, vitest_1.expect)(cola.enAtencion).toBe(1);
                        (0, vitest_1.expect)(cola.atendidos).toBe(1);
                        (0, vitest_1.expect)(cola.ausentes).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
