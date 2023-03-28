/** @odoo-module **/

import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { archParseBoolean } from "@web/views/utils";
import { formatChar } from "../formatters";
import { useInputField } from "../input_field_hook";
import { standardFieldProps } from "../standard_field_props";
import { TranslationButton } from "../translation_button";
<<<<<<< HEAD
import { useDynamicPlaceholder } from "../dynamicplaceholder_hook";

import { Component, onMounted, onWillUnmount, useRef } from "@odoo/owl";
=======
import { useDynamicPlaceholder } from "../dynamic_placeholder_hook";

import { Component, useExternalListener, useRef, useEffect } from "@odoo/owl";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class CharField extends Component {
    static template = "web.CharField";
    static components = {
        TranslationButton,
    };
    static props = {
        ...standardFieldProps,
        autocomplete: { type: String, optional: true },
        isPassword: { type: Boolean, optional: true },
        placeholder: { type: String, optional: true },
        dynamicPlaceholder: { type: Boolean, optional: true },
        dynamicPlaceholderModelReferenceField: { type: String, optional: true },
    };
    static defaultProps = { dynamicPlaceholder: false };

    setup() {
<<<<<<< HEAD
        if (this.props.dynamicPlaceholder) {
            this.dynamicPlaceholder = useDynamicPlaceholder();
        }

        this.input = useRef("input");
        useInputField({ getValue: () => this.props.value || "", parse: (v) => this.parse(v) });
        onMounted(this.onMounted);
        onWillUnmount(this.onWillUnmount);
    }
    async onKeydownListener(ev) {
        if (ev.key === this.dynamicPlaceholder.TRIGGER_KEY && ev.target === this.input.el) {
            const baseModel = this.props.record.data.mailing_model_real;
            if (baseModel) {
                await this.dynamicPlaceholder.open(
                    this.input.el,
                    baseModel,
                    {
                        validateCallback: this.onDynamicPlaceholderValidate.bind(this),
                        closeCallback: this.onDynamicPlaceholderClose.bind(this)
                    }
                );
            }
        }
    }
    onMounted() {
        if (this.props.dynamicPlaceholder) {
            this.keydownListenerCallback = this.onKeydownListener.bind(this);
            document.addEventListener('keydown', this.keydownListenerCallback);
        }
    }
    onWillUnmount() {
        if (this.props.dynamicPlaceholder) {
            document.removeEventListener('keydown', this.keydownListenerCallback);
        }
    }
    onDynamicPlaceholderValidate(chain, defaultValue) {
        if (chain) {
            const triggerKeyReplaceRegex = new RegExp(`${this.dynamicPlaceholder.TRIGGER_KEY}$`);
            let dynamicPlaceholder = "{{object." + chain.join('.');
            dynamicPlaceholder += defaultValue && defaultValue !== '' ? ` or '''${defaultValue}'''}}` : '}}';
            this.props.update(this.input.el.value.replace(triggerKeyReplaceRegex, '') + dynamicPlaceholder);
        }
    }
    onDynamicPlaceholderClose() {
        this.input.el.focus();
=======
        this.input = useRef("input");
        if (this.props.dynamicPlaceholder) {
            const dynamicPlaceholder = useDynamicPlaceholder(this.input);
            useExternalListener(document, "keydown", dynamicPlaceholder.onKeydown);
            useEffect(() =>
                dynamicPlaceholder.updateModel(this.props.dynamicPlaceholderModelReferenceField)
            );
        }
        useInputField({
            getValue: () => this.props.record.data[this.props.name] || "",
            parse: (v) => this.parse(v),
        });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    get shouldTrim() {
        return this.props.record.fields[this.props.name].trim && !this.props.isPassword;
    }
    get maxLength() {
        return this.props.record.fields[this.props.name].size;
    }
    get isTranslatable() {
        return this.props.record.fields[this.props.name].translate;
    }
    get formattedValue() {
        return formatChar(this.props.record.data[this.props.name], {
            isPassword: this.props.isPassword,
        });
    }

    parse(value) {
        if (this.shouldTrim) {
            return value.trim();
        }
        return value;
    }
}

<<<<<<< HEAD
CharField.template = "web.CharField";
CharField.components = {
    TranslationButton,
};
CharField.defaultProps = { dynamicPlaceholder: false };
CharField.props = {
    ...standardFieldProps,
    autocomplete: { type: String, optional: true },
    isPassword: { type: Boolean, optional: true },
    placeholder: { type: String, optional: true },
    dynamicPlaceholder: { type: Boolean, optional: true},
    shouldTrim: { type: Boolean, optional: true },
    maxLength: { type: Number, optional: true },
    isTranslatable: { type: Boolean, optional: true },
};

CharField.displayName = _lt("Text");
CharField.supportedTypes = ["char"];

CharField.extractProps = ({ attrs, field }) => {
    return {
        shouldTrim: field.trim && !archParseBoolean(attrs.password), // passwords shouldn't be trimmed
        maxLength: field.size,
        isTranslatable: field.translate,
        dynamicPlaceholder: attrs.options.dynamic_placeholder,
        autocomplete: attrs.autocomplete,
=======
export const charField = {
    component: CharField,
    displayName: _lt("Text"),
    supportedTypes: ["char"],
    extractProps: ({ attrs, options }) => ({
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        isPassword: archParseBoolean(attrs.password),
        dynamicPlaceholder: options?.dynamic_placeholder || false,
        dynamicPlaceholderModelReferenceField: options?.dynamic_placeholder_model_reference_field || "",
        autocomplete: attrs.autocomplete,
        placeholder: attrs.placeholder,
    }),
};

registry.category("fields").add("char", charField);
