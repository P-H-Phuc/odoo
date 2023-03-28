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

// First tour should not get any automatic rewards
startSteps();

ProductScreen.do.confirmOpeningPopup();
ProductScreen.do.clickHomeCategory();

// Not valid -> date
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Whiteboard Pen', '5');
PosLoyalty.check.checkNoClaimableRewards();
PosLoyalty.exec.finalizeOrder('Cash', '20');

Tour.register('PosLoyaltyValidity1', { test: true, url: '/pos/web' }, getSteps());
=======
ProductScreen.exec.addOrderline("Whiteboard Pen", "5");
PosLoyalty.check.checkNoClaimableRewards();
PosLoyalty.exec.finalizeOrder("Cash", "20");

registry.category("web_tour.tours").add("PosLoyaltyValidity1", { test: true, url: "/pos/web", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

// Second tour
startSteps();

ProductScreen.do.clickHomeCategory();

// Valid
<<<<<<< HEAD
ProductScreen.exec.addOrderline('Whiteboard Pen', '5');
PosLoyalty.check.hasRewardLine('90% on the cheapest product', '-2.88');
PosLoyalty.exec.finalizeOrder('Cash', '20');

// Not valid -> usage
ProductScreen.exec.addOrderline('Whiteboard Pen', '5');
PosLoyalty.check.checkNoClaimableRewards();
PosLoyalty.exec.finalizeOrder('Cash', '20');

Tour.register('PosLoyaltyValidity2', { test: true, url: '/pos/web' }, getSteps());
=======
ProductScreen.exec.addOrderline("Whiteboard Pen", "5");
PosLoyalty.check.hasRewardLine("90% on the cheapest product", "-2.88");
PosLoyalty.exec.finalizeOrder("Cash", "20");

// Not valid -> usage
ProductScreen.exec.addOrderline("Whiteboard Pen", "5");
PosLoyalty.check.checkNoClaimableRewards();
PosLoyalty.exec.finalizeOrder("Cash", "20");

registry.category("web_tour.tours").add("PosLoyaltyValidity2", { test: true, url: "/pos/web", steps: getSteps() });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
