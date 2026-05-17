'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = Pagination;
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var cn_1 = require("@/lib/cn");
function Pagination(_a) {
    var page = _a.page, totalPages = _a.totalPages, total = _a.total, onPageChange = _a.onPageChange, className = _a.className;
    if (totalPages <= 1)
        return null;
    return (<div className={(0, cn_1.cn)('flex items-center justify-between gap-4 py-4', className)}>
      <p className="text-sm text-gray-500">
        {total !== undefined && (<>
            Total: <span className="font-medium text-gray-700">{total}</span>
            {' · '}
          </>)}
        Página {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <button_1.Button variant="outline" size="sm" disabled={page <= 1} onClick={function () { return onPageChange(page - 1); }}>
          <lucide_react_1.ChevronLeft className="h-4 w-4"/>
          Anterior
        </button_1.Button>
        <button_1.Button variant="outline" size="sm" disabled={page >= totalPages} onClick={function () { return onPageChange(page + 1); }}>
          Siguiente
          <lucide_react_1.ChevronRight className="h-4 w-4"/>
        </button_1.Button>
      </div>
    </div>);
}
