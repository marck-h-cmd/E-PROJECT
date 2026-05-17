'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = ConfirmDialog;
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
function ConfirmDialog(_a) {
    var open = _a.open, _b = _a.title, title = _b === void 0 ? 'Confirmar acción' : _b, message = _a.message, _c = _a.confirmLabel, confirmLabel = _c === void 0 ? 'Confirmar' : _c, _d = _a.cancelLabel, cancelLabel = _d === void 0 ? 'Cancelar' : _d, _e = _a.variant, variant = _e === void 0 ? 'default' : _e, onConfirm = _a.onConfirm, onCancel = _a.onCancel;
    return (<dialog_1.Dialog open={open} onOpenChange={function (v) { return !v && onCancel(); }}>
      <dialog_1.DialogContent>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>{title}</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>{message}</dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <dialog_1.DialogFooter>
          <button_1.Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </button_1.Button>
          <button_1.Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={onConfirm}>
            {confirmLabel}
          </button_1.Button>
        </dialog_1.DialogFooter>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
