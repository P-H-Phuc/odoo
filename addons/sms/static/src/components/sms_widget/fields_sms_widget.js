/** @odoo-module **/

<<<<<<< HEAD
import basic_fields from 'web.basic_fields';
import { patch } from "@web/core/utils/patch";
import { EmojisTextField} from '@mail/views/fields/emojis_text_field/emojis_text_field';
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

const DynamicPlaceholderFieldMixin = basic_fields.DynamicPlaceholderFieldMixin;
=======
import {
    EmojisTextField,
    emojisTextField,
} from "@mail/views/fields/emojis_text_field/emojis_text_field";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
/**
 * SmsWidget is a widget to display a textarea (the body) and a text representing
 * the number of SMS and the number of characters. This text is computed every
 * time the user changes the body.
 */
export class SmsWidget extends EmojisTextField {
    setup() {
        super.setup();
<<<<<<< HEAD
=======
        this._emojiAdded = () => this.props.record.update({ [this.props.name]: this.targetEditElement.el.value });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.notification = useService('notification');
    }

    get encoding() {
<<<<<<< HEAD
        return this._extractEncoding(this.props.value || '');
    }
    get nbrChar() {
        const content = this.props.value || '';
=======
        return this._extractEncoding(this.props.record.data[this.props.name] || '');
    }
    get nbrChar() {
        const content = this.props.record.data[this.props.name] || '';
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return content.length + (content.match(/\n/g) || []).length;
    }
    get nbrSMS() {
        return this._countSMS(this.nbrChar, this.encoding);
    }

<<<<<<< HEAD
    /**
     * Open a Model Field Selector in order to select fields
     * and create a dynamic placeholder string with or without
     * a default text value.
     *
     * @public
     * @param {String} baseModel
     * @param {Array} chain
     *
     */
    async openDynamicPlaceholder(baseModel, chain = []) {
        const modelSelector = await this._openNewModelSelector(baseModel, chain);
        modelSelector.$el.css('margin-top', 4);
    }

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    //--------------------------------------------------------------------------
    // Private: SMS
    //--------------------------------------------------------------------------

    /**
     * Count the number of SMS of the content
     * @private
     * @returns {integer} Number of SMS
     */
    _countSMS(nbrChar, encoding) {
        if (nbrChar === 0) {
            return 0;
        }
        if (encoding === 'UNICODE') {
            if (nbrChar <= 70) {
                return 1;
            }
            return Math.ceil(nbrChar / 67);
        }
        if (nbrChar <= 160) {
            return 1;
        }
        return Math.ceil(nbrChar / 153);
    }

    /**
     * Extract the encoding depending on the characters in the content
     * @private
     * @param {String} content Content of the SMS
     * @returns {String} Encoding of the content (GSM7 or UNICODE)
     */
    _extractEncoding(content) {
        if (String(content).match(RegExp("^[@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà]*$"))) {
            return 'GSM7';
        }
        return 'UNICODE';
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @override
     * @private
     */
    async onBlur() {
<<<<<<< HEAD
        var content = this.props.value || '';
=======
        var content = this.props.record.data[this.props.name] || '';
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if( !content.trim().length && content.length > 0) {
            this.notification.add(
                this.env._t("Your SMS Text Message must include at least one non-whitespace character"),
                { type: 'danger' },
            )
<<<<<<< HEAD
            await this.props.update(content.trim());
=======
            await this.props.record.update({ [this.props.name]: content.trim() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    }

    /**
     * @override
     * @private
     */
    async onInput(ev) {
<<<<<<< HEAD
        await this.props.update(this.targetEditElement.el.value);
        super.onInput(...arguments);
        const key = ev.originalEvent ? ev.originalEvent.data : '';
        if (this.props.dynamicPlaceholder && key === this.DYNAMIC_PLACEHOLDER_TRIGGER_KEY) {
            const baseModel = this.recordData && this.recordData.mailing_model_real ? this.recordData.mailing_model_real : undefined;
            if (baseModel) {
                this.openDynamicPlaceholder(baseModel);
            }
        }
    }
};
SmsWidget.template = 'sms.SmsWidget';
SmsWidget.additionalClasses = [...(EmojisTextField.additionalClasses || []), 'o_field_text'];
patch(SmsWidget.prototype, 'sms_widget_dynamic_placeholder_field_mixin', DynamicPlaceholderFieldMixin);
registry.category("fields").add("sms_widget", SmsWidget);
=======
        super.onInput(...arguments);
        await this.props.record.update({ [this.props.name]: this.targetEditElement.el.value });
    }
}
SmsWidget.template = 'sms.SmsWidget';

export const smsWidget = {
    ...emojisTextField,
    component: SmsWidget,
    additionalClasses: [
        ...(emojisTextField.additionalClasses || []),
        "o_field_text",
        "o_field_text_emojis",
    ],
};

registry.category("fields").add("sms_widget", smsWidget);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
