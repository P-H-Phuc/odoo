/** @odoo-module **/

import { PortalWizardUserListController } from "../list/portal_wizard_user_list_controller";
<<<<<<< HEAD
import { X2ManyField } from "@web/views/fields/x2many/x2many_field";
=======
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { registry } from "@web/core/registry";

export class PortalUserX2ManyField extends X2ManyField {}
PortalUserX2ManyField.components = {
    ...X2ManyField.components,
    Controller: PortalWizardUserListController,
};

export const portalUserX2ManyField = {
    ...x2ManyField,
    component: PortalUserX2ManyField,
};

registry.category("fields").add("portal_wizard_user_one2many", portalUserX2ManyField);
