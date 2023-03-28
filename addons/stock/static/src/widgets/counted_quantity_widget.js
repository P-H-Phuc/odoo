/** @odoo-module **/

<<<<<<< HEAD
import { FloatField } from "@web/views/fields/float/float_field";
=======
import { FloatField, floatField } from "@web/views/fields/float/float_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { registry } from "@web/core/registry";
import { getActiveHotkey } from "@web/core/hotkeys/hotkey_service";

const { useEffect, useRef } = owl;

export class CountedQuantityWidgetField extends FloatField {
    setup() {
        // Need to adapt useInputField to overide onInput and onChange
        super.setup();

        const inputRef = useRef("numpadDecimal");

        useEffect(
            (inputEl) => {
                if (inputEl) {
                    inputEl.addEventListener("input", this.onInput.bind(this));
                    inputEl.addEventListener("keydown", this.onKeydown.bind(this));
                    return () => {
                        inputEl.removeEventListener("input", this.onInput.bind(this));
                        inputEl.removeEventListener("keydown", this.onKeydown.bind(this));
                    };
                }
            },
            () => [inputRef.el]
        );
    }

    onInput(ev) {
<<<<<<< HEAD
        this.props.setDirty(true);
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return this.props.record.update({ inventory_quantity_set: true });
    }

    onKeydown(ev) {
        const hotkey = getActiveHotkey(ev);
        if (["enter", "tab", "shift+tab"].includes(hotkey)) {
            try {
                const val = this.parse(ev.target.value);
<<<<<<< HEAD
                this.props.update(val);
            } catch (_e) {
                // ignore since it will be handled later
            }
=======
                this.props.record.update({ [this.props.name]: val });
            } catch {} // ignore since it will be handled later
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            this.onInput(ev);
        }
    }

    get formattedValue() {
        if (
            this.props.readonly &&
<<<<<<< HEAD
            !this.props.value & !this.props.record.data.inventory_quantity_set
=======
            !this.props.record.data[this.props.name] & !this.props.record.data.inventory_quantity_set
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ) {
            return "";
        }
        return super.formattedValue;
    }
}

<<<<<<< HEAD
registry.category("fields").add("counted_quantity_widget", CountedQuantityWidgetField);
=======
export const countedQuantityWidgetField = {
    ...floatField,
    component: CountedQuantityWidgetField,
};

registry.category("fields").add("counted_quantity_widget", countedQuantityWidgetField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
