/** @odoo-module **/

<<<<<<< HEAD
import { pick } from "@web/core/utils/objects";

import { Component, useRef } from "@odoo/owl";
=======
import { Component, useRef } from "@odoo/owl";
import { ControlPanel } from "@web/search/control_panel/control_panel";
import { SearchPanel } from "@web/search/search_panel/search_panel";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * @param {Object} params
 * @returns {Object}
 */
export function extractLayoutComponents(params) {
    const layoutComponents = {
        ControlPanel: params.ControlPanel || ControlPanel,
        SearchPanel: params.SearchPanel || SearchPanel,
    };
    if (params.Banner) {
        layoutComponents.Banner = params.Banner;
    }
    return layoutComponents;
}

export class Layout extends Component {
    setup() {
        this.components = extractLayoutComponents(this.env.config);
        this.contentRef = useRef("content");
    }
    get controlPanelSlots() {
        const slots = { ...this.props.slots };
        slots["control-panel-bottom-left-buttons"] = slots["layout-buttons"];
        delete slots["layout-buttons"];
        delete slots.default;
        return slots;
    }
    get display() {
        const { controlPanel } = this.props.display;
        if (!controlPanel || !this.env.inDialog) {
            return this.props.display;
        }
        return {
            ...this.props.display,
            controlPanel: {
                ...controlPanel,
                "top-left": false,
                "bottom-left-buttons": false,
            },
        };
    }
}

Layout.template = "web.Layout";
Layout.props = {
    className: { type: String, optional: true },
    display: { type: Object, optional: true },
    slots: { type: Object, optional: true },
};
Layout.defaultProps = {
    display: {},
};
