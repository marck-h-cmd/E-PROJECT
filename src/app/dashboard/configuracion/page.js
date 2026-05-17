'use client';
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
exports.default = ConfiguracionPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var api_client_1 = require("@/lib/api-client");
var AuthContext_1 = require("@/contexts/AuthContext");
var client_1 = require("@prisma/client");
var sonner_1 = require("sonner");
function ConfiguracionPage() {
    var _this = this;
    var _a, _b, _c, _d;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN]).loading;
    var _e = (0, react_1.useState)({}), cfg = _e[0], setCfg = _e[1];
    var _f = (0, react_1.useState)(true), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)(false), saving = _g[0], setSaving = _g[1];
    var _h = (0, react_1.useState)(null), error = _h[0], setError = _h[1];
    var load = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiGet)('/api/configuracion')];
                case 2:
                    res = _b.sent();
                    setCfg((_a = res.data) !== null && _a !== void 0 ? _a : {});
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    setError(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al cargar configuración');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        load();
    }, []);
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPut)('/api/configuracion', {
                            nombreApp: cfg.nombreApp,
                            version: cfg.version,
                            maxIntentosLogin: cfg.maxIntentosLogin,
                            tiempoBloqueoMinutos: cfg.tiempoBloqueoMinutos,
                            notificacionesActivas: cfg.notificacionesActivas,
                            auditoriaActiva: cfg.auditoriaActiva,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Configuración guardada');
                    load();
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error al guardar');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Configuración del sistema" description="Parámetros generales almacenados en caché (Redis)." actions={<button_1.Button onClick={handleSave} disabled={saving || loading} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
            <lucide_react_1.Save className="h-4 w-4"/>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button_1.Button>}/>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={load}/>}

      {loading ? (<div className="flex justify-center py-16">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
        </div>) : (<div className="card max-w-xl">
          <div className="card-body space-y-4">
            <div>
              <label_1.Label htmlFor="na">Nombre de la aplicación</label_1.Label>
              <input_1.Input id="na" value={(_a = cfg.nombreApp) !== null && _a !== void 0 ? _a : ''} onChange={function (e) { return setCfg(function (c) { return (__assign(__assign({}, c), { nombreApp: e.target.value })); }); }}/>
            </div>
            <div>
              <label_1.Label htmlFor="ver">Versión</label_1.Label>
              <input_1.Input id="ver" value={(_b = cfg.version) !== null && _b !== void 0 ? _b : ''} onChange={function (e) { return setCfg(function (c) { return (__assign(__assign({}, c), { version: e.target.value })); }); }}/>
            </div>
            <div>
              <label_1.Label htmlFor="max">Máximo intentos de login</label_1.Label>
              <input_1.Input id="max" type="number" min={1} value={(_c = cfg.maxIntentosLogin) !== null && _c !== void 0 ? _c : ''} onChange={function (e) {
                return setCfg(function (c) { return (__assign(__assign({}, c), { maxIntentosLogin: parseInt(e.target.value, 10) || 0 })); });
            }}/>
            </div>
            <div>
              <label_1.Label htmlFor="tb">Tiempo de bloqueo (minutos)</label_1.Label>
              <input_1.Input id="tb" type="number" min={1} value={(_d = cfg.tiempoBloqueoMinutos) !== null && _d !== void 0 ? _d : ''} onChange={function (e) {
                return setCfg(function (c) { return (__assign(__assign({}, c), { tiempoBloqueoMinutos: parseInt(e.target.value, 10) || 0 })); });
            }}/>
            </div>
            <div className="flex items-center gap-2">
              <input id="notif" type="checkbox" checked={!!cfg.notificacionesActivas} onChange={function (e) {
                return setCfg(function (c) { return (__assign(__assign({}, c), { notificacionesActivas: e.target.checked })); });
            }}/>
              <label_1.Label htmlFor="notif">Notificaciones activas</label_1.Label>
            </div>
            <div className="flex items-center gap-2">
              <input id="aud" type="checkbox" checked={!!cfg.auditoriaActiva} onChange={function (e) { return setCfg(function (c) { return (__assign(__assign({}, c), { auditoriaActiva: e.target.checked })); }); }}/>
              <label_1.Label htmlFor="aud">Auditoría activa</label_1.Label>
            </div>
          </div>
        </div>)}
    </div>);
}
