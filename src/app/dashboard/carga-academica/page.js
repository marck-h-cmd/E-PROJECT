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
exports.default = CargaAcademicaPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
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
function CargaAcademicaPage() {
    var _this = this;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN, client_1.Rol.ADMINISTRADOR]).loading;
    var _a = (0, useConfirm_1.useConfirm)(), confirm = _a.confirm, confirmState = _a.state, handleConfirmClose = _a.handleClose;
    var _b = (0, react_1.useState)(''), qInput = _b[0], setQInput = _b[1];
    var _c = (0, react_1.useState)(''), search = _c[0], setSearch = _c[1];
    var listParams = (0, react_1.useMemo)(function () { return ({ search: search || undefined }); }, [search]);
    var _d = (0, usePaginatedQuery_1.usePaginatedQuery)('/api/carga-academica', listParams), data = _d.data, meta = _d.meta, loading = _d.loading, error = _d.error, page = _d.page, setPage = _d.setPage, refresh = _d.refresh;
    var _e = (0, react_1.useState)(false), assignOpen = _e[0], setAssignOpen = _e[1];
    var _f = (0, react_1.useState)(false), saving = _f[0], setSaving = _f[1];
    var _g = (0, react_1.useState)([]), docentes = _g[0], setDocentes = _g[1];
    var _h = (0, react_1.useState)([]), cursos = _h[0], setCursos = _h[1];
    var _j = (0, react_1.useState)(''), selDocente = _j[0], setSelDocente = _j[1];
    var _k = (0, react_1.useState)(''), selCurso = _k[0], setSelCurso = _k[1];
    var _l = (0, react_1.useState)(4), horas = _l[0], setHoras = _l[1];
    (0, react_1.useEffect)(function () { return setPage(1); }, [search, setPage]);
    (0, react_1.useEffect)(function () {
        if (!assignOpen)
            return;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, d, c, dList, cList, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                (0, api_client_1.apiGet)('/api/docentes', { limit: 100, page: 1 }),
                                (0, api_client_1.apiGet)('/api/cursos', { limit: 100, page: 1 }),
                            ])];
                    case 1:
                        _a = _c.sent(), d = _a[0], c = _a[1];
                        dList = Array.isArray(d.data) ? d.data : [];
                        cList = Array.isArray(c.data) ? c.data : [];
                        setDocentes(dList);
                        setCursos(cList);
                        if (dList[0])
                            setSelDocente(dList[0].id);
                        if (cList[0])
                            setSelCurso(cList[0].id);
                        return [3 /*break*/, 3];
                    case 2:
                        _b = _c.sent();
                        sonner_1.toast.error('No se pudieron cargar listas para asignar');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }, [assignOpen]);
    var handleAssign = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selCurso || !selDocente)
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)("/api/cursos/".concat(selCurso, "/docentes"), {
                            docenteId: selDocente,
                            horasAsignadas: horas,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Docente asignado al curso');
                    setAssignOpen(false);
                    refresh();
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    sonner_1.toast.error(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al asignar');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRemove = function (row) { return __awaiter(_this, void 0, void 0, function () {
        var ok, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, confirm({
                        title: 'Quitar asignación',
                        message: "\u00BFRemover a ".concat(formateadores_1.Formateadores.nombreUsuario(row.docente.usuario), " del curso ").concat(row.curso.codigo, "?"),
                        variant: 'destructive',
                        confirmLabel: 'Quitar',
                    })];
                case 1:
                    ok = _a.sent();
                    if (!ok)
                        return [2 /*return*/];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, api_client_1.apiRequest)("/api/cursos/".concat(row.curso.id, "/docentes"), {
                            method: 'DELETE',
                            params: { docenteId: row.docente.id },
                        })];
                case 3:
                    _a.sent();
                    sonner_1.toast.success('Asignación eliminada');
                    refresh();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error al eliminar');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        {
            key: 'curso',
            header: 'Curso',
            cell: function (r) { return (<div>
          <div className="font-mono text-sm">{r.curso.codigo}</div>
          <div className="text-sm text-gray-700">{r.curso.nombre}</div>
        </div>); },
        },
        {
            key: 'doc',
            header: 'Docente',
            cell: function (r) { return formateadores_1.Formateadores.nombreUsuario(r.docente.usuario); },
        },
        { key: 'h', header: 'Horas', cell: function (r) { return formateadores_1.Formateadores.horas(r.horasAsignadas); } },
        {
            key: 'acc',
            header: '',
            className: 'w-16 text-right',
            cell: function (r) { return (<button_1.Button type="button" size="sm" variant="destructive" onClick={function () { return handleRemove(r); }}>
          <lucide_react_1.Trash2 className="h-3.5 w-3.5"/>
        </button_1.Button>); },
        },
    ];
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Carga académica" description="Asignación de docentes a cursos y control de horas." actions={<button_1.Button onClick={function () { return setAssignOpen(true); }} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
            <lucide_react_1.Plus className="h-4 w-4"/>
            Asignar docente
          </button_1.Button>}/>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar_1.SearchBar value={qInput} onChange={setQInput} placeholder="Buscar curso o docente…" onSubmit={function () { return setSearch(qInput.trim()); }}/>
        <button_1.Button type="button" variant="outline" onClick={function () { return setSearch(qInput.trim()); }}>
          Buscar
        </button_1.Button>
      </div>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={refresh}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }}/>

      {meta && (<Pagination_1.Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage}/>)}

      <dialog_1.Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Asignar docente a curso</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <label_1.Label>Curso</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={selCurso} onChange={function (e) { return setSelCurso(e.target.value); }}>
                {cursos.map(function (c) { return (<option key={c.id} value={c.id}>
                    {c.codigo} — {c.nombre}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label>Docente</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={selDocente} onChange={function (e) { return setSelDocente(e.target.value); }}>
                {docentes.map(function (d) { return (<option key={d.id} value={d.id}>
                    {d.codigo} — {formateadores_1.Formateadores.nombreUsuario(d.usuario)}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label htmlFor="ha">Horas asignadas</label_1.Label>
              <input_1.Input id="ha" type="number" min={0} value={horas} onChange={function (e) { return setHoras(parseInt(e.target.value, 10) || 0); }}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setAssignOpen(false); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" disabled={saving} onClick={handleAssign} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              {saving ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : 'Asignar'}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      <ConfirmDialog_1.ConfirmDialog open={confirmState.open} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} cancelLabel={confirmState.cancelLabel} variant={confirmState.variant} onConfirm={function () { return handleConfirmClose(true); }} onCancel={function () { return handleConfirmClose(false); }}/>
    </div>);
}
