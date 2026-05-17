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
exports.default = PeriodosPage;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var lucide_react_1 = require("lucide-react");
var Badge_1 = require("@/components/ui/Badge");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var DataTable_1 = require("@/components/data/DataTable");
var Pagination_1 = require("@/components/data/Pagination");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var usePaginatedQuery_1 = require("@/hooks/usePaginatedQuery");
var api_client_1 = require("@/lib/api-client");
var formateadores_1 = require("@/lib/formateadores");
var AuthContext_1 = require("@/contexts/AuthContext");
var client_1 = require("@prisma/client");
var sonner_1 = require("sonner");
var PeriodoContext_1 = require("@/contexts/PeriodoContext");
function PeriodosPage() {
    var _this = this;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN, client_1.Rol.ADMINISTRADOR, client_1.Rol.OPERADOR]).loading;
    var refreshPeriodoCtx = (0, PeriodoContext_1.usePeriodo)().refresh;
    var listParams = (0, react_1.useMemo)(function () { return ({}); }, []);
    var _a = (0, usePaginatedQuery_1.usePaginatedQuery)('/api/periodos', listParams), data = _a.data, meta = _a.meta, loading = _a.loading, error = _a.error, page = _a.page, setPage = _a.setPage, refresh = _a.refresh;
    var _b = (0, react_1.useState)(false), createOpen = _b[0], setCreateOpen = _b[1];
    var _c = (0, react_1.useState)(null), editRow = _c[0], setEditRow = _c[1];
    var _d = (0, react_1.useState)(false), saving = _d[0], setSaving = _d[1];
    var _e = (0, react_1.useState)({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
    }), createForm = _e[0], setCreateForm = _e[1];
    var _f = (0, react_1.useState)({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        estado: client_1.EstadoPeriodo.BORRADOR,
        activo: false,
    }), editForm = _f[0], setEditForm = _f[1];
    var openEdit = function (row) {
        setEditRow(row);
        setEditForm({
            nombre: row.nombre,
            fechaInicio: row.fechaInicio.slice(0, 10),
            fechaFin: row.fechaFin.slice(0, 10),
            estado: row.estado,
            activo: row.activo,
        });
    };
    var handleCreate = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/periodos', {
                            nombre: createForm.nombre,
                            fechaInicio: createForm.fechaInicio,
                            fechaFin: createForm.fechaFin,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Período creado');
                    setCreateOpen(false);
                    setCreateForm({ nombre: '', fechaInicio: '', fechaFin: '' });
                    refresh();
                    refreshPeriodoCtx();
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    sonner_1.toast.error(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al crear');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleEditSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editRow)
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPut)("/api/periodos/".concat(editRow.id), {
                            nombre: editForm.nombre,
                            fechaInicio: editForm.fechaInicio,
                            fechaFin: editForm.fechaFin,
                            estado: editForm.estado,
                            activo: editForm.activo,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Período actualizado');
                    setEditRow(null);
                    refresh();
                    refreshPeriodoCtx();
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error al actualizar');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        { key: 'nom', header: 'Nombre', cell: function (r) { return <span className="font-medium text-gray-900">{r.nombre}</span>; } },
        {
            key: 'ini',
            header: 'Inicio',
            cell: function (r) {
                return (0, date_fns_1.format)(new Date(r.fechaInicio), 'd MMM yyyy', { locale: locale_1.es });
            },
        },
        {
            key: 'fin',
            header: 'Fin',
            cell: function (r) { return (0, date_fns_1.format)(new Date(r.fechaFin), 'd MMM yyyy', { locale: locale_1.es }); },
        },
        {
            key: 'est',
            header: 'Estado',
            cell: function (r) { return (<Badge_1.Badge variant="outline">{formateadores_1.Formateadores.estadoPeriodo(r.estado)}</Badge_1.Badge>); },
        },
        {
            key: 'act',
            header: 'Activo',
            cell: function (r) {
                return r.activo ? <Badge_1.Badge variant="success">Sí</Badge_1.Badge> : <Badge_1.Badge variant="secondary">No</Badge_1.Badge>;
            },
        },
        {
            key: 'counts',
            header: 'Hor./Vent.',
            cell: function (r) { return (<span className="text-sm text-gray-600">
          {r._count ? "".concat(r._count.horarios, " / ").concat(r._count.ventanas) : '—'}
        </span>); },
        },
        {
            key: 'acc',
            header: '',
            className: 'w-24 text-right',
            cell: function (r) { return (<button_1.Button type="button" size="sm" variant="outline" onClick={function () { return openEdit(r); }}>
          <lucide_react_1.Pencil className="h-3.5 w-3.5"/>
        </button_1.Button>); },
        },
    ];
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Períodos académicos" description="Alta y edición de ciclos para planificación de horarios." actions={<button_1.Button onClick={function () { return setCreateOpen(true); }} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
            <lucide_react_1.Plus className="h-4 w-4"/>
            Nuevo período
          </button_1.Button>}/>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={refresh}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }}/>

      {meta && (<Pagination_1.Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage}/>)}

      <dialog_1.Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Nuevo período</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <label_1.Label htmlFor="pnom">Nombre</label_1.Label>
              <input_1.Input id="pnom" value={createForm.nombre} onChange={function (e) { return setCreateForm(function (f) { return (__assign(__assign({}, f), { nombre: e.target.value })); }); }}/>
            </div>
            <div>
              <label_1.Label htmlFor="pini">Fecha inicio</label_1.Label>
              <input_1.Input id="pini" type="date" value={createForm.fechaInicio} onChange={function (e) { return setCreateForm(function (f) { return (__assign(__assign({}, f), { fechaInicio: e.target.value })); }); }}/>
            </div>
            <div>
              <label_1.Label htmlFor="pfin">Fecha fin</label_1.Label>
              <input_1.Input id="pfin" type="date" value={createForm.fechaFin} onChange={function (e) { return setCreateForm(function (f) { return (__assign(__assign({}, f), { fechaFin: e.target.value })); }); }}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setCreateOpen(false); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" disabled={saving} onClick={handleCreate} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              {saving ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : 'Crear'}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      <dialog_1.Dialog open={!!editRow} onOpenChange={function (o) { return !o && setEditRow(null); }}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Editar período</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <label_1.Label htmlFor="en">Nombre</label_1.Label>
              <input_1.Input id="en" value={editForm.nombre} onChange={function (e) { return setEditForm(function (f) { return (__assign(__assign({}, f), { nombre: e.target.value })); }); }}/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label_1.Label>Inicio</label_1.Label>
                <input_1.Input type="date" value={editForm.fechaInicio} onChange={function (e) { return setEditForm(function (f) { return (__assign(__assign({}, f), { fechaInicio: e.target.value })); }); }}/>
              </div>
              <div>
                <label_1.Label>Fin</label_1.Label>
                <input_1.Input type="date" value={editForm.fechaFin} onChange={function (e) { return setEditForm(function (f) { return (__assign(__assign({}, f), { fechaFin: e.target.value })); }); }}/>
              </div>
            </div>
            <div>
              <label_1.Label>Estado</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={editForm.estado} onChange={function (e) {
            return setEditForm(function (f) { return (__assign(__assign({}, f), { estado: e.target.value })); });
        }}>
                {Object.values(client_1.EstadoPeriodo).map(function (s) { return (<option key={s} value={s}>
                    {formateadores_1.Formateadores.estadoPeriodo(s)}
                  </option>); })}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input id="eact" type="checkbox" checked={editForm.activo} onChange={function (e) { return setEditForm(function (f) { return (__assign(__assign({}, f), { activo: e.target.checked })); }); }}/>
              <label_1.Label htmlFor="eact">Marcar como período activo (desactiva otros)</label_1.Label>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setEditRow(null); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" disabled={saving} onClick={handleEditSave} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              {saving ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : 'Guardar'}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
