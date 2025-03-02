odoo.define("website_mass_mailing.tour.newsletter_popup_edition", function (require) {
"use strict";

const { registry } = require("@web/core/registry");
const wTourUtils = require('website.tour_utils');
const newsletterPopupUseTour = require('website_mass_mailing.tour.newsletter_popup_use');

registry.category("web_tour.tours").add('newsletter_popup_edition', {
    test: true,
    url: '/?enable_editor=1',
    steps: [
    wTourUtils.dragNDrop({
        id: 's_newsletter_subscribe_popup',
        name: 'Newsletter Popup',
    }),
    {
        content: "Check the modal is opened for edition",
        trigger: 'iframe .o_newsletter_popup .modal:visible',
        in_modal: false,
        run: () => null,
    },
    ...wTourUtils.clickOnSave(),
    {
        content: "Check the modal has been saved, closed",
        trigger: 'iframe body:has(.o_newsletter_popup)',
        extra_trigger: 'iframe body:not(.editor_enable)',
        run: newsletterPopupUseTour.ensurePopupNotVisible,
    }
<<<<<<< HEAD
]);
=======
]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});

odoo.define("website_mass_mailing.tour.newsletter_popup_use", function (require) {
"use strict";

const { registry } = require("@web/core/registry");

function ensurePopupNotVisible() {
    const $modal = this.$anchor.find('.o_newsletter_popup .modal');
    if ($modal.length !== 1) {
        // Avoid the tour to succeed if the modal can't be found while
        // it should. Indeed, if the selector ever becomes wrong and the
        // expected element is actually not found anymore, the test
        // won't be testing anything anymore as the visible check will
        // always be truthy on empty jQuery element.
        console.error("Modal couldn't be found in the DOM. The tour is not working as expected.");
    }
    if ($modal.is(':visible')) {
        console.error('Modal should not be opened.');
    }
}

<<<<<<< HEAD
tour.register('newsletter_popup_use', {
=======
registry.category("web_tour.tours").add('newsletter_popup_use', {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    test: true,
    url: '/',
    steps: [
    {
        content: "Check the modal is not yet opened and force it opened",
        trigger: 'body:has(.o_newsletter_popup)',
        run: ensurePopupNotVisible,
    },
    {
        content: "Check the modal is now opened and enter text in the subscribe input",
        trigger: '.o_newsletter_popup .modal input',
        in_modal: false,
        run: 'text hello@world.com',
    },
    {
        content: "Subscribe",
        trigger: '.modal-dialog .btn-primary',
    },
    {
        content: "Check the modal is now closed",
<<<<<<< HEAD
        trigger: 'body:has(.o_newsletter_popup)',
        run: ensurePopupNotVisible,
    }
]);
=======
        trigger: 'body:not(.modal-open)',
        run: ensurePopupNotVisible,
    }
]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

return {
    ensurePopupNotVisible: ensurePopupNotVisible,
};
});
