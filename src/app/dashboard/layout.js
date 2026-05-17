'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
var DashboardShell_1 = require("@/components/layout/DashboardShell");
var AuthContext_1 = require("@/contexts/AuthContext");
var lucide_react_1 = require("lucide-react");
function DashboardLayout(_a) {
    var children = _a.children;
    var loading = (0, AuthContext_1.useRequireAuth)().loading;
    if (loading) {
        return (<div className="flex min-h-screen items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-unt-blue"/>
      </div>);
    }
    return <DashboardShell_1.DashboardShell>{children}</DashboardShell_1.DashboardShell>;
}
