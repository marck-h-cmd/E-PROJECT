'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoSelector = PeriodoSelector;
var lucide_react_1 = require("lucide-react");
var PeriodoContext_1 = require("@/contexts/PeriodoContext");
var formateadores_1 = require("@/lib/formateadores");
var cn_1 = require("@/lib/cn");
function PeriodoSelector(_a) {
    var className = _a.className;
    var _b = (0, PeriodoContext_1.usePeriodo)(), periodos = _b.periodos, periodoSeleccionado = _b.periodoSeleccionado, setPeriodoSeleccionado = _b.setPeriodoSeleccionado, loading = _b.loading;
    if (loading) {
        return <div className={(0, cn_1.cn)('h-9 w-48 animate-pulse rounded-md bg-gray-200', className)}/>;
    }
    return (<div className={(0, cn_1.cn)('flex items-center gap-2', className)}>
      <lucide_react_1.Calendar className="h-4 w-4 text-unt-blue shrink-0"/>
      <select className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-unt-blue focus:outline-none focus:ring-1 focus:ring-unt-blue" value={(periodoSeleccionado === null || periodoSeleccionado === void 0 ? void 0 : periodoSeleccionado.id) || ''} onChange={function (e) {
            var p = periodos.find(function (x) { return x.id === e.target.value; });
            setPeriodoSeleccionado(p || null);
        }}>
        {periodos.length === 0 && <option value="">Sin períodos</option>}
        {periodos.map(function (p) { return (<option key={p.id} value={p.id}>
            {p.nombre} ({formateadores_1.Formateadores.estadoPeriodo(p.estado)})
          </option>); })}
      </select>
    </div>);
}
