<<<<<<< HEAD
odoo.define('pos_loyalty.PartnerLine', function (require) {
    'use strict';

    const PartnerLine = require('point_of_sale.PartnerLine');
    const Registries = require('point_of_sale.Registries');

    const PosLoyaltyPartnerLine = (PartnerLine) =>
        class extends PartnerLine {
            _getLoyaltyPointsRepr(loyaltyCard) {
                const program = this.env.pos.program_by_id[loyaltyCard.program_id];
                if (program.program_type === 'ewallet') {
                    return `${program.name}: ${this.env.pos.format_currency(loyaltyCard.balance)}`;
                }
                const balanceRepr = this.env.pos.format_pr(loyaltyCard.balance, 0.01);
                if (program.portal_visible) {
                    return `${balanceRepr} ${program.portal_point_name}`;
                }
                return _.str.sprintf(this.env._t('%s Points'), balanceRepr);
            }
        };

    Registries.Component.extend(PartnerLine, PosLoyaltyPartnerLine);

    return PartnerLine;
=======
/** @odoo-module */

import { PartnerLine } from "@point_of_sale/js/Screens/PartnerListScreen/PartnerLine";
import { patch } from "@web/core/utils/patch";

patch(PartnerLine.prototype, "pos_loyalty.PartnerLine", {
    _getLoyaltyPointsRepr(loyaltyCard) {
        const program = this.env.pos.program_by_id[loyaltyCard.program_id];
        if (program.program_type === "ewallet") {
            return `${program.name}: ${this.env.pos.format_currency(loyaltyCard.balance)}`;
        }
        const balanceRepr = this.env.pos.format_pr(loyaltyCard.balance, 0.01);
        if (program.portal_visible) {
            return `${balanceRepr} ${program.portal_point_name}`;
        }
        return _.str.sprintf(this.env._t("%s Points"), balanceRepr);
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
