/** @odoo-module **/

import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add('shop_editor', {
    test: true,
    url: '/shop?enable_editor=1',
<<<<<<< HEAD
}, [{
=======
    steps: [{
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    trigger: '#oe_snippets.o_loaded',
    content: "Wait for the editor to be loaded"
}, {
    content: "Click on pricelist dropdown",
    trigger: "iframe div.o_pricelist_dropdown a[data-bs-toggle=dropdown]",
}, {
    trigger: "iframe input[name=search]",
    extra_trigger: "iframe div.o_pricelist_dropdown a[data-bs-toggle=dropdown][aria-expanded=true]",
    content: "Click somewhere else in the shop.",
}, {
    trigger: "iframe div.o_pricelist_dropdown a[data-bs-toggle=dropdown]",
    extra_trigger: "iframe div.o_pricelist_dropdown a[data-bs-toggle=dropdown][aria-expanded=false]",
    content: "Click on the pricelist again.",
}]});
