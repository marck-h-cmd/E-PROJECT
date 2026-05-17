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
exports.default = DocentesPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Badge_1 = require("@/components/ui/Badge");
var button_1 = require("@/components/ui/button");
var ConfirmDialog_1 = require("@/components/ui/ConfirmDialog");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var DataTable_1 = require("@/components/data/DataTable");
var Pagination_1 = require("@/components/data/Pagination");
var SearchBar_1 = require("@/components/data/SearchBar");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var useConfirm_1 = require("@/hooks/useConfirm");
var usePaginatedQuery_1 = require("@/hooks/usePaginatedQuery");
var api_client_1 = require("@/lib/api-client");
var formateadores_1 = require("@/lib/formateadores");
var AuthContext_1 = require("@/contexts/AuthContext");
var client_1 = require("@prisma/client");
var sonner_1 = require("sonner");
var CATEGORIAS = Object.values(client_1.CategoriaDocente);
function DocentesPage() {
    var _this = this;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN, client_1.Rol.ADMINISTRADOR]).loading;
    var _a = (0, useConfirm_1.useConfirm)(), confirm = _a.confirm, confirmState = _a.state, handleConfirmClose = _a.handleClose;
    var _b = (0, react_1.useState)(''), qInput = _b[0], setQInput = _b[1];
    var _c = (0, react_1.useState)(''), search = _c[0], setSearch = _c[1];
    var listParams = (0, react_1.useMemo)(function () { return ({ search: search || undefined }); }, [search]);
    var _d = (0, usePaginatedQuery_1.usePaginatedQuery)('/api/docentes', listParams), data = _d.data, meta = _d.meta, loading = _d.loading, error = _d.error, page = _d.page, setPage = _d.setPage, refresh = _d.refresh;
    var _e = (0, react_1.useState)(false), dialogOpen = _e[0], setDialogOpen = _e[1];
    var _f = (0, react_1.useState)(null), editing = _f[0], setEditing = _f[1];
    var _g = (0, react_1.useState)(false), saving = _g[0], setSaving = _g[1];
    var _h = (0, react_1.useState)({
        email: '',
        nombre: '',
        apellidos: '',
        codigo: '',
        categoria: client_1.CategoriaDocente.PRINCIPAL,
        departamento: '',
        telefono: '',
        whatsapp: '',
        activo: true,
    }), form = _h[0], setForm = _h[1];
    var resetForm = function () {
        setForm({
            email: '',
            nombre: '',
            apellidos: '',
            codigo: '',
            categoria: client_1.CategoriaDocente.PRINCIPAL,
            departamento: '',
            telefono: '',
            whatsapp: '',
            activo: true,
        });
        setEditing(null);
    };
    var openCreate = function () {
        resetForm();
        setDialogOpen(true);
    };
    var openEdit = function (row) { return __awaiter(_this, void 0, void 0, function () {
        var res, d, e_1;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    setEditing(row);
                    setSaving(true);
                    _m.label = 1;
                case 1:
                    _m.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiGet)("/api/docentes/".concat(row.id))];
                case 2:
                    res = _m.sent();
                    d = res.data;
                    if (!d)
                        throw new Error('Vacío');
                    setForm({
                        email: (_b = (_a = d.usuario) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : row.usuario.email,
                        nombre: (_d = (_c = d.usuario) === null || _c === void 0 ? void 0 : _c.nombre) !== null && _d !== void 0 ? _d : row.usuario.nombre,
                        apellidos: (_f = (_e = d.usuario) === null || _e === void 0 ? void 0 : _e.apellidos) !== null && _f !== void 0 ? _f : row.usuario.apellidos,
                        codigo: d.codigo,
                        categoria: d.categoria,
                        departamento: (_g = d.departamento) !== null && _g !== void 0 ? _g : '',
                        telefono: (_h = d.telefono) !== null && _h !== void 0 ? _h : '',
                        whatsapp: (_j = d.whatsapp) !== null && _j !== void 0 ? _j : '',
                        activo: (_l = (_k = d.usuario) === null || _k === void 0 ? void 0 : _k.activo) !== null && _l !== void 0 ? _l : row.usuario.activo,
                    });
                    setDialogOpen(true);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _m.sent();
                    sonner_1.toast.error(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'No se pudo cargar el docente');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!editing) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, api_client_1.apiPut)("/api/docentes/".concat(editing.id), {
                            nombre: form.nombre,
                            apellidos: form.apellidos,
                            categoria: form.categoria,
                            departamento: form.departamento || undefined,
                            telefono: form.telefono || undefined,
                            whatsapp: form.whatsapp || undefined,
                            activo: form.activo,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Docente actualizado');
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, (0, api_client_1.apiPost)('/api/docentes', {
                        email: form.email,
                        nombre: form.nombre,
                        apellidos: form.apellidos,
                        codigo: formateadores_1.Formateadores.codigo(form.codigo),
                        categoria: form.categoria,
                        departamento: form.departamento || undefined,
                        telefono: form.telefono || undefined,
                        whatsapp: form.whatsapp || undefined,
                    })];
                case 4:
                    _a.sent();
                    sonner_1.toast.success('Docente creado');
                    _a.label = 5;
                case 5:
                    setDialogOpen(false);
                    resetForm();
                    refresh();
                    return [3 /*break*/, 8];
                case 6:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error al guardar');
                    return [3 /*break*/, 8];
                case 7:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (row) { return __awaiter(_this, void 0, void 0, function () {
        var ok, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, confirm({
                        title: 'Desactivar docente',
                        message: "\u00BFDesactivar a ".concat(row.usuario.nombre, " ").concat(row.usuario.apellidos, "?"),
                        variant: 'destructive',
                        confirmLabel: 'Desactivar',
                    })];
                case 1:
                    ok = _a.sent();
                    if (!ok)
                        return [2 /*return*/];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, api_client_1.apiDelete)("/api/docentes/".concat(row.id))];
                case 3:
                    _a.sent();
                    sonner_1.toast.success('Docente desactivado');
                    refresh();
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    sonner_1.toast.error(e_3 instanceof api_client_1.ApiClientError ? e_3.message : 'Error al eliminar');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        setPage(1);
    }, [search, setPage]);
    var columns = [
        { key: 'codigo', header: 'Código', cell: function (r) { return <span className="font-mono text-sm">{r.codigo}</span>; } },
        {
            key: 'nombre',
            header: 'Usuario',
            cell: function (r) { return (<div>
          <div className="font-medium text-gray-900">
            {formateadores_1.Formateadores.nombreUsuario({ nombre: r.usuario.nombre, apellidos: r.usuario.apellidos })}
          </div>
          <div className="text-xs text-gray-500">{r.usuario.email}</div>
        </div>); },
        },
        {
            key: 'categoria',
            header: 'Categoría',
            cell: function (r) { return formateadores_1.Formateadores.categoriaDocente(r.categoria); },
        },
        { key: 'depto', header: 'Departamento', cell: function (r) { return r.departamento || '—'; } },
        {
            key: 'activo',
            header: 'Activo',
            cell: function (r) {
                return r.usuario.activo ? (<Badge_1.Badge variant="success">Sí</Badge_1.Badge>) : (<Badge_1.Badge variant="secondary">No</Badge_1.Badge>);
            },
        },
        {
            key: 'acciones',
            header: '',
            className: 'w-32 text-right',
            cell: function (r) { return (<div className="flex justify-end gap-1">
          <button_1.Button type="button" size="sm" variant="outline" onClick={function () { return openEdit(r); }}>
            <lucide_react_1.Pencil className="h-3.5 w-3.5"/>
          </button_1.Button>
          <button_1.Button type="button" size="sm" variant="destructive" onClick={function () { return handleDelete(r); }}>
            <lucide_react_1.Trash2 className="h-3.5 w-3.5"/>
          </button_1.Button>
        </div>); },
        },
    ];
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Docentes" description="Gestión del personal académico." actions={<button_1.Button onClick={openCreate} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
            <lucide_react_1.Plus className="h-4 w-4"/>
            Nuevo docente
          </button_1.Button>}/>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar_1.SearchBar value={qInput} onChange={setQInput} placeholder="Buscar por nombre, correo o código…" onSubmit={function () { return setSearch(qInput.trim()); }}/>
        <button_1.Button type="button" variant="outline" onClick={function () { return setSearch(qInput.trim()); }}>
          Buscar
        </button_1.Button>
      </div>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={refresh}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }} emptyTitle="No hay docentes" emptyDescription="Ajuste la búsqueda o registre un nuevo docente."/>

      {meta && (<Pagination_1.Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage}/>)}

      <dialog_1.Dialog open={dialogOpen} onOpenChange={function (o) { return !o && (setDialogOpen(false), resetForm()); }}>
        <dialog_1.DialogContent className="max-w-lg">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>{editing ? 'Editar docente' : 'Registrar docente'}</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid gap-3 py-2">
            {!editing && (<div>
                <label_1.Label htmlFor="email">Correo electrónico</label_1.Label>
                <input_1.Input id="email" type="email" value={form.email} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { email: e.target.value })); }); }}/>
              </div>)}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label_1.Label htmlFor="nombre">Nombre</label_1.Label>
                <input_1.Input id="nombre" value={form.nombre} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { nombre: e.target.value })); }); }}/>
              </div>
              <div>
                <label_1.Label htmlFor="apellidos">Apellidos</label_1.Label>
                <input_1.Input id="apellidos" value={form.apellidos} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { apellidos: e.target.value })); }); }}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label_1.Label htmlFor="codigo">Código</label_1.Label>
                <input_1.Input id="codigo" value={form.codigo} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { codigo: e.target.value })); }); }} disabled={!!editing}/>
              </div>
              <div>
                <label_1.Label htmlFor="categoria">Categoría</label_1.Label>
                <select id="categoria" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.categoria} onChange={function (e) {
            return setForm(function (f) { return (__assign(__assign({}, f), { categoria: e.target.value })); });
        }}>
                  {CATEGORIAS.map(function (c) { return (<option key={c} value={c}>
                      {formateadores_1.Formateadores.categoriaDocente(c)}
                    </option>); })}
                </select>
              </div>
            </div>
            <div>
              <label_1.Label htmlFor="departamento">Departamento</label_1.Label>
              <input_1.Input id="departamento" value={form.departamento} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { departamento: e.target.value })); }); }}/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label_1.Label htmlFor="telefono">Teléfono</label_1.Label>
                <input_1.Input id="telefono" value={form.telefono} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { telefono: e.target.value })); }); }}/>
              </div>
              <div>
                <label_1.Label htmlFor="whatsapp">WhatsApp</label_1.Label>
                <input_1.Input id="whatsapp" value={form.whatsapp} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { whatsapp: e.target.value })); }); }}/>
              </div>
            </div>
            {editing && (<div className="flex items-center gap-2">
                <input id="activo" type="checkbox" checked={form.activo} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { activo: e.target.checked })); }); }}/>
                <label_1.Label htmlFor="activo">Usuario activo</label_1.Label>
              </div>)}
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setDialogOpen(false); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" disabled={saving} onClick={handleSave} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              {saving ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : 'Guardar'}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      <ConfirmDialog_1.ConfirmDialog open={confirmState.open} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} cancelLabel={confirmState.cancelLabel} variant={confirmState.variant} onConfirm={function () { return handleConfirmClose(true); }} onCancel={function () { return handleConfirmClose(false); }}/>
    </div>);
}
