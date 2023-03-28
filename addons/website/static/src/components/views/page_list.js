/** @odoo-module **/

import {PageControllerMixin, PageRendererMixin} from "./page_views_mixin";
import {registry} from '@web/core/registry';
import {listView} from '@web/views/list/list_view';
import {ConfirmationDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import {useService} from "@web/core/utils/hooks";
import {sprintf} from "@web/core/utils/strings";
import {DeletePageDialog} from '@website/components/dialog/page_properties';


export class PageListController extends PageControllerMixin(listView.Controller) {
    /**
     * @override
     */
    setup() {
        super.setup();
        this.orm = useService('orm');
<<<<<<< HEAD
=======
        if (this.props.resModel === "website.page") {
            this.archiveEnabled = false;
        }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    /**
     * @override
     */
    onClickCreate() {
        return this.createWebsiteContent();
    }

    /**
     * Adds a "Publish/Unpublish" button to the 'action' menu of the list view.
     *
     * @override
     */
<<<<<<< HEAD
    getActionMenuItems() {
        const actionMenuItems = super.getActionMenuItems();
        // 'Archive' / 'Unarchive' options are disabled only on 'website.page' list view.
        if (this.props.resModel === 'website.page') {
            actionMenuItems.other = actionMenuItems.other
                .filter(item => !['archive', 'unarchive'].includes(item.key));
        }
        actionMenuItems.other.splice(-1, 0, {
=======
    getStaticActionMenuItems() {
        const menuItems = super.getStaticActionMenuItems();
        menuItems.publish = {
            sequence: 15,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            description: this.env._t("Publish"),
            callback: async () => {
                this.dialogService.add(ConfirmationDialog, {
                    title: this.env._t("Publish Website Content"),
<<<<<<< HEAD
                    body: sprintf(this.env._t("%s record(s) selected, are you sure you want to publish them all?"), this.model.root.selection.length),
                    confirm: () => this.togglePublished(true),
                });
            }
        },
        {
            description: this.env._t("Unpublish"),
            callback: async () => this.togglePublished(false),
        });
        return actionMenuItems;
=======
                    body: sprintf(
                        this.env._t(
                            "%s record(s) selected, are you sure you want to publish them all?"
                        ),
                        this.model.root.selection.length
                    ),
                    confirm: () => this.togglePublished(true),
                });
            },
        };
        menuItems.unpublish = {
            sequence: 16,
            description: this.env._t("Unpublish"),
            callback: async () => this.togglePublished(false),
        };
        return menuItems;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    onDeleteSelectedRecords() {
        this.dialogService.add(DeletePageDialog, {
            resIds: this.model.root.selection.map((record) => record.resId),
            resModel: this.props.resModel,
            onDelete: () => {
                this.model.root.deleteRecords();
            },
        });
    }

    async togglePublished(publish) {
        const resIds = this.model.root.selection.map(record => record.resId);
        await this.orm.write(this.props.resModel, resIds, {is_published: publish});
        this.actionService.switchView('list');
    }
}
PageListController.template = `website.PageListView`;

export class PageListRenderer extends PageRendererMixin(listView.Renderer) {}
PageListRenderer.props = [
    ...listView.Renderer.props,
    "activeWebsite",
];
PageListRenderer.recordRowTemplate = "website.PageListRenderer.RecordRow";

export const PageListView = {
    ...listView,
    Renderer: PageListRenderer,
    Controller: PageListController,
};

registry.category("views").add("website_pages_list", PageListView);
