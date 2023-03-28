<<<<<<< HEAD
odoo.define('pos_loyalty.PartnerListScreen', function (require) {
    'use strict';

    const PartnerListScreen = require('point_of_sale.PartnerListScreen');
    const Registries = require('point_of_sale.Registries');

    const PosLoyaltyPartnerListScreen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            /**
             * Needs to be set to true to show the loyalty points in the partner list.
             * @override
             */
            get isBalanceDisplayed() {
                return true;
            }
        };

    Registries.Component.extend(PartnerListScreen, PosLoyaltyPartnerListScreen);

    return PartnerListScreen;
=======
/** @odoo-module */

import { PartnerListScreen } from "@point_of_sale/js/Screens/PartnerListScreen/PartnerListScreen";
import { patch } from "@web/core/utils/patch";

patch(PartnerListScreen.prototype, "pos_loyalty.PartnerListScreen", {
    /**
     * Needs to be set to true to show the loyalty points in the partner list.
     * @override
     */
    get isBalanceDisplayed() {
        return true;
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
