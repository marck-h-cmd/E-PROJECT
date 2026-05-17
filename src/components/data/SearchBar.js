'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = SearchBar;
var lucide_react_1 = require("lucide-react");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var cn_1 = require("@/lib/cn");
function SearchBar(_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? 'Buscar...' : _b, className = _a.className, onSubmit = _a.onSubmit;
    return (<form className={(0, cn_1.cn)('relative flex max-w-md gap-2', className)} onSubmit={function (e) {
            e.preventDefault();
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
        }}>
      <div className="relative flex-1">
        <lucide_react_1.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
        <input_1.Input value={value} onChange={function (e) { return onChange(e.target.value); }} placeholder={placeholder} className="pl-9"/>
      </div>
      {value && (<button_1.Button type="button" variant="ghost" size="icon" onClick={function () { return onChange(''); }}>
          <lucide_react_1.X className="h-4 w-4"/>
        </button_1.Button>)}
    </form>);
}
