/** @odoo-module **/

import { registry } from "@web/core/registry";
import { stepUtils } from "@web_tour/tour_service/tour_utils";

// Note: please keep this test without pricelist for maximum coverage.
// The pricelist is tested on the other tours.

registry.category("web_tour.tours").add('sale_product_configurator_tour', {
    url: '/web',
    test: true,
    steps: [stepUtils.showAppsMenuItem(), {
    trigger: '.o_app[data-menu-xmlid="sale.sale_menu_root"]',
}, {
    trigger: '.o_list_button_add',
    extra_trigger: '.o_sale_order'
}, {
    trigger: 'a:contains("Add a product")',
}, {
    trigger: 'div[name="product_template_id"] input',
    run: 'text Custo',
}, {
    trigger: 'ul.ui-autocomplete a:contains("Customizable Desk (TEST)")',
}, {
    trigger: '.main_product span:contains("Steel")',
    run: function () {},
}, {
    trigger: '.main_product span:contains("Aluminium")',
}, {
    trigger: 'span.oe_currency_value:contains("800.40")',
    run: function (){} // check updated price
}, {
    trigger: 'input[data-value_name="Black"]'
}, {
    trigger: '.btn-primary.disabled span:contains("Confirm")',
    extra_trigger: '.show .modal-footer' // check confirm is disable and try to do it anyway
}, {
    trigger: 'input[data-value_name="White"]'
}, {
    trigger: '.btn-primary:not(.disabled)  span:contains("Confirm")',
    extra_trigger: '.show .modal-footer',
    run: function (){} // check confirm is available
}, {
    trigger: 'span:contains("Aluminium"):eq(1)',
}, {
    trigger: '.js_product:contains(Conference Chair) .js_add',
}, {
    trigger: '.js_product:contains(Chair floor protection) .js_add',
}, {
    trigger: 'button span:contains(Confirm)',
    id: 'quotation_product_selected',
},
// check that 3 products were added to the SO
{
    trigger: 'td.o_data_cell:contains("Customizable Desk (TEST) (Aluminium, White)")',
    run: function (){}
}, {
    trigger: 'td.o_data_cell:contains("Conference Chair (TEST) (Aluminium)")',
    run: function (){}
}, {
    trigger: 'td.o_data_cell:contains("Chair floor protection")',
    run: function (){}
}, {
<<<<<<< HEAD
    trigger: 'span[name=amount_total]:contains("0.00")',
=======
    trigger: 'span[name=amount_total]:contains("960.60")',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    run: function (){}
}, ...stepUtils.discardForm()
]});
