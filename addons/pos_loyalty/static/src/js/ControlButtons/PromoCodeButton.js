/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { useService } from "@web/core/utils/hooks";
import { TextInputPopup } from "@point_of_sale/js/Popups/TextInputPopup";
import { Component } from "@odoo/owl";

export class PromoCodeButton extends Component {
    static template = "PromoCodeButton";

    setup() {
        super.setup();
        this.popup = useService("popup");
    }

<<<<<<< HEAD
    async onClick() {
        let { confirmed, payload: code } = await this.showPopup('TextInputPopup', {
            title: this.env._t('Enter Code'),
            startingValue: '',
            placeholder: this.env._t('Gift card or Discount code'),
        });
        if (confirmed) {
            code = code.trim();
            if (code !== '') {
=======
    async click() {
        let { confirmed, payload: code } = await this.popup.add(TextInputPopup, {
            title: this.env._t("Enter Code"),
            startingValue: "",
            placeholder: this.env._t("Gift card or Discount code"),
        });
        if (confirmed) {
            code = code.trim();
            if (code !== "") {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                this.env.pos.get_order().activateCode(code);
            }
        }
    }
}

ProductScreen.addControlButton({
    component: PromoCodeButton,
    condition: function () {
<<<<<<< HEAD
        return this.env.pos.programs.some(p => ['coupons', 'promotion', 'gift_card', 'promo_code'].includes(p.program_type));
    }
=======
        return this.env.pos.programs.some((p) =>
            ["coupons", "promotion", "gift_card", "promo_code"].includes(p.program_type)
        );
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
