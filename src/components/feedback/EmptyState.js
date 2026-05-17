"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
var lucide_react_1 = require("lucide-react");
var cn_1 = require("@/lib/cn");
function EmptyState(_a) {
    var title = _a.title, description = _a.description, action = _a.action, className = _a.className;
    return (<div className={(0, cn_1.cn)('flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-16 px-6 text-center', className)}>
      <lucide_react_1.Inbox className="h-12 w-12 text-gray-300 mb-4"/>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>);
}
