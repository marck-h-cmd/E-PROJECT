"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;
var link_1 = require("next/link");
function NotFound() {
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center animate-fadeIn">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        <p className="text-gray-500 mb-6">
          La página que busca no existe o ha sido movida.
        </p>
        <link_1.default href="/" className="btn-primary">
          Volver al inicio
        </link_1.default>
      </div>
    </div>);
}
