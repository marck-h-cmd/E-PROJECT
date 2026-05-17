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
var AuthService_1 = require("@/services/auth/AuthService");
vitest_1.vi.mock('@/lib/prisma', function () { return ({
    prisma: {
        usuario: {
            findUnique: vitest_1.vi.fn(),
            update: vitest_1.vi.fn().mockResolvedValue({}),
        },
        sesion: {
            create: vitest_1.vi.fn().mockResolvedValue({}),
            findUnique: vitest_1.vi.fn(),
            update: vitest_1.vi.fn().mockResolvedValue({}),
            updateMany: vitest_1.vi.fn().mockResolvedValue({ count: 1 }),
        },
    },
}); });
var prisma_1 = require("@/lib/prisma");
var bcryptjs_1 = require("bcryptjs");
(0, vitest_1.describe)('AuthService - Integración', function () {
    var authService;
    var mockUsuario = {
        id: 'user-1',
        email: 'docente@unitru.edu.pe',
        password: '',
        nombre: 'Juan',
        apellidos: 'Pérez',
        rol: 'DOCENTE',
        activo: true,
        verificado: true,
        tokenVersion: 0,
        ultimoAcceso: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authService = new AuthService_1.AuthService();
                    vitest_1.vi.clearAllMocks();
                    return [4 /*yield*/, bcryptjs_1.default.hash('Password123!', 12)];
                case 1:
                    hash = _a.sent();
                    mockUsuario.password = hash;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('login', function () {
        (0, vitest_1.it)('debe autenticar con credenciales válidas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        prisma_1.prisma.sesion.create.mockResolvedValueOnce({
                            id: 'sesion-1',
                            usuarioId: 'user-1',
                            token: 'token-123',
                            refreshToken: 'refresh-123',
                            expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            activa: true,
                        });
                        prisma_1.prisma.usuario.update.mockResolvedValueOnce(__assign(__assign({}, mockUsuario), { ultimoAcceso: new Date() }));
                        return [4 /*yield*/, authService.login('docente@unitru.edu.pe', 'Password123!')];
                    case 1:
                        resultado = _a.sent();
                        (0, vitest_1.expect)(resultado.usuario).toBeDefined();
                        (0, vitest_1.expect)(resultado.usuario.email).toBe('docente@unitru.edu.pe');
                        (0, vitest_1.expect)(resultado.tokens.accessToken).toBeDefined();
                        (0, vitest_1.expect)(resultado.tokens.refreshToken).toBeDefined();
                        // No debe incluir password
                        (0, vitest_1.expect)(resultado.usuario.password).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe crear una sesión al hacer login con los datos correctos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        prisma_1.prisma.sesion.create.mockResolvedValueOnce({});
                        prisma_1.prisma.usuario.update.mockResolvedValueOnce({});
                        return [4 /*yield*/, authService.login('docente@unitru.edu.pe', 'Password123!')];
                    case 1:
                        _a.sent();
                        // Verificar que se llamó a create con los datos que realmente envía el servicio
                        // El servicio envía: usuarioId, token (refreshToken), refreshToken, expiraEn, ipAddress, userAgent
                        // NO envía activa explícitamente porque tiene default true en el esquema
                        (0, vitest_1.expect)(prisma_1.prisma.sesion.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.objectContaining({
                                usuarioId: 'user-1',
                                refreshToken: vitest_1.expect.any(String),
                                expiraEn: vitest_1.expect.any(Date),
                            }),
                        }));
                        createArgs = prisma_1.prisma.sesion.create.mock.calls[0][0];
                        (0, vitest_1.expect)(createArgs.data.usuarioId).toBe('user-1');
                        (0, vitest_1.expect)(createArgs.data.refreshToken).toBeTruthy();
                        (0, vitest_1.expect)(createArgs.data.token).toBe(createArgs.data.refreshToken); // token = refreshToken
                        (0, vitest_1.expect)(createArgs.data.expiraEn).toBeInstanceOf(Date);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe actualizar último acceso al hacer login', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        prisma_1.prisma.sesion.create.mockResolvedValueOnce({});
                        return [4 /*yield*/, authService.login('docente@unitru.edu.pe', 'Password123!')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.usuario.update).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: { id: 'user-1' },
                            data: vitest_1.expect.objectContaining({
                                ultimoAcceso: vitest_1.expect.any(Date),
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe pasar IP y User-Agent a la sesión', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        prisma_1.prisma.sesion.create.mockResolvedValueOnce({});
                        prisma_1.prisma.usuario.update.mockResolvedValueOnce({});
                        return [4 /*yield*/, authService.login('docente@unitru.edu.pe', 'Password123!', '192.168.1.1', 'Mozilla/5.0 Test')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.sesion.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            data: vitest_1.expect.objectContaining({
                                ipAddress: '192.168.1.1',
                                userAgent: 'Mozilla/5.0 Test',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar con credenciales inválidas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.login('docente@unitru.edu.pe', 'WrongPassword123!')).rejects.toThrow(AuthService_1.AppError)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.login('docente@unitru.edu.pe', 'WrongPassword123!')).rejects.toMatchObject({
                                statusCode: 401,
                                code: 'INVALID_CREDENTIALS',
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si la cuenta está desactivada', function () { return __awaiter(void 0, void 0, void 0, function () {
            var usuarioInactivo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usuarioInactivo = __assign(__assign({}, mockUsuario), { activo: false });
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(usuarioInactivo);
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.login('docente@unitru.edu.pe', 'Password123!')).rejects.toMatchObject({
                                statusCode: 403,
                                code: 'ACCOUNT_DISABLED',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si el email no existe', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.login('noexiste@unitru.edu.pe', 'Password123!')).rejects.toMatchObject({
                                statusCode: 401,
                                code: 'INVALID_CREDENTIALS',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('refreshToken', function () {
        (0, vitest_1.it)('debe renovar tokens con refresh token válido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sesionValida, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sesionValida = {
                            id: 'sesion-1',
                            usuarioId: 'user-1',
                            token: 'refresh-token-123',
                            refreshToken: 'refresh-token-123',
                            expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            activa: true,
                            ipAddress: null,
                            userAgent: null,
                            usuario: __assign({}, mockUsuario),
                        };
                        prisma_1.prisma.sesion.findUnique.mockResolvedValueOnce(sesionValida);
                        prisma_1.prisma.sesion.update.mockResolvedValueOnce({});
                        prisma_1.prisma.sesion.create.mockResolvedValueOnce({});
                        return [4 /*yield*/, authService.refreshToken('refresh-token-123')];
                    case 1:
                        tokens = _a.sent();
                        (0, vitest_1.expect)(tokens.accessToken).toBeDefined();
                        (0, vitest_1.expect)(tokens.refreshToken).toBeDefined();
                        // Debe invalidar la sesión anterior
                        (0, vitest_1.expect)(prisma_1.prisma.sesion.update).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: { id: 'sesion-1' },
                            data: { activa: false },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar refresh token expirado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sesionExpirada;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sesionExpirada = {
                            id: 'sesion-2',
                            usuarioId: 'user-1',
                            token: 'refresh-token-expired',
                            refreshToken: 'refresh-token-expired',
                            expiraEn: new Date(Date.now() - 1000), // Ya expiró
                            activa: true,
                            ipAddress: null,
                            userAgent: null,
                            usuario: mockUsuario,
                        };
                        prisma_1.prisma.sesion.findUnique.mockResolvedValueOnce(sesionExpirada);
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.refreshToken('refresh-token-expired')).rejects.toMatchObject({
                                statusCode: 401,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('logout', function () {
        (0, vitest_1.it)('debe invalidar sesiones activas del usuario', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.sesion.updateMany.mockResolvedValueOnce({ count: 2 });
                        return [4 /*yield*/, authService.logout('user-1', 'access-token-123')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.sesion.updateMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: {
                                usuarioId: 'user-1',
                                activa: true,
                            },
                            data: { activa: false },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('cambiarPassword', function () {
        (0, vitest_1.it)('debe cambiar contraseña con datos correctos', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        prisma_1.prisma.usuario.update.mockResolvedValueOnce({});
                        prisma_1.prisma.sesion.updateMany.mockResolvedValueOnce({ count: 1 });
                        return [4 /*yield*/, authService.cambiarPassword('user-1', 'Password123!', 'NewPassword456!')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(prisma_1.prisma.usuario.update).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: { id: 'user-1' },
                            data: vitest_1.expect.objectContaining({
                                password: vitest_1.expect.any(String),
                                tokenVersion: mockUsuario.tokenVersion + 1,
                            }),
                        }));
                        // Debe invalidar todas las sesiones
                        (0, vitest_1.expect)(prisma_1.prisma.sesion.updateMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            where: { usuarioId: 'user-1', activa: true },
                            data: { activa: false },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si la contraseña actual es incorrecta', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuario);
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.cambiarPassword('user-1', 'WrongPassword!', 'NewPassword456!')).rejects.toMatchObject({
                                statusCode: 400,
                                code: 'INVALID_CURRENT_PASSWORD',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe rechazar si el usuario no existe', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma_1.prisma.usuario.findUnique.mockResolvedValueOnce(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(authService.cambiarPassword('no-existe', 'Password123!', 'NewPassword456!')).rejects.toMatchObject({
                                statusCode: 404,
                                code: 'USER_NOT_FOUND',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
