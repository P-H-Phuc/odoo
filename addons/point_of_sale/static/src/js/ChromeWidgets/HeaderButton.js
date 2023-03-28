/** @odoo-module */

<<<<<<< HEAD
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { ConnectionLostError, ConnectionAbortedError } = require('@web/core/network/rpc_service')
    const { identifyError } = require('point_of_sale.utils');

    // Previously HeaderButtonWidget
    // This is the close session button
    class HeaderButton extends PosComponent {
        async onClick() {
            try {
                const info = await this.env.pos.getClosePosInfo();
                this.showPopup('ClosePosPopup', { info: info, keepBehind: true });
            } catch (e) {
                if (identifyError(e) instanceof ConnectionAbortedError||ConnectionLostError) {
                    this.showPopup('OfflineErrorPopup', {
                        title: this.env._t('Network Error'),
                        body: this.env._t('Please check your internet connection and try again.'),
                    });
                } else {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Unknown Error'),
                        body: this.env._t('An unknown error prevents us from getting closing information.'),
                    });
                }
            }
        }
=======
import { useService } from "@web/core/utils/hooks";
import { ClosePosPopup } from "@point_of_sale/js/Popups/ClosePosPopup";
import { Component } from "@odoo/owl";

// Previously HeaderButtonWidget
// This is the close session button
export class HeaderButton extends Component {
    static template = "HeaderButton";

    setup() {
        super.setup(...arguments);
        this.popup = useService("popup");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    async onClick() {
        const info = await this.env.pos.getClosePosInfo();
        this.popup.add(ClosePosPopup, { info: info, keepBehind: true });
    }
}
