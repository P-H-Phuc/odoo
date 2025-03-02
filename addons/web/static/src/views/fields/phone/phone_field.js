/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { useInputField } from "../input_field_hook";
import { standardFieldProps } from "../standard_field_props";

import { Component } from "@odoo/owl";

export class PhoneField extends Component {
    static template = "web.PhoneField";
    static props = {
        ...standardFieldProps,
        placeholder: { type: String, optional: true },
    };

    setup() {
        useInputField({ getValue: () => this.props.record.data[this.props.name] || "" });
    }
}

export const phoneField = {
    component: PhoneField,
    displayName: _lt("Phone"),
    supportedTypes: ["char"],
    extractProps: ({ attrs }) => ({
        placeholder: attrs.placeholder,
    }),
};

<<<<<<< HEAD
class FormPhoneField extends PhoneField {}
FormPhoneField.template = "web.FormPhoneField";

registry.category("fields").add("phone", PhoneField);
registry.category("fields").add("form.phone", FormPhoneField);
=======
registry.category("fields").add("phone", phoneField);

class FormPhoneField extends PhoneField {
    static template = "web.FormPhoneField";
}

export const formPhoneField = {
    ...phoneField,
    component: FormPhoneField,
};

registry.category("fields").add("form.phone", formPhoneField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
