/** @odoo-module **/

import { OrderWidget } from "@point_of_sale/js/Screens/ProductScreen/OrderWidget";
import { patch } from "@web/core/utils/patch";

patch(OrderWidget.prototype, "pos_loyalty.OrderWidget", {
    getActiveProgramsAndRewards() {
        const order = this.env.pos.get_order();
        const activePrograms = Object.values(order.couponPointChanges).map(
            (pe) => this.env.pos.program_by_id[pe.program_id]
        );
        const seenRewards = new Set();
        const activeRewards = [];
        for (const line of order._get_reward_lines()) {
            const key = line.reward_id + "-" + line.coupon_id + "-" + line.reward_identifier_code;
            if (seenRewards.has(key)) {
                continue;
            }
            seenRewards.add(key);
            const dbCoupon = this.env.pos.couponCache[line.coupon_id];
            const couponCode = dbCoupon ? dbCoupon.code : false;
            activeRewards.push({
                id: line.cid,
                name: line.get_product().display_name,
                code: couponCode,
            });
<<<<<<< HEAD
            return {
                activePrograms: [...new Set(activePrograms)],
                activeCoupons,
                activeRewards,
            }
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        const activeCoupons = order.codeActivatedCoupons.map((coupon) => {
            const program = this.env.pos.program_by_id[coupon.program_id];
            return {
                programName: program.name,
                code: coupon.code,
            };
        });
        return {
            activePrograms: [...new Set(activePrograms)],
            activeCoupons,
            activeRewards,
        };
    },
});
