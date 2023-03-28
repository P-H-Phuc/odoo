/** @odoo-module */

<<<<<<< HEAD
    const Chrome = require('point_of_sale.Chrome');
    const Registries = require('point_of_sale.Registries');
    const { ConnectionLostError, ConnectionAbortedError } = require('@web/core/network/rpc_service')
    const { identifyError } = require('point_of_sale.utils');

    const PosFrCertChrome = (Chrome) =>
        class extends Chrome {
            async start() {
                await super.start();
                if (this.env.pos.is_french_country() && this.env.pos.pos_session.start_at) {
                    const now = Date.now();
                    let limitDate = new Date(this.env.pos.pos_session.start_at);
                    limitDate.setDate(limitDate.getDate() + 1);
                    if (limitDate < now) {
                        try {
                            const info = await this.env.pos.getClosePosInfo();
                            this.showPopup('ClosePosPopup', { info: info });
                        } catch (e) {
                            if (identifyError(e) instanceof ConnectionLostError||ConnectionAbortedError) {
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
                }
=======
import { Chrome } from "@point_of_sale/js/Chrome";
import { patch } from "@web/core/utils/patch";
import { ClosePosPopup } from "@point_of_sale/js/Popups/ClosePosPopup";

patch(Chrome.prototype, "l10n_fr_pos_cert.Chrome", {
    async start() {
        await this._super(...arguments);
        if (this.env.pos.is_french_country() && this.env.pos.pos_session.start_at) {
            const now = Date.now();
            const limitDate = new Date(this.env.pos.pos_session.start_at);
            limitDate.setDate(limitDate.getDate() + 1);
            if (limitDate.getTime() < now) {
                const info = await this.env.pos.getClosePosInfo();
                this.popup.add(ClosePosPopup, { info });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            }
        }
    },
});
