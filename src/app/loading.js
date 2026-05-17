"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Loading;
function Loading() {
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg className="spinner h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-gray-500 text-lg">Cargando...</p>
        <p className="text-gray-400 text-sm mt-1">Sistema de Gestión de Horarios - UNT</p>
      </div>
    </div>);
}
