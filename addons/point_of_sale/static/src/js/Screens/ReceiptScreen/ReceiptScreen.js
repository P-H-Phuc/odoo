/** @odoo-module */

import { Printer } from "@point_of_sale/js/printers";
import { is_email } from "web.utils";
import { useErrorHandlers } from "@point_of_sale/js/custom_hooks";
import { AbstractReceiptScreen } from "@point_of_sale/js/Misc/AbstractReceiptScreen";
import { OfflineErrorPopup } from "@point_of_sale/js/Popups/OfflineErrorPopup";
import { registry } from "@web/core/registry";
import { OrderReceipt } from "./OrderReceipt";
import { onMounted, useRef, status } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/pos_hook";
import { useService } from "@web/core/utils/hooks";

export class ReceiptScreen extends AbstractReceiptScreen {
    static template = "ReceiptScreen";
    static components = { OrderReceipt };

    setup() {
        super.setup();
        this.pos = usePos();
        useErrorHandlers();
        this.orm = useService("orm");
        this.orderReceipt = useRef("order-receipt");
        this.buttonMailReceipt = useRef("order-mail-receipt-button");
        this.buttonPrintReceipt = useRef("order-print-receipt-button");
        this.currentOrder = this.env.pos.get_order();
        const partner = this.currentOrder.get_partner();
        this.orderUiState = this.currentOrder.uiState.ReceiptScreen;
        this.orderUiState.inputEmail =
            this.orderUiState.inputEmail || (partner && partner.email) || "";
        this.is_email = is_email;

<<<<<<< HEAD
                onMounted(() => {
                    // Here, we send a task to the event loop that handles
                    // the printing of the receipt when the component is mounted.
                    // We are doing this because we want the receipt screen to be
                    // displayed regardless of what happen to the handleAutoPrint
                    // call.
                    setTimeout(async () => {
                        if (status(this) === "mounted") {
                            let images = this.orderReceipt.el.getElementsByTagName('img');
                            for (let image of images) {
                                await image.decode();
                            }
                            await this.handleAutoPrint();
                        }
                    }, 0);
                });
            }
            _addNewOrder() {
                this.env.pos.add_new_order();
            }
            async onSendEmail() {
                if (!is_email(this.orderUiState.inputEmail)) {
                    this.orderUiState.emailSuccessful = false;
                    this.orderUiState.emailNotice = this.env._t('Invalid email.');
                    return;
                }
                try {
                    await this._sendReceiptToCustomer();
                    this.orderUiState.emailSuccessful = true;
                    this.orderUiState.emailNotice = this.env._t('Email sent.');
                } catch (_error) {
                    this.orderUiState.emailSuccessful = false;
                    this.orderUiState.emailNotice = this.env._t('Sending email failed. Please try again.');
                }
            }
            get orderAmountPlusTip() {
                const order = this.currentOrder;
                const orderTotalAmount = order.get_total_with_tax();
                const tip_product_id = this.env.pos.config.tip_product_id && this.env.pos.config.tip_product_id[0];
                const tipLine = order
                    .get_orderlines()
                    .find((line) => tip_product_id && line.product.id === tip_product_id);
                const tipAmount = tipLine ? tipLine.get_all_prices().priceWithTax : 0;
                const orderAmountStr = this.env.pos.format_currency(orderTotalAmount - tipAmount);
                if (!tipAmount) return orderAmountStr;
                const tipAmountStr = this.env.pos.format_currency(tipAmount);
                return `${orderAmountStr} + ${tipAmountStr} tip`;
            }
            get currentOrder() {
                return this.env.pos.get_order();
            }
            get nextScreen() {
                return { name: 'ProductScreen' };
            }
            whenClosing() {
                this.orderDone();
            }
            /**
             * This function is called outside the rendering call stack. This way,
             * we don't block the displaying of ReceiptScreen when it is mounted; additionally,
             * any error that can happen during the printing does not affect the rendering.
             */
            async handleAutoPrint() {
                if (this._shouldAutoPrint()) {
                    const currentOrder = this.currentOrder;
                    await this.printReceipt();
                    if (this.currentOrder && this.currentOrder === currentOrder && currentOrder._printed && this._shouldCloseImmediately()) {
                        this.whenClosing();
=======
        onMounted(() => {
            // Here, we send a task to the event loop that handles
            // the printing of the receipt when the component is mounted.
            // We are doing this because we want the receipt screen to be
            // displayed regardless of what happen to the handleAutoPrint
            // call.
            setTimeout(async () => {
                if (status(this) === "mounted") {
                    const images = this.orderReceipt.el.getElementsByTagName("img");
                    for (const image of images) {
                        await image.decode();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    }
                    await this.handleAutoPrint();
                }
            }, 0);
        });
    }
    _addNewOrder() {
        this.env.pos.add_new_order();
    }
    onSendEmail() {
        if (this.buttonMailReceipt.el.classList.contains("fa-spin")) {
            this.orderUiState.emailSuccessful = false;
            this.orderUiState.emailNotice = this.env._t("Sending in progress.");
            return;
        }
        this.buttonMailReceipt.el.className = "fa fa-fw fa-spin fa-circle-o-notch";
        this.orderUiState.emailNotice = "";

        if (!is_email(this.orderUiState.inputEmail)) {
            this.orderUiState.emailSuccessful = false;
            this.buttonMailReceipt.el.className = "fa fa-paper-plane";
            this.orderUiState.emailNotice = this.env._t("Invalid email.");
            return;
        }

        // Delay to allow the user to see the wheel that informs that the mail will be sent
        setTimeout(async () => {
            try {
                await this._sendReceiptToCustomer();
                this.orderUiState.emailSuccessful = true;
                this.orderUiState.emailNotice = this.env._t("Email sent.");
            } catch {
                this.orderUiState.emailSuccessful = false;
                this.orderUiState.emailNotice = this.env._t(
                    "Sending email failed. Please try again."
                );
            }
<<<<<<< HEAD
            orderDone() {
                this.env.pos.removeOrder(this.currentOrder);
                this._addNewOrder();
                const { name, props } = this.nextScreen;
                this.showScreen(name, props);
                if (this.env.pos.config.iface_customer_facing_display) {
                    this.env.pos.send_current_order_to_customer_facing_display();
                }
            }
            async printReceipt() {
                const currentOrder = this.currentOrder;
                const isPrinted = await this._printReceipt();
                if (isPrinted) {
                    currentOrder._printed = true;
                }
            }
            _shouldAutoPrint() {
                return this.env.pos.config.iface_print_auto && !this.currentOrder._printed;
            }
            _shouldCloseImmediately() {
                var invoiced_finalized = this.currentOrder.is_to_invoice() ? this.currentOrder.finalized : true;
                return this.env.proxy.printer && this.env.pos.config.iface_print_skip_screen && invoiced_finalized;
            }
            async _sendReceiptToCustomer() {
                const printer = new Printer(null, this.env.pos);
                const receiptString = this.orderReceipt.el.innerHTML;
                const ticketImage = await printer.htmlToImg(receiptString);
                const order = this.currentOrder;
                const partner = order.get_partner();
                const orderName = order.get_name();
                const orderPartner = { email: this.orderUiState.inputEmail, name: partner ? partner.name : this.orderUiState.inputEmail };
                const order_server_id = this.env.pos.validated_orders_name_server_id_map[orderName];
                if (!order_server_id) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Unsynced order'),
                        body: this.env._t('This order is not yet synced to server. Make sure it is synced then try again.'),
                    });
                    return Promise.reject();
                }
                await this.rpc({
                    model: 'pos.order',
                    method: 'action_receipt_to_customer',
                    args: [[order_server_id], orderName, orderPartner, ticketImage],
                });
=======
            this.buttonMailReceipt.el.className = "fa fa-paper-plane";
        }, 1000);
    }
    get orderAmountPlusTip() {
        const order = this.currentOrder;
        const orderTotalAmount = order.get_total_with_tax();
        const tip_product_id =
            this.env.pos.config.tip_product_id && this.env.pos.config.tip_product_id[0];
        const tipLine = order
            .get_orderlines()
            .find((line) => tip_product_id && line.product.id === tip_product_id);
        const tipAmount = tipLine ? tipLine.get_all_prices().priceWithTax : 0;
        const orderAmountStr = this.env.pos.format_currency(orderTotalAmount - tipAmount);
        if (!tipAmount) {
            return orderAmountStr;
        }
        const tipAmountStr = this.env.pos.format_currency(tipAmount);
        return `${orderAmountStr} + ${tipAmountStr} tip`;
    }
    get nextScreen() {
        return { name: "ProductScreen" };
    }
    get ticketScreen() {
        return { name: "TicketScreen" };
    }
    whenClosing() {
        this.orderDone();
    }
    /**
     * This function is called outside the rendering call stack. This way,
     * we don't block the displaying of ReceiptScreen when it is mounted; additionally,
     * any error that can happen during the printing does not affect the rendering.
     */
    async handleAutoPrint() {
        if (this._shouldAutoPrint()) {
            const currentOrder = this.currentOrder;
            await this.printReceipt();
            if (
                this.currentOrder &&
                this.currentOrder === currentOrder &&
                currentOrder._printed &&
                this._shouldCloseImmediately()
            ) {
                this.whenClosing();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            }
        }
    }
    orderDone() {
        this.env.pos.removeOrder(this.currentOrder);
        this._addNewOrder();
        const { name, props } = this.nextScreen;
        this.pos.showScreen(name, props);
        if (this.env.pos.config.iface_customer_facing_display) {
            this.env.pos.send_current_order_to_customer_facing_display();
        }
    }
    resumeOrder() {
        this.env.pos.removeOrder(this.currentOrder);
        this.env.pos.selectNextOrder();
        const { name, props } = this.ticketScreen;
        this.pos.showScreen(name, props);
    }
    isResumeVisible() {
        return this.env.pos.get_order_list().length > 1;
    }
    async printReceipt() {
        this.buttonPrintReceipt.el.className = "fa fa-fw fa-spin fa-circle-o-notch";
        const currentOrder = this.currentOrder;
        const isPrinted = await this._printReceipt();

        if (isPrinted) {
            currentOrder._printed = true;
        }

        this.buttonPrintReceipt.el.className = "fa fa-print";
    }
    _shouldAutoPrint() {
        return this.env.pos.config.iface_print_auto && !this.currentOrder._printed;
    }
    _shouldCloseImmediately() {
        var invoiced_finalized = this.currentOrder.is_to_invoice()
            ? this.currentOrder.finalized
            : true;
        return (
            this.env.proxy.printer &&
            this.env.pos.config.iface_print_skip_screen &&
            invoiced_finalized
        );
    }
    async _sendReceiptToCustomer() {
        const printer = new Printer(null, this.env.pos);
        const receiptString = this.orderReceipt.el.innerHTML;
        const ticketImage = await printer.htmlToImg(receiptString);
        const order = this.currentOrder;
        const partner = order.get_partner();
        const orderName = order.get_name();
        const orderPartner = {
            email: this.orderUiState.inputEmail,
            name: partner ? partner.name : this.orderUiState.inputEmail,
        };
        const order_server_id = this.env.pos.validated_orders_name_server_id_map[orderName];
        if (!order_server_id) {
            this.popup.add(OfflineErrorPopup, {
                title: this.env._t("Unsynced order"),
                body: this.env._t(
                    "This order is not yet synced to server. Make sure it is synced then try again."
                ),
            });
            return Promise.reject();
        }
        await this.orm.call("pos.order", "action_receipt_to_customer", [
            [order_server_id],
            orderName,
            orderPartner,
            ticketImage,
        ]);
    }
}

registry.category("pos_screens").add("ReceiptScreen", ReceiptScreen);
