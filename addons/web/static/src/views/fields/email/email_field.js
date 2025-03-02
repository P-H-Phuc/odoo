/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { useInputField } from "../input_field_hook";
import { standardFieldProps } from "../standard_field_props";

import { Component } from "@odoo/owl";

export class EmailField extends Component {
    static template = "web.EmailField";
    static props = {
        ...standardFieldProps,
        placeholder: { type: String, optional: true },
    };

    setup() {
        useInputField({ getValue: () => this.props.record.data[this.props.name] || "" });
    }
}

export const emailField = {
    component: EmailField,
    displayName: _lt("Email"),
    supportedTypes: ["char"],
    extractProps: ({ attrs }) => ({
        placeholder: attrs.placeholder,
    }),
};

registry.category("fields").add("email", emailField);

<<<<<<< HEAD
class FormEmailField extends EmailField {}
FormEmailField.template = "web.FormEmailField";

registry.category("fields").add("email", EmailField);
registry.category("fields").add("form.email", FormEmailField);
=======
class FormEmailField extends EmailField {
    static template = "web.FormEmailField";
}

export const formEmailField = {
    ...emailField,
    component: FormEmailField,
};

registry.category("fields").add("form.email", formEmailField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
