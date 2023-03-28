/** @odoo-module **/

<<<<<<< HEAD
import { TextField } from "@web/views/fields/text/text_field";
import { patch } from "@web/core/utils/patch";
import MailEmojisMixin from '@mail/js/emojis_mixin';
import { EmojisDropdown } from '@mail/js/emojis_dropdown';
import { EmojisFieldCommon } from '@mail/views/fields/emojis_field_common';
=======
import { TextField, textField } from "@web/views/fields/text/text_field";
import { patch } from "@web/core/utils/patch";
import MailEmojisMixin from "@mail/js/emojis_mixin";
import { EmojisFieldCommon } from "@mail/views/fields/emojis_field_common/emojis_field_common";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { registry } from "@web/core/registry";

/**
 * Extension of the FieldText that will add emojis support
 */
export class EmojisTextField extends TextField {
    setup() {
        super.setup();
        this.targetEditElement = this.textareaRef;
        this._setupOverride();
    }
<<<<<<< HEAD
};

patch(EmojisTextField.prototype, 'emojis_text_field_mail_mixin', MailEmojisMixin);
patch(EmojisTextField.prototype, 'emojis_text_field_field_mixin', EmojisFieldCommon);
EmojisTextField.template = 'mail.EmojisTextField';
EmojisTextField.components = { ...TextField.components, EmojisDropdown };
EmojisTextField.additionalClasses = [...(TextField.additionalClasses || []), 'o_field_text'];
registry.category("fields").add("text_emojis", EmojisTextField);
=======
}

patch(EmojisTextField.prototype, "emojis_char_field_mail_mixin", MailEmojisMixin);
patch(EmojisTextField.prototype, "emojis_text_field_field_mixin", EmojisFieldCommon);
EmojisTextField.template = "mail.EmojisTextField";
EmojisTextField.components = { ...TextField.components };

export const emojisTextField = {
    ...textField,
    component: EmojisTextField,
    additionalClasses: [...(textField.additionalClasses || []), "o_field_text"],
};

registry.category("fields").add("text_emojis", emojisTextField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
