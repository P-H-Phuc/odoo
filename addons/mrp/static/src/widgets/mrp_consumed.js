/** @odoo-module */

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { FloatField } from '@web/views/fields/float/float_field';
=======
import { FloatField, floatField } from '@web/views/fields/float/float_field';
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const { useRef, useEffect } = owl;

export class MrpConsumed extends FloatField {
    setup() {
        super.setup();
        const inputRef = useRef("numpadDecimal");

        useEffect(
            (inputEl) => {
                if (inputEl) {
                    inputEl.addEventListener("input", this.onInput.bind(this));
                    return () => {
                        inputEl.removeEventListener("input", this.onInput.bind(this));
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
        return this.props.record.update({ manual_consumption: true });
    }
}

<<<<<<< HEAD
registry.category('fields').add('mrp_consumed', MrpConsumed);
=======
export const mrpConsumed = {
    ...floatField,
    component: MrpConsumed,
};

registry.category('fields').add('mrp_consumed', mrpConsumed);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
