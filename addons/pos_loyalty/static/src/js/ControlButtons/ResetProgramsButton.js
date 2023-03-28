/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { Component } from "@odoo/owl";

export class ResetProgramsButton extends Component {
    static template = "ResetProgramsButton";

    setup() {
        super.setup();
    }
    _isDisabled() {
        return !this.env.pos.get_order().isProgramsResettable();
    }
    click() {
        this.env.pos.get_order()._resetPrograms();
    }
}

ProductScreen.addControlButton({
    component: ResetProgramsButton,
    condition: function () {
<<<<<<< HEAD
        return this.env.pos.programs.some(p => ['coupons', 'promotion'].includes(p.program_type));
    }
=======
        return this.env.pos.programs.some((p) => ["coupons", "promotion"].includes(p.program_type));
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
