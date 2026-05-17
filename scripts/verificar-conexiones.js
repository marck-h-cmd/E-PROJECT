"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var client_1 = require("@prisma/client");
var ioredis_1 = require("ioredis");
var nodemailer_1 = require("nodemailer");
var axios_1 = require("axios");
var prisma = new client_1.PrismaClient();
var redis = new ioredis_1.default(process.env.REDIS_URL);
function verificarConexiones() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, ping, error_2, transporter, error_3, response, error_4, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔍 Verificando conexiones...\n');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                case 2:
                    _a.sent();
                    console.log('✅ PostgreSQL: Conectado');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ PostgreSQL: Error de conexión:', error_1);
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, redis.ping()];
                case 5:
                    ping = _a.sent();
                    if (ping === 'PONG') {
                        console.log('✅ Redis: Conectado');
                    }
                    else {
                        console.error('❌ Redis: Respuesta inesperada:', ping);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('❌ Redis: Error de conexión:', error_2);
                    return [3 /*break*/, 7];
                case 7:
                    if (!process.env.SMTP_HOST) return [3 /*break*/, 12];
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    transporter = nodemailer_1.default.createTransport({
                        host: process.env.SMTP_HOST,
                        port: parseInt(process.env.SMTP_PORT || '587'),
                        secure: process.env.SMTP_SECURE === 'true',
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASSWORD,
                        },
                    });
                    return [4 /*yield*/, transporter.verify()];
                case 9:
                    _a.sent();
                    console.log('✅ SMTP: Conectado');
                    return [3 /*break*/, 11];
                case 10:
                    error_3 = _a.sent();
                    console.error('❌ SMTP: Error de conexión:', error_3);
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 13];
                case 12:
                    console.log('⚠️  SMTP: No configurado');
                    _a.label = 13;
                case 13:
                    if (!process.env.WHATSAPP_API_KEY) return [3 /*break*/, 18];
                    _a.label = 14;
                case 14:
                    _a.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, axios_1.default.get("".concat(process.env.WHATSAPP_API_URL, "/health"), {
                            headers: {
                                'Authorization': "Bearer ".concat(process.env.WHATSAPP_API_KEY),
                            },
                        })];
                case 15:
                    response = _a.sent();
                    console.log('✅ WhatsApp API: Conectado');
                    return [3 /*break*/, 17];
                case 16:
                    error_4 = _a.sent();
                    console.error('❌ WhatsApp API: Error de conexión:', error_4);
                    return [3 /*break*/, 17];
                case 17: return [3 /*break*/, 19];
                case 18:
                    console.log('⚠️  WhatsApp API: No configurado');
                    _a.label = 19;
                case 19:
                    if (!process.env.TELEGRAM_BOT_TOKEN) return [3 /*break*/, 24];
                    _a.label = 20;
                case 20:
                    _a.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, axios_1.default.get("https://api.telegram.org/bot".concat(process.env.TELEGRAM_BOT_TOKEN, "/getMe"))];
                case 21:
                    response = _a.sent();
                    console.log('✅ Telegram Bot: Conectado -', response.data.result.username);
                    return [3 /*break*/, 23];
                case 22:
                    error_5 = _a.sent();
                    console.error('❌ Telegram Bot: Error de conexión:', error_5);
                    return [3 /*break*/, 23];
                case 23: return [3 /*break*/, 25];
                case 24:
                    console.log('⚠️  Telegram Bot: No configurado');
                    _a.label = 25;
                case 25:
                    console.log('\n🏁 Verificación completada');
                    return [2 /*return*/];
            }
        });
    });
}
verificarConexiones()
    .catch(console.error)
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [4 /*yield*/, redis.quit()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var templateObject_1;
