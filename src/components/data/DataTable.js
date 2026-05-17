'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
var cn_1 = require("@/lib/cn");
var TableSkeleton_1 = require("@/components/feedback/TableSkeleton");
var EmptyState_1 = require("@/components/feedback/EmptyState");
function DataTable(_a) {
    var columns = _a.columns, data = _a.data, loading = _a.loading, _b = _a.emptyTitle, emptyTitle = _b === void 0 ? 'Sin registros' : _b, emptyDescription = _a.emptyDescription, keyExtractor = _a.keyExtractor, className = _a.className;
    if (loading)
        return <TableSkeleton_1.TableSkeleton columns={columns.length}/>;
    if (data.length === 0) {
        return <EmptyState_1.EmptyState title={emptyTitle} description={emptyDescription}/>;
    }
    return (<div className={(0, cn_1.cn)('table-container', className)}>
      <table className="table">
        <thead>
          <tr>
            {columns.map(function (col) { return (<th key={col.key} className={col.className}>
                {col.header}
              </th>); })}
          </tr>
        </thead>
        <tbody>
          {data.map(function (row) { return (<tr key={keyExtractor(row)} className="hover:bg-gray-50">
              {columns.map(function (col) { return (<td key={col.key} className={col.className}>
                  {col.cell(row)}
                </td>); })}
            </tr>); })}
        </tbody>
      </table>
    </div>);
}
