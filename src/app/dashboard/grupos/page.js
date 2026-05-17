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
exports.default = GruposPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var DataTable_1 = require("@/components/data/DataTable");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var api_client_1 = require("@/lib/api-client");
var AuthContext_1 = require("@/contexts/AuthContext");
var client_1 = require("@prisma/client");
var sonner_1 = require("sonner");
function GruposInner() {
    var _this = this;
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN, client_1.Rol.ADMINISTRADOR]).loading;
    var searchParams = (0, navigation_1.useSearchParams)();
    var cursoId = searchParams.get('cursoId');
    var _a = (0, react_1.useState)([]), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), dialogOpen = _d[0], setDialogOpen = _d[1];
    var _e = (0, react_1.useState)(false), saving = _e[0], setSaving = _e[1];
    var _f = (0, react_1.useState)(''), nombre = _f[0], setNombre = _f[1];
    var _g = (0, react_1.useState)(40), capacidad = _g[0], setCapacidad = _g[1];
    var load = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!cursoId) {
                        setData([]);
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiGet)('/api/grupos', { cursoId: cursoId })];
                case 2:
                    res = _b.sent();
                    setData((_a = res.data) !== null && _a !== void 0 ? _a : []);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    setError(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al cargar grupos');
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
    }, [cursoId]);
    var handleCreate = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cursoId)
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/grupos', { cursoId: cursoId, nombre: nombre, capacidad: capacidad })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Grupo creado');
                    setDialogOpen(false);
                    setNombre('');
                    setCapacidad(40);
                    load();
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'Error al crear grupo');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var columns = (0, react_1.useMemo)(function () { return [
        { key: 'nom', header: 'Grupo', cell: function (r) { return <span className="font-medium">{r.nombre}</span>; } },
        { key: 'cap', header: 'Capacidad', cell: function (r) { return r.capacidad; } },
        {
            key: 'curso',
            header: 'Curso',
            cell: function (r) { return (<span className="text-sm">
            {r.curso.codigo} — {r.curso.nombre}
          </span>); },
        },
        {
            key: 'h',
            header: 'Horarios',
            cell: function (r) { var _a, _b; return (_b = (_a = r._count) === null || _a === void 0 ? void 0 : _a.horarios) !== null && _b !== void 0 ? _b : 0; },
        },
    ]; }, []);
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    if (!cursoId) {
        return (<div>
        <PageHeader_1.PageHeader title="Grupos" description="Indique un curso en la URL: /dashboard/grupos?cursoId=…"/>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Vaya a{' '}
          <link_1.default href="/dashboard/cursos" className="font-medium text-unt-blue underline">
            Cursos
          </link_1.default>{' '}
          y use el enlace «Ver grupos» del curso deseado.
        </div>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Grupos del curso" description="Listado y creación de grupos para la asignación de horarios." actions={<button_1.Button onClick={function () { return setDialogOpen(true); }} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
            <lucide_react_1.Plus className="h-4 w-4"/>
            Nuevo grupo
          </button_1.Button>}/>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={load}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }}/>

      <dialog_1.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Nuevo grupo</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <label_1.Label htmlFor="gn">Nombre del grupo</label_1.Label>
              <input_1.Input id="gn" value={nombre} onChange={function (e) { return setNombre(e.target.value); }}/>
            </div>
            <div>
              <label_1.Label htmlFor="gc">Capacidad</label_1.Label>
              <input_1.Input id="gc" type="number" min={1} value={capacidad} onChange={function (e) { return setCapacidad(parseInt(e.target.value, 10) || 1); }}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setDialogOpen(false); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" disabled={saving || !nombre.trim()} onClick={handleCreate} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              {saving ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : 'Crear'}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
function GruposPage() {
    return (<react_1.Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
        </div>}>
      <GruposInner />
    </react_1.Suspense>);
}
