/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { debounce } from "@web/core/utils/timing";
<<<<<<< HEAD
import { CharField } from "@web/views/fields/char/char_field";
import { TextField } from '@web/views/fields/text/text_field';
=======
import { CharField, charField } from "@web/views/fields/char/char_field";
import { TextField, textField } from "@web/views/fields/text/text_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { archParseBoolean } from "@web/views/utils";

const { useEffect } = owl;

/**
 * Support a key-based onchange in text fields.
 * The triggerOnChange method is debounced to run after given debounce delay
 * (or 2 seconds by default) when typing ends.
 *
 */
const onchangeOnKeydownMixin = {
    setup() {
        this._super(...arguments);

        if (this.props.onchangeOnKeydown) {
            const input = this.input || this.textareaRef;

            const triggerOnChange = debounce(this.triggerOnChange, this.props.keydownDebounceDelay);
            useEffect(() => {
                if (input.el) {
<<<<<<< HEAD
                    input.el.addEventListener('keydown', triggerOnChange.bind(this));
=======
                    input.el.addEventListener("keydown", triggerOnChange.bind(this));
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                }
            });
        }
    },

    triggerOnChange() {
        const input = this.input || this.textareaRef;
<<<<<<< HEAD
        input.el.dispatchEvent(new Event('change'));
    }
};

patch(CharField.prototype, 'char_field_onchange_on_keydown', onchangeOnKeydownMixin);
patch(TextField.prototype, 'text_field_onchange_on_keydown', onchangeOnKeydownMixin);
=======
        input.el.dispatchEvent(new Event("change"));
    },
};

patch(CharField.prototype, "char_field_onchange_on_keydown", onchangeOnKeydownMixin);
patch(TextField.prototype, "text_field_onchange_on_keydown", onchangeOnKeydownMixin);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

CharField.props = {
    ...CharField.props,
    onchangeOnKeydown: { type: Boolean, optional: true },
    keydownDebounceDelay: { type: Number, optional: true },
};

TextField.props = {
    ...TextField.props,
    onchangeOnKeydown: { type: Boolean, optional: true },
    keydownDebounceDelay: { type: Number, optional: true },
};

<<<<<<< HEAD
const charExtractProps = CharField.extractProps;
CharField.extractProps = ({ attrs, field }) => {
    return Object.assign(charExtractProps({ attrs, field }), {
        onchangeOnKeydown: archParseBoolean(attrs.onchange_on_keydown),
        keydownDebounceDelay: attrs.keydown_debounce_delay ? Number(attrs.keydown_debounce_delay) : 2000,
    });
};

const textExtractProps = TextField.extractProps;
TextField.extractProps = ({ attrs, field }) => {
    return Object.assign(textExtractProps({ attrs, field }), {
        onchangeOnKeydown: archParseBoolean(attrs.onchange_on_keydown),
        keydownDebounceDelay: attrs.keydown_debounce_delay ? Number(attrs.keydown_debounce_delay) : 2000,
=======
const charExtractProps = charField.extractProps;
charField.extractProps = (fieldInfo) => {
    return Object.assign(charExtractProps(fieldInfo), {
        onchangeOnKeydown: archParseBoolean(fieldInfo.attrs.onchange_on_keydown),
        keydownDebounceDelay: fieldInfo.attrs.keydown_debounce_delay
            ? Number(fieldInfo.attrs.keydown_debounce_delay)
            : 2000,
    });
};

const textExtractProps = textField.extractProps;
textField.extractProps = (fieldInfo) => {
    return Object.assign(textExtractProps(fieldInfo), {
        onchangeOnKeydown: archParseBoolean(fieldInfo.attrs.onchange_on_keydown),
        keydownDebounceDelay: fieldInfo.attrs.keydown_debounce_delay
            ? Number(fieldInfo.attrs.keydown_debounce_delay)
            : 2000,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    });
};
