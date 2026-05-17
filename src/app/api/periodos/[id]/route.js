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
exports.PUT = PUT;
var prisma_1 = require("@/lib/prisma");
var respuestas_1 = require("@/lib/respuestas");
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
var updateSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(3).optional(),
    fechaInicio: zod_1.z.string().optional(),
    fechaFin: zod_1.z.string().optional(),
    estado: zod_1.z.nativeEnum(client_1.EstadoPeriodo).optional(),
    activo: zod_1.z.boolean().optional(),
});
function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var body, validation, data, periodo, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _c.sent();
                    validation = updateSchema.safeParse(body);
                    if (!validation.success) {
                        return [2 /*return*/, (0, respuestas_1.createErrorResponse)('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors)];
                    }
                    data = __assign({}, validation.data);
                    if (validation.data.fechaInicio)
                        data.fechaInicio = new Date(validation.data.fechaInicio);
                    if (validation.data.fechaFin)
                        data.fechaFin = new Date(validation.data.fechaFin);
                    if (!(validation.data.activo === true)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma_1.prisma.periodoAcademico.updateMany({
                            where: { activo: true },
                            data: { activo: false },
                        })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [4 /*yield*/, prisma_1.prisma.periodoAcademico.update({
                        where: { id: params.id },
                        data: data,
                    })];
                case 4:
                    periodo = _c.sent();
                    return [2 /*return*/, (0, respuestas_1.createSuccessResponse)(periodo)];
                case 5:
                    error_1 = _c.sent();
                    console.error('Error actualizando período:', error_1);
                    return [2 /*return*/, (0, respuestas_1.createErrorResponse)('INTERNAL_ERROR', 'Error al actualizar período', 500)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
