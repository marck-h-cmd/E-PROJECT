'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutDashboard = LayoutDashboard;
var Sidebar_1 = require("./Sidebar");
var BarraSuperior_1 = require("./BarraSuperior");
var AuthContext_1 = require("@/contexts/AuthContext");
var PantallaCarga_1 = require("@/components/ui/PantallaCarga");
function LayoutDashboard(_a) {
    var children = _a.children;
    var loading = (0, AuthContext_1.useAuth)().loading;
    if (loading) {
        return <PantallaCarga_1.PantallaCarga mensaje="Cargando panel de control..."/>;
    }
    return (<div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Desktop */}
      <Sidebar_1.Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <BarraSuperior_1.BarraSuperior />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>);
}
