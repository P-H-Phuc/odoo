/** @odoo-module */

import { OrderReceipt } from "@point_of_sale/js/Screens/ReceiptScreen/OrderReceipt";
import { patch } from "@web/core/utils/patch";

<<<<<<< HEAD
    const OrderReceiptGCC = OrderReceipt =>
        class extends OrderReceipt {

            get receiptEnv() {
                let receipt_render_env = super.receiptEnv;
                let receipt = receipt_render_env.receipt;
                const country = receipt_render_env.order.pos.company.country;
                receipt.is_gcc_country =  country ? ['SA', 'AE', 'BH', 'OM', 'QA', 'KW'].includes(country && country.code) : false;
                return receipt_render_env;
            }
        }
    Registries.Component.extend(OrderReceipt, OrderReceiptGCC)
    return OrderReceiptGCC
=======
patch(OrderReceipt.prototype, "l10n_gcc_pos.OrderReceipt", {
    get receiptEnv() {
        const receipt_render_env = this._super(...arguments);
        const receipt = receipt_render_env.receipt;
        const country = receipt_render_env.order.pos.company.country;
        receipt.is_gcc_country =  country ? ["SA", "AE", "BH", "OM", "QA", "KW"].includes(country && country.code) : false;
        return receipt_render_env;
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
