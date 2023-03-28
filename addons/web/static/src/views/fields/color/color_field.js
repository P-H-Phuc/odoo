/** @odoo-module **/

import { Component, onWillUpdateProps, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { standardFieldProps } from "../standard_field_props";

<<<<<<< HEAD
import { Component, useState, onWillUpdateProps } from "@odoo/owl";

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
export class ColorField extends Component {
    static template = "web.ColorField";
    static props = {
        ...standardFieldProps,
    };

    setup() {
        this.state = useState({
<<<<<<< HEAD
            color: this.props.value || '',
        });

        onWillUpdateProps((nextProps) => {
            this.state.color = nextProps.value || '';
=======
            color: this.props.record.data[this.props.name] || "",
        });

        onWillUpdateProps((nextProps) => {
            this.state.color = nextProps.record.data[nextProps.name] || "";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        });
    }
}

export const colorField = {
    component: ColorField,
    supportedTypes: ["char"],
    extractProps(fieldInfo, dynamicInfo) {
        return {
            readonly: dynamicInfo.readonly,
        };
    },
};

registry.category("fields").add("color", colorField);
