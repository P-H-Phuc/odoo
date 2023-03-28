/** @odoo-modules */

<<<<<<< HEAD
import tour from 'web_tour.tour';

tour.register('website_event_pages_seo', {
    test: true,
    // The tour must start on an event's custom page (not register page)
    // url: `/event/openwood-collection-online-reveal-8/page/introduction-openwood-collection-online-reveal`,
}, [
=======
import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add('website_event_pages_seo', {
    test: true,
    // The tour must start on an event's custom page (not register page)
    // url: `/event/openwood-collection-online-reveal-8/page/introduction-openwood-collection-online-reveal`,
    steps: [
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    {
        content: "Open the site menu",
        trigger: '[data-menu-xmlid="website.menu_site"]',
        extra_trigger: 'iframe #o_wevent_event_submenu', // Ensure we landed on the event page
    },
    {
        content: "Open the optimize SEO dialog",
        trigger: '[data-menu-xmlid="website.menu_optimize_seo"]',
    },
    {
        content: "Fill in the title input",
        trigger: '[for="website_meta_title"] + input',
        run: 'text Hello, world!',
    },
    {
        content: "Save the dialog",
        trigger: '.modal-footer .btn-primary',
    },
    {
        content: "Check that the page title is adapted, inside and outside the iframe",
        trigger: 'html:has(title:containsExactText(Hello, world!))',
        extra_trigger: 'iframe html:has(title:containsExactText(Hello, world!))',
    },
<<<<<<< HEAD
]);
=======
]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
