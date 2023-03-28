/** @odoo-module **/

import { OrderSummary } from "@point_of_sale/js/Screens/ProductScreen/OrderSummary";
import { patch } from "@web/core/utils/patch";

<<<<<<< HEAD
export const PosLoyaltyOrderSummary = (OrderSummary) => 
    class PosLoyaltyOrderSummary extends OrderSummary {
        getLoyaltyPoints() {
            const order = this.env.pos.get_order();
            return order.getLoyaltyPoints();
        }
    };

Registries.Component.extend(OrderSummary, PosLoyaltyOrderSummary)
=======
patch(OrderSummary.prototype, "pos_loyalty.OrderSummary", {
    getLoyaltyPoints() {
        const order = this.env.pos.get_order();
        return order.getLoyaltyPoints();
    },
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
