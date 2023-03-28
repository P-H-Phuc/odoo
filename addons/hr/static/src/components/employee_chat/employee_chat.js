/** @odoo-module */

<<<<<<< HEAD
import { registry } from '@web/core/registry';
import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";

import { useOpenChat } from "@mail/views/open_chat_hook";
=======
import { registry } from "@web/core/registry";
import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";

import { useOpenChat } from "@mail/web/open_chat_hook";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const { Component } = owl;

export class HrEmployeeChat extends Component {
    setup() {
        super.setup();
        this.openChat = useOpenChat(this.props.record.resModel);
    }
}
HrEmployeeChat.props = {
    ...standardWidgetProps,
};
<<<<<<< HEAD
HrEmployeeChat.template = 'hr.OpenChat';

registry.category("view_widgets").add("hr_employee_chat", HrEmployeeChat);
=======
HrEmployeeChat.template = "hr.OpenChat";

export const hrEmployeeChat = {
    component: HrEmployeeChat,
};
registry.category("view_widgets").add("hr_employee_chat", hrEmployeeChat);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
