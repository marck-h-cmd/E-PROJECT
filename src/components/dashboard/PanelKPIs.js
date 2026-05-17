'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelKPIs = PanelKPIs;
var React = require("react");
var lucide_react_1 = require("lucide-react");
var TarjetaEstadistica_1 = require("@/components/ui/TarjetaEstadistica");
function PanelKPIs(_a) {
    var stats = _a.stats, loading = _a.loading;
    var data = [
        {
            titulo: 'Docentes Activos',
            valor: (stats === null || stats === void 0 ? void 0 : stats.docentesCount) || 0,
            icono: lucide_react_1.Users,
            color: 'blue',
            subtitulo: 'Registrados en el sistema',
        },
        {
            titulo: 'Cursos Ofertados',
            valor: (stats === null || stats === void 0 ? void 0 : stats.cursosCount) || 0,
            icono: lucide_react_1.BookOpen,
            color: 'green',
            subtitulo: 'Para el ciclo actual',
        },
        {
            titulo: 'Aulas Disponibles',
            valor: (stats === null || stats === void 0 ? void 0 : stats.ambientesCount) || 0,
            icono: lucide_react_1.MapPin,
            color: 'purple',
            subtitulo: 'Capacidad total optimizada',
        },
        {
            titulo: 'Horas Programadas',
            valor: (stats === null || stats === void 0 ? void 0 : stats.horasProgramadas) || 0,
            icono: lucide_react_1.Clock,
            color: 'orange',
            subtitulo: 'De 1,200 proyectadas',
        },
    ];
    return (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {data.map(function (kpi, index) { return (<TarjetaEstadistica_1.TarjetaEstadistica key={index} titulo={kpi.titulo} valor={kpi.valor} icono={kpi.icono} color={kpi.color} subtitulo={kpi.subtitulo} loading={loading}/>); })}
    </div>);
}
