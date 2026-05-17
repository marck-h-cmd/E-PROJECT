'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarraSuperior = BarraSuperior;
var react_1 = require("react");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var AuthContext_1 = require("@/contexts/AuthContext");
var formateadores_1 = require("@/lib/formateadores");
var cn_1 = require("@/lib/cn");
function BarraSuperior() {
    var _a, _b;
    var _c = (0, AuthContext_1.useAuth)(), user = _c.user, logout = _c.logout;
    var _d = (0, react_1.useState)(false), showUserMenu = _d[0], setShowUserMenu = _d[1];
    return (<header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {/* Logo responsivo para móvil */}
        <div className="flex md:hidden items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-primary-100 p-1">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Escudo_UNT.png/220px-Escudo_UNT.png" alt="UNT" className="h-full w-full object-contain"/>
          </div>
          <span className="text-lg font-bold text-primary-900">UNT</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500">
          <span>Sistema de Gestión de Horarios</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Buscador Global (Simulado) */}
        <div className="relative hidden sm:block">
          <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"/>
          <input type="search" placeholder="Buscar..." className="h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
        </div>

        {/* Notificaciones */}
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <lucide_react_1.Bell className="h-5 w-5"/>
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Menú de Usuario */}
        {user && (<div className="relative">
            <button onClick={function () { return setShowUserMenu(!showUserMenu); }} className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-3 hover:bg-gray-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {(_a = user.nombre) === null || _a === void 0 ? void 0 : _a.charAt(0)}{(_b = user.apellidos) === null || _b === void 0 ? void 0 : _b.charAt(0)}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold text-gray-900">{user.nombre}</p>
                <p className="text-[10px] text-gray-500">{formateadores_1.Formateadores.rolUsuario(user.rol)}</p>
              </div>
              <lucide_react_1.ChevronDown className={(0, cn_1.cn)("h-4 w-4 text-gray-400 transition-transform", showUserMenu && "rotate-180")}/>
            </button>

            {showUserMenu && (<div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.nombre} {user.apellidos}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <link_1.default href="/dashboard/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={function () { return setShowUserMenu(false); }}>
                  Mi Perfil
                </link_1.default>
                <link_1.default href="/dashboard/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={function () { return setShowUserMenu(false); }}>
                  Configuración
                </link_1.default>
                <button onClick={function () {
                    setShowUserMenu(false);
                    logout();
                }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  <lucide_react_1.LogOut className="h-4 w-4"/>
                  Cerrar Sesión
                </button>
              </div>)}
          </div>)}
      </div>
    </header>);
}
