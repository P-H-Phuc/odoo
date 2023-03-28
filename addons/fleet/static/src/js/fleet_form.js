/** @odoo-module **/

import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { registry } from "@web/core/registry";
import { FormController } from "@web/views/form/form_controller";
import { formView } from "@web/views/form/form_view";

export class FleetFormController extends FormController {
    /**
     * @override
     **/
<<<<<<< HEAD
    getActionMenuItems() {
        const menuItems = super.getActionMenuItems();
        const archiveAction = menuItems.other.find((item) => item.key === "archive");
        if (archiveAction) {
            archiveAction.callback = () => {
                const dialogProps = {
                    body: this.env._t(
                        "Every service and contract of this vehicle will be considered as archived. Are you sure that you want to archive this record?"
                    ),
                    confirm: () => this.model.root.archive(),
                    cancel: () => {},
                };
                this.dialogService.add(ConfirmationDialog, dialogProps);
=======
    getStaticActionMenuItems() {
        const menuItems = super.getStaticActionMenuItems();
        menuItems.archive.callback = () => {
            const dialogProps = {
                body: this.env._t(
                    "Every service and contract of this vehicle will be considered as archived. Are you sure that you want to archive this record?"
                ),
                confirm: () => this.model.root.archive(),
                cancel: () => {},
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };
            this.dialogService.add(ConfirmationDialog, dialogProps);
        };
        return menuItems;
    }
}

export const fleetFormView = {
    ...formView,
    Controller: FleetFormController,
};

registry.category("views").add("fleet_form", fleetFormView);
