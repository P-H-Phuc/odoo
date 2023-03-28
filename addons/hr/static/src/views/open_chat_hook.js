/** @odoo-module **/

<<<<<<< HEAD
import { helpers } from "@mail/views/open_chat_hook";
import { patch } from "@web/core/utils/patch";

patch(helpers, "hr_m2x_avatar_employee", {
    SUPPORTED_M2X_AVATAR_MODELS: [...helpers.SUPPORTED_M2X_AVATAR_MODELS, "hr.employee", "hr.employee.public"],
=======
import { helpers } from "@mail/web/open_chat_hook";
import { patch } from "@web/core/utils/patch";

patch(helpers, "hr_m2x_avatar_employee", {
    SUPPORTED_M2X_AVATAR_MODELS: [
        ...helpers.SUPPORTED_M2X_AVATAR_MODELS,
        "hr.employee",
        "hr.employee.public",
    ],
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    buildOpenChatParams: function (resModel, id) {
        if (["hr.employee", "hr.employee.public"].includes(resModel)) {
            return { employeeId: id };
        }
        return this._super(...arguments);
    },
});
