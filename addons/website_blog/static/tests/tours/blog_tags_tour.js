/** @odoo-module **/

import wTourUtils from 'website.tour_utils';


/**
 * Makes sure that blog tags can be created and removed.
 */
wTourUtils.registerWebsitePreviewTour('blog_tags', {
    test: true,
    url: '/blog',
}, [{
        content: "Go to first blog",
        trigger: "iframe article[name=blog_post] a",
    },
    wTourUtils.clickOnEdit(),
    wTourUtils.clickOnSnippet('#o_wblog_post_top .o_wblog_post_page_cover'),
    {
        content: "Open tag dropdown",
        trigger: "we-customizeblock-option:contains(Tags) .o_we_m2m we-toggler",
    }, {
        content: "Enter tag name",
        trigger: "we-customizeblock-option:contains(Tags) we-selection-items .o_we_m2o_create input",
        run: "text testtag",
    }, {
        content: "Click Create",
        trigger: "we-customizeblock-option:contains(Tags) we-selection-items .o_we_m2o_create we-button",
    }, {
        content: "Verify tag appears in options",
        trigger: "we-customizeblock-option:contains(Tags) we-list input[data-name=testtag]",
<<<<<<< HEAD
        run: () => {}, // it's a check
=======
        isCheck: true,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },
    ...wTourUtils.clickOnSave(),
    {
        content: "Verify tag appears in blog post",
        trigger: "iframe #o_wblog_post_content .badge:contains(testtag)",
<<<<<<< HEAD
        run: () => {}, // it's a check
=======
        isCheck: true,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },
    wTourUtils.clickOnEdit(),
    wTourUtils.clickOnSnippet('#o_wblog_post_top .o_wblog_post_page_cover'),
    {
        content: "Remove tag",
        trigger: "we-customizeblock-option:contains(Tags) we-list tr:has(input[data-name=testtag]) we-button.fa-minus",
    }, {
        content: "Verify tag does not appear in options anymore",
        trigger: "we-customizeblock-option:contains(Tags) we-list:not(:has(input[data-name=testtag]))",
<<<<<<< HEAD
        run: () => {}, // it's a check
=======
        isCheck: true,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },
    ...wTourUtils.clickOnSave(),
    {
        content: "Verify tag does not appear in blog post anymore",
        trigger: "iframe #o_wblog_post_content div:has(.badge):not(:contains(testtag))",
        run: () => {}, // it's a check
<<<<<<< HEAD
=======
    }, {
        content: "Go back to /blog",
        trigger: "iframe #top_menu a[href='/blog'] span",
    }, {
        content: "Click on the adventure tag",
        trigger: "iframe a[href^='/blog/tag/adventure']",
    }, {
        content: "Verify we are still on the backend",
        trigger: "iframe span:contains(adventure) i.fa-tag",
        run: () => {}, // it's a check
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }]
);
