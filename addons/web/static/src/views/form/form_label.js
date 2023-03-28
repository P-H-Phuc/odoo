/**@odoo-module */

import { fieldVisualFeedback } from "@web/views/fields/field";
import { session } from "@web/session";
import { getTooltipInfo } from "@web/views/fields/field_tooltip";

import { Component } from "@odoo/owl";

export class FormLabel extends Component {
    get className() {
        const { invalid, empty, readonly } = fieldVisualFeedback(
<<<<<<< HEAD
            this.props.fieldInfo.FieldComponent,
=======
            this.props.fieldInfo.field,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            this.props.record,
            this.props.fieldName,
            this.props.fieldInfo
        );
        const classes = this.props.className ? [this.props.className] : [];
        if (invalid) {
            classes.push("o_field_invalid");
        }
        if (empty) {
            classes.push("o_form_label_empty");
        }
<<<<<<< HEAD
        if (readonly) {
=======
        if (readonly && !this.props.notMuttedLabel) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            classes.push("o_form_label_readonly");
        }
        return classes.join(" ");
    }

    get hasTooltip() {
        return Boolean(odoo.debug) || this.tooltipHelp;
    }

    get tooltipHelp() {
        const field = this.props.record.fields[this.props.fieldName];
        let help = field.help || "";
        if (field.company_dependent && session.display_switch_company_menu) {
            help += (help ? "\n\n" : "") + this.env._t("Values set here are company-specific.");
        }
        return help;
    }
    get tooltipInfo() {
        if (!odoo.debug) {
            return JSON.stringify({
                field: {
                    help: this.tooltipHelp,
                },
            });
        }
        return getTooltipInfo({
            viewMode: "form",
            resModel: this.props.record.resModel,
            field: this.props.record.fields[this.props.fieldName],
            fieldInfo: this.props.fieldInfo,
            help: this.tooltipHelp,
        });
    }
}
FormLabel.template = "web.FormLabel";
<<<<<<< HEAD
=======
FormLabel.props = {
    fieldInfo: { type: Object },
    record: { type: Object },
    fieldName: { type: String },
    className: { type: String, optional: true },
    string: { type: String },
    id: { type: String },
    notMuttedLabel: { type: Boolean, optional: true },
};
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
