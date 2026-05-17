'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardShell = DashboardShell;
var react_1 = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var AuthContext_1 = require("@/contexts/AuthContext");
var formateadores_1 = require("@/lib/formateadores");
var menu_config_1 = require("@/lib/menu-config");
var PeriodoSelector_1 = require("@/components/layout/PeriodoSelector");
var cn_1 = require("@/lib/cn");
function DashboardShell(_a) {
    var _b, _c;
    var children = _a.children;
    var pathname = (0, navigation_1.usePathname)();
    var _d = (0, AuthContext_1.useAuth)(), user = _d.user, logout = _d.logout, can = _d.can;
    var _e = (0, react_1.useState)(false), mobileOpen = _e[0], setMobileOpen = _e[1];
    var visibleSections = menu_config_1.MENU_SECTIONS.map(function (section) { return (__assign(__assign({}, section), { items: section.items.filter(function (item) { return !item.permission || can(item.permission); }) })); }).filter(function (s) { return s.items.length > 0; });
    var sidebar = (<div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1 overflow-hidden">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Escudo_UNT.png/220px-Escudo_UNT.png" alt="UNT Logo" className="h-full w-auto object-contain" onError={function (e) {
            e.currentTarget.src = "/imagenes/iconos/logo-unt.png";
        }}/>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-white">Gestión de Horarios</h1>
          <p className="truncate text-xs text-blue-300">Ing. de Sistemas</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleSections.map(function (section) { return (<div key={section.titulo} className="mb-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-blue-300">
              {section.titulo}
            </h3>
            <ul className="space-y-1">
              {section.items.map(function (item) {
                var Icon = item.icon;
                var active = pathname === item.href ||
                    (item.href !== '/dashboard' && (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(item.href)));
                return (<li key={item.href}>
                    <link_1.default href={item.href} onClick={function () { return setMobileOpen(false); }} className={(0, cn_1.cn)('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors', active
                        ? 'bg-white/20 text-white'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white')}>
                      <Icon className="h-4 w-4 shrink-0"/>
                      <span>{item.nombre}</span>
                    </link_1.default>
                  </li>);
            })}
            </ul>
          </div>); })}
      </nav>

      {user && (<div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-unt-gold text-xs font-bold text-unt-blue">
              {(_b = user.nombre) === null || _b === void 0 ? void 0 : _b.charAt(0)}
              {(_c = user.apellidos) === null || _c === void 0 ? void 0 : _c.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.nombre} {user.apellidos}
              </p>
              <p className="truncate text-xs text-blue-300">
                {formateadores_1.Formateadores.rolUsuario(user.rol)}
              </p>
            </div>
            <button type="button" onClick={function () { return logout(); }} className="rounded p-1 hover:bg-white/10" title="Cerrar sesión">
              <lucide_react_1.LogOut className="h-4 w-4"/>
            </button>
          </div>
        </div>)}
    </div>);
    return (<div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 bg-unt-blue text-white lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (<div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={function () { return setMobileOpen(false); }}/>
          <aside className="absolute left-0 top-0 h-full w-64 bg-unt-blue text-white shadow-xl">
            <button type="button" className="absolute right-3 top-3 rounded p-1 hover:bg-white/10" onClick={function () { return setMobileOpen(false); }}>
              <lucide_react_1.X className="h-5 w-5"/>
            </button>
            {sidebar}
          </aside>
        </div>)}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
            <button type="button" className="rounded-md p-2 hover:bg-gray-100 lg:hidden" onClick={function () { return setMobileOpen(true); }}>
              <lucide_react_1.Menu className="h-5 w-5"/>
            </button>
            <p className="text-sm font-medium text-gray-500 lg:hidden">UNT Horarios</p>
            <PeriodoSelector_1.PeriodoSelector className="ml-auto"/>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>);
}
