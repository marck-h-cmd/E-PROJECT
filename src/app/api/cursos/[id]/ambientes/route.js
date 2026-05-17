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
exports.POST = POST;
var prisma_1 = require("@/lib/prisma");
var respuestas_1 = require("@/lib/respuestas");
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, page, limit, search, tipo, activo, where, _a, ambientes, total, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    searchParams = new URL(request.url).searchParams;
                    page = parseInt(searchParams.get('page') || '1');
                    limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
                    search = searchParams.get('search') || '';
                    tipo = searchParams.get('tipo');
                    activo = searchParams.get('activo');
                    where = {};
                    if (search) {
                        where.OR = [
                            { codigo: { contains: search, mode: 'insensitive' } },
                            { nombre: { contains: search, mode: 'insensitive' } },
                            { ubicacion: { contains: search, mode: 'insensitive' } },
                        ];
                    }
                    if (tipo)
                        where.tipo = tipo;
                    if (activo !== null && activo !== '') {
                        where.activo = activo === 'true';
                    }
                    return [4 /*yield*/, Promise.all([
                            prisma_1.prisma.ambiente.findMany({
                                where: where,
                                include: {
                                    _count: {
                                        select: {
                                            horarios: true,
                                        },
                                    },
                                },
                                orderBy: [{ tipo: 'asc' }, { codigo: 'asc' }],
                                skip: (page - 1) * limit,
                                take: limit,
                            }),
                            prisma_1.prisma.ambiente.count({ where: where }),
                        ])];
                case 1:
                    _a = _b.sent(), ambientes = _a[0], total = _a[1];
                    return [2 /*return*/, (0, respuestas_1.createPaginatedResponse)(ambientes, page, limit, total)];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error listando ambientes:', error_1);
                    return [2 /*return*/, (0, respuestas_1.createErrorResponse)('INTERNAL_ERROR', 'Error al listar ambientes', 500)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var body, ambiente, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.ambiente.create({
                            data: {
                                codigo: body.codigo,
                                nombre: body.nombre,
                                tipo: body.tipo,
                                capacidad: body.capacidad,
                                ubicacion: body.ubicacion,
                            },
                        })];
                case 2:
                    ambiente = _a.sent();
                    return [2 /*return*/, (0, respuestas_1.createSuccessResponse)(ambiente, undefined, 201)];
                case 3:
                    error_2 = _a.sent();
                    if (error_2.code === 'P2002') {
                        return [2 /*return*/, (0, respuestas_1.createErrorResponse)('DUPLICATE', 'Ya existe un ambiente con ese código', 409)];
                    }
                    console.error('Error creando ambiente:', error_2);
                    return [2 /*return*/, (0, respuestas_1.createErrorResponse)('INTERNAL_ERROR', 'Error al crear ambiente', 500)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
