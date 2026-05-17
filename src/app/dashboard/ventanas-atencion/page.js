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
exports.default = VentanasAtencionPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var DataTable_1 = require("@/components/data/DataTable");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var api_client_1 = require("@/lib/api-client");
var formateadores_1 = require("@/lib/formateadores");
var AuthContext_1 = require("@/contexts/AuthContext");
var PeriodoContext_1 = require("@/contexts/PeriodoContext");
var client_1 = require("@prisma/client");
var sonner_1 = require("sonner");
function VentanasAtencionPage() {
    var _this = this;
    var _a;
    var authLoading = (0, AuthContext_1.useRequireAuth)([
        client_1.Rol.SUPER_ADMIN,
        client_1.Rol.ADMINISTRADOR,
        client_1.Rol.OPERADOR,
    ]).loading;
    var _b = (0, PeriodoContext_1.usePeriodo)(), periodoSeleccionado = _b.periodoSeleccionado, periodoLoading = _b.loading;
    var periodoId = (_a = periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.id) !== null && _a !== void 0 ? _a : '';
    var _c = (0, react_1.useState)([]), data = _c[0], setData = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(false), dialogOpen = _f[0], setDialogOpen = _f[1];
    var _g = (0, react_1.useState)(false), saving = _g[0], setSaving = _g[1];
    var _h = (0, react_1.useState)({
        nombre: '',
        categoria: client_1.CategoriaDocente.PRINCIPAL,
        fechaInicio: '',
        fechaFin: '',
    }), form = _h[0], setForm = _h[1];
    var load = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!periodoId) {
                        setData([]);
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiGet)('/api/ventanas-atencion', { periodoId: periodoId })];
                case 2:
                    res = _b.sent();
                    setData((_a = res.data) !== null && _a !== void 0 ? _a : []);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    setError(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al cargar ventanas');
                    setData([]);
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
    }, [periodoId]);
    var handleCreate = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!periodoId)
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/ventanas-atencion', {
                            periodoId: periodoId,
                            nombre: form.nombre,
                            categoria: form.categoria,
                            fechaInicio: form.fechaInicio,
                            fechaFin: form.fechaFin,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Ventana creada');
                    setDialogOpen(false);
                    setForm({
                        nombre: '',
                        categoria: client_1.CategoriaDocente.PRINCIPAL,
                        fechaInicio: '',
                        fechaFin: '',
                    });
                    load();
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error al crear');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var columns = (0, react_1.useMemo)(function () { return [
        { key: 'n', header: 'Nombre', cell: function (r) { return <span className="font-medium">{r.nombre}</span>; } },
        {
            key: 'c',
            header: 'Categoría',
            cell: function (r) { return formateadores_1.Formateadores.categoriaDocente(r.categoria); },
        },
        {
            key: 'fi',
            header: 'Inicio',
            cell: function (r) { return new Date(r.fechaInicio).toLocaleString('es-PE'); },
        },
        {
            key: 'ff',
            header: 'Fin',
            cell: function (r) { return new Date(r.fechaFin).toLocaleString('es-PE'); },
        },
        {
            key: 'e',
            header: 'Estado',
            cell: function (r) { var _a; return (_a = r.estado) !== null && _a !== void 0 ? _a : '—'; },
        },
    ]; }, []);
    if (authLoading || periodoLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    if (!periodoId) {
        return (<div>
        <PageHeader_1.PageHeader title="Ventanas de atención" description="Turnos por categoría docente."/>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Elija un período académico para listar o crear ventanas.
        </div>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Ventanas de atención" description={"Per\u00EDodo: ".concat(periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.nombre)} actions={<button_1.Button onClick={function () { return setDialogOpen(true); }} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
            <lucide_react_1.Plus className="h-4 w-4"/>
            Nueva ventana
          </button_1.Button>}/>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={load}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }}/>

      <dialog_1.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Nueva ventana de atención</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <label_1.Label>Nombre</label_1.Label>
              <input_1.Input value={form.nombre} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { nombre: e.target.value })); }); }}/>
            </div>
            <div>
              <label_1.Label>Categoría atendida</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.categoria} onChange={function (e) {
            return setForm(function (f) { return (__assign(__assign({}, f), { categoria: e.target.value })); });
        }}>
                {Object.values(client_1.CategoriaDocente).map(function (c) { return (<option key={c} value={c}>
                    {formateadores_1.Formateadores.categoriaDocente(c)}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label>Inicio</label_1.Label>
              <input_1.Input type="datetime-local" value={form.fechaInicio} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { fechaInicio: e.target.value })); }); }}/>
            </div>
            <div>
              <label_1.Label>Fin</label_1.Label>
              <input_1.Input type="datetime-local" value={form.fechaFin} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { fechaFin: e.target.value })); }); }}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setDialogOpen(false); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" disabled={saving || !form.nombre.trim()} onClick={handleCreate} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              {saving ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : 'Crear'}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
