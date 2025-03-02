/** @odoo-module **/

import { Orderline } from "@point_of_sale/js/Screens/ProductScreen/Orderline";
import { patch } from "@web/core/utils/patch";

patch(Orderline.prototype, "pos_loyalty.Orderline", {
    get addedClasses() {
        return Object.assign(
            { "program-reward": this.props.line.is_reward_line },
            this._super(...arguments)
        );
    },
    _isGiftCardOrEWalletReward() {
        const coupon = this.env.pos.couponCache[this.props.line.coupon_id];
        if (coupon) {
            const program = this.env.pos.program_by_id[coupon.program_id];
            return (
                ["ewallet", "gift_card"].includes(program.program_type) &&
                this.props.line.is_reward_line
            );
        }
<<<<<<< HEAD
        _isGiftCardOrEWalletReward() {
            const coupon = this.env.pos.couponCache[this.props.line.coupon_id];
            if (coupon) {
                const program = this.env.pos.program_by_id[coupon.program_id]
                return ['ewallet', 'gift_card'].includes(program.program_type) && this.props.line.is_reward_line;
            }
            return false;
        }
        _getGiftCardOrEWalletBalance() {
            const coupon = this.env.pos.couponCache[this.props.line.coupon_id];
            if (coupon) {
                return this.env.pos.format_currency(coupon.balance);
            }
            return this.env.pos.format_currency(0);
        }
    };

Registries.Component.extend(Orderline, PosLoyaltyOrderline);
=======
        return false;
    },
    _getGiftCardOrEWalletBalance() {
        const coupon = this.env.pos.couponCache[this.props.line.coupon_id];
        if (coupon) {
            return this.env.pos.format_currency(coupon.balance);
        }
        return this.env.pos.format_currency(0);
    },
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
