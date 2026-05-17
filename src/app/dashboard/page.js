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
exports.default = DashboardPage;
var react_1 = require("react");
var LayoutDashboard_1 = require("@/components/layouts/LayoutDashboard");
var TarjetaResumenPeriodo_1 = require("@/components/dashboard/TarjetaResumenPeriodo");
var api_client_1 = require("@/lib/api-client");
var Alerta_1 = require("@/components/ui/Alerta");
var AuthContext_1 = require("@/contexts/AuthContext");
var lucide_react_1 = require("lucide-react");
function DashboardPage() {
    var user = (0, AuthContext_1.useAuth)().user;
    var _a = (0, react_1.useState)(null), periodoActivo = _a[0], setPeriodoActivo = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        function fetchPeriodo() {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, 3, 4]);
                            return [4 /*yield*/, (0, api_client_1.apiRequest)('/api/periodos/activo')];
                        case 1:
                            res = _b.sent();
                            if (res.success) {
                                setPeriodoActivo(res.data);
                            }
                            else {
                                setError(((_a = res.error) === null || _a === void 0 ? void 0 : _a.message) || 'No se pudo cargar el período activo');
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            err_1 = _b.sent();
                            setError('Error de conexión con el servidor');
                            return [3 /*break*/, 4];
                        case 3:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        fetchPeriodo();
    }, []);
    return (<LayoutDashboard_1.LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user === null || user === void 0 ? void 0 : user.nombre}</h1>
          <p className="text-sm text-gray-500">Panel de control del sistema de gestión de horarios.</p>
        </div>

        {error && <Alerta_1.Alerta tipo="warning" mensaje={error}/>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <lucide_react_1.Calendar className="h-6 w-6"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Período Activo</p>
                <p className="text-lg font-bold text-gray-900">{(periodoActivo === null || periodoActivo === void 0 ? void 0 : periodoActivo.nombre) || 'Ninguno'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <lucide_react_1.Users className="h-6 w-6"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Docentes</p>
                <p className="text-lg font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                <lucide_react_1.BookOpen className="h-6 w-6"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cursos</p>
                <p className="text-lg font-bold text-gray-900">128</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                <lucide_react_1.MapPin className="h-6 w-6"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Aulas/Lab</p>
                <p className="text-lg font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-96 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ocupación Semanal</h3>
              <div className="flex h-full items-center justify-center text-gray-400">
                <p>Gráfico de ocupación (Implementación en proceso)</p>
              </div>
            </div>
          </div>
          
          <div>
             <TarjetaResumenPeriodo_1.TarjetaResumenPeriodo periodo={periodoActivo} loading={loading}/>
          </div>
        </div>
      </div>
    </LayoutDashboard_1.LayoutDashboard>);
}
