/** @odoo-module */

<<<<<<< HEAD
import { registry } from '@web/core/registry';
=======
import { registry } from "@web/core/registry";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

import { formView } from "@web/views/form/form_view";
import { FormController } from "@web/views/form/form_controller";
import { FormRenderer } from "@web/views/form/form_renderer";

<<<<<<< HEAD
import { useArchiveEmployee } from '@hr/views/archive_employee_hook';
import { useOpenChat } from "@mail/views/open_chat_hook";
=======
import { useArchiveEmployee } from "@hr/views/archive_employee_hook";
import { useOpenChat } from "@mail/web/open_chat_hook";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class EmployeeFormController extends FormController {
    setup() {
        super.setup();
        this.archiveEmployee = useArchiveEmployee();
    }

<<<<<<< HEAD
    getActionMenuItems() {
        const menuItems = super.getActionMenuItems();
        if (!this.archiveEnabled || !this.model.root.isActive) {
            return menuItems;
        }

        const archiveAction = menuItems.other.find((item) => item.key === "archive");
        if (archiveAction) {
            archiveAction.callback = this.archiveEmployee.bind(this, this.model.root.resId);
        }
=======
    getStaticActionMenuItems() {
        const menuItems = super.getStaticActionMenuItems();
        menuItems.archive.callback = this.archiveEmployee.bind(this, this.model.root.resId);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return menuItems;
    }
}

// TODO KBA: to remove in master
export class EmployeeFormRenderer extends FormRenderer {
    setup() {
        super.setup();
        this.openChat = useOpenChat(this.props.record.resModel);
    }
}

registry.category("views").add("hr_employee_form", {
    ...formView,
    Controller: EmployeeFormController,
    Renderer: EmployeeFormRenderer,
});
