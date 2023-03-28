/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PhoneField, phoneField, formPhoneField } from "@web/views/fields/phone/phone_field";
import { SendSMSButton } from '@sms/components/sms_button/sms_button';

patch(PhoneField, "sms.PhoneField", {
    components: {
        ...PhoneField.components,
        SendSMSButton
    },
    defaultProps: {
        ...PhoneField.defaultProps,
        enableButton: true,
    },
    props: {
        ...PhoneField.props,
        enableButton: { type: Boolean, optional: true },
    },
<<<<<<< HEAD
    extractProps: ({ attrs }) => {
        return {
            enableButton: attrs.options.enable_sms,
            placeholder: attrs.placeholder,
        };
    },
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});

const patchDescr = {
    extractProps({ options }) {
        const props = this._super(...arguments);
        props.enableButton = options.enable_sms;
        return props;
    },
};

patch(phoneField, "sms.PhoneField", patchDescr);
patch(formPhoneField, "sms.PhoneField", patchDescr);
