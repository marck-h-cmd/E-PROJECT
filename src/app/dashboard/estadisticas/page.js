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
exports.default = EstadisticasPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var BarChartCard_1 = require("@/components/charts/BarChartCard");
var PieChartCard_1 = require("@/components/charts/PieChartCard");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var KpiCard_1 = require("@/components/feedback/KpiCard");
var PageHeader_1 = require("@/components/layout/PageHeader");
var api_client_1 = require("@/lib/api-client");
var formateadores_1 = require("@/lib/formateadores");
var AuthContext_1 = require("@/contexts/AuthContext");
var PeriodoContext_1 = require("@/contexts/PeriodoContext");
var client_1 = require("@prisma/client");
var DIAS_CORTO = {
    LUNES: 'Lun',
    MARTES: 'Mar',
    MIERCOLES: 'Mié',
    JUEVES: 'Jue',
    VIERNES: 'Vie',
};
var ORDEN_DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
function EstadisticasPage() {
    var _this = this;
    var _a, _b, _c, _d, _e;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN, client_1.Rol.ADMINISTRADOR]).loading;
    var _f = (0, PeriodoContext_1.usePeriodo)(), periodoSeleccionado = _f.periodoSeleccionado, periodoLoading = _f.loading;
    var periodoId = periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.id;
    var _g = (0, react_1.useState)(true), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_1.useState)(null), error = _h[0], setError = _h[1];
    var _j = (0, react_1.useState)(null), resumen = _j[0], setResumen = _j[1];
    var _k = (0, react_1.useState)([]), ocupacion = _k[0], setOcupacion = _k[1];
    var _l = (0, react_1.useState)(null), avance = _l[0], setAvance = _l[1];
    var _m = (0, react_1.useState)(null), mapaCalor = _m[0], setMapaCalor = _m[1];
    (0, react_1.useEffect)(function () {
        if (!periodoId) {
            setResumen(null);
            setOcupacion([]);
            setAvance(null);
            setMapaCalor(null);
            setLoading(false);
            return;
        }
        var c = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, r, o, a, m, e_1;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                (0, api_client_1.apiGet)('/api/estadisticas/resumen', { periodoId: periodoId }),
                                (0, api_client_1.apiGet)('/api/estadisticas/ocupacion-ambientes', { periodoId: periodoId }),
                                (0, api_client_1.apiGet)('/api/estadisticas/avance-categoria', { periodoId: periodoId }),
                                (0, api_client_1.apiGet)('/api/estadisticas/mapa-calor', { periodoId: periodoId }),
                            ])];
                    case 2:
                        _a = _f.sent(), r = _a[0], o = _a[1], a = _a[2], m = _a[3];
                        if (c)
                            return [2 /*return*/];
                        setResumen((_b = r.data) !== null && _b !== void 0 ? _b : null);
                        setOcupacion((_c = o.data) !== null && _c !== void 0 ? _c : []);
                        setAvance((_d = a.data) !== null && _d !== void 0 ? _d : null);
                        setMapaCalor((_e = m.data) !== null && _e !== void 0 ? _e : null);
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _f.sent();
                        if (!c)
                            setError(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al cargar estadísticas');
                        return [3 /*break*/, 5];
                    case 4:
                        if (!c)
                            setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            c = true;
        };
    }, [periodoId]);
    var pieAvance = (0, react_1.useMemo)(function () {
        if (!avance)
            return [];
        return Object.entries(avance).map(function (_a) {
            var cat = _a[0], v = _a[1];
            return ({
                name: formateadores_1.Formateadores.categoriaDocente(cat),
                value: Math.max(0, v.porcentajeAvance),
            });
        });
    }, [avance]);
    var barMapaCalor = (0, react_1.useMemo)(function () {
        var _a;
        if (!mapaCalor)
            return [];
        var rows = [];
        for (var _i = 0, ORDEN_DIAS_1 = ORDEN_DIAS; _i < ORDEN_DIAS_1.length; _i++) {
            var dia = ORDEN_DIAS_1[_i];
            var bloques = mapaCalor[dia];
            if (!bloques)
                continue;
            for (var _b = 0, _c = Object.keys(bloques).sort(); _b < _c.length; _b++) {
                var hora = _c[_b];
                rows.push({
                    franja: "".concat((_a = DIAS_CORTO[dia]) !== null && _a !== void 0 ? _a : dia, " ").concat(hora),
                    sesiones: bloques[hora],
                });
            }
        }
        return rows;
    }, [mapaCalor]);
    var barOcupacion = (0, react_1.useMemo)(function () {
        return ocupacion.map(function (a) { return ({
            ambiente: a.nombre || a.codigo,
            pct: a.porcentajeOcupacion,
            ocupadas: a.horariosOcupados,
        }); });
    }, [ocupacion]);
    var barPorDia = (0, react_1.useMemo)(function () {
        if (!(resumen === null || resumen === void 0 ? void 0 : resumen.horariosPorDia))
            return [];
        return Object.entries(resumen.horariosPorDia).map(function (_a) {
            var _b;
            var dia = _a[0], n = _a[1];
            return ({
                dia: (_b = DIAS_CORTO[dia]) !== null && _b !== void 0 ? _b : dia,
                cantidad: n,
            });
        });
    }, [resumen]);
    if (authLoading || periodoLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    if (!periodoId) {
        return (<div>
        <PageHeader_1.PageHeader title="Estadísticas detalladas" description="Análisis del período seleccionado."/>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico.
        </div>
      </div>);
    }
    return (<div className="space-y-8">
      <PageHeader_1.PageHeader title="Estadísticas detalladas" description={"Mismos indicadores que el panel principal, con desglose adicional. ".concat((_a = periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.nombre) !== null && _a !== void 0 ? _a : '')}/>

      {error && <ErrorAlert_1.ErrorAlert message={error}/>}

      {loading ? (<div className="flex justify-center py-20">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
        </div>) : (<>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard_1.KpiCard title="Docentes" value={(_b = resumen === null || resumen === void 0 ? void 0 : resumen.totalDocentes) !== null && _b !== void 0 ? _b : 0} icon={lucide_react_1.Users}/>
            <KpiCard_1.KpiCard title="Cursos" value={(_c = resumen === null || resumen === void 0 ? void 0 : resumen.totalCursos) !== null && _c !== void 0 ? _c : 0} icon={lucide_react_1.GraduationCap}/>
            <KpiCard_1.KpiCard title="Ambientes" value={(_d = resumen === null || resumen === void 0 ? void 0 : resumen.totalAmbientes) !== null && _d !== void 0 ? _d : 0} icon={lucide_react_1.Building2}/>
            <KpiCard_1.KpiCard title="Horarios" value={(_e = resumen === null || resumen === void 0 ? void 0 : resumen.totalHorarios) !== null && _e !== void 0 ? _e : 0} icon={lucide_react_1.CalendarClock}/>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-gray-900">Horarios por estado</h3>
            </div>
            <div className="card-body text-sm text-gray-700">
              {(resumen === null || resumen === void 0 ? void 0 : resumen.horariosPorEstado) &&
                Object.entries(resumen.horariosPorEstado).map(function (_a) {
                    var k = _a[0], v = _a[1];
                    return (<div key={k} className="flex justify-between border-b border-gray-100 py-1">
                    <span>{formateadores_1.Formateadores.estadoHorario(k)}</span>
                    <span className="font-medium text-unt-blue">{v}</span>
                  </div>);
                })}
            </div>
          </div>

          <BarChartCard_1.BarChartCard title="Distribución por día de la semana" data={barPorDia} xKey="dia" dataKey="cantidad" color="#1a365d"/>

          <div className="grid gap-6 lg:grid-cols-2">
            <BarChartCard_1.BarChartCard title="Ocupación de ambientes (%)" data={barOcupacion} xKey="ambiente" dataKey="pct" color="#1a365d"/>
            <PieChartCard_1.PieChartCard title="Avance horario por categoría" data={pieAvance}/>
          </div>

          <BarChartCard_1.BarChartCard title="Intensidad horaria (mapa de calor agregado)" data={barMapaCalor} xKey="franja" dataKey="sesiones" color="#1a365d"/>
        </>)}
    </div>);
}
