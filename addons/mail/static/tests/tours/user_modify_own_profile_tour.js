/** @odoo-module **/

<<<<<<< HEAD
import tour from 'web_tour.tour';
=======
import { registry } from "@web/core/registry";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * Verify that a user can modify their own profile information.
 */
<<<<<<< HEAD
tour.register('mail/static/tests/tours/user_modify_own_profile_tour.js', {
    test: true,
}, [{
=======
registry.category("web_tour.tours").add('mail/static/tests/tours/user_modify_own_profile_tour.js', {
    test: true,
    steps: [{
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    content: 'Open user account menu',
    trigger: '.o_user_menu button',
}, {
    content: "Open preferences / profile screen",
    trigger: '[data-menu=settings]',
}, {
    content: "Update the email address",
    trigger: 'div[name="email"] input',
    run: 'text updatedemail@example.com',
}, {
    content: "Save the form",
    trigger: 'button[name="preference_save"]',
}, {
    content: "Wait until the modal is closed",
    trigger: 'body:not(.modal-open)',
<<<<<<< HEAD
}]);
=======
}]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
