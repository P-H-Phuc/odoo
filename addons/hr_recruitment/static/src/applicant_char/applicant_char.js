/** @odoo-module */

<<<<<<< HEAD
import { CharField } from "@web/views/fields/char/char_field";
=======
import { CharField, charField } from "@web/views/fields/char/char_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { registry } from "@web/core/registry";

import { useService } from "@web/core/utils/hooks";

export class ApplicantCharField extends CharField {
    setup() {
        super.setup();

        this.action = useService("action");
    }

    onClick() {
        const record = this.props.record.data;
        if (record.res_id !== undefined && record.res_model == 'hr.applicant') {
            this.action.doAction({
                type: 'ir.actions.act_window',
                res_model: 'hr.applicant',
                res_id: record.res_id,
                views: [[false, "form"]],
                view_mode: "form",
                target: "current",
            });
        }
    }
}
ApplicantCharField.template = "hr_recruitment.ApplicantCharField";
<<<<<<< HEAD
registry.category("fields").add("applicant_char", ApplicantCharField);
=======

export const applicantCharField = {
    ...charField,
    component: ApplicantCharField,
};

registry.category("fields").add("applicant_char", applicantCharField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
