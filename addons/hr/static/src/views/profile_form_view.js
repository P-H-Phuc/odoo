/** @odoo-module */

import { registry } from "@web/core/registry";
<<<<<<< HEAD

import { formView } from "@web/views/form/form_view";
import { Record, RelationalModel } from "@web/views/basic_relational_model";

export class EmployeeProfileRecord extends Record {
    async save() {
        const dirtyFields = this.dirtyFields.map((f) => f.name);
        const isSaved = await super.save(...arguments);
        if (isSaved && dirtyFields.includes("lang")) {
            this.model.actionService.doAction("reload_context");
=======
import { useService } from "@web/core/utils/hooks";
import { formView } from "@web/views/form/form_view";

export class EmployeeProfileController extends formView.Controller {
    setup() {
        super.setup();
        this.action = useService("action");
        this.mustReload = false;
    }

    onWillSaveRecord(record) {
        this.mustReload = record.isFieldDirty("lang");
    }

    onRecordSaved(record) {
        if (this.mustReload) {
            this.mustReload = false;
            return this.action.doAction("reload_context");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        return isSaved;
    }
}

<<<<<<< HEAD
class EmployeeProfileModel extends RelationalModel {}
EmployeeProfileModel.Record = EmployeeProfileRecord;

registry.category("views").add("hr_employee_profile_form", {
    ...formView,
    Model: EmployeeProfileModel,
=======
registry.category("views").add("hr_employee_profile_form", {
    ...formView,
    Controller: EmployeeProfileController,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
