"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorAlert = ErrorAlert;
var lucide_react_1 = require("lucide-react");
var cn_1 = require("@/lib/cn");
function ErrorAlert(_a) {
    var message = _a.message, className = _a.className, onRetry = _a.onRetry;
    return (<div role="alert" className={(0, cn_1.cn)('flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800', className)}>
      <lucide_react_1.AlertCircle className="h-5 w-5 shrink-0 mt-0.5"/>
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (<button type="button" onClick={onRetry} className="mt-2 font-medium underline hover:no-underline">
            Reintentar
          </button>)}
      </div>
    </div>);
}
