/** @odoo-module */

import { registry } from '@web/core/registry';

import { listView } from '@web/views/list/list_view';
import { ListController } from '@web/views/list/list_controller';

import { useArchiveEmployee } from '@hr/views/archive_employee_hook';

export class EmployeeListController extends ListController {
    setup() {
        super.setup();
        this.archiveEmployee = useArchiveEmployee();
    }

    getStaticActionMenuItems() {
        const menuItems = super.getStaticActionMenuItems();
        const selectedRecords = this.model.root.selection;

        // Only override the Archive action when only 1 record is selected.
<<<<<<< HEAD
        if (!this.archiveEnabled || selectedRecords.length > 1 || !selectedRecords[0].data.active) {
            return menuItems;
        }

        const archiveAction = menuItems.other.find((item) => item.key === "archive");
        if (archiveAction) {
            archiveAction.callback = this.archiveEmployee.bind(this, selectedRecords[0].resId);
=======
        if (selectedRecords.length === 1 && selectedRecords[0].data.active) {
            menuItems.archive.callback = this.archiveEmployee.bind(this, selectedRecords[0].resId);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        return menuItems;
    }
}

registry.category('views').add('hr_employee_list', {
    ...listView,
    Controller: EmployeeListController,
});
