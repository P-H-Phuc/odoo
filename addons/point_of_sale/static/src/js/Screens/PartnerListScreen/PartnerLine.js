/** @odoo-module */

import { Component } from "@odoo/owl";

<<<<<<< HEAD
    class PartnerLine extends PosComponent {
        get highlight() {
            return this._isPartnerSelected ? 'highlight' : '';
        }
        get shortAddress() {
            const { partner } = this.props;
            return partner.address;
        }
        get _isPartnerSelected() {
            return this.props.partner === this.props.selectedPartner;
        }
=======
export class PartnerLine extends Component {
    static template = "PartnerLine";

    get highlight() {
        return this._isPartnerSelected ? "highlight" : "";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
    get _isPartnerSelected() {
        return this.props.partner === this.props.selectedPartner;
    }
}
