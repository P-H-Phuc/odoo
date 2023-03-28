/** @odoo-module **/

import { DatePicker } from "@web/core/datepicker/datepicker";
import { areDateEquals, formatDate, formatDateTime } from "@web/core/l10n/dates";
import { localization } from "@web/core/l10n/localization";
import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { standardFieldProps } from "../standard_field_props";

import { Component } from "@odoo/owl";

export class DateField extends Component {
<<<<<<< HEAD
=======
    static template = "web.DateField";
    static components = {
        DatePicker,
    };
    static props = {
        ...standardFieldProps,
        pickerOptions: { type: Object, optional: true },
        placeholder: { type: String, optional: true },
    };
    static defaultProps = {
        pickerOptions: {},
    };

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    setup() {
        /**
         * The last value that has been commited to the model.
         * Not changed in case of invalid field value.
         */
        this.lastSetValue = null;
    }
<<<<<<< HEAD
=======

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    get isDateTime() {
        return this.props.record.fields[this.props.name].type === "datetime";
    }
    get date() {
        return (
            this.props.record.data[this.props.name] &&
            this.props.record.data[this.props.name].startOf("day")
        );
    }

    get formattedValue() {
        return this.isDateTime
            ? formatDateTime(this.props.record.data[this.props.name], {
                  format: localization.dateFormat,
              })
            : formatDate(this.props.record.data[this.props.name]);
    }

    onDateTimeChanged(date) {
        if (!areDateEquals(this.date || "", date)) {
            this.props.record.update({ [this.props.name]: date });
        }
    }
    onDatePickerInput(ev) {
<<<<<<< HEAD
        this.props.setDirty(ev.target.value !== this.lastSetValue);
    }
    onUpdateInput(date) {
        this.props.setDirty(false);
=======
        this.props.record.model.bus.trigger(
            "FIELD_IS_DIRTY",
            ev.target.value !== this.lastSetValue
        );
    }
    onUpdateInput(date) {
        this.props.record.model.bus.trigger("FIELD_IS_DIRTY", false);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.lastSetValue = date;
    }
}

export const dateField = {
    component: DateField,
    displayName: _lt("Date"),
    supportedTypes: ["date", "datetime"],
    extractProps: ({ attrs, options }) => ({
        pickerOptions: options.datepicker,
        placeholder: attrs.placeholder,
    }),
};

registry.category("fields").add("date", dateField);
