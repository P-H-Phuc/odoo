/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { X2ManyField } from "@web/views/fields/x2many/x2many_field";
=======
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { ListRenderer } from "@web/views/list/list_renderer";

export class MrpProductionComponentsListRenderer extends ListRenderer {
    getCellClass(column, record) {
        let classNames = super.getCellClass(...arguments);
        if (column.name == "quantity_done" && !record.data.manual_consumption) {
            classNames += ' o_non_manual_consumption';
        }
        return classNames;
    }
}

export class MrpProductionComponentsX2ManyField extends X2ManyField {}
<<<<<<< HEAD
MrpProductionComponentsX2ManyField.components = { ...X2ManyField.components, ListRenderer: MrpProductionComponentsListRenderer };

registry.category("fields").add("mrp_production_components_x2many", MrpProductionComponentsX2ManyField);
=======
MrpProductionComponentsX2ManyField.components = {
    ...X2ManyField.components,
    ListRenderer: MrpProductionComponentsListRenderer
};

export const mrpProductionComponentsX2ManyField = {
    ...x2ManyField,
    component: MrpProductionComponentsX2ManyField,
};

registry.category("fields").add("mrp_production_components_x2many", mrpProductionComponentsX2ManyField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
