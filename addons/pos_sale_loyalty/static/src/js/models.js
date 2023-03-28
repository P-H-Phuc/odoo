/** @odoo-module alias=pos_sale_loyalty.models **/


import { Orderline } from '@point_of_sale/js/models';
import { patch } from "@web/core/utils/patch";

patch(Orderline.prototype, "pos_sale_loyalty.Orderline", {
    //@override
    ignoreLoyaltyPoints(args) {
        if (this.sale_order_origin_id) {
            return true;
        }
<<<<<<< HEAD
        return super.ignoreLoyaltyPoints(args);
    }
=======
        return this._super(args);
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    //@override
    setQuantityFromSOL(saleOrderLine) {
        // we need to consider reward product such as discount in a quotation
        if (saleOrderLine.reward_id) {
            this.set_quantity(saleOrderLine.product_uom_qty);
        } else {
            this._super(...arguments);
        }
    },
});
