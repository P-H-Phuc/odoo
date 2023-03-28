/** @odoo-module */

import { usePos } from "@point_of_sale/app/pos_hook";
import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { Component } from "@odoo/owl";

<<<<<<< HEAD
    class PrintBillButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick() {
            const order = this.env.pos.get_order();
            if (order.get_orderlines().length > 0) {
                order.initialize_validation_date();
                await this.showTempScreen('BillScreen');
            } else {
                await this.showPopup('ErrorPopup', {
                    title: this.env._t('Nothing to Print'),
                    body: this.env._t('There are no order lines'),
                });
            }
        }
=======
export class PrintBillButton extends Component {
    static template = "PrintBillButton";

    setup() {
        super.setup();
        this.pos = usePos();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
    _isDisabled() {
        const order = this.env.pos.get_order();
        return order.get_orderlines().length === 0;
    }
    click() {
        this.pos.showTempScreen("BillScreen");
    }
}

ProductScreen.addControlButton({
    component: PrintBillButton,
    condition: function () {
        return this.env.pos.config.iface_printbill;
    },
});
