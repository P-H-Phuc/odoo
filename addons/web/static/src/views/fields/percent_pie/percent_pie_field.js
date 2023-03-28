/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { standardFieldProps } from "../standard_field_props";

import { Component } from "@odoo/owl";

export class PercentPieField extends Component {
    static template = "web.PercentPieField";
    static props = {
        ...standardFieldProps,
        string: { type: String, optional: true },
    };

    get transform() {
        const rotateDeg = (360 * this.props.record.data[this.props.name]) / 100;
        return {
            left: rotateDeg < 180 ? 180 : rotateDeg,
            right: rotateDeg < 180 ? rotateDeg : 0,
            value: rotateDeg,
        };
    }
}

export const percentPieField = {
    component: PercentPieField,
    displayName: _lt("PercentPie"),
    supportedTypes: ["float", "integer"],
    additionalClasses: ["o_field_percent_pie"],
    extractProps: ({ string }) => ({ string }),
};

<<<<<<< HEAD
PercentPieField.displayName = _lt("PercentPie");
PercentPieField.supportedTypes = ["float", "integer"];

PercentPieField.extractProps = ({ attrs }) => {
    return {
        string: attrs.string,
    };
};
PercentPieField.additionalClasses = ["o_field_percent_pie"];

registry.category("fields").add("percentpie", PercentPieField);
=======
registry.category("fields").add("percentpie", percentPieField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
