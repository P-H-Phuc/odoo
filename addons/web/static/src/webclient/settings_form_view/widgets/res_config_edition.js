/** @odoo-module */

import { registry } from "@web/core/registry";
import { session } from "@web/session";
import { Setting } from "@web/views/form/setting/setting";

import { Component } from "@odoo/owl";
<<<<<<< HEAD
=======
import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
const { DateTime } = luxon;

/**
 * Widget in the settings that handles a part of the "About" section.
 * Contains info about the odoo version, database expiration date and copyrights.
 */
class ResConfigEdition extends Component {
    static template = "res_config_edition";
    static components = { Setting };
    static props = {
        ...standardWidgetProps,
    };

    setup() {
        this.serverVersion = session.server_version;
        this.expirationDate = session.expiration_date
            ? DateTime.fromSQL(session.expiration_date).toLocaleString(DateTime.DATE_FULL)
            : DateTime.now().plus({ days: 30 }).toLocaleString(DateTime.DATE_FULL);
    }
}

export const resConfigEdition = {
    component: ResConfigEdition,
};

registry.category("view_widgets").add("res_config_edition", resConfigEdition);
