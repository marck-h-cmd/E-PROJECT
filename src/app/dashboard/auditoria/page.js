'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuditoriaPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var DataTable_1 = require("@/components/data/DataTable");
var Pagination_1 = require("@/components/data/Pagination");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var AuthContext_1 = require("@/contexts/AuthContext");
var usePaginatedQuery_1 = require("@/hooks/usePaginatedQuery");
var formateadores_1 = require("@/lib/formateadores");
var client_1 = require("@prisma/client");
function AuditoriaPage() {
    var authLoading = (0, AuthContext_1.useRequireAuth)([client_1.Rol.SUPER_ADMIN]).loading;
    var _a = (0, react_1.useState)(''), accion = _a[0], setAccion = _a[1];
    var _b = (0, react_1.useState)(''), entidad = _b[0], setEntidad = _b[1];
    var _c = (0, react_1.useState)(''), entidadId = _c[0], setEntidadId = _c[1];
    var _d = (0, react_1.useState)(''), usuarioId = _d[0], setUsuarioId = _d[1];
    var _e = (0, react_1.useState)(''), fechaDesde = _e[0], setFechaDesde = _e[1];
    var _f = (0, react_1.useState)(''), fechaHasta = _f[0], setFechaHasta = _f[1];
    var listParams = (0, react_1.useMemo)(function () { return ({
        accion: accion.trim() || undefined,
        entidad: entidad.trim() || undefined,
        entidadId: entidadId.trim() || undefined,
        usuarioId: usuarioId.trim() || undefined,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
    }); }, [accion, entidad, entidadId, usuarioId, fechaDesde, fechaHasta]);
    var filterKey = (0, react_1.useMemo)(function () { return [accion, entidad, entidadId, usuarioId, fechaDesde, fechaHasta].join('|'); }, [accion, entidad, entidadId, usuarioId, fechaDesde, fechaHasta]);
    var _g = (0, usePaginatedQuery_1.usePaginatedQuery)('/api/auditoria', listParams, { initialLimit: 50 }), data = _g.data, meta = _g.meta, loading = _g.loading, error = _g.error, page = _g.page, setPage = _g.setPage, refresh = _g.refresh;
    (0, react_1.useEffect)(function () {
        setPage(1);
    }, [filterKey, setPage]);
    var columns = (0, react_1.useMemo)(function () { return [
        {
            key: 'f',
            header: 'Fecha',
            cell: function (r) { return new Date(r.createdAt).toLocaleString('es-PE'); },
        },
        {
            key: 'u',
            header: 'Usuario',
            cell: function (r) {
                return r.usuario
                    ? "".concat(r.usuario.apellidos, ", ").concat(r.usuario.nombre, " (").concat(formateadores_1.Formateadores.rolUsuario(r.usuario.rol), ")")
                    : '—';
            },
        },
        { key: 'a', header: 'Acción', cell: function (r) { return <span className="font-mono text-xs">{r.accion}</span>; } },
        { key: 'e', header: 'Entidad', cell: function (r) { return r.entidad; } },
        { key: 'ei', header: 'ID entidad', cell: function (r) { return r.entidadId || '—'; } },
    ]; }, []);
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Auditoría" description="Registro de acciones relevantes en el sistema."/>

      <div className="card mb-6">
        <div className="card-body grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label_1.Label>Usuario ID</label_1.Label>
            <input_1.Input value={usuarioId} onChange={function (e) { return setUsuarioId(e.target.value); }} placeholder="UUID"/>
          </div>
          <div>
            <label_1.Label>Acción</label_1.Label>
            <input_1.Input value={accion} onChange={function (e) { return setAccion(e.target.value); }} placeholder="p. ej. CREATE"/>
          </div>
          <div>
            <label_1.Label>Entidad</label_1.Label>
            <input_1.Input value={entidad} onChange={function (e) { return setEntidad(e.target.value); }} placeholder="p. ej. Horario"/>
          </div>
          <div>
            <label_1.Label>ID entidad</label_1.Label>
            <input_1.Input value={entidadId} onChange={function (e) { return setEntidadId(e.target.value); }}/>
          </div>
          <div>
            <label_1.Label>Desde</label_1.Label>
            <input_1.Input type="date" value={fechaDesde} onChange={function (e) { return setFechaDesde(e.target.value); }}/>
          </div>
          <div>
            <label_1.Label>Hasta</label_1.Label>
            <input_1.Input type="date" value={fechaHasta} onChange={function (e) { return setFechaHasta(e.target.value); }}/>
          </div>
          <div className="flex items-end">
            <button_1.Button type="button" variant="outline" onClick={function () {
            setAccion('');
            setEntidad('');
            setEntidadId('');
            setUsuarioId('');
            setFechaDesde('');
            setFechaHasta('');
        }}>
              Limpiar filtros
            </button_1.Button>
          </div>
        </div>
      </div>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={refresh}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }}/>

      {meta && (<Pagination_1.Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage}/>)}
    </div>);
}
