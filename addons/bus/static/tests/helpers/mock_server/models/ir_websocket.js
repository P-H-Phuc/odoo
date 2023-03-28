/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { MockServer } from "@web/../tests/helpers/mock_server";

patch(MockServer.prototype, 'bus/models/ir_websocket', {
    /**
     * Simulates `_update_presence` on `ir.websocket`.
     *
     * @param inactivityPeriod
     * @param imStatusIdsByModel
     */
     _mockIrWebsocket__updatePresence(inactivityPeriod, imStatusIdsByModel) {
        const imStatusNotifications = this._mockIrWebsocket__getImStatus(imStatusIdsByModel);
        if (Object.keys(imStatusNotifications).length > 0) {
<<<<<<< HEAD
            this._mockBusBus__sendone(this.currentPartnerId, 'bus/im_status', imStatusNotifications);
=======
            this._mockBusBus__sendone(this.currentPartnerId, 'mail.record/insert', imStatusNotifications);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    },
    /**
     * Simulates `_get_im_status` on `ir.websocket`.
     *
     * @param {Object} imStatusIdsByModel
     * @param {Number[]|undefined} res.partner ids of res.partners whose im_status
     * should be monitored.
     */
    _mockIrWebsocket__getImStatus(imStatusIdsByModel) {
        const imStatus = {};
        const { 'res.partner': partnerIds } = imStatusIdsByModel;
        if (partnerIds) {
<<<<<<< HEAD
            imStatus['partners'] = this.mockSearchRead('res.partner', [[['id', 'in', partnerIds]]], { context: { 'active_test': false }, fields: ['im_status'] })
=======
            imStatus['Partner'] = this.mockSearchRead('res.partner', [[['id', 'in', partnerIds]]], { context: { 'active_test': false }, fields: ['im_status'] })
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        return imStatus;
    },
});
