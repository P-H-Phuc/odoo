/** @odoo-module **/

<<<<<<< HEAD
import tour from 'web_tour.tour';

tour.register('website_sale_product_configurator_optional_products_tour', {
    test: true,
}, [{
=======
import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add('website_sale_product_configurator_optional_products_tour', {
    test: true,
    steps: [{
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    name: 'Click Aluminium Option',
    trigger: 'ul.js_add_cart_variants span:contains("Aluminium")',
    extra_trigger: 'ul.js_add_cart_variants span:contains("Aluminium") ~ span.badge:contains("50.40")',
}, {
    name: 'Add to cart',
    trigger: '#add_to_cart',
}, {
    name: 'Check that modal was opened with the correct variant price',
    trigger: 'main.oe_advanced_configurator_modal',
    extra_trigger: 'main.oe_advanced_configurator_modal span:contains("800.40")',
    run: () => {},
<<<<<<< HEAD
}]);
=======
}]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
