/** @odoo-module */

import { PaymentScreen } from "@point_of_sale/js/Screens/PaymentScreen/PaymentScreen";
import { patch } from "@web/core/utils/patch";

<<<<<<< HEAD
    const PosHrPaymentScreen = (PaymentScreen_) =>
          class extends PaymentScreen_ {
              async _finalizeValidation() {
                  this.currentOrder.cashier = this.env.pos.get_cashier();
                  await super._finalizeValidation();
              }
          };

    Registries.Component.extend(PaymentScreen, PosHrPaymentScreen);

    return PaymentScreen;
=======
patch(PaymentScreen.prototype, "pos_hr.PaymentScreen", {
    async _finalizeValidation() {
        this.currentOrder.cashier = this.env.pos.get_cashier();
        await this._super(...arguments);
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
