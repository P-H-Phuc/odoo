odoo.define('hr_holidays.tour_time_off_request_calendar_view', function (require) {
'use strict';

<<<<<<< HEAD
var tour = require('web_tour.tour');

tour.register('time_off_request_calendar_view', {
    test: true,
    url: '/web',
},
[
    tour.stepUtils.showAppsMenuItem(),
=======
const { registry } = require("@web/core/registry");
const { stepUtils } = require('@web_tour/tour_service/tour_utils');

registry.category("web_tour.tours").add('time_off_request_calendar_view', {
    test: true,
    url: '/web',
    steps: [stepUtils.showAppsMenuItem(),
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    {
        content: "Open Time Off app",
        trigger: '.o_app[data-menu-xmlid="hr_holidays.menu_hr_holidays_root"]',
    },
    {
        content: "Click on the first Thursday of the year",
        trigger: '.fc-day-top.fc-thu',
        run: () => {
            const el = document.querySelector('.fc-day-top.fc-thu').firstChild;
            const fromPosition = el.getBoundingClientRect();
            fromPosition.x += el.offsetWidth / 2;
            fromPosition.y += el.offsetHeight / 2;

            el.dispatchEvent(new MouseEvent("mousedown", {
                bubbles: true,
                which: 1,
                button: 0,
                clientX: fromPosition.x,
                clientY: fromPosition.y}));
            el.dispatchEvent(new MouseEvent("mouseup", {
                bubbles: true,
                which: 1,
                button: 0,
                clientX: fromPosition.x,
                clientY: fromPosition.y }));
        }
    },
    {
        content: "Save the leave",
        trigger: '.btn:contains("Save")',
        run: 'click',
    }
<<<<<<< HEAD
]);
=======
]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});
