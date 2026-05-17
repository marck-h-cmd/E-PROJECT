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
exports.default = ReportesPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var label_1 = require("@/components/ui/label");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var api_client_1 = require("@/lib/api-client");
var AuthContext_1 = require("@/contexts/AuthContext");
var PeriodoContext_1 = require("@/contexts/PeriodoContext");
var client_1 = require("@prisma/client");
var sonner_1 = require("sonner");
function ReportesPage() {
    var _this = this;
    var _a;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN, client_1.Rol.ADMINISTRADOR]).loading;
    var _b = (0, PeriodoContext_1.usePeriodo)(), periodoSeleccionado = _b.periodoSeleccionado, periodoLoading = _b.loading;
    var periodoId = (_a = periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.id) !== null && _a !== void 0 ? _a : '';
    var _c = (0, react_1.useState)([]), docentes = _c[0], setDocentes = _c[1];
    var _d = (0, react_1.useState)([]), ambientes = _d[0], setAmbientes = _d[1];
    var _e = (0, react_1.useState)(''), selDocente = _e[0], setSelDocente = _e[1];
    var _f = (0, react_1.useState)(''), selAmbiente = _f[0], setSelAmbiente = _f[1];
    var _g = (0, react_1.useState)(true), loadingOpts = _g[0], setLoadingOpts = _g[1];
    var _h = (0, react_1.useState)(null), err = _h[0], setErr = _h[1];
    var _j = (0, react_1.useState)(null), downloading = _j[0], setDownloading = _j[1];
    (0, react_1.useEffect)(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, d, a, dList, aList, e_1;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        setLoadingOpts(true);
                        setErr(null);
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                (0, api_client_1.apiGet)('/api/docentes', { limit: 200, page: 1 }),
                                (0, api_client_1.apiGet)('/api/ambientes', { limit: 200, page: 1 }),
                            ])];
                    case 2:
                        _a = _h.sent(), d = _a[0], a = _a[1];
                        dList = (_b = d.data) !== null && _b !== void 0 ? _b : [];
                        aList = (_c = a.data) !== null && _c !== void 0 ? _c : [];
                        setDocentes(dList);
                        setAmbientes(aList);
                        setSelDocente((_e = (_d = dList[0]) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : '');
                        setSelAmbiente((_g = (_f = aList[0]) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : '');
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _h.sent();
                        setErr(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al cargar selectores');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoadingOpts(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
    }, []);
    var runDownload = function (key, fn) { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!periodoId) {
                        sonner_1.toast.error('Seleccione un período');
                        return [2 /*return*/];
                    }
                    setDownloading(key);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fn()];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Descarga iniciada');
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error en la descarga');
                    return [3 /*break*/, 5];
                case 4:
                    setDownloading(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (authLoading || periodoLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div className="space-y-6">
      <PageHeader_1.PageHeader title="Reportes PDF" description="Generación de informes por docente, aula, gestión y conflictos."/>

      {!periodoId && (<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico activo para habilitar las descargas.
        </div>)}

      {err && <ErrorAlert_1.ErrorAlert message={err}/>}

      {loadingOpts ? (<lucide_react_1.Loader2 className="h-6 w-6 animate-spin text-unt-blue"/>) : (<div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte por docente</h3>
            </div>
            <div className="card-body space-y-3">
              <div>
                <label_1.Label>Docente</label_1.Label>
                <select className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={selDocente} onChange={function (e) { return setSelDocente(e.target.value); }}>
                  {docentes.map(function (d) { return (<option key={d.id} value={d.id}>
                      {(d.codigo ? d.codigo + ' — ' : '') +
                    (d.usuario
                        ? "".concat(d.usuario.apellidos, ", ").concat(d.usuario.nombre)
                        : d.nombre)}
                    </option>); })}
                </select>
              </div>
              <button_1.Button className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white" disabled={!selDocente || !!downloading} onClick={function () {
                return runDownload('doc', function () {
                    return (0, api_client_1.downloadFile)('/api/reportes/docente', { docenteId: selDocente, periodoId: periodoId }, "reporte-docente-".concat(selDocente, ".pdf"));
                });
            }}>
                <lucide_react_1.FileDown className="h-4 w-4"/>
                {downloading === 'doc' ? 'Generando…' : 'Descargar'}
              </button_1.Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte por aula / ambiente</h3>
            </div>
            <div className="card-body space-y-3">
              <div>
                <label_1.Label>Ambiente</label_1.Label>
                <select className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={selAmbiente} onChange={function (e) { return setSelAmbiente(e.target.value); }}>
                  {ambientes.map(function (a) { return (<option key={a.id} value={a.id}>
                      {a.codigo ? "".concat(a.codigo, " \u2014 ").concat(a.nombre) : a.nombre}
                    </option>); })}
                </select>
              </div>
              <button_1.Button className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white" disabled={!selAmbiente || !!downloading} onClick={function () {
                return runDownload('aula', function () {
                    return (0, api_client_1.downloadFile)('/api/reportes/aula', { ambienteId: selAmbiente, periodoId: periodoId }, "reporte-aula-".concat(selAmbiente, ".pdf"));
                });
            }}>
                <lucide_react_1.FileDown className="h-4 w-4"/>
                {downloading === 'aula' ? 'Generando…' : 'Descargar'}
              </button_1.Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte de gestión</h3>
            </div>
            <div className="card-body">
              <button_1.Button className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white" disabled={!!downloading} onClick={function () {
                return runDownload('ges', function () {
                    return (0, api_client_1.downloadFile)('/api/reportes/gestion', { periodoId: periodoId }, "reporte-gestion-".concat(periodoId, ".pdf"));
                });
            }}>
                <lucide_react_1.FileDown className="h-4 w-4"/>
                {downloading === 'ges' ? 'Generando…' : 'Descargar'}
              </button_1.Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte de conflictos</h3>
            </div>
            <div className="card-body">
              <button_1.Button className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white" disabled={!!downloading} onClick={function () {
                return runDownload('conf', function () {
                    return (0, api_client_1.downloadFile)('/api/reportes/conflictos', { periodoId: periodoId }, "reporte-conflictos-".concat(periodoId, ".pdf"));
                });
            }}>
                <lucide_react_1.FileDown className="h-4 w-4"/>
                {downloading === 'conf' ? 'Generando…' : 'Descargar'}
              </button_1.Button>
            </div>
          </div>
        </div>)}
    </div>);
}
