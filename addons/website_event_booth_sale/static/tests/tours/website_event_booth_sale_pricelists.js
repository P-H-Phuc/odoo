/** @odoo-module **/

<<<<<<< HEAD
import tour from 'web_tour.tour';
import { getPriceListChecksSteps } from 'website_event_booth_sale.tour.WebsiteEventBoothSaleTourMethods';

tour.register('event_booth_sale_pricelists_different_currencies', {
    test: true,
    url: '/event',
}, [
=======
import { registry } from "@web/core/registry";
import { getPriceListChecksSteps } from 'website_event_booth_sale.tour.WebsiteEventBoothSaleTourMethods';

registry.category("web_tour.tours").add('event_booth_sale_pricelists_different_currencies', {
    test: true,
    url: '/event',
    steps: [
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    // Init: registering the booth
    {
        content: 'Open "Test Event Booths" event',
        trigger: 'h5.card-title span:contains("Test Event Booths")',
    },
    {
        content: 'Go to "Get A Booth" page',
        trigger: 'li.nav-item a:has(span:contains("Get A Booth"))',
    },
    {
        content: 'Select the booth',
        trigger: '.o_wbooth_booths input[name="event_booth_ids"]',
        run: function () {
            $('.o_wbooth_booths input[name="event_booth_ids"]:lt(1)').click();
        },
    },
    {
        content: 'Confirm the booth by clicking the submit button',
        trigger: 'button.o_wbooth_registration_submit',
    },
    {
        content: 'Fill in your contact information',
        trigger: 'input[name="contact_name"]',
        run: function () {
            $('input[name="contact_name"]').val('John Doe');
            $('input[name="contact_email"]').val('jdoe@example.com');
        },
    },
    {
        content: 'Submit your informations',
        trigger: 'button[type="submit"]',
    }, {
        content: 'Checkout your order',
        trigger: 'a[role="button"] span:contains("Process Checkout")',
    },
    ...getPriceListChecksSteps({
        pricelistName: "EUR With Discount Included",
        eventName: "Test Event Booths",
<<<<<<< HEAD
        price: "90.00",
        priceSelected: "90",
=======
        price: "99.00",
        priceSelected: "99",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        priceCart: "99.00",
    }),
    ...getPriceListChecksSteps({
        pricelistName: "EUR Without Discount Included",
        eventName: "Test Event Booths",
<<<<<<< HEAD
        price: "90.00",
        priceSelected: "90",
        priceCart: "99.00",
        priceBeforeDiscount: "100.00",
=======
        price: "99.00",
        priceSelected: "99",
        priceCart: "99.00",
        priceBeforeDiscount: "110.00",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }),
    ...getPriceListChecksSteps({
        pricelistName: "EX With Discount Included",
        eventName: "Test Event Booths",
<<<<<<< HEAD
        price: "900.00",
        priceSelected: "900",
=======
        price: "990.00",
        priceSelected: "990",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        priceCart: "990.00",
    }),
    ...getPriceListChecksSteps({
        pricelistName: "EX Without Discount Included",
        eventName: "Test Event Booths",
<<<<<<< HEAD
        price: "900.00",
        priceSelected: "900",
        priceCart: "990.00",
        priceBeforeDiscount: "1,000.00",
    }),
]);
=======
        price: "990.00",
        priceSelected: "990",
        priceCart: "990.00",
        priceBeforeDiscount: "1,100.00",
    }),
]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
