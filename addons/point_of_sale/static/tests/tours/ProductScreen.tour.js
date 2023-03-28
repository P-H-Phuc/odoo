/** @odoo-module */

import { ProductScreen } from "@point_of_sale/../tests/tours/helpers/ProductScreenTourMethods";
import { TextAreaPopup } from "@point_of_sale/../tests/tours/helpers/TextAreaPopupTourMethods";
import { getSteps, startSteps } from "@point_of_sale/../tests/tours/helpers/utils";
import { registry } from "@web/core/registry";

// signal to start generating steps
// when finished, steps can be taken from getSteps
startSteps();

// Go by default to home category
ProductScreen.do.clickHomeCategory();

// Clicking product multiple times should increment quantity
ProductScreen.do.clickDisplayedProduct("Desk Organizer");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "1.0", "5.10");
ProductScreen.do.clickDisplayedProduct("Desk Organizer");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "2.0", "10.20");

// Clicking product should add new orderline and select the orderline
// If orderline exists, increment the quantity
ProductScreen.do.clickDisplayedProduct("Letter Tray");
ProductScreen.check.selectedOrderlineHas("Letter Tray", "1.0", "5.28");
ProductScreen.do.clickDisplayedProduct("Desk Organizer");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "3.0", "15.30");

// Check effects of clicking numpad buttons
ProductScreen.do.clickOrderline("Letter Tray", "1");
ProductScreen.check.selectedOrderlineHas("Letter Tray", "1.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Letter Tray", "0.0", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "3", "15.30");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "0.0", "0.0");
ProductScreen.do.pressNumpad("1");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "1.0", "5.1");
ProductScreen.do.pressNumpad("2");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "12.0", "61.2");
ProductScreen.do.pressNumpad("3");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "123.0", "627.3");
ProductScreen.do.pressNumpad(". 5");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "123.5", "629.85");
ProductScreen.do.pressNumpad("Price");
ProductScreen.check.modeIsActive("Price");
ProductScreen.do.pressNumpad("1");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "123.5", "123.5");
ProductScreen.do.pressNumpad("1 .");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "123.5", "1,358.5");
ProductScreen.do.pressNumpad("Disc");
ProductScreen.check.modeIsActive("Disc");
ProductScreen.do.pressNumpad("5 .");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "123.5", "1,290.58");
ProductScreen.do.pressNumpad("Qty");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.orderIsEmpty();

<<<<<<< HEAD
    // Check different subcategories
    ProductScreen.do.clickSubcategory('Desks');
    ProductScreen.check.productIsDisplayed('Desk Pad');
    ProductScreen.do.clickHomeCategory();
    ProductScreen.do.clickSubcategory('Miscellaneous');
    ProductScreen.check.productIsDisplayed('Whiteboard Pen');
    ProductScreen.do.clickHomeCategory();
    ProductScreen.do.clickSubcategory('Chairs');
    ProductScreen.check.productIsDisplayed('Letter Tray');
    ProductScreen.do.clickHomeCategory();
    
    // Add two orderlines and update quantity
    ProductScreen.do.clickDisplayedProduct('Whiteboard Pen');
    ProductScreen.do.clickDisplayedProduct('Wall Shelf Unit');
    ProductScreen.do.clickOrderline('Whiteboard Pen', '1.0');
    ProductScreen.check.selectedOrderlineHas('Whiteboard Pen', '1.0');
    ProductScreen.do.pressNumpad('2');
    ProductScreen.check.selectedOrderlineHas('Whiteboard Pen', '2.0');
    ProductScreen.do.clickOrderline('Wall Shelf Unit', '1.0');
    ProductScreen.check.selectedOrderlineHas('Wall Shelf Unit', '1.0');
    ProductScreen.do.pressNumpad('2');
    ProductScreen.check.selectedOrderlineHas('Wall Shelf Unit', '2.0');
    ProductScreen.do.pressNumpad('Backspace');
    ProductScreen.check.selectedOrderlineHas('Wall Shelf Unit', '0.0');
    ProductScreen.do.pressNumpad('Backspace');
    ProductScreen.check.selectedOrderlineHas('Whiteboard Pen', '2.0');
    ProductScreen.do.pressNumpad('Backspace');
    ProductScreen.check.selectedOrderlineHas('Whiteboard Pen', '0.0');
    ProductScreen.do.pressNumpad('Backspace');
    ProductScreen.check.orderIsEmpty();
=======
// Check different subcategories
ProductScreen.do.clickSubcategory("Desks");
ProductScreen.check.productIsDisplayed("Desk Pad");
ProductScreen.do.clickHomeCategory();
ProductScreen.do.clickSubcategory("Miscellaneous");
ProductScreen.check.productIsDisplayed("Whiteboard Pen");
ProductScreen.do.clickHomeCategory();
ProductScreen.do.clickSubcategory("Chairs");
ProductScreen.check.productIsDisplayed("Letter Tray");
ProductScreen.do.clickHomeCategory();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// Add two orderlines and update quantity
ProductScreen.do.clickDisplayedProduct("Whiteboard Pen");
ProductScreen.do.clickDisplayedProduct("Wall Shelf Unit");
ProductScreen.do.clickOrderline("Whiteboard Pen", "1.0");
ProductScreen.check.selectedOrderlineHas("Whiteboard Pen", "1.0");
ProductScreen.do.pressNumpad("2");
ProductScreen.check.selectedOrderlineHas("Whiteboard Pen", "2.0");
ProductScreen.do.clickOrderline("Wall Shelf Unit", "1.0");
ProductScreen.check.selectedOrderlineHas("Wall Shelf Unit", "1.0");
ProductScreen.do.pressNumpad("2");
ProductScreen.check.selectedOrderlineHas("Wall Shelf Unit", "2.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Wall Shelf Unit", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Whiteboard Pen", "2.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Whiteboard Pen", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.orderIsEmpty();

// Add multiple orderlines then delete each of them until empty
ProductScreen.do.clickDisplayedProduct("Whiteboard Pen");
ProductScreen.do.clickDisplayedProduct("Wall Shelf Unit");
ProductScreen.do.clickDisplayedProduct("Small Shelf");
ProductScreen.do.clickDisplayedProduct("Magnetic Board");
ProductScreen.do.clickDisplayedProduct("Monitor Stand");
ProductScreen.do.clickOrderline("Whiteboard Pen", "1.0");
ProductScreen.check.selectedOrderlineHas("Whiteboard Pen", "1.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Whiteboard Pen", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Monitor Stand", "1.0");
ProductScreen.do.clickOrderline("Wall Shelf Unit", "1.0");
ProductScreen.check.selectedOrderlineHas("Wall Shelf Unit", "1.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Wall Shelf Unit", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Monitor Stand", "1.0");
ProductScreen.do.clickOrderline("Small Shelf", "1.0");
ProductScreen.check.selectedOrderlineHas("Small Shelf", "1.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Small Shelf", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Monitor Stand", "1.0");
ProductScreen.do.clickOrderline("Magnetic Board", "1.0");
ProductScreen.check.selectedOrderlineHas("Magnetic Board", "1.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Magnetic Board", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Monitor Stand", "1.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.selectedOrderlineHas("Monitor Stand", "0.0");
ProductScreen.do.pressNumpad("Backspace");
ProductScreen.check.orderIsEmpty();

// Test OrderlineCustomerNoteButton
ProductScreen.do.clickDisplayedProduct("Desk Organizer");
ProductScreen.check.selectedOrderlineHas("Desk Organizer", "1.0");
ProductScreen.do.clickOrderlineCustomerNoteButton();
TextAreaPopup.check.isShown();
TextAreaPopup.do.inputText("Test customer note");
TextAreaPopup.do.clickConfirm();
ProductScreen.check.orderlineHasCustomerNote("Desk Organizer", "1", "Test customer note");

<<<<<<< HEAD
    Tour.register('ProductScreenTour', { test: true, url: '/pos/ui' }, getSteps());

    startSteps();

    ProductScreen.do.clickHomeCategory();
    ProductScreen.do.clickDisplayedProduct('Test Product');
    ProductScreen.check.totalAmountIs('100.00');
    ProductScreen.do.changeFiscalPosition('No Tax');
    ProductScreen.check.noDiscountApplied("100.00");
    ProductScreen.check.totalAmountIs('86.96');

    Tour.register('FiscalPositionNoTax', { test: true, url: '/pos/ui' }, getSteps());
});
=======
registry.category("web_tour.tours").add("ProductScreenTour", { test: true, url: "/pos/ui", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

startSteps();

ProductScreen.do.enterOpeningAmount('90');
ProductScreen.do.confirmOpeningPopup();
ProductScreen.check.checkSecondCashClosingDetailsLineAmount('10.00', '-');

<<<<<<< HEAD
    startSteps();

    ProductScreen.do.clickHomeCategory();

    ProductScreen.do.clickDisplayedProduct('Zero Amount Product');
    ProductScreen.check.selectedOrderlineHas('Zero Amount Product', '1.0', '1.0');
    ProductScreen.do.pressNumpad('+/- 1');
    ProductScreen.check.selectedOrderlineHas('Zero Amount Product', '-1.0', '-1.0');

    ProductScreen.do.clickPayButton();
    PaymentScreen.do.clickPaymentMethod('Bank');
    PaymentScreen.check.remainingIs('0.00');
    PaymentScreen.do.clickValidate();

    ReceiptScreen.check.receiptIsThere();

    Tour.register('FixedTaxNegativeQty', { test: true, url: '/pos/ui' }, getSteps());
});

odoo.define('point_of_sale.tour.OpenCloseCashCount', function (require) {
    'use strict';

    const { ProductScreen } = require('point_of_sale.tour.ProductScreenTourMethods');
    const { getSteps, startSteps } = require('point_of_sale.tour.utils');
    var Tour = require('web_tour.tour');

    startSteps();

    ProductScreen.do.enterOpeningAmount('90');
    ProductScreen.do.confirmOpeningPopup();
    ProductScreen.check.checkSecondCashClosingDetailsLineAmount('10.00', '-');

    Tour.register('CashClosingDetails', { test: true, url: '/pos/ui' }, getSteps());
});
=======
registry.category("web_tour.tours").add("CashClosingDetails", { test: true, url: "/pos/ui", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
