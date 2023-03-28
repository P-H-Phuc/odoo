/** @odoo-module **/

import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { useBus, useService } from "@web/core/utils/hooks";

<<<<<<< HEAD
import { Component } from "@odoo/owl";
=======
import { Component, EventBus } from "@odoo/owl";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class ProfilingItem extends Component {
    setup() {
        this.profiling = useService("profiling");
        useBus(this.props.bus, "UPDATE", this.render);
    }

    changeParam(param, ev) {
        this.profiling.setParam(param, ev.target.value);
    }
    toggleParam(param) {
        const value = this.profiling.state.params.execution_context_qweb;
        this.profiling.setParam(param, !value);
    }
    openProfiles() {
        if (this.env.services.action) {
            // using doAction in the backend to preserve breadcrumbs and stuff
            this.env.services.action.doAction("base.action_menu_ir_profile");
        } else {
            // No action service means we are in the frontend.
            window.location = "/web/#action=base.action_menu_ir_profile";
        }
    }
}
ProfilingItem.components = { DropdownItem };
ProfilingItem.template = "web.DebugMenu.ProfilingItem";
ProfilingItem.props = {
    bus: { type: EventBus },
};
