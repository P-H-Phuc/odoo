/** @odoo-module **/

<<<<<<< HEAD
import { PosLoyalty } from 'pos_loyalty.tour.PosCouponTourMethods';
import { ProductScreen } from 'point_of_sale.tour.ProductScreenTourMethods';
import { getSteps, startSteps } from 'point_of_sale.tour.utils';
import Tour from 'web_tour.tour';
=======
import { PosLoyalty } from "@pos_loyalty/tours/PosLoyaltyTourMethods";
import { ProductScreen } from "@point_of_sale/../tests/tours/helpers/ProductScreenTourMethods";
import { getSteps, startSteps } from "@point_of_sale/../tests/tours/helpers/utils";
import { registry } from "@web/core/registry";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// --- PoS Loyalty Tour Basic Part 1 ---
// Generate coupons for PosLoyaltyTour2.
startSteps();

ProductScreen.do.confirmOpeningPopup();
ProductScreen.do.clickHomeCategory();

// basic order
// just accept the automatically applied promo program
// applied programs:
//   - on cheapest product
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Whiteboard Pen', '5');
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-2.88');
PosLoyalty.do.selectRewardLine('on the cheapest product');
PosLoyalty.check.orderTotalIs('13.12');
PosLoyalty.exec.finalizeOrder('Cash', '20');

// remove the reward from auto promo program
// no applied programs
ProductScreen.exec.addOrderline('Whiteboard Pen', '6');
PosLoyalty.check.hasRewardLine('on the cheapest product', '-2.88');
PosLoyalty.check.orderTotalIs('16.32');
PosLoyalty.exec.removeRewardLine('90% on the cheapest product');
PosLoyalty.check.orderTotalIs('19.2');
PosLoyalty.exec.finalizeOrder('Cash', '20');
=======
ProductScreen.exec.addOrderline("Whiteboard Pen", "5");
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-2.88");
PosLoyalty.do.selectRewardLine("on the cheapest product");
PosLoyalty.check.orderTotalIs("13.12");
PosLoyalty.exec.finalizeOrder("Cash", "20");

// remove the reward from auto promo program
// no applied programs
ProductScreen.exec.addOrderline("Whiteboard Pen", "6");
PosLoyalty.check.hasRewardLine("on the cheapest product", "-2.88");
PosLoyalty.check.orderTotalIs("16.32");
PosLoyalty.exec.removeRewardLine("90% on the cheapest product");
PosLoyalty.check.orderTotalIs("19.2");
PosLoyalty.exec.finalizeOrder("Cash", "20");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// order with coupon code from coupon program
// applied programs:
//   - coupon program
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Desk Organizer', '9');
PosLoyalty.check.hasRewardLine('on the cheapest product', '-4.59');
PosLoyalty.exec.removeRewardLine('90% on the cheapest product');
PosLoyalty.check.orderTotalIs('45.90');
PosLoyalty.do.enterCode('invalid_code', false);
PosLoyalty.do.enterCode('1234');
PosLoyalty.check.hasRewardLine('Free Product - Desk Organizer', '-15.30');
PosLoyalty.exec.finalizeOrder('Cash', '50');
=======
ProductScreen.exec.addOrderline("Desk Organizer", "9");
PosLoyalty.check.hasRewardLine("on the cheapest product", "-4.59");
PosLoyalty.exec.removeRewardLine("90% on the cheapest product");
PosLoyalty.check.orderTotalIs("45.90");
PosLoyalty.do.enterCode("invalid_code", false);
PosLoyalty.check.notificationMessageContains("invalid_code");
PosLoyalty.do.enterCode("1234");
PosLoyalty.check.hasRewardLine("Free Product - Desk Organizer", "-15.30");
PosLoyalty.exec.finalizeOrder("Cash", "50");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// Use coupon but eventually remove the reward
// applied programs:
//   - on cheapest product
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Letter Tray', '4');
ProductScreen.exec.addOrderline('Desk Organizer', '9');
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-4.75');
PosLoyalty.check.orderTotalIs('62.27');
PosLoyalty.do.enterCode('5678');
PosLoyalty.check.hasRewardLine('Free Product - Desk Organizer', '-15.30');
PosLoyalty.check.orderTotalIs('46.97');
PosLoyalty.exec.removeRewardLine('Free Product');
PosLoyalty.check.orderTotalIs('62.27');
PosLoyalty.exec.finalizeOrder('Cash', '90');
=======
ProductScreen.exec.addOrderline("Letter Tray", "4");
ProductScreen.exec.addOrderline("Desk Organizer", "9");
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-4.75");
PosLoyalty.check.orderTotalIs("62.27");
PosLoyalty.do.enterCode("5678");
PosLoyalty.check.hasRewardLine("Free Product - Desk Organizer", "-15.30");
PosLoyalty.check.orderTotalIs("46.97");
PosLoyalty.exec.removeRewardLine("Free Product");
PosLoyalty.check.orderTotalIs("62.27");
PosLoyalty.exec.finalizeOrder("Cash", "90");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// specific product discount
// applied programs:
//   - on cheapest product
//   - on specific products
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Magnetic Board', '10') // 1.98
ProductScreen.exec.addOrderline('Desk Organizer', '3') // 5.1
ProductScreen.exec.addOrderline('Letter Tray', '4') // 4.8 tax 10%
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-1.78')
PosLoyalty.check.orderTotalIs('54.44')
PosLoyalty.do.enterCode('promocode', false)
PosLoyalty.check.hasRewardLine('50% on specific products', '-16.66') // 17.55 - 1.78*0.5
PosLoyalty.check.orderTotalIs('37.78')
PosLoyalty.exec.finalizeOrder('Cash', '50')

Tour.register('PosLoyaltyTour1', { test: true, url: '/pos/web' }, getSteps());
=======
ProductScreen.exec.addOrderline("Magnetic Board", "10"); // 1.98
ProductScreen.exec.addOrderline("Desk Organizer", "3"); // 5.1
ProductScreen.exec.addOrderline("Letter Tray", "4"); // 4.8 tax 10%
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-1.78");
PosLoyalty.check.orderTotalIs("54.44");
PosLoyalty.do.enterCode("promocode", false);
PosLoyalty.check.hasRewardLine("50% on specific products", "-16.66"); // 17.55 - 1.78*0.5
PosLoyalty.check.orderTotalIs("37.78");
PosLoyalty.exec.finalizeOrder("Cash", "50");

registry.category("web_tour.tours").add("PosLoyaltyTour1", { test: true, url: "/pos/web", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// --- PoS Loyalty Tour Basic Part 2 ---
// Using the coupons generated from PosLoyaltyTour1.
startSteps();

ProductScreen.do.clickHomeCategory();

// Test that global discount and cheapest product discounts can be accumulated.
// Applied programs:
//   - global discount
//   - on cheapest discount
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Desk Organizer', '10'); // 5.1
PosLoyalty.check.hasRewardLine('on the cheapest product', '-4.59');
ProductScreen.exec.addOrderline('Letter Tray', '4'); // 4.8 tax 10%
PosLoyalty.check.hasRewardLine('on the cheapest product', '-4.75');
PosLoyalty.do.enterCode('123456');
PosLoyalty.check.hasRewardLine('10% on your order', '-5.10');
PosLoyalty.check.hasRewardLine('10% on your order', '-1.64');
PosLoyalty.check.orderTotalIs('60.63'); //SUBTOTAL
PosLoyalty.exec.finalizeOrder('Cash', '70');
=======
ProductScreen.exec.addOrderline("Desk Organizer", "10"); // 5.1
PosLoyalty.check.hasRewardLine("on the cheapest product", "-4.59");
ProductScreen.exec.addOrderline("Letter Tray", "4"); // 4.8 tax 10%
PosLoyalty.check.hasRewardLine("on the cheapest product", "-4.75");
PosLoyalty.do.enterCode("123456");
PosLoyalty.check.hasRewardLine("10% on your order", "-5.10");
PosLoyalty.check.hasRewardLine("10% on your order", "-1.64");
PosLoyalty.check.orderTotalIs("60.63"); //SUBTOTAL
PosLoyalty.exec.finalizeOrder("Cash", "70");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// Scanning coupon twice.
// Also apply global discount on top of free product to check if the
// calculated discount is correct.
// Applied programs:
//  - coupon program (free product)
//  - global discount
//  - on cheapest discount
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Desk Organizer', '11'); // 5.1 per item
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-4.59');
PosLoyalty.check.orderTotalIs('51.51');
// add global discount and the discount will be replaced
PosLoyalty.do.enterCode('345678');
PosLoyalty.check.hasRewardLine('10% on your order', '-5.15');
// add free product coupon (for qty=11, free=4)
// the discount should change after having free products
// it should go back to cheapest discount as it is higher
PosLoyalty.do.enterCode('5678');
PosLoyalty.check.hasRewardLine('Free Product - Desk Organizer', '-20.40');
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-4.59');
// set quantity to 18
// free qty stays the same since the amount of points on the card only allows for 4 free products
ProductScreen.do.pressNumpad('Backspace 8')
PosLoyalty.check.hasRewardLine('10% on your order', '-6.68');
PosLoyalty.check.hasRewardLine('Free Product - Desk Organizer', '-20.40');
// scan the code again and check notification
PosLoyalty.do.enterCode('5678');
PosLoyalty.check.orderTotalIs('60.13');
PosLoyalty.exec.finalizeOrder('Cash', '65');
=======
ProductScreen.exec.addOrderline("Desk Organizer", "11"); // 5.1 per item
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-4.59");
PosLoyalty.check.orderTotalIs("51.51");
// add global discount and the discount will be replaced
PosLoyalty.do.enterCode("345678");
PosLoyalty.check.hasRewardLine("10% on your order", "-5.15");
// add free product coupon (for qty=11, free=4)
// the discount should change after having free products
// it should go back to cheapest discount as it is higher
PosLoyalty.do.enterCode("5678");
PosLoyalty.check.hasRewardLine("Free Product - Desk Organizer", "-20.40");
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-4.59");
// set quantity to 18
// free qty stays the same since the amount of points on the card only allows for 4 free products
ProductScreen.do.pressNumpad("Backspace 8");
PosLoyalty.check.hasRewardLine("10% on your order", "-6.68");
PosLoyalty.check.hasRewardLine("Free Product - Desk Organizer", "-20.40");
// scan the code again and check notification
PosLoyalty.do.enterCode("5678");
PosLoyalty.check.orderTotalIs("60.13");
PosLoyalty.exec.finalizeOrder("Cash", "65");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// Specific products discount (with promocode) and free product (1357)
// Applied programs:
//   - discount on specific products
//   - free product
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Desk Organizer', '6'); // 5.1 per item
PosLoyalty.check.hasRewardLine('on the cheapest product', '-4.59');
PosLoyalty.exec.removeRewardLine('90% on the cheapest product');
PosLoyalty.do.enterCode('promocode', false);
PosLoyalty.check.hasRewardLine('50% on specific products', '-15.30');
PosLoyalty.do.enterCode('1357');
PosLoyalty.check.hasRewardLine('Free Product - Desk Organizer', '-10.20');
PosLoyalty.check.hasRewardLine('50% on specific products', '-10.20');
PosLoyalty.check.orderTotalIs('10.20');
PosLoyalty.exec.finalizeOrder('Cash', '20');
=======
ProductScreen.exec.addOrderline("Desk Organizer", "6"); // 5.1 per item
PosLoyalty.check.hasRewardLine("on the cheapest product", "-4.59");
PosLoyalty.exec.removeRewardLine("90% on the cheapest product");
PosLoyalty.do.enterCode("promocode", false);
PosLoyalty.check.hasRewardLine("50% on specific products", "-15.30");
PosLoyalty.do.enterCode("1357");
PosLoyalty.check.hasRewardLine("Free Product - Desk Organizer", "-10.20");
PosLoyalty.check.hasRewardLine("50% on specific products", "-10.20");
PosLoyalty.check.orderTotalIs("10.20");
PosLoyalty.exec.finalizeOrder("Cash", "20");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// Check reset program
// Enter two codes and reset the programs.
// The codes should be checked afterwards. They should return to new.
// Applied programs:
//   - cheapest product
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Monitor Stand', '6'); // 3.19 per item
PosLoyalty.do.enterCode('098765');
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-2.87');
PosLoyalty.check.hasRewardLine('10% on your order', '-1.63');
PosLoyalty.check.orderTotalIs('14.64');
PosLoyalty.exec.removeRewardLine('90% on the cheapest product');
PosLoyalty.check.hasRewardLine('10% on your order', '-1.91');
PosLoyalty.check.orderTotalIs('17.23');
PosLoyalty.do.resetActivePrograms();
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-2.87');
PosLoyalty.check.orderTotalIs('16.27');
PosLoyalty.exec.finalizeOrder('Cash', '20');

Tour.register('PosLoyaltyTour2', { test: true, url: '/pos/web' }, getSteps());
=======
ProductScreen.exec.addOrderline("Monitor Stand", "6"); // 3.19 per item
PosLoyalty.do.enterCode("098765");
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-2.87");
PosLoyalty.check.hasRewardLine("10% on your order", "-1.63");
PosLoyalty.check.orderTotalIs("14.64");
PosLoyalty.exec.removeRewardLine("90% on the cheapest product");
PosLoyalty.check.hasRewardLine("10% on your order", "-1.91");
PosLoyalty.check.orderTotalIs("17.23");
PosLoyalty.do.resetActivePrograms();
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-2.87");
PosLoyalty.check.orderTotalIs("16.27");
PosLoyalty.exec.finalizeOrder("Cash", "20");

registry.category("web_tour.tours").add("PosLoyaltyTour2", { test: true, url: "/pos/web", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// --- PoS Loyalty Tour Basic Part 3 ---

startSteps();

ProductScreen.do.confirmOpeningPopup();
ProductScreen.do.clickHomeCategory();

<<<<<<< HEAD
ProductScreen.do.clickDisplayedProduct('Promo Product');
PosLoyalty.check.orderTotalIs('34.50');
ProductScreen.do.clickDisplayedProduct('Product B');
PosLoyalty.check.hasRewardLine('100% on specific products', '25.00');
ProductScreen.do.clickDisplayedProduct('Product A');
PosLoyalty.check.hasRewardLine('100% on specific products', '15.00');
PosLoyalty.check.orderTotalIs('34.50');
ProductScreen.do.clickDisplayedProduct('Product A');
PosLoyalty.check.hasRewardLine('100% on specific products', '21.82');
PosLoyalty.check.hasRewardLine('100% on specific products', '18.18');
PosLoyalty.check.orderTotalIs('49.50');


Tour.register('PosLoyaltyTour3', { test: true, url: '/pos/web' }, getSteps());
=======
ProductScreen.do.clickDisplayedProduct("Promo Product");
PosLoyalty.check.orderTotalIs("34.50");
ProductScreen.do.clickDisplayedProduct("Product B");
PosLoyalty.check.hasRewardLine("100% on specific products", "25.00");
ProductScreen.do.clickDisplayedProduct("Product A");
PosLoyalty.check.hasRewardLine("100% on specific products", "15.00");
PosLoyalty.check.orderTotalIs("34.50");
ProductScreen.do.clickDisplayedProduct("Product A");
PosLoyalty.check.hasRewardLine("100% on specific products", "21.82");
PosLoyalty.check.hasRewardLine("100% on specific products", "18.18");
PosLoyalty.check.orderTotalIs("49.50");

registry.category("web_tour.tours").add("PosLoyaltyTour3", { test: true, url: "/pos/web", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

startSteps();

ProductScreen.do.confirmOpeningPopup();
ProductScreen.do.clickHomeCategory();

<<<<<<< HEAD
ProductScreen.exec.addOrderline('Test Product 1', '1');
ProductScreen.exec.addOrderline('Test Product 2', '1');
ProductScreen.do.clickPricelistButton();
ProductScreen.do.selectPriceList('Public Pricelist');
PosLoyalty.do.enterCode('abcda');
PosLoyalty.check.orderTotalIs('0.00');
ProductScreen.do.clickPricelistButton();
ProductScreen.do.selectPriceList('Test multi-currency');
PosLoyalty.check.orderTotalIs('0.00');

Tour.register('PosLoyaltyTour4', { test: true, url: '/pos/web' }, getSteps());
=======
ProductScreen.exec.addOrderline("Test Product 1", "1");
ProductScreen.exec.addOrderline("Test Product 2", "1");
ProductScreen.do.clickPricelistButton();
ProductScreen.do.selectPriceList("Public Pricelist");
PosLoyalty.do.enterCode("abcda");
PosLoyalty.check.orderTotalIs("0.00");
ProductScreen.do.clickPricelistButton();
ProductScreen.do.selectPriceList("Test multi-currency");
PosLoyalty.check.orderTotalIs("0.00");

registry.category("web_tour.tours").add("PosLoyaltyTour4", { test: true, url: "/pos/web", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

startSteps();

ProductScreen.do.clickHomeCategory();

ProductScreen.exec.addOrderline('Test Product 1', '1.00', '100');
PosLoyalty.do.clickDiscountButton();
PosLoyalty.do.clickConfirmButton();
ProductScreen.check.totalAmountIs('92.00');

<<<<<<< HEAD
Tour.register('PosLoyaltyTour5', { test: true, url: '/pos/web' }, getSteps());
=======
registry.category("web_tour.tours").add('PosCouponTour5', { test: true, url: '/pos/web', steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
