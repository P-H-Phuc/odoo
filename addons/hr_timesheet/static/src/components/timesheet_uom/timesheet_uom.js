/** @odoo-module */

import { useService } from "@web/core/utils/hooks";
<<<<<<< HEAD
import { session } from "@web/session";
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { registry } from "@web/core/registry";
import { FloatFactorField } from "@web/views/fields/float_factor/float_factor_field";
import { FloatToggleField } from "@web/views/fields/float_toggle/float_toggle_field";
import { FloatTimeField } from "@web/views/fields/float_time/float_time_field";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

<<<<<<< HEAD
const { Component } = owl;


export class TimesheetUOM extends Component {

    setup() {
        this.companyService = useService("company");
    }

    get timesheetUOMId() {
        return this.companyService.currentCompany.timesheet_uom_id;
    }

    get timesheetWidget() {
        let timesheet_widget = "float_factor";
        if (this.timesheetUOMId in session.uom_ids) {
            timesheet_widget = session.uom_ids[this.timesheetUOMId].timesheet_widget;
        }
        return timesheet_widget;
    }

    get timesheetComponent() {
        return registry.category("fields").get(this.timesheetWidget, FloatFactorField);
    }

    get timesheetComponentProps() {
        const factorDependantComponents = ["float_toggle", "float_factor"];
        return factorDependantComponents.includes(this.timesheetWidget) ? this.FactorCompanyDependentProps : this.props;
    }

    get FactorCompanyDependentProps() {
        const factor = this.companyService.currentCompany.timesheet_uom_factor || this.props.factor;
        return { ...this.props, factor };
    }

}

TimesheetUOM.props = {
    ...standardFieldProps,
};

TimesheetUOM.template = "hr_timesheet.TimesheetUOM";

TimesheetUOM.components = { FloatFactorField, FloatToggleField, FloatTimeField };

registry.category("fields").add("timesheet_uom", TimesheetUOM);
=======
import { Component } from "@odoo/owl";

export class TimesheetUOM extends Component {
    static props = {
        ...standardFieldProps,
    };

    static template = "hr_timesheet.TimesheetUOM";

    static components = { FloatFactorField, FloatToggleField, FloatTimeField };

    setup() {
        this.timesheetUOMService = useService("timesheet_uom");
    }

    get timesheetComponent() {
        return this.timesheetUOMService.getTimesheetComponent();
    }

    get timesheetComponentProps() {
        return this.timesheetUOMService.getTimesheetComponentProps(this.props);
    }
}

export const timesheetUOM = {
    component: TimesheetUOM,
};

registry.category("fields").add("timesheet_uom", timesheetUOM);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
