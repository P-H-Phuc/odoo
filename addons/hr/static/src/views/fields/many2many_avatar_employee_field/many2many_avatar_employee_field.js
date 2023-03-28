/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { Many2ManyTagsAvatarUserField, KanbanMany2ManyTagsAvatarUserField } from "@mail/views/fields/many2many_avatar_user_field/many2many_avatar_user_field";

export class Many2ManyTagsAvatarEmployeeField extends Many2ManyTagsAvatarUserField {}
Many2ManyTagsAvatarEmployeeField.additionalClasses = [...Many2ManyTagsAvatarUserField.additionalClasses, "o_field_many2many_avatar_user"];

registry.category("fields").add("many2many_avatar_employee", Many2ManyTagsAvatarEmployeeField);

export class KanbanMany2ManyTagsAvatarEmployeeField extends KanbanMany2ManyTagsAvatarUserField {}
KanbanMany2ManyTagsAvatarEmployeeField.additionalClasses = [...KanbanMany2ManyTagsAvatarUserField.additionalClasses, "o_field_many2many_avatar_user"];

registry.category("fields").add("kanban.many2many_avatar_employee", KanbanMany2ManyTagsAvatarEmployeeField);
registry.category("fields").add("list.many2many_avatar_employee", KanbanMany2ManyTagsAvatarEmployeeField);
=======
import {
    Many2ManyTagsAvatarUserField,
    KanbanMany2ManyTagsAvatarUserField,
    many2ManyTagsAvatarUserField,
    kanbanMany2ManyTagsAvatarUserField,
} from "@mail/web/fields/many2many_avatar_user_field/many2many_avatar_user_field";

export class Many2ManyTagsAvatarEmployeeField extends Many2ManyTagsAvatarUserField {}

export const many2ManyTagsAvatarEmployeeField = {
    ...many2ManyTagsAvatarUserField,
    component: Many2ManyTagsAvatarEmployeeField,
    additionalClasses: [
        ...many2ManyTagsAvatarUserField.additionalClasses,
        "o_field_many2many_avatar_user",
    ],
};

registry.category("fields").add("many2many_avatar_employee", many2ManyTagsAvatarEmployeeField);

export class KanbanMany2ManyTagsAvatarEmployeeField extends KanbanMany2ManyTagsAvatarUserField {}

export const kanbanMany2ManyTagsAvatarEmployeeField = {
    ...kanbanMany2ManyTagsAvatarUserField,
    component: KanbanMany2ManyTagsAvatarEmployeeField,
    additionalClasses: [
        ...kanbanMany2ManyTagsAvatarUserField.additionalClasses,
        "o_field_many2many_avatar_user",
    ],
};

registry
    .category("fields")
    .add("kanban.many2many_avatar_employee", kanbanMany2ManyTagsAvatarEmployeeField);
registry
    .category("fields")
    .add("list.many2many_avatar_employee", kanbanMany2ManyTagsAvatarEmployeeField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
