/** @odoo-module */

import { registry } from "@web/core/registry";

<<<<<<< HEAD
import { TimesheetUOM } from "../timesheet_uom/timesheet_uom";


export class TimesheetUOMNoToggle extends TimesheetUOM {

    get timesheetWidget() {
        const timesheetWidget = super.timesheetWidget;
        return timesheetWidget !== "float_toggle" ? timesheetWidget : "float_factor";
    }

=======
import { TimesheetUOM, timesheetUOM } from "../timesheet_uom/timesheet_uom";

export class TimesheetUOMNoToggle extends TimesheetUOM {
    get timesheetComponent() {
        if (this.timesheetUOMService.timesheetWidget === "float_toggle") {
            return this.timesheetUOMService.getTimesheetComponent("float_factor");
        }
        return super.timesheetComponent;
    }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
}

// As FloatToggleField won't be used by TimesheetUOMNoToggle, we remove it from the components that we get from TimesheetUOM.
delete TimesheetUOMNoToggle.components.FloatToggleField;

<<<<<<< HEAD
registry.category("fields").add("timesheet_uom_no_toggle", TimesheetUOMNoToggle);
=======
export const timesheetUOMNoToggle = {
    ...timesheetUOM,
    component: TimesheetUOMNoToggle,
};

registry.category("fields").add("timesheet_uom_no_toggle", timesheetUOMNoToggle);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
