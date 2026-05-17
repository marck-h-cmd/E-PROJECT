'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificacionesPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Badge_1 = require("@/components/ui/Badge");
var button_1 = require("@/components/ui/button");
var DataTable_1 = require("@/components/data/DataTable");
var Pagination_1 = require("@/components/data/Pagination");
var ErrorAlert_1 = require("@/components/feedback/ErrorAlert");
var PageHeader_1 = require("@/components/layout/PageHeader");
var AuthContext_1 = require("@/contexts/AuthContext");
var usePaginatedQuery_1 = require("@/hooks/usePaginatedQuery");
var formateadores_1 = require("@/lib/formateadores");
var client_1 = require("@prisma/client");
function NotificacionesPage() {
    var authLoading = (0, AuthContext_1.useRequireAuth)().loading;
    var user = (0, AuthContext_1.useAuth)().user;
    var _a = (0, react_1.useState)(true), soloMis = _a[0], setSoloMis = _a[1];
    var listParams = (0, react_1.useMemo)(function () {
        return soloMis && (user === null || user === void 0 ? void 0 : user.id)
            ? { usuarioId: user.id }
            : {};
    }, [soloMis, user === null || user === void 0 ? void 0 : user.id]);
    var _b = (0, usePaginatedQuery_1.usePaginatedQuery)('/api/notificaciones', listParams), data = _b.data, meta = _b.meta, loading = _b.loading, error = _b.error, page = _b.page, setPage = _b.setPage, refresh = _b.refresh;
    var columns = (0, react_1.useMemo)(function () { return [
        {
            key: 'fecha',
            header: 'Fecha',
            cell: function (r) { return new Date(r.createdAt).toLocaleString('es-PE'); },
        },
        {
            key: 'titulo',
            header: 'Título',
            cell: function (r) { return <span className="font-medium text-gray-900">{r.titulo}</span>; },
        },
        {
            key: 'tipo',
            header: 'Tipo',
            cell: function (r) { return r.tipo; },
        },
        {
            key: 'canal',
            header: 'Canal',
            cell: function (r) { return formateadores_1.Formateadores.canalNotificacion(r.canal); },
        },
        {
            key: 'prio',
            header: 'Prioridad',
            cell: function (r) { return formateadores_1.Formateadores.prioridadNotificacion(r.prioridad); },
        },
        {
            key: 'est',
            header: 'Estado',
            cell: function (r) { return <Badge_1.Badge variant="outline">{r.estado}</Badge_1.Badge>; },
        },
    ]; }, []);
    if (authLoading) {
        return (<div className="flex min-h-[40vh] items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return (<div>
      <PageHeader_1.PageHeader title="Notificaciones" description="Historial de avisos enviados por el sistema." actions={<div className="flex items-center gap-2">
            <button_1.Button type="button" variant={soloMis ? 'default' : 'outline'} className={soloMis ? 'bg-unt-blue hover:bg-unt-blue/90 text-white' : ''} onClick={function () { return setSoloMis(true); }}>
              Mis notificaciones
            </button_1.Button>
            {(user === null || user === void 0 ? void 0 : user.rol) === client_1.Rol.SUPER_ADMIN || (user === null || user === void 0 ? void 0 : user.rol) === client_1.Rol.ADMINISTRADOR ? (<button_1.Button type="button" variant={!soloMis ? 'default' : 'outline'} className={!soloMis ? 'bg-unt-blue hover:bg-unt-blue/90 text-white' : ''} onClick={function () { return setSoloMis(false); }}>
                Todas
              </button_1.Button>) : null}
          </div>}/>

      {error && <ErrorAlert_1.ErrorAlert message={error} className="mb-4" onRetry={refresh}/>}

      <DataTable_1.DataTable columns={columns} data={data} loading={loading} keyExtractor={function (r) { return r.id; }} emptyTitle="Sin notificaciones"/>

      {meta && (<Pagination_1.Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage}/>)}
    </div>);
}
