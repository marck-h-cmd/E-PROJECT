'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var AuthContext_1 = require("@/contexts/AuthContext");
var cn_1 = require("@/lib/cn");
function Sidebar() {
    var pathname = (0, navigation_1.usePathname)();
    var can = (0, AuthContext_1.useAuth)().can;
    var menuItems = [
        {
            titulo: 'Principal',
            items: [
                { nombre: 'Dashboard', href: '/dashboard', icon: lucide_react_1.Home },
                { nombre: 'Horarios', href: '/dashboard/horarios', icon: lucide_react_1.Calendar },
            ]
        },
        {
            titulo: 'Gestión',
            items: [
                { nombre: 'Docentes', href: '/dashboard/docentes', icon: lucide_react_1.Users, permission: 'VER_DOCENTES' },
                { nombre: 'Cursos', href: '/dashboard/cursos', icon: lucide_react_1.BookOpen, permission: 'VER_CURSOS' },
                { nombre: 'Ambientes', href: '/dashboard/ambientes', icon: lucide_react_1.MapPin, permission: 'VER_AMBIENTES' },
            ]
        },
        {
            titulo: 'Sistema',
            items: [
                { nombre: 'Estadísticas', href: '/dashboard/estadisticas', icon: lucide_react_1.BarChart2, permission: 'VER_ESTADISTICAS' },
                { nombre: 'Reportes', href: '/dashboard/reportes', icon: lucide_react_1.FileText, permission: 'GENERAR_REPORTES' },
                { nombre: 'Notificaciones', href: '/dashboard/notificaciones', icon: lucide_react_1.Bell },
                { nombre: 'Auditoría', href: '/dashboard/auditoria', icon: lucide_react_1.ShieldCheck, permission: 'VER_AUDITORIA' },
            ]
        },
        {
            titulo: 'Configuración',
            items: [
                { nombre: 'Períodos', href: '/dashboard/periodos', icon: lucide_react_1.Clock, permission: 'GESTIONAR_PERIODOS' },
                { nombre: 'Ajustes', href: '/dashboard/configuracion', icon: lucide_react_1.Settings },
            ]
        }
    ];
    return (<aside className="hidden h-screen w-64 flex-col border-r bg-gray-900 text-white md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Escudo_UNT.png/220px-Escudo_UNT.png" alt="UNT Logo" className="h-full w-auto object-contain"/>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold uppercase tracking-wider text-white">UNT Horarios</h1>
          <p className="truncate text-[10px] text-gray-400">Ing. de Sistemas</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {menuItems.map(function (section) {
            // Filtrar items por permiso
            var visibleItems = section.items.filter(function (item) { return !item.permission || can(item.permission); });
            if (visibleItems.length === 0)
                return null;
            return (<div key={section.titulo} className="mb-6">
              <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                {section.titulo}
              </h3>
              <ul className="space-y-1">
                {visibleItems.map(function (item) {
                    var Icon = item.icon;
                    var active = pathname === item.href || (item.href !== '/dashboard' && (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(item.href)));
                    return (<li key={item.href}>
                      <link_1.default href={item.href} className={(0, cn_1.cn)("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", active
                            ? "bg-primary-600 text-white shadow-md"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white")}>
                        <Icon className={(0, cn_1.cn)("h-4 w-4", active ? "text-white" : "text-gray-500")}/>
                        <span>{item.nombre}</span>
                      </link_1.default>
                    </li>);
                })}
              </ul>
            </div>);
        })}
      </nav>

      <div className="border-t border-gray-800 p-4 text-center">
        <p className="text-[10px] text-gray-500">© 2024 Escuela de Sistemas UNT</p>
      </div>
    </aside>);
}
