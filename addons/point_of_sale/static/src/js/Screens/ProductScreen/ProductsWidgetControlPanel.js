/** @odoo-module */

import { debounce } from "@web/core/utils/timing";
import { usePos } from "@point_of_sale/app/pos_hook";

import { CategoryButton } from "./CategoryButton";

import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

<<<<<<< HEAD
            onMounted(() => {
                this.env.posbus.on('search-product-from-info-popup', this, this.searchProductFromInfo)
            });

            onWillUnmount(() => {
                this.env.posbus.off('search-product-from-info-popup', this);
            });
        }
        _clearSearch() {
            this.searchWordInput.el.value = '';
            this.trigger('clear-search');
        }
        get displayCategImages() {
            return Object.values(this.env.pos.db.category_by_id).some(categ => categ.has_image) && !this.env.isMobile;
        }
        updateSearch(event) {
            this.trigger('update-search', event.target.value);
            if (event.key === 'Enter') {
                this._onPressEnterKey()
            }
        }
        async _onPressEnterKey() {
            if (!this.searchWordInput.el.value) return;
            const result = await this.loadProductFromDB();
            this.showNotification(
                _.str.sprintf(
                    this.env._t('%s product(s) found for "%s".'),
                    result.length,
                    this.searchWordInput.el.value
                ),
                3000
            );
        }
        searchProductFromInfo(productName) {
            this.searchWordInput.el.value = productName;
            this.trigger('switch-category', 0);
            this.trigger('update-search', productName);
        }
        _toggleMobileSearchbar() {
            this.trigger('toggle-mobile-searchbar');
        }
        async loadProductFromDB() {
            if(!this.searchWordInput.el.value)
                return;

            try {
                let ProductIds = await this.rpc({
                    model: 'product.product',
                    method: 'search',
                    args: [['&',['available_in_pos', '=', true], '|','|',
                     ['name', 'ilike', this.searchWordInput.el.value],
                     ['default_code', 'ilike', this.searchWordInput.el.value],
                     ['barcode', 'ilike', this.searchWordInput.el.value]]],
                    context: this.env.session.user_context,
                });
                if(ProductIds.length) {
                    await this.env.pos._addProducts(ProductIds, false);
                }
                this.trigger('update-product-list');
                return ProductIds;
            } catch (error) {
                const identifiedError = identifyError(error)
                if (identifiedError instanceof ConnectionLostError || identifiedError instanceof ConnectionAbortedError) {
                    return this.showPopup('OfflineErrorPopup', {
                        title: this.env._t('Network Error'),
                        body: this.env._t("Product is not loaded. Tried loading the product from the server but there is a network error."),
                    });
                } else {
                    throw error;
                }
            }
=======
export class ProductsWidgetControlPanel extends Component {
    static components = { CategoryButton };
    static template = "ProductsWidgetControlPanel";

    setup() {
        super.setup();
        this.pos = usePos();
        this.notification = useService("pos_notification");
        this.orm = useService("orm");
        this.updateSearch = debounce(this.updateSearch, 100);
        this.state = useState({ mobileSearchBarIsShown: false });
    }
    toggleMobileSearchBar() {
        this.state.mobileSearchBarIsShown = !this.state.mobileSearchBarIsShown;
    }
    _clearSearch() {
        this.env.pos.searchProductWord = "";
        this.props.clearSearch();
    }
    get displayCategImages() {
        return (
            Object.values(this.env.pos.db.category_by_id).some((categ) => categ.has_image) &&
            !this.env.isMobile
        );
    }
    updateSearch(event) {
        this.props.updateSearch(this.env.pos.searchProductWord);
        if (event.key === "Enter") {
            this._onPressEnterKey();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    }
    async _onPressEnterKey() {
        if (!this.env.pos.searchProductWord) {
            return;
        }
        const result = await this.loadProductFromDB();
        this.notification.add(
            _.str.sprintf(
                this.env._t('%s product(s) found for "%s".'),
                result.length,
                this.env.pos.searchProductWord
            ),
            3000
        );
    }
    searchProductFromInfo(productName) {
        this.env.pos.searchProductWord = productName;
        this.props.switchCategory(0);
        this.props.updateSearch(productName);
    }
    async loadProductFromDB() {
        if (!this.env.pos.searchProductWord) {
            return;
        }

        const ProductIds = await this.orm.search("product.product", [
            "&",
            ["available_in_pos", "=", true],
            "|",
            "|",
            ["name", "ilike", this.env.pos.searchProductWord],
            ["default_code", "ilike", this.env.pos.searchProductWord],
            ["barcode", "ilike", this.env.pos.searchProductWord],
        ]);
        if (ProductIds.length) {
            await this.env.pos._addProducts(ProductIds, false);
        }
        this.props.updateProductList();
        return ProductIds;
    }
}
