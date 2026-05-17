'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProviders = AppProviders;
var AuthContext_1 = require("@/contexts/AuthContext");
var PeriodoContext_1 = require("@/contexts/PeriodoContext");
var sonner_1 = require("sonner");
function AppProviders(_a) {
    var children = _a.children;
    return (<AuthContext_1.AuthProvider>
      <PeriodoContext_1.PeriodoProvider>
        {children}
        <sonner_1.Toaster position="top-right" richColors closeButton/>
      </PeriodoContext_1.PeriodoProvider>
    </AuthContext_1.AuthProvider>);
}
