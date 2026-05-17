'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarjetaResumenPeriodo = TarjetaResumenPeriodo;
var React = require("react");
var lucide_react_1 = require("lucide-react");
var formateadores_1 = require("@/lib/formateadores");
var cn_1 = require("@/lib/cn");
function TarjetaResumenPeriodo(_a) {
    var _b, _c;
    var periodo = _a.periodo, loading = _a.loading;
    if (loading) {
        return (<div className="h-48 w-full animate-pulse rounded-xl bg-gray-100"/>);
    }
    if (!periodo) {
        return (<div className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <lucide_react_1.AlertCircle className="h-8 w-8 text-gray-400"/>
        <p className="text-sm text-gray-500">No hay información del período activo</p>
      </div>);
    }
    var esActivo = periodo.activo && periodo.estado === 'ACTIVO';
    return (<div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className={(0, cn_1.cn)("flex items-center justify-between border-b px-6 py-4", esActivo ? "bg-primary-50 border-primary-100" : "bg-gray-50 border-gray-100")}>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Período Actual</h3>
        <span className={(0, cn_1.cn)("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", esActivo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700")}>
          {esActivo && <lucide_react_1.CheckCircle2 className="h-3 w-3"/>}
          {periodo.estado}
        </span>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">{periodo.nombre}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <lucide_react_1.Calendar className="h-3 w-3"/>
            <span>{formateadores_1.Formateadores.fecha(periodo.fechaInicio)} - {formateadores_1.Formateadores.fecha(periodo.fechaFin)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Horarios</p>
            <p className="text-lg font-bold text-primary-700">{((_b = periodo._count) === null || _b === void 0 ? void 0 : _b.horarios) || 0}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Ventanas</p>
            <p className="text-lg font-bold text-primary-700">{((_c = periodo._count) === null || _c === void 0 ? void 0 : _c.ventanas) || 0}</p>
          </div>
        </div>
      </div>
    </div>);
}
