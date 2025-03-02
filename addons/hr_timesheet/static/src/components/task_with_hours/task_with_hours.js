/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
=======
import { Many2OneField, many2OneField } from "@web/views/fields/many2one/many2one_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6


class TaskWithHours extends Many2OneField {

    get canCreate() {
        return Boolean(this.context.default_project_id);
    }

    /**
     * @override
     */
    get displayName() {
        const displayName = super.displayName;
        return displayName ? displayName.split('\u00A0')[0] : displayName;
    }

    /**
     * @override
     */
    get context() {
        return {...super.context, hr_timesheet_display_remaining_hours: true};
    }

    /**
     * @override
     */
    get Many2XAutocompleteProps() {
        const props = super.Many2XAutocompleteProps;
        if (!this.canCreate) {
            props.quickCreate = null;
        }
        return props;
    }

    /**
     * @override
     */
    computeActiveActions(props) {
        super.computeActiveActions(props);
        const activeActions = this.state.activeActions;
        activeActions.create = activeActions.create && this.canCreate;
        activeActions.createEdit = activeActions.create;
    }

}

<<<<<<< HEAD
registry.category("fields").add("task_with_hours", TaskWithHours);
=======
registry.category("fields").add("task_with_hours", {
    ...many2OneField,
    component: TaskWithHours,
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
