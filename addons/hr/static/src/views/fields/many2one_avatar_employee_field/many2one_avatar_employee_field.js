/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { Many2OneAvatarUserField, KanbanMany2OneAvatarUserField } from "@mail/views/fields/many2one_avatar_user_field/many2one_avatar_user_field";

export class Many2OneAvatarEmployeeField extends Many2OneAvatarUserField {}
Many2OneAvatarEmployeeField.additionalClasses = [...Many2OneAvatarUserField.additionalClasses, "o_field_many2one_avatar_user"];

registry.category("fields").add("many2one_avatar_employee", Many2OneAvatarEmployeeField);

export class KanbanMany2OneAvatarEmployeeField extends KanbanMany2OneAvatarUserField {}

registry.category("fields").add("kanban.many2one_avatar_employee", KanbanMany2OneAvatarEmployeeField);
=======
import {
    Many2OneAvatarUserField,
    KanbanMany2OneAvatarUserField,
    many2OneAvatarUserField,
    kanbanMany2OneAvatarUserField,
} from "@mail/web/fields/many2one_avatar_user_field/many2one_avatar_user_field";

export class Many2OneAvatarEmployeeField extends Many2OneAvatarUserField {}

export const many2OneAvatarEmployeeField = {
    ...many2OneAvatarUserField,
    component: Many2OneAvatarEmployeeField,
    additionalClasses: [
        ...many2OneAvatarUserField.additionalClasses,
        "o_field_many2one_avatar_user",
    ],
};

registry.category("fields").add("many2one_avatar_employee", many2OneAvatarEmployeeField);

export class KanbanMany2OneAvatarEmployeeField extends KanbanMany2OneAvatarUserField {}

export const kanbanMany2OneAvatarEmployeeField = {
    ...kanbanMany2OneAvatarUserField,
    component: KanbanMany2OneAvatarEmployeeField,
};

registry
    .category("fields")
    .add("kanban.many2one_avatar_employee", kanbanMany2OneAvatarEmployeeField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
