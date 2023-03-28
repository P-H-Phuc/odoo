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

class  StockRescheculingPopoverComponent extends PopoverComponent {
    setup(){
        this.action = useService("action");
    }

    openElement(ev){
        this.action.doAction({
            res_model: ev.currentTarget.getAttribute('element-model'),
            res_id: parseInt(ev.currentTarget.getAttribute('element-id')),
            views: [[false, "form"]],
            type: "ir.actions.act_window",
            view_mode: "form",
        });
    }
}

class StockRescheculingPopover extends PopoverWidgetField {
    setup(){
        super.setup();
        this.color = this.jsonValue.color || 'text-danger';
        this.icon = this.jsonValue.icon || 'fa-exclamation-triangle';
    }

    showPopup(ev){
        if (!this.jsonValue.late_elements){
            return;
        }
        super.showPopup(ev);
    }
}
StockRescheculingPopover.components = {
    Popover: StockRescheculingPopoverComponent
}

<<<<<<< HEAD
registry.category("fields").add("stock_rescheduling_popover", StockRescheculingPopover);
=======
registry.category("fields").add("stock_rescheduling_popover", {
    ...popoverWidgetField,
    component: StockRescheculingPopover,
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
