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
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
var ServicioAmbiente_1 = require("@/services/ambientes/ServicioAmbiente");
var respuestas_1 = require("@/lib/respuestas");
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
var servicioAmbiente = new ServicioAmbiente_1.ServicioAmbiente();
var updateAmbienteSchema = zod_1.z.object({
    codigo: zod_1.z.string().min(3).max(20).optional(),
    nombre: zod_1.z.string().min(3).max(100).optional(),
    tipo: zod_1.z.nativeEnum(client_1.TipoAmbiente).optional(),
    capacidad: zod_1.z.number().int().positive().optional(),
    ubicacion: zod_1.z.string().optional(),
    activo: zod_1.z.boolean().optional(),
});
function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var ambiente, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, servicioAmbiente.obtenerPorId(params.id)];
                case 1:
                    ambiente = _c.sent();
                    return [2 /*return*/, (0, respuestas_1.createSuccessResponse)(ambiente)];
                case 2:
                    error_1 = _c.sent();
                    if (error_1.statusCode) {
                        return [2 /*return*/, (0, respuestas_1.createErrorResponse)(error_1.code, error_1.message, error_1.statusCode)];
                    }
                    console.error('Error obteniendo ambiente:', error_1);
                    return [2 /*return*/, (0, respuestas_1.createErrorResponse)('INTERNAL_ERROR', 'Error al obtener ambiente', 500)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var body, validation, ambiente, error_2;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _c.sent();
                    validation = updateAmbienteSchema.safeParse(body);
                    if (!validation.success) {
                        return [2 /*return*/, (0, respuestas_1.createErrorResponse)('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors)];
                    }
                    return [4 /*yield*/, servicioAmbiente.actualizar(params.id, validation.data)];
                case 2:
                    ambiente = _c.sent();
                    return [2 /*return*/, (0, respuestas_1.createSuccessResponse)(ambiente)];
                case 3:
                    error_2 = _c.sent();
                    if (error_2.statusCode) {
                        return [2 /*return*/, (0, respuestas_1.createErrorResponse)(error_2.code, error_2.message, error_2.statusCode)];
                    }
                    console.error('Error actualizando ambiente:', error_2);
                    return [2 /*return*/, (0, respuestas_1.createErrorResponse)('INTERNAL_ERROR', 'Error al actualizar ambiente', 500)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var error_3;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, servicioAmbiente.eliminar(params.id)];
                case 1:
                    _c.sent();
                    return [2 /*return*/, (0, respuestas_1.createSuccessResponse)({ message: 'Ambiente desactivado exitosamente' })];
                case 2:
                    error_3 = _c.sent();
                    if (error_3.statusCode) {
                        return [2 /*return*/, (0, respuestas_1.createErrorResponse)(error_3.code, error_3.message, error_3.statusCode)];
                    }
                    console.error('Error eliminando ambiente:', error_3);
                    return [2 /*return*/, (0, respuestas_1.createErrorResponse)('INTERNAL_ERROR', 'Error al eliminar ambiente', 500)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
