/** @odoo-module */

import { useCashierSelector } from "@pos_hr/js/SelectCashierMixin";
import { registry } from "@web/core/registry";
import { usePos } from "@point_of_sale/app/pos_hook";
import { Component } from "@odoo/owl";

<<<<<<< HEAD
    class LoginScreen extends SelectCashierMixin(PosComponent) {
        setup() {
            super.setup();
            useBarcodeReader({cashier: this.barcodeCashierAction}, true);
        }
        async selectCashier() {
            if (await super.selectCashier()) {
                this.back();
            }
        }
        async barcodeCashierAction(code) {
            if (await super.barcodeCashierAction(code) && this.env.pos.get_cashier().id) {
                this.back();
            }
        }
        back() {
            this.props.resolve({ confirmed: false, payload: false });
            this.trigger('close-temp-screen');
            this.env.pos.hasLoggedIn = true;
            this.env.posbus.trigger('start-cash-control');
        }
        confirm() {
            this.props.resolve({ confirmed: true, payload: true });
            this.trigger('close-temp-screen');
        }
        get shopName() {
            return this.env.pos.config.name;
        }
=======
export class LoginScreen extends Component {
    static template = "LoginScreen";
    setup() {
        super.setup(...arguments);
        this.selectCashier = useCashierSelector({
            onCashierChanged: () => this.back(),
            exclusive: true, // takes exclusive control on the barcode reader
        });
        this.pos = usePos();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    back() {
        this.props.resolve({ confirmed: false, payload: false });
        this.pos.closeTempScreen();
        this.env.pos.hasLoggedIn = true;
        this.pos.openCashControl();
    }

    get shopName() {
        return this.env.pos.config.name;
    }
}

registry.category("pos_screens").add("LoginScreen", LoginScreen);
