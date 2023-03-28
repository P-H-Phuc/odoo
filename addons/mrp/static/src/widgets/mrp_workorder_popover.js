/** @odoo-module */
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { PopoverComponent, PopoverWidgetField } from '@stock/widgets/popover_widget';
=======
import {
    PopoverComponent,
    PopoverWidgetField,
    popoverWidgetField,
} from "@stock/widgets/popover_widget";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * Link to a Char field representing a JSON:
 * {
 *  'replan': <REPLAN_BOOL>, // Show the replan btn
 *  'color': '<COLOR_CLASS>', // Color Class of the icon (d-none to hide)
 *  'infos': [
 *      {'msg' : '<MESSAGE>', 'color' : '<COLOR_CLASS>'},
 *      {'msg' : '<MESSAGE>', 'color' : '<COLOR_CLASS>'},
 *      ... ]
 * }
 */

class WorkOrderPopover extends PopoverComponent {
    setup(){
        this.orm = useService("orm");
    }

    async onReplanClick() {
        await this.orm.call(
            'mrp.workorder',
            'action_replan',
            [this.props.record.resId]
        );
        await this.props.record.model.load();
    }
};

class WorkOrderPopoverField extends PopoverWidgetField {};

WorkOrderPopoverField.components = {
    Popover: WorkOrderPopover
};

<<<<<<< HEAD
registry.category("fields").add("mrp_workorder_popover", WorkOrderPopoverField);
=======
registry.category("fields").add("mrp_workorder_popover", {
    ...popoverWidgetField,
    component: WorkOrderPopoverField,
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
