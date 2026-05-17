'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
var link_1 = require("next/link");
function HomePage() {
    return (<div className="min-h-screen bg-gradient-to-br from-unt-blue to-primary-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 p-2 overflow-hidden">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Escudo_UNT.png/220px-Escudo_UNT.png" alt="UNT Logo" className="h-full w-auto object-contain" onError={function (e) {
            e.currentTarget.src = "/imagenes/iconos/logo-unt.png";
        }}/>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Sistema de Gestión de Horarios
          </h1>
          
          <p className="text-lg text-blue-200 mb-2">
            Escuela de Ingeniería de Sistemas
          </p>
          
          <p className="text-sm text-blue-300">
            Universidad Nacional de Trujillo
          </p>
        </div>

        {/* Estado del sistema */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-300 text-sm">Sistema en línea</span>
          </div>

          <div className="space-y-3">
            <link_1.default href="/auth/login" className="btn-primary w-full block text-center">
              Iniciar Sesión
            </link_1.default>
            
            <link_1.default href="/api/salud" className="btn-outline w-full block text-center bg-white/20 text-white border-white/30 hover:bg-white/30">
              Verificar API
            </link_1.default>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="text-center text-sm text-blue-300 space-y-1">
          <p>Versión 1.0.0</p>
          <p>© {new Date().getFullYear()} UNT - Todos los derechos reservados</p>
        </div>
      </div>
    </div>);
}
