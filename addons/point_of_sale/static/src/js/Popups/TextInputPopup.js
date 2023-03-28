/** @odoo-module */

import { AbstractAwaitablePopup } from "@point_of_sale/js/Popups/AbstractAwaitablePopup";
import { _lt } from "@web/core/l10n/translation";
import { onMounted, useRef, useState } from "@odoo/owl";

<<<<<<< HEAD
    const { onMounted, useRef, useState } = owl;

    // formerly TextInputPopupWidget
    class TextInputPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            this.state = useState({ inputValue: this.props.startingValue });
            this.inputRef = useRef('input');
            onMounted(this.onMounted);
        }
        onMounted() {
            this.inputRef.el.focus();
        }
        getPayload() {
            return this.state.inputValue;
        }
    }
    TextInputPopup.template = 'TextInputPopup';
    TextInputPopup.defaultProps = {
        confirmText: _lt('Ok'),
        cancelText: _lt('Cancel'),
        title: '',
        body: '',
        startingValue: '',
        placeholder: '',
=======
// formerly TextInputPopupWidget
export class TextInputPopup extends AbstractAwaitablePopup {
    static template = "TextInputPopup";
    static defaultProps = {
        confirmText: _lt("Confirm"),
        cancelText: _lt("Discard"),
        title: "",
        body: "",
        startingValue: "",
        placeholder: "",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    };

    setup() {
        super.setup();
        this.state = useState({ inputValue: this.props.startingValue });
        this.inputRef = useRef("input");
        onMounted(this.onMounted);
    }
    onMounted() {
        this.inputRef.el.focus();
    }
    getPayload() {
        return this.state.inputValue;
    }
}
