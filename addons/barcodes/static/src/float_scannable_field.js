/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { FloatField } from "@web/views/fields/float/float_field";
=======
import { FloatField, floatField } from "@web/views/fields/float/float_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class FloatScannableField extends FloatField {
    onBarcodeScanned() {
        this.inputRef.el.dispatchEvent(new InputEvent("input"));
    }
}
FloatScannableField.template = "barcodes.FloatScannableField";

<<<<<<< HEAD
registry.category("fields").add("field_float_scannable", FloatScannableField);
=======
export const floatScannableField = {
    ...floatField,
    component: FloatScannableField,
};

registry.category("fields").add("field_float_scannable", floatScannableField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
