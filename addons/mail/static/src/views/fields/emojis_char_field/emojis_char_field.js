/** @odoo-module **/

<<<<<<< HEAD
import { CharField } from "@web/views/fields/char/char_field";
import { patch } from "@web/core/utils/patch";
import MailEmojisMixin from '@mail/js/emojis_mixin';
import { EmojisDropdown } from '@mail/js/emojis_dropdown';
import { EmojisFieldCommon } from '@mail/views/fields/emojis_field_common';
import { registry } from "@web/core/registry";

const { useRef } = owl;
=======
import { CharField, charField } from "@web/views/fields/char/char_field";
import { patch } from "@web/core/utils/patch";
import MailEmojisMixin from "@mail/js/emojis_mixin";
import { EmojisFieldCommon } from "@mail/views/fields/emojis_field_common/emojis_field_common";
import { registry } from "@web/core/registry";

import { useRef } from "@odoo/owl";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * Extension of the FieldChar that will add emojis support
 */
export class EmojisCharField extends CharField {
    setup() {
        super.setup();
<<<<<<< HEAD
        this.targetEditElement = useRef('input');
        this._setupOverride();
    }
};

patch(EmojisCharField.prototype, 'emojis_char_field_mail_mixin', MailEmojisMixin);
patch(EmojisCharField.prototype, 'emojis_char_field_field_mixin', EmojisFieldCommon);
EmojisCharField.template = 'mail.EmojisCharField';
EmojisCharField.components = { ...CharField.components, EmojisDropdown };
EmojisCharField.additionalClasses = [...(CharField.additionalClasses || []), 'o_field_text'];
registry.category("fields").add("char_emojis", EmojisCharField);
=======
        this.targetEditElement = useRef("input");
        this._setupOverride();
    }
}

patch(EmojisCharField.prototype, "emojis_char_field_mail_mixin", MailEmojisMixin);
patch(EmojisCharField.prototype, "emojis_char_field_field_mixin", EmojisFieldCommon);
EmojisCharField.template = "mail.EmojisCharField";
EmojisCharField.components = { ...CharField.components };

export const emojisCharField = {
    ...charField,
    component: EmojisCharField,
    additionalClasses: [...(charField.additionalClasses || []), "o_field_text"],
};

registry.category("fields").add("char_emojis", emojisCharField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
