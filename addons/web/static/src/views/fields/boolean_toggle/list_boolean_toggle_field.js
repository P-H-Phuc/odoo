/** @odoo-module **/

import { registry } from "@web/core/registry";
import { booleanToggleField, BooleanToggleField } from "./boolean_toggle_field";

export class ListBooleanToggleField extends BooleanToggleField {
<<<<<<< HEAD
    onClick() {
        if (!this.props.readonly) {
            this.props.update(!this.props.value, { save: true });
=======
    static template = "web.ListBooleanToggleField";

    async onClick() {
        if (!this.props.readonly && this.props.record.isInEdition) {
            await this.props.record.update({
                [this.props.name]: !this.props.record.data[this.props.name],
            });
            return this.props.record.save();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    }
}

export const listBooleanToggleField = {
    ...booleanToggleField,
    component: ListBooleanToggleField,
};

registry.category("fields").add("list.boolean_toggle", listBooleanToggleField);
