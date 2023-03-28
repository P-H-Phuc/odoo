/** @odoo-module **/

<<<<<<< HEAD
import tour from 'web_tour.tour';
=======
import { registry } from "@web/core/registry";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * Makes sure that blog search can be used with the date filtering.
 */
<<<<<<< HEAD
tour.register('blog_autocomplete_with_date', {
    test: true,
    url: '/blog',
}, [{
=======
registry.category("web_tour.tours").add("blog_autocomplete_with_date", {
    test: true,
    url: '/blog',
    steps: [{
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    content: "Select first month",
    trigger: 'select[name=archive]',
    run: 'text option 2',
}, {
    content: "Enter search term",
    trigger: '.o_searchbar_form input',
    extra_trigger: '#o_wblog_posts_loop span:has(i.fa-calendar-o):has(a[href="/blog"])',
    run: 'text a',
}, {
    content: "Wait for suggestions then click on search icon",
    extra_trigger: '.o_searchbar_form .o_dropdown_menu .o_search_result_item',
    trigger: '.o_searchbar_form button:has(i.oi-search)',
}, {
    content: "Ensure both filters are applied",
    trigger: '#o_wblog_posts_loop:has(span:has(i.fa-calendar-o):has(a[href="/blog?search=a"])):has(span:has(i.fa-search):has(a[href^="/blog?date_begin"]))',
    run: () => {}, // This is a check.
<<<<<<< HEAD
}]);
=======
}]});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
