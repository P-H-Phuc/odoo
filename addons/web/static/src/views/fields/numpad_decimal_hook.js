/** @odoo-module **/

import { localization } from "@web/core/l10n/localization";

import { useRef, useEffect } from "@odoo/owl";
<<<<<<< HEAD
=======

function onKeydown(ev) {
    const decimalPoint = localization.decimalPoint;
    if (
        !([".", ","].includes(ev.key) && ev.code === "NumpadDecimal") ||
        ev.key === decimalPoint ||
        ev.target.type === "number"
    ) {
        return;
    }
    ev.preventDefault();
    ev.target.setRangeText(decimalPoint, ev.target.selectionStart, ev.target.selectionEnd, "end");
}

function onFocus(ev) {
    ev.target.select();
}
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * This hook replaces the decimal separator of the numpad decimal key
 * by the decimal separator from the user's language setting when user
 * edits an input. The input is found using a t-ref="numpadDecimal"
 * reference in the current component. It can be placed directly on an
 * input or an element containing multiple inputs that require the
 * behavior
 *
 * NOTE: Special consideration for the input type = "number". In this
 * case, whatever the user types, we let the browser's default behavior.
 */
export function useNumpadDecimal() {
<<<<<<< HEAD
    const decimalPoint = localization.decimalPoint;
    const ref = useRef("numpadDecimal");
    const handler = (ev) => {
        if (
            !([".", ","].includes(ev.key) && ev.code === "NumpadDecimal") ||
            ev.key === decimalPoint ||
            ev.target.type === "number"
        ) {
            return;
        }
        ev.preventDefault();
        ev.target.setRangeText(
            decimalPoint,
            ev.target.selectionStart,
            ev.target.selectionEnd,
            "end"
        );
    };
    useEffect(() => {
        let inputs = [];
        const el = ref.el;
        if (el) {
            inputs = el.nodeName === "INPUT" ? [el] : el.querySelectorAll("input");
            inputs.forEach((input) => input.addEventListener("keydown", handler));
        }
        return () => {
            inputs.forEach((input) => input.removeEventListener("keydown", handler));
=======
    const ref = useRef("numpadDecimal");
    useEffect(() => {
        let inputs = [];
        const el = ref.el;
        if (el) {
            inputs = el.nodeName === "INPUT" ? [el] : el.querySelectorAll("input");
            inputs.forEach((input) => input.addEventListener("keydown", onKeydown));
            inputs.forEach((input) => input.addEventListener("focus", onFocus));
        }
        return () => {
            inputs.forEach((input) => input.removeEventListener("keydown", onKeydown));
            inputs.forEach((input) => input.removeEventListener("focus", onFocus));
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        };
    });
}
