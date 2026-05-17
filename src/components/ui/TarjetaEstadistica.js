'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarjetaEstadistica = TarjetaEstadistica;
var React = require("react");
var cn_1 = require("@/lib/cn");
var colores = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
};
function TarjetaEstadistica(_a) {
    var titulo = _a.titulo, valor = _a.valor, subtitulo = _a.subtitulo, Icono = _a.icono, tendencia = _a.tendencia, _b = _a.color, color = _b === void 0 ? 'blue' : _b, _c = _a.loading, loading = _c === void 0 ? false : _c;
    if (loading) {
        return (<div className="h-32 w-full animate-pulse rounded-xl bg-gray-100"/>);
    }
    return (<div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{titulo}</p>
          <h4 className="mt-1 text-2xl font-bold text-gray-900">{valor}</h4>
          
          {subtitulo && (<p className="mt-1 text-xs text-gray-500">{subtitulo}</p>)}

          {tendencia && (<div className={(0, cn_1.cn)("mt-2 flex items-center gap-1 text-xs font-medium", tendencia.positivo ? "text-green-600" : "text-red-600")}>
              <span>{tendencia.positivo ? '↑' : '↓'}</span>
              <span>{Math.abs(tendencia.valor)}%</span>
              <span className="text-gray-400 font-normal ml-1">vs mes anterior</span>
            </div>)}
        </div>

        {Icono && (<div className={(0, cn_1.cn)("rounded-lg p-3", colores[color])}>
            <Icono className="h-6 w-6"/>
          </div>)}
      </div>
    </div>);
}
