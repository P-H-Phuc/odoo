/** @odoo-module */

<<<<<<< HEAD
import { ChatterContainer } from "@mail/components/chatter_container/chatter_container";
import { WebClientViewAttachmentViewContainer } from "@mail/components/web_client_view_attachment_view_container/web_client_view_attachment_view_container";
=======
import { Chatter } from "@mail/web/chatter";
import { AttachmentView } from "@mail/attachments/attachment_view";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

import { patch } from "@web/core/utils/patch";
import { FormRenderer } from "@web/views/form/form_renderer";

<<<<<<< HEAD
patch(FormRenderer.prototype, 'mail', {
=======
patch(FormRenderer.prototype, "mail", {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    get compileParams() {
        return {
            ...this._super(),
            hasAttachmentViewerInArch: this.props.hasAttachmentViewerInArch,
            saveButtonClicked: this.props.saveButtonClicked,
        };
    },
<<<<<<< HEAD
=======
});

patch(FormRenderer.props, "mail", {
    hasAttachmentViewerInArch: { type: Boolean, optional: true },
    // Template props : added by the FormCompiler
    hasAttachmentViewer: { type: Boolean, optional: true },
    chatter: { type: Object, optional: true },
    saveButtonClicked: { type: Function, optional: true },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});

Object.assign(FormRenderer.components, {
    AttachmentView,
    Chatter,
});
