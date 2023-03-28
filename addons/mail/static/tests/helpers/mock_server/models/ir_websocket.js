/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { MockServer } from "@web/../tests/helpers/mock_server";

// ensure bus override is applied first.
import "@bus/../tests/helpers/mock_server";

<<<<<<< HEAD
patch(MockServer.prototype, 'mail/models/ir_websocket', {
=======
patch(MockServer.prototype, "mail/models/ir_websocket", {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    /**
     * Simulates `_get_im_status` on `ir.websocket`.
     *
     * @param {Object} imStatusIdsByModel
     * @param {Number[]|undefined} mail.guest ids of mail.guest whose im_status
     * should be monitored.
     */
    _mockIrWebsocket__getImStatus(imStatusIdsByModel) {
        const imStatus = this._super(imStatusIdsByModel);
<<<<<<< HEAD
        const { 'mail.guest': guestIds } = imStatusIdsByModel;
        if (guestIds) {
            imStatus['guests'] = this.pyEnv['mail.guest'].searchRead([['id', 'in', guestIds]], { context: { 'active_test': false }, fields: ['im_status'] });
=======
        const { "mail.guest": guestIds } = imStatusIdsByModel;
        if (guestIds) {
            imStatus["Guest"] = this.pyEnv["mail.guest"].searchRead([["id", "in", guestIds]], {
                context: { active_test: false },
                fields: ["im_status"],
            });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        return imStatus;
    },
});
