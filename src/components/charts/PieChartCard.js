'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieChartCard = PieChartCard;
var recharts_1 = require("recharts");
var cn_1 = require("@/lib/cn");
var COLORS = ['#1a365d', '#c9a84c', '#2563eb', '#c41e3a', '#4a5568', '#10b981'];
function PieChartCard(_a) {
    var title = _a.title, description = _a.description, data = _a.data, className = _a.className;
    return (<div className={(0, cn_1.cn)('card', className)}>
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="card-body h-72">
        <recharts_1.ResponsiveContainer width="100%" height="100%">
          <recharts_1.PieChart>
            <recharts_1.Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map(function (_, i) { return (<recharts_1.Cell key={i} fill={COLORS[i % COLORS.length]}/>); })}
            </recharts_1.Pie>
            <recharts_1.Tooltip />
            <recharts_1.Legend />
          </recharts_1.PieChart>
        </recharts_1.ResponsiveContainer>
      </div>
    </div>);
}
