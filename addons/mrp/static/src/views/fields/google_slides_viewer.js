/** @odoo-module **/

import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
<<<<<<< HEAD
import { CharField } from "@web/views/fields/char/char_field";
=======
import { CharField, charField } from "@web/views/fields/char/char_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const { useState } = owl;

export class SlidesViewer extends CharField {
    setup() {
        super.setup();
        this.notification = useService("notification");
        this.page = 1 || this.props.page;
        this.state = useState({
            isValid: true,
        });
    }

    get fileName() {
<<<<<<< HEAD
        return this.state.fileName || this.props.value || "";
=======
        return this.state.fileName || this.props.record.data[this.props.name] || "";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    get url() {
        var src = false;
<<<<<<< HEAD
        if (this.props.value) {
            // check given google slide url is valid or not
            var googleRegExp = /(^https:\/\/docs.google.com).*(\/d\/e\/|\/d\/)([A-Za-z0-9-_]+)/;
            var google = this.props.value.match(googleRegExp);
=======
        if (this.props.record.data[this.props.name]) {
            // check given google slide url is valid or not
            var googleRegExp = /(^https:\/\/docs.google.com).*(\/d\/e\/|\/d\/)([A-Za-z0-9-_]+)/;
            var google = this.props.record.data[this.props.name].match(googleRegExp);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            if (google && google[3]) {
                src =
                    "https://docs.google.com/presentation" +
                    google[2] +
                    google[3] +
                    "/preview?slide=" +
                    this.page;
            }
        }
        return src || this.props.value;
    }

    onLoadFailed() {
        this.state.isValid = false;
        this.notification.add(this.env._t("Could not display the selected spreadsheet"), {
            type: "danger",
        });
    }
}

SlidesViewer.template = "mrp.SlidesViewer";
<<<<<<< HEAD
SlidesViewer.displayName = _lt("Google Slides Viewer");

registry.category("fields").add("embed_viewer", SlidesViewer);
=======

export const slidesViewer = {
    ...charField,
    component: SlidesViewer,
    displayName: _lt("Google Slides Viewer"),
};

registry.category("fields").add("embed_viewer", slidesViewer);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
