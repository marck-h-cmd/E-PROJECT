'use client';
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
exports.DialogDescription = exports.DialogTitle = exports.DialogContent = exports.DialogTrigger = exports.DialogClose = exports.DialogOverlay = exports.DialogPortal = exports.Dialog = void 0;
exports.DialogHeader = DialogHeader;
exports.DialogFooter = DialogFooter;
var React = require("react");
var DialogPrimitive = require("@radix-ui/react-dialog");
var lucide_react_1 = require("lucide-react");
var cn_1 = require("@/lib/cn");
var Dialog = DialogPrimitive.Root;
exports.Dialog = Dialog;
var DialogTrigger = DialogPrimitive.Trigger;
exports.DialogTrigger = DialogTrigger;
var DialogPortal = DialogPrimitive.Portal;
exports.DialogPortal = DialogPortal;
var DialogClose = DialogPrimitive.Close;
exports.DialogClose = DialogClose;
var DialogOverlay = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Overlay ref={ref} className={(0, cn_1.cn)('fixed inset-0 z-50 bg-black/50', className)} {...props}/>);
});
exports.DialogOverlay = DialogOverlay;
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={(0, cn_1.cn)('fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white p-6 shadow-lg sm:rounded-lg max-h-[90vh] overflow-y-auto', className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
        <lucide_react_1.X className="h-4 w-4"/>
        <span className="sr-only">Cerrar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>);
});
exports.DialogContent = DialogContent;
DialogContent.displayName = DialogPrimitive.Content.displayName;
function DialogHeader(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div className={(0, cn_1.cn)('flex flex-col space-y-1.5', className)} {...props}/>;
}
var DialogTitle = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Title ref={ref} className={(0, cn_1.cn)('text-lg font-semibold text-gray-900', className)} {...props}/>);
});
exports.DialogTitle = DialogTitle;
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Description ref={ref} className={(0, cn_1.cn)('text-sm text-gray-500', className)} {...props}/>);
});
exports.DialogDescription = DialogDescription;
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function DialogFooter(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props}/>);
}
