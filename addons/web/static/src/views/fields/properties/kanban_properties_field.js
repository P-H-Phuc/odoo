/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { PropertiesField } from "./properties_field";

export class KanbanPropertiesField extends PropertiesField {
=======
import { propertiesField, PropertiesField } from "./properties_field";

export class KanbanPropertiesField extends PropertiesField {
    static template = "web.KanbanPropertiesField";

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    async _checkDefinitionAccess() {
        // can not edit properties definition in the kanban view
        this.state.canChangeDefinition = false;
    }
}

<<<<<<< HEAD
KanbanPropertiesField.template = "web.KanbanPropertiesField";

registry.category("fields").add("kanban.properties", KanbanPropertiesField);
=======
export const kanbanPropertiesField = {
    ...propertiesField,
    component: KanbanPropertiesField,
};

registry.category("fields").add("kanban.properties", kanbanPropertiesField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
