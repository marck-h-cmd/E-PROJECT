"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
var google_1 = require("next/font/google");
var AppProviders_1 = require("@/providers/AppProviders");
require("./globals.css");
var inter = (0, google_1.Inter)({
    subsets: ['latin'],
    variable: '--font-inter',
});
exports.metadata = {
    title: 'Sistema de Gestión de Horarios - UNT',
    description: 'Sistema de Gestión de Horarios para la Escuela de Ingeniería de Sistemas de la Universidad Nacional de Trujillo',
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
    },
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="es">
      <body className={"".concat(inter.variable, " font-sans antialiased")}>
        <AppProviders_1.AppProviders>{children}</AppProviders_1.AppProviders>
      </body>
    </html>);
}
