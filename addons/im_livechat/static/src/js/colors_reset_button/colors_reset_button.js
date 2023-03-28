/** @odoo-module **/

<<<<<<< HEAD
import { registry } from '@web/core/registry';
=======
import { registry } from "@web/core/registry";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";

const { Component } = owl;

export class ColorsResetButton extends Component {
    onColorsResetButtonClick() {
        this.props.record.update(this.props.default_colors);
    }
}
ColorsResetButton.template = `im_livechat.ColorsResetButton`;
ColorsResetButton.props = {
    ...standardWidgetProps,
    default_colors: { type: Object },
};
<<<<<<< HEAD
ColorsResetButton.extractProps = ({ attrs }) => {
    // Note: `options` should have `default_colors`. It's specified when using the widget.
    return attrs.options;
};

registry.category('view_widgets').add('colors_reset_button', ColorsResetButton);
=======

export const colorsResetButton = {
    component: ColorsResetButton,
    extractProps: ({ options }) => ({
        // Note: `options` should have `default_colors`. It's specified when using the widget.
        default_colors: options.default_colors,
    }),
};
registry.category("view_widgets").add("colors_reset_button", colorsResetButton);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
