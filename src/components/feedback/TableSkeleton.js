"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableSkeleton = TableSkeleton;
var cn_1 = require("@/lib/cn");
function TableSkeleton(_a) {
    var _b = _a.columns, columns = _b === void 0 ? 5 : _b, _c = _a.rows, rows = _c === void 0 ? 5 : _c, className = _a.className;
    return (<div className={(0, cn_1.cn)('table-container', className)}>
      <div className="animate-pulse space-y-3 p-4">
        <div className="h-8 bg-gray-200 rounded w-full"/>
        {Array.from({ length: rows }).map(function (_, i) { return (<div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map(function (_, j) { return (<div key={j} className="h-6 bg-gray-100 rounded flex-1"/>); })}
          </div>); })}
      </div>
    </div>);
}
