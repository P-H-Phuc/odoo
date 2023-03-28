/** @odoo-module **/

import { registry } from "@web/core/registry";
import { floatField, FloatField } from "../float/float_field";

<<<<<<< HEAD
import { Component } from "@odoo/owl";
export class FloatFactorField extends Component {
    get factor() {
        return this.props.factor;
=======
export class FloatFactorField extends FloatField {
    static props = {
        ...FloatField.props,
        factor: { type: Number, optional: true },
    };
    static defaultProps = {
        ...FloatField.defaultProps,
        factor: 1,
    };

    parse(value) {
        let factorValue = value / this.props.factor;
        if (this.props.inputType !== "number") {
            factorValue = factorValue.toString();
        }
        return super.parse(factorValue);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    get value() {
        return this.props.record.data[this.props.name] * this.props.factor;
    }
}

export const floatFactorField = {
    ...floatField,
    component: FloatFactorField,
    extractProps({ options }) {
        const props = floatField.extractProps(...arguments);
        props.factor = options.factor;
        return props;
    },
};

registry.category("fields").add("float_factor", floatFactorField);
