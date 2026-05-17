'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarChartCard = BarChartCard;
var recharts_1 = require("recharts");
var cn_1 = require("@/lib/cn");
function BarChartCard(_a) {
    var title = _a.title, description = _a.description, data = _a.data, dataKey = _a.dataKey, xKey = _a.xKey, _b = _a.color, color = _b === void 0 ? '#1a365d' : _b, className = _a.className;
    return (<div className={(0, cn_1.cn)('card', className)}>
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="card-body h-72">
        <recharts_1.ResponsiveContainer width="100%" height="100%">
          <recharts_1.BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <recharts_1.CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
            <recharts_1.XAxis dataKey={xKey} tick={{ fontSize: 11 }}/>
            <recharts_1.YAxis tick={{ fontSize: 11 }}/>
            <recharts_1.Tooltip />
            <recharts_1.Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]}/>
          </recharts_1.BarChart>
        </recharts_1.ResponsiveContainer>
      </div>
    </div>);
}
