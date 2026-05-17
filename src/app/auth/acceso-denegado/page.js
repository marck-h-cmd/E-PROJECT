'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AccesoDenegadoPage;
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
function AccesoDenegadoPage() {
    return (<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <lucide_react_1.ShieldX className="mb-4 h-16 w-16 text-unt-red"/>
      <h1 className="text-2xl font-bold text-gray-900">Acceso denegado</h1>
      <p className="mt-2 max-w-md text-center text-gray-500">
        No tiene permisos para acceder a esta sección del sistema.
      </p>
      <button_1.Button asChild className="mt-6 bg-unt-blue hover:bg-unt-blue/90">
        <link_1.default href="/dashboard">Volver al dashboard</link_1.default>
      </button_1.Button>
    </div>);
}
