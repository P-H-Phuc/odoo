odoo.define('l10n_ar.account_tour', function(require) {
"use strict";

    require("account.tour");
    const { registry } = require("@web/core/registry");
    let account_tour = registry.category("web_tour.tours").get("account_tour");
    // Remove the step suggesting to change the name as it is done another way (document number)
    account_tour.steps = _.filter(account_tour.steps, step => step.trigger != "input[name=name]");

    // Configure the AFIP Responsibility
    let partner_step_idx = _.findIndex(account_tour.steps, step => step.trigger == 'div[name=partner_id] input');
    account_tour.steps.splice(partner_step_idx + 2, 0, {
        // FIXME WOWL: this selector needs to work in both legacy and non-legacy views
        trigger: "div[name=l10n_ar_afip_responsibility_type_id] input",
        extra_trigger: "[name=move_type] [raw-value=out_invoice], [name=move_type][raw-value=out_invoice]",
        position: "bottom",
        content: "Set the AFIP Responsability",
        run: "text IVA",
    })
    account_tour.steps.splice(partner_step_idx + 3, 0, {
        trigger: ".ui-menu-item > a:contains('IVA').ui-state-active",
        auto: true,
        in_modal: false,
    })

})
