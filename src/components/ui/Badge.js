"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = Badge;
var React = require("react");
var class_variance_authority_1 = require("class-variance-authority");
var cn_1 = require("@/lib/cn");
var badgeVariants = (0, class_variance_authority_1.cva)('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
    variants: {
        variant: {
            default: 'bg-primary-100 text-primary-800',
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            danger: 'bg-red-100 text-red-800',
            secondary: 'bg-gray-100 text-gray-800',
            outline: 'border border-gray-300 text-gray-700',
        },
    },
    defaultVariants: { variant: 'default' },
});
function Badge(_a) {
    var className = _a.className, variant = _a.variant, props = __rest(_a, ["className", "variant"]);
    return <div className={(0, cn_1.cn)(badgeVariants({ variant: variant }), className)} {...props}/>;
}
