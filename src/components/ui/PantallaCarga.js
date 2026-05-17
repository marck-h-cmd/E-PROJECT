'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PantallaCarga = PantallaCarga;
var React = require("react");
var lucide_react_1 = require("lucide-react");
function PantallaCarga(_a) {
    var _b = _a.mensaje, mensaje = _b === void 0 ? 'Cargando...' : _b, _c = _a.fullScreen, fullScreen = _c === void 0 ? true : _c;
    var content = (<div className="flex flex-col items-center justify-center gap-4 p-8">
      <lucide_react_1.Loader2 className="h-10 w-10 animate-spin text-primary-600"/>
      <p className="text-sm font-medium text-gray-600 animate-pulse">{mensaje}</p>
    </div>);
    if (fullScreen) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>);
    }
    return content;
}
