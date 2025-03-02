/** @odoo-module */
/* global StripeTerminal */

import core from "web.core";
import rpc from "web.rpc";
import { PaymentInterface } from "@point_of_sale/js/payment";
import { ErrorPopup } from "@point_of_sale/js/Popups/ErrorPopup";

const _t = core._t;

export const PaymentStripe = PaymentInterface.extend({
    init: function (pos, payment_method) {
        this._super(...arguments);
        this.terminal = new StripeTerminal({
            onFetchConnectionToken: this.stripeFetchConnectionToken.bind(this),
            onUnexpectedReaderDisconnect: this.stripeUnexpectedDisconnect.bind(this),
        });
        this.discoverReaders();
    },

    stripeUnexpectedDisconnect: function () {
        // Include a way to attempt to reconnect to a reader ?
        this._showError(_t("Reader disconnected"));
    },

    stripeFetchConnectionToken: async function () {
        // Do not cache or hardcode the ConnectionToken.
        try {
<<<<<<< HEAD
            let data = await rpc.query({
                model: 'pos.payment.method',
                method: 'stripe_connection_token',
            }, {
                silent: true,
            });
=======
            const data = await rpc.query(
                {
                    model: "pos.payment.method",
                    method: "stripe_connection_token",
                },
                {
                    silent: true,
                }
            );
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            if (data.error) {
                throw data.error;
            }
            return data.secret;
        } catch (error) {
            this._showError(error.message);
            return false;
<<<<<<< HEAD
        };
=======
        }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },

    discoverReaders: async function () {
        const discoverResult = await this.terminal.discoverReaders({});
        if (discoverResult.error) {
            this._showError(_.str.sprintf(_t("Failed to discover: %s"), discoverResult.error));
        } else if (discoverResult.discoveredReaders.length === 0) {
            this._showError(_t("No available Stripe readers."));
        } else {
            // Need to stringify all Readers to avoid to put the array into a proxy Object not interpretable
            // for the Stripe SDK
            this.pos.discoveredReaders = JSON.stringify(discoverResult.discoveredReaders);
        }
    },

    checkReader: async function () {
        const line = this.pos.get_order().selected_paymentline;
        // Because the reader can only connect to one instance of the SDK at a time.
        // We need the disconnect this reader if we want to use another one
        if (
            this.pos.connectedReader != this.payment_method.stripe_serial_number &&
            this.terminal.getConnectionStatus() == "connected"
        ) {
            const disconnectResult = await this.terminal.disconnectReader();
            if (disconnectResult.error) {
                this._showError(disconnectResult.error.message, disconnectResult.error.code);
                line.set_payment_status("retry");
                return false;
            } else {
                return await this.connectReader();
            }
        } else if (this.terminal.getConnectionStatus() == "not_connected") {
            return await this.connectReader();
        } else {
            return true;
        }
    },

    connectReader: async function () {
        const line = this.pos.get_order().selected_paymentline;
        const discoveredReaders = JSON.parse(this.pos.discoveredReaders);
        for (const selectedReader of discoveredReaders) {
            if (selectedReader.serial_number == this.payment_method.stripe_serial_number) {
                const connectResult = await this.terminal.connectReader(selectedReader, {
                    fail_if_in_use: true,
                });
                if (connectResult.error) {
                    this._showError(connectResult.error.message, connectResult.error.code);
                    line.set_payment_status("retry");
                    return false;
                } else {
                    this.pos.connectedReader = this.payment_method.stripe_serial_number;
                    return true;
                }
            }
        }
<<<<<<< HEAD
        this._showError(_.str.sprintf(
            this.env._t('Stripe readers %s not listed in your account'), 
            this.payment_method.stripe_serial_number
        ));
    },

    collectPayment: async function (amount) {
        let line = this.pos.get_order().selected_paymentline;
        let clientSecret = await this.fetchPaymentIntentClientSecret(line.payment_method, amount);
        if (!clientSecret) {
            line.set_payment_status('retry');
            return false;
        }
        line.set_payment_status('waitingCard');
        let collectPaymentMethod = await this.terminal.collectPaymentMethod(clientSecret);
=======
        this._showError(
            _.str.sprintf(
                this.env._t("Stripe readers %s not listed in your account"),
                this.payment_method.stripe_serial_number
            )
        );
    },

    collectPayment: async function (amount) {
        const line = this.pos.get_order().selected_paymentline;
        const clientSecret = await this.fetchPaymentIntentClientSecret(line.payment_method, amount);
        if (!clientSecret) {
            line.set_payment_status("retry");
            return false;
        }
        line.set_payment_status("waitingCard");
        const collectPaymentMethod = await this.terminal.collectPaymentMethod(clientSecret);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (collectPaymentMethod.error) {
            this._showError(collectPaymentMethod.error.message, collectPaymentMethod.error.code);
            line.set_payment_status("retry");
            return false;
        } else {
            line.set_payment_status("waitingCapture");
            const processPayment = await this.terminal.processPayment(
                collectPaymentMethod.paymentIntent
            );
            line.transaction_id = collectPaymentMethod.paymentIntent.id;
            if (processPayment.error) {
                this._showError(processPayment.error.message, processPayment.error.code);
                line.set_payment_status("retry");
                return false;
            } else if (processPayment.paymentIntent) {
                line.set_payment_status("waitingCapture");
                await this.captureAfterPayment(processPayment, line);
                line.set_payment_status("done");
                return true;
            }
        }
    },

    captureAfterPayment: async function (processPayment, line) {
<<<<<<< HEAD
        let capturePayment = await this.capturePayment(processPayment.paymentIntent.id);
        if (capturePayment.charges)
            line.card_type = capturePayment.charges.data[0].payment_method_details.card_present.brand;
=======
        const capturePayment = await this.capturePayment(processPayment.paymentIntent.id);
        if (capturePayment.charges) {
            line.card_type =
                capturePayment.charges.data[0].payment_method_details.card_present.brand;
        }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        line.transaction_id = capturePayment.id;
    },

    capturePayment: async function (paymentIntentId) {
        try {
<<<<<<< HEAD
            let data = await rpc.query({
                model: 'pos.payment.method',
                method: 'stripe_capture_payment',
                args: [paymentIntentId],
            }, {
                silent: true,
            });
=======
            const data = await rpc.query(
                {
                    model: "pos.payment.method",
                    method: "stripe_capture_payment",
                    args: [paymentIntentId],
                },
                {
                    silent: true,
                }
            );
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            if (data.error) {
                throw data.error;
            }
            return data;
        } catch (error) {
            this._showError(error.message);
            return false;
<<<<<<< HEAD
        };
=======
        }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },

    fetchPaymentIntentClientSecret: async function (payment_method, amount) {
        try {
<<<<<<< HEAD
            let data = await rpc.query({
                model: 'pos.payment.method',
                method: 'stripe_payment_intent',
                args: [[payment_method.id], amount],
            }, {
                silent: true,
            });
=======
            const data = await rpc.query(
                {
                    model: "pos.payment.method",
                    method: "stripe_payment_intent",
                    args: [[payment_method.id], amount],
                },
                {
                    silent: true,
                }
            );
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            if (data.error) {
                throw data.error;
            }
            return data.client_secret;
        } catch (error) {
            this._showError(error.message);
            return false;
<<<<<<< HEAD
        };
=======
        }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },

    send_payment_request: async function (cid) {
        /**
         * Override
         */
        await this._super.apply(this, arguments);
        const line = this.pos.get_order().selected_paymentline;
        line.set_payment_status("waiting");
        if (await this.checkReader()) {
            return await this.collectPayment(line.amount);
        } else {
            return false;
        }
    },

    send_payment_cancel: async function (order, cid) {
        /**
         * Override
         */
        this._super.apply(this, arguments);
        const line = this.pos.get_order().selected_paymentline;
        const stripeCancel = await this.stripeCancel();
        if (stripeCancel) {
            line.set_payment_status("retry");
            return true;
        }
    },

    stripeCancel: async function () {
        if (this.terminal.getConnectionStatus() != "connected") {
            this._showError(_t("Payment canceled because not reader connected"));
            return true;
        } else {
            const cancelCollectPaymentMethod = await this.terminal.cancelCollectPaymentMethod();
            if (cancelCollectPaymentMethod.error) {
                this._showError(
                    cancelCollectPaymentMethod.error.message,
                    cancelCollectPaymentMethod.error.code
                );
            }
            return true;
        }
    },

    // private methods

    _showError: function (msg, title) {
        if (!title) {
            title = _t("Stripe Error");
        }
        this.pos.env.services.popup.add(ErrorPopup, {
            title: title,
            body: msg,
        });
    },
});
