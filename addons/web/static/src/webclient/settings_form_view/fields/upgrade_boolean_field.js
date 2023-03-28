/** @odoo-module **/

import { registry } from "@web/core/registry";
import { booleanField, BooleanField } from "@web/views/fields/boolean/boolean_field";
import { useService } from "@web/core/utils/hooks";
import { UpgradeDialog } from "./upgrade_dialog";

/**
 *  The upgrade boolean field is intended to be used in config settings.
 *  When checked, an upgrade popup is showed to the user.
 */

export class UpgradeBooleanField extends BooleanField {
    setup() {
        super.setup();
        this.dialogService = useService("dialog");
        this.isEnterprise = odoo.info && odoo.info.isEnterprise;
    }

    async onChange(newValue) {
        if (!this.isEnterprise) {
            this.dialogService.add(
                UpgradeDialog,
                {},
                {
                    onClose: () => {
                        this.props.record.update({ [this.props.name]: false });
                    },
                }
            );
        } else {
            super.onChange(...arguments);
        }
    }
}
<<<<<<< HEAD
UpgradeBooleanField.isUpgradeField = true;
UpgradeBooleanField.additionalClasses = [
    ...UpgradeBooleanField.additionalClasses || [],
    "o_field_boolean",
];

registry.category("fields").add("upgrade_boolean", UpgradeBooleanField);
=======

export const upgradeBooleanField = {
    ...booleanField,
    component: UpgradeBooleanField,
    isUpgradeField: true,
    additionalClasses: [...(booleanField.additionalClasses || []), "o_field_boolean"],
};

registry.category("fields").add("upgrade_boolean", upgradeBooleanField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
