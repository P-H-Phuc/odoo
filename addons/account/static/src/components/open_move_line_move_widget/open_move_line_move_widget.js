/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { Many2OneField } from "@web/views/fields/many2one/many2one_field";

class LineOpenMoveWidget extends Many2OneField {
    async openAction() {
        const action = await this.orm.call("account.move.line", "action_open_business_doc", [this.props.value[0]], {});
=======
import { Many2OneField, many2OneField } from "@web/views/fields/many2one/many2one_field";

class LineOpenMoveWidget extends Many2OneField {
    async openAction() {
        const action = await this.orm.call("account.move.line", "action_open_business_doc", [this.props.record.data[this.props.name][0]], {});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        await this.action.doAction(action);
    }
}

<<<<<<< HEAD
registry.category("fields").add("line_open_move_widget", LineOpenMoveWidget);
=======
export const lineOpenMoveWidget = {
    ...many2OneField,
    component: LineOpenMoveWidget,
};

registry.category("fields").add("line_open_move_widget", lineOpenMoveWidget);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
