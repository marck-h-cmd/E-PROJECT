'use client';
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
exports.PeriodoProvider = PeriodoProvider;
exports.usePeriodo = usePeriodo;
var react_1 = require("react");
var api_client_1 = require("@/lib/api-client");
var PeriodoContext = (0, react_1.createContext)(undefined);
function PeriodoProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = (0, react_1.useState)([]), periodos = _b[0], setPeriodos = _b[1];
    var _c = (0, react_1.useState)(null), periodoActivo = _c[0], setPeriodoActivo = _c[1];
    var _d = (0, react_1.useState)(null), periodoSeleccionado = _d[0], setPeriodoSeleccionado = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    var refresh = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, listaRes, activoRes, lista_1, activo_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, Promise.all([
                            (0, api_client_1.apiGet)('/api/periodos', { limit: 50 }),
                            (0, api_client_1.apiGet)('/api/periodos/activo').catch(function () { return null; }),
                        ])];
                case 1:
                    _a = _c.sent(), listaRes = _a[0], activoRes = _a[1];
                    lista_1 = listaRes.data || [];
                    setPeriodos(lista_1);
                    activo_1 = (activoRes === null || activoRes === void 0 ? void 0 : activoRes.data) || lista_1.find(function (p) { return p.activo; }) || lista_1[0] || null;
                    setPeriodoActivo(activo_1);
                    setPeriodoSeleccionado(function (prev) {
                        if (prev && lista_1.some(function (p) { return p.id === prev.id; }))
                            return prev;
                        return activo_1;
                    });
                    return [3 /*break*/, 4];
                case 2:
                    _b = _c.sent();
                    setPeriodos([]);
                    setPeriodoActivo(null);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        refresh();
    }, [refresh]);
    var value = (0, react_1.useMemo)(function () { return ({
        periodos: periodos,
        periodoActivo: periodoActivo,
        periodoSeleccionado: periodoSeleccionado,
        setPeriodoSeleccionado: setPeriodoSeleccionado,
        loading: loading,
        refresh: refresh,
    }); }, [periodos, periodoActivo, periodoSeleccionado, loading, refresh]);
    return <PeriodoContext.Provider value={value}>{children}</PeriodoContext.Provider>;
}
function usePeriodo() {
    var ctx = (0, react_1.useContext)(PeriodoContext);
    if (!ctx)
        throw new Error('usePeriodo debe usarse dentro de PeriodoProvider');
    return ctx;
}
