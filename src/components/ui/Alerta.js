'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alerta = Alerta;
var React = require("react");
var cn_1 = require("@/lib/cn");
var lucide_react_1 = require("lucide-react");
var estilos = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
};
var iconos = {
    success: lucide_react_1.CheckCircle2,
    error: lucide_react_1.AlertCircle,
    warning: lucide_react_1.AlertTriangle,
    info: lucide_react_1.Info,
};
function Alerta(_a) {
    var _b = _a.tipo, tipo = _b === void 0 ? 'info' : _b, mensaje = _a.mensaje, titulo = _a.titulo, onClose = _a.onClose, className = _a.className;
    var Icono = iconos[tipo];
    return (<div className={(0, cn_1.cn)('relative flex w-full gap-3 rounded-lg border p-4 animate-fadeIn', estilos[tipo], className)}>
      <Icono className="h-5 w-5 shrink-0"/>
      <div className="flex-1">
        {titulo && <h4 className="mb-1 font-semibold leading-none tracking-tight">{titulo}</h4>}
        <p className="text-sm leading-relaxed">{mensaje}</p>
      </div>
      {onClose && (<button onClick={onClose} className="shrink-0 rounded-md p-1 hover:bg-black/5">
          <lucide_react_1.X className="h-4 w-4"/>
        </button>)}
    </div>);
}
