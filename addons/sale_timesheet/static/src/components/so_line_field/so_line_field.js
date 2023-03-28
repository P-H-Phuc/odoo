/** @odoo-module */

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { X2ManyField } from "@web/views/fields/x2many/x2many_field";
=======
import { Many2OneField, many2OneField } from "@web/views/fields/many2one/many2one_field";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class SoLineField extends Many2OneField {
    setup() {
        super.setup();

        const update = this.update;
        this.update = (value, params = {}) => {
            update(value, params);
            if (value || this.updateOnEmpty) {
                this.props.record.update({ is_so_line_edited: true });
            }
        };
    }
}

<<<<<<< HEAD
export class TimesheetsOne2ManyField extends X2ManyField {}
TimesheetsOne2ManyField.additionalClasses = ['o_field_one2many'];
registry.category("fields").add('so_line_one2many', TimesheetsOne2ManyField); // TODO: Remove me when the gantt view is converted in OWL

registry.category("fields").add("so_line_field", SoLineField);
=======
export const soLineField = {
    ...many2OneField,
    component: SoLineField,
};
registry.category("fields").add("so_line_field", soLineField);

export class TimesheetsOne2ManyField extends X2ManyField {}
export const timesheetsOne2ManyField = {
    ...x2ManyField,
    component: TimesheetsOne2ManyField,
    additionalClasses: ['o_field_one2many'],
};

registry.category("fields").add('so_line_one2many', timesheetsOne2ManyField); // TODO: Remove me when the gantt view is converted in OWL
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
