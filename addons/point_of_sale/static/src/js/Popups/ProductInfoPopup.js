/** @odoo-module */

import { AbstractAwaitablePopup } from "@point_of_sale/js/Popups/AbstractAwaitablePopup";

<<<<<<< HEAD
    /**
     * Props:
     *  {
     *      info: {object of data}
     *  }
     */
    class ProductInfoPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            Object.assign(this, this.props.info);
        }
        searchProduct(productName) {
            this.env.posbus.trigger('search-product-from-info-popup', productName);
            this.cancel()
        }
        _hasMarginsCostsAccessRights() {
            const isAccessibleToEveryUser = this.env.pos.config.is_margins_costs_accessible_to_every_user;
            const isCashierManager = this.env.pos.get_cashier().role === 'manager';
            return isAccessibleToEveryUser || isCashierManager;
        }
=======
/**
 * Props:
 *  {
 *      info: {object of data}
 *  }
 */
export class ProductInfoPopup extends AbstractAwaitablePopup {
    static template = "ProductInfoPopup";
    static defaultProps = { confirmKey: false };

    setup() {
        super.setup();
        Object.assign(this, this.props.info);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
    searchProduct(productName) {
        this.env.pos.setSelectedCategoryId(0);
        this.env.pos.searchProductWord = productName;
        this.cancel();
    }
    _hasMarginsCostsAccessRights() {
        const isAccessibleToEveryUser =
            this.env.pos.config.is_margins_costs_accessible_to_every_user;
        const isCashierManager = this.env.pos.get_cashier().role === "manager";
        return isAccessibleToEveryUser || isCashierManager;
    }
}
