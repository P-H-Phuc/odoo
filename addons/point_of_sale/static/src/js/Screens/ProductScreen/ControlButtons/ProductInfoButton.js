/** @odoo-module */

<<<<<<< HEAD
    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require('point_of_sale.Registries');
    const { ConnectionLostError, ConnectionAbortedError } = require('@web/core/network/rpc_service')
    const { identifyError } = require('point_of_sale.utils');

    class ProductInfoButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick() {
            const orderline = this.env.pos.get_order().get_selected_orderline();
            if (orderline) {
                const product = orderline.get_product();
                const quantity = orderline.get_quantity();
                try {
                    const info = await this.env.pos.getProductInfo(product, quantity);
                    this.showPopup('ProductInfoPopup', { info: info , product: product });
                } catch (e) {
                    if (identifyError(e) instanceof ConnectionLostError||ConnectionAbortedError) {
                        this.showPopup('OfflineErrorPopup', {
                            title: this.env._t('Network Error'),
                            body: this.env._t('Cannot access product information screen if offline.'),
                        });
                    } else {
                        this.showPopup('ErrorPopup', {
                            title: this.env._t('Unknown error'),
                            body: this.env._t('An unknown error prevents us from loading product information.'),
                        });
                    }
                }
            }
=======
import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { useService } from "@web/core/utils/hooks";
import { ProductInfoPopup } from "@point_of_sale/js/Popups/ProductInfoPopup";
import { Component } from "@odoo/owl";

export class ProductInfoButton extends Component {
    static template = "ProductInfoButton";

    setup() {
        super.setup();
        this.popup = useService("popup");
    }
    async click() {
        const orderline = this.env.pos.get_order().get_selected_orderline();
        if (orderline) {
            const product = orderline.get_product();
            const quantity = orderline.get_quantity();
            const info = await this.env.pos.getProductInfo(product, quantity);
            this.popup.add(ProductInfoPopup, { info: info, product: product });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    }
}

ProductScreen.addControlButton({
    component: ProductInfoButton,
    position: ["before", "SetFiscalPositionButton"],
});
