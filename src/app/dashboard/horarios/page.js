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
exports.default = HorariosPage;
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
var cn_1 = require("@/lib/cn");
var DIAS = [
    client_1.DiaSemana.LUNES,
    client_1.DiaSemana.MARTES,
    client_1.DiaSemana.MIERCOLES,
    client_1.DiaSemana.JUEVES,
    client_1.DiaSemana.VIERNES,
];
var HORAS = Array.from({ length: 12 }, function (_, i) { return i + 8; });
var DIA_LABEL = {
    LUNES: 'Lun',
    MARTES: 'Mar',
    MIERCOLES: 'Mié',
    JUEVES: 'Jue',
    VIERNES: 'Vie',
};
function HorariosPage() {
    var _this = this;
    var _a;
    var authLoading = (0, AuthContext_1.useRequireAuth)([
        client_1.Rol.SUPER_ADMIN,
        client_1.Rol.ADMINISTRADOR,
        client_1.Rol.OPERADOR,
    ]).loading;
    var can = (0, AuthContext_1.useAuth)().can;
    var puedePublicar = can('PUBLICAR_HORARIOS');
    var _b = (0, PeriodoContext_1.usePeriodo)(), periodoSeleccionado = _b.periodoSeleccionado, periodoLoading = _b.loading;
    var periodoId = (_a = periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.id) !== null && _a !== void 0 ? _a : '';
    var _c = (0, react_1.useState)([]), horarios = _c[0], setHorarios = _c[1];
    var _d = (0, react_1.useState)(false), loadingHor = _d[0], setLoadingHor = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(null), conflictos = _f[0], setConflictos = _f[1];
    var _g = (0, react_1.useState)(false), loadingConf = _g[0], setLoadingConf = _g[1];
    var _h = (0, react_1.useState)(false), busyAction = _h[0], setBusyAction = _h[1];
    var _j = (0, react_1.useState)(false), createOpen = _j[0], setCreateOpen = _j[1];
    var _k = (0, react_1.useState)([]), cursos = _k[0], setCursos = _k[1];
    var _l = (0, react_1.useState)([]), docentes = _l[0], setDocentes = _l[1];
    var _m = (0, react_1.useState)([]), ambientes = _m[0], setAmbientes = _m[1];
    var _o = (0, react_1.useState)([]), grupos = _o[0], setGrupos = _o[1];
    var _p = (0, react_1.useState)({
        cursoId: '',
        docenteId: '',
        ambienteId: '',
        grupoId: '',
        diaSemana: client_1.DiaSemana.LUNES,
        horaInicio: '08:00',
        horaFin: '10:00',
    }), form = _p[0], setForm = _p[1];
    var fetchHorarios = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var res, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!periodoId) {
                        setHorarios([]);
                        return [2 /*return*/];
                    }
                    setLoadingHor(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiGet)('/api/horarios', {
                            periodoId: periodoId,
                            limit: 500,
                            page: 1,
                        })];
                case 2:
                    res = _b.sent();
                    setHorarios((_a = res.data) !== null && _a !== void 0 ? _a : []);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    setError(e_1 instanceof api_client_1.ApiClientError ? e_1.message : 'Error al cargar horarios');
                    setHorarios([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingHor(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [periodoId]);
    var fetchConflictos = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var res, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!periodoId) {
                        setConflictos(null);
                        return [2 /*return*/];
                    }
                    setLoadingConf(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiGet)('/api/horarios/conflictos', { periodoId: periodoId })];
                case 2:
                    res = _c.sent();
                    setConflictos(res.data
                        ? {
                            totalConflictos: res.data.totalConflictos,
                            conflictos: (_b = res.data.conflictos) !== null && _b !== void 0 ? _b : [],
                        }
                        : null);
                    return [3 /*break*/, 5];
                case 3:
                    _a = _c.sent();
                    setConflictos(null);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingConf(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [periodoId]);
    (0, react_1.useEffect)(function () {
        fetchHorarios();
        fetchConflictos();
    }, [fetchHorarios, fetchConflictos]);
    (0, react_1.useEffect)(function () {
        if (!createOpen)
            return;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, c, d, a, cL_1, dL_1, aL_1, _b;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                (0, api_client_1.apiGet)('/api/cursos', { limit: 100, page: 1 }),
                                (0, api_client_1.apiGet)('/api/docentes', { limit: 100, page: 1 }),
                                (0, api_client_1.apiGet)('/api/ambientes', { limit: 100, page: 1 }),
                            ])];
                    case 1:
                        _a = _f.sent(), c = _a[0], d = _a[1], a = _a[2];
                        cL_1 = (_c = c.data) !== null && _c !== void 0 ? _c : [];
                        dL_1 = (_d = d.data) !== null && _d !== void 0 ? _d : [];
                        aL_1 = (_e = a.data) !== null && _e !== void 0 ? _e : [];
                        setCursos(cL_1);
                        setDocentes(dL_1);
                        setAmbientes(aL_1);
                        setForm(function (f) {
                            var _a, _b, _c, _d, _e, _f;
                            return (__assign(__assign({}, f), { cursoId: (_b = (_a = cL_1[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '', docenteId: (_d = (_c = dL_1[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '', ambienteId: (_f = (_e = aL_1[0]) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : '' }));
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        _b = _f.sent();
                        sonner_1.toast.error('Error cargando datos del formulario');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }, [createOpen]);
    (0, react_1.useEffect)(function () {
        if (!createOpen || !form.cursoId) {
            setGrupos([]);
            return;
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var res, g_1, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_client_1.apiGet)('/api/grupos', { cursoId: form.cursoId })];
                    case 1:
                        res = _c.sent();
                        g_1 = (_b = res.data) !== null && _b !== void 0 ? _b : [];
                        setGrupos(g_1);
                        setForm(function (f) { var _a, _b; return (__assign(__assign({}, f), { grupoId: (_b = (_a = g_1[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '' })); });
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _c.sent();
                        setGrupos([]);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }, [createOpen, form.cursoId]);
    var handleCreate = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!periodoId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/horarios', {
                            periodoId: periodoId,
                            cursoId: form.cursoId,
                            docenteId: form.docenteId,
                            ambienteId: form.ambienteId,
                            grupoId: form.grupoId || undefined,
                            diaSemana: form.diaSemana,
                            horaInicio: form.horaInicio,
                            horaFin: form.horaFin,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Horario creado');
                    setCreateOpen(false);
                    fetchHorarios();
                    fetchConflictos();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    sonner_1.toast.error(e_2 instanceof api_client_1.ApiClientError ? e_2.message : 'No se pudo crear');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var validarTodo = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, e_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!periodoId)
                        return [2 /*return*/];
                    setBusyAction(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/horarios/validar-todo', {
                            periodoId: periodoId,
                        })];
                case 2:
                    res = _c.sent();
                    sonner_1.toast.success("Validaci\u00F3n terminada. Con conflictos: ".concat((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.horariosConConflictos) !== null && _b !== void 0 ? _b : '—'));
                    fetchConflictos();
                    return [3 /*break*/, 5];
                case 3:
                    e_3 = _c.sent();
                    sonner_1.toast.error(e_3 instanceof api_client_1.ApiClientError ? e_3.message : 'Error al validar');
                    return [3 /*break*/, 5];
                case 4:
                    setBusyAction(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var publicar = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!periodoId || !puedePublicar)
                        return [2 /*return*/];
                    setBusyAction(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, api_client_1.apiPost)('/api/horarios/publicar', { periodoId: periodoId })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Horarios publicados');
                    fetchHorarios();
                    return [3 /*break*/, 5];
                case 3:
                    e_4 = _a.sent();
                    sonner_1.toast.error(e_4 instanceof api_client_1.ApiClientError ? e_4.message : 'Error al publicar');
                    return [3 /*break*/, 5];
                case 4:
                    setBusyAction(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var celdas = (0, react_1.useMemo)(function () {
        var _a;
        var map = new Map();
        for (var _i = 0, horarios_1 = horarios; _i < horarios_1.length; _i++) {
            var h = horarios_1[_i];
            var hour = parseInt(h.horaInicio.split(':')[0], 10);
            var key = "".concat(h.diaSemana, "-").concat(hour);
            var prev = (_a = map.get(key)) !== null && _a !== void 0 ? _a : [];
            prev.push(h);
            map.set(key, prev);
        }
        return map;
    }, [horarios]);
    var columnsConflictos = [
        { key: 't', header: 'Tipo', cell: function (r) { return r.tipoRegla; } },
        {
            key: 'm',
            header: 'Detalle',
            cell: function (r) {
                var _a, _b;
                return (<span className="text-sm text-gray-700">{r.mensaje || ((_b = (_a = r.horario) === null || _a === void 0 ? void 0 : _a.curso) === null || _b === void 0 ? void 0 : _b.codigo) || '—'}</span>);
            },
        },
    ];
    if (authLoading || periodoLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    if (!periodoId) {
        return (<div>
        <PageHeader_1.PageHeader title="Horarios" description="Programación semanal por período."/>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico arriba para ver y editar horarios.
        </div>
      </div>);
    }
    return (<div className="space-y-8">
      <PageHeader_1.PageHeader title="Horarios" description={"Per\u00EDodo: ".concat(periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.nombre, ". Cuadr\u00EDcula Lun\u2013Vie, 8:00\u201319:00.")} actions={<div className="flex flex-wrap gap-2">
            <button_1.Button variant="outline" disabled={busyAction} onClick={validarTodo} className="border-unt-blue text-unt-blue hover:bg-unt-blue/10">
              Validar todo
            </button_1.Button>
            {puedePublicar && (<button_1.Button disabled={busyAction} onClick={publicar} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
                Publicar confirmados
              </button_1.Button>)}
            <button_1.Button onClick={function () { return setCreateOpen(true); }} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              <lucide_react_1.Plus className="h-4 w-4"/>
              Nuevo horario
            </button_1.Button>
          </div>}/>

      {error && <ErrorAlert_1.ErrorAlert message={error} onRetry={fetchHorarios}/>}

      <div className="card overflow-x-auto">
        <div className="card-body p-2">
          {loadingHor ? (<div className="flex justify-center py-16">
              <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
            </div>) : (<div className="grid min-w-[720px] gap-px bg-gray-200 text-xs" style={{ gridTemplateColumns: "80px repeat(".concat(DIAS.length, ", minmax(0,1fr))") }}>
              <div className="bg-gray-100 p-2 font-semibold text-gray-600">Hora</div>
              {DIAS.map(function (d) {
                var _a;
                return (<div key={d} className="bg-unt-blue p-2 text-center font-semibold text-white">
                  {(_a = DIA_LABEL[d]) !== null && _a !== void 0 ? _a : d}
                </div>);
            })}
              {HORAS.map(function (h) { return (<div key={h} className="contents">
                  <div className="flex items-center bg-gray-50 p-2 font-mono text-gray-700">
                    {h}:00
                  </div>
                  {DIAS.map(function (d) {
                    var _a;
                    var list = (_a = celdas.get("".concat(d, "-").concat(h))) !== null && _a !== void 0 ? _a : [];
                    return (<div key={"".concat(d, "-").concat(h)} className={(0, cn_1.cn)('min-h-[52px] bg-white p-1', list.length > 1 ? 'bg-amber-50' : '')}>
                        {list.map(function (x) { return (<div key={x.id} className="mb-1 rounded border border-gray-200 bg-gray-50 px-1 py-0.5 leading-tight">
                            <div className="font-semibold text-unt-blue">{x.curso.codigo}</div>
                            <div className="truncate text-[10px] text-gray-600">{x.ambiente.codigo}</div>
                          </div>); })}
                      </div>);
                })}
                </div>); })}
            </div>)}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold text-unt-blue">Conflictos de validación</h2>
        {loadingConf ? (<lucide_react_1.Loader2 className="h-6 w-6 animate-spin text-unt-blue"/>) : conflictos && conflictos.totalConflictos > 0 ? (<DataTable_1.DataTable columns={columnsConflictos} data={conflictos.conflictos.slice(0, 50)} keyExtractor={function (r) { return r.id; }} emptyTitle="Sin conflictos"/>) : (<p className="text-sm text-gray-500">No hay registros de conflicto con cumple = false.</p>)}
      </div>

      <dialog_1.Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <dialog_1.DialogContent className="max-w-md">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Nuevo horario</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="grid max-h-[60vh] gap-3 overflow-y-auto py-2">
            <div>
              <label_1.Label>Curso</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.cursoId} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { cursoId: e.target.value })); }); }}>
                {cursos.map(function (c) { return (<option key={c.id} value={c.id}>
                    {c.codigo} — {c.nombre}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label>Grupo (opcional)</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.grupoId} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { grupoId: e.target.value })); }); }}>
                <option value="">— Sin grupo —</option>
                {grupos.map(function (g) { return (<option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label>Docente</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.docenteId} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { docenteId: e.target.value })); }); }}>
                {docentes.map(function (d) { return (<option key={d.id} value={d.id}>
                    {formateadores_1.Formateadores.nombreUsuario(d.usuario)}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label>Ambiente</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.ambienteId} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { ambienteId: e.target.value })); }); }}>
                {ambientes.map(function (a) { return (<option key={a.id} value={a.id}>
                    {a.codigo} — {a.nombre}
                  </option>); })}
              </select>
            </div>
            <div>
              <label_1.Label>Día</label_1.Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm" value={form.diaSemana} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { diaSemana: e.target.value })); }); }}>
                {DIAS.map(function (d) {
            var _a;
            return (<option key={d} value={d}>
                    {(_a = DIA_LABEL[d]) !== null && _a !== void 0 ? _a : d}
                  </option>);
        })}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label_1.Label>Inicio</label_1.Label>
                <input_1.Input value={form.horaInicio} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { horaInicio: e.target.value })); }); }}/>
              </div>
              <div>
                <label_1.Label>Fin</label_1.Label>
                <input_1.Input value={form.horaFin} onChange={function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { horaFin: e.target.value })); }); }}/>
              </div>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setCreateOpen(false); }}>
              Cancelar
            </button_1.Button>
            <button_1.Button type="button" onClick={handleCreate} className="bg-unt-blue hover:bg-unt-blue/90 text-white">
              Guardar
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
