/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { standardFieldProps } from "../standard_field_props";
import { formatSelection } from "../formatters";

import { Component } from "@odoo/owl";

export class FontSelectionField extends Component {
    static template = "web.FontSelectionField";
    static props = {
        ...standardFieldProps,
        placeholder: { type: String, optional: true },
        required: { type: Boolean, optional: true },
    };

    get options() {
        return this.props.record.fields[this.props.name].selection.filter(
            (option) => option[0] !== false && option[1] !== ""
        );
    }
    get string() {
        return formatSelection(this.props.record.data[this.props.name], {
            selection: this.options,
        });
    }

    stringify(value) {
        return JSON.stringify(value);
    }

    /**
     * @param {Event} ev
     */
    onChange(ev) {
        const value = JSON.parse(ev.target.value);
        this.props.record.update({ [this.props.name]: value });
    }
}

export const fontSelectionField = {
    component: FontSelectionField,
    displayName: _lt("Font Selection"),
    supportedTypes: ["selection"],
    extractProps({ attrs }, dynamicInfo) {
        return {
            placeholder: attrs.placeholder,
            required: dynamicInfo.required,
        };
    },
    legacySpecialData: "_fetchSpecialRelation",
};

<<<<<<< HEAD
FontSelectionField.displayName = _lt("Font Selection");
FontSelectionField.supportedTypes = ["selection"];
FontSelectionField.legacySpecialData = "_fetchSpecialRelation";

FontSelectionField.extractProps = ({ attrs }) => {
    return {
        placeholder: attrs.placeholder,
    };
};

registry.category("fields").add("font", FontSelectionField);
=======
registry.category("fields").add("font", fontSelectionField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
