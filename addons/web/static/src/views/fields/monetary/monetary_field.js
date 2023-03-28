/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { formatMonetary } from "../formatters";
import { parseMonetary } from "../parsers";
import { useInputField } from "../input_field_hook";
import { useNumpadDecimal } from "../numpad_decimal_hook";
import { standardFieldProps } from "../standard_field_props";

import { Component } from "@odoo/owl";
<<<<<<< HEAD
=======
import { getCurrency } from "@web/core/currency";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class MonetaryField extends Component {
    static template = "web.MonetaryField";
    static props = {
        ...standardFieldProps,
        currencyField: { type: String, optional: true },
        inputType: { type: String, optional: true },
        useFieldDigits: { type: Boolean, optional: true },
        hideSymbol: { type: Boolean, optional: true },
        placeholder: { type: String, optional: true },
    };
    static defaultProps = {
        hideSymbol: false,
        inputType: "text",
    };

    setup() {
        useInputField({
            getValue: () => this.formattedValue,
            refName: "numpadDecimal",
            parse: parseMonetary,
        });
        useNumpadDecimal();
    }

    get currencyId() {
        const currencyField =
            this.props.currencyField ||
            this.props.record.fields[this.props.name].currency_field ||
            "currency_id";
        const currency = this.props.record.data[currencyField];
        return currency && currency[0];
    }
    get currency() {
        if (!isNaN(this.currencyId)) {
            return getCurrency(this.currencyId) || null;
        }
        return null;
    }

    get currencySymbol() {
        return this.currency ? this.currency.symbol : "";
    }

    get currencyDigits() {
        if (this.props.useFieldDigits) {
            return this.props.record.fields[this.props.name].digits;
        }
        if (!this.currency) {
            return null;
        }
        return getCurrency(this.currencyId).digits;
    }

    get formattedValue() {
        if (
            this.props.inputType === "number" &&
            !this.props.readonly &&
            this.props.record.data[this.props.name]
        ) {
            return this.props.record.data[this.props.name];
        }
        return formatMonetary(this.props.record.data[this.props.name], {
            digits: this.currencyDigits,
            currencyId: this.currencyId,
            noSymbol: !this.props.readonly || this.props.hideSymbol,
        });
    }
}

<<<<<<< HEAD
MonetaryField.template = "web.MonetaryField";
MonetaryField.props = {
    ...standardFieldProps,
    currencyField: { type: String, optional: true },
    inputType: { type: String, optional: true },
    useFieldDigits: { type: Boolean, optional: true },
    hideSymbol: { type: Boolean, optional: true },
    placeholder: { type: String, optional: true },
};
MonetaryField.defaultProps = {
    hideSymbol: false,
    inputType: "text",
};

MonetaryField.supportedTypes = ["monetary", "float"];
MonetaryField.displayName = _lt("Monetary");

MonetaryField.extractProps = ({ attrs }) => {
    return {
        currencyField: attrs.options.currency_field,
        inputType: attrs.type,
        useFieldDigits: attrs.options.field_digits,
        hideSymbol: attrs.options.no_symbol,
=======
export const monetaryField = {
    component: MonetaryField,
    supportedTypes: ["monetary", "float"],
    displayName: _lt("Monetary"),
    extractProps: ({ attrs, options }) => ({
        currencyField: options.currency_field,
        inputType: attrs.type,
        useFieldDigits: options.field_digits,
        hideSymbol: options.no_symbol,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        placeholder: attrs.placeholder,
    }),
};

registry.category("fields").add("monetary", monetaryField);
