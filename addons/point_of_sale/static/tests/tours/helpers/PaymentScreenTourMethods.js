/** @odoo-module */

import { createTourMethods } from "@point_of_sale/../tests/tours/helpers/utils";

class Do {
    clickPaymentMethod(name) {
        return [
            {
                content: `click '${name}' payment method`,
                trigger: `.paymentmethods .button.paymentmethod:contains("${name}")`,
            },
        ];
    }

    /**
     * Delete the paymentline having the given payment method name and amount.
     * @param {String} name payment method
     * @param {String} amount
     */
    clickPaymentlineDelButton(name, amount) {
        return [
            {
                content: `delete ${name} paymentline with ${amount} amount`,
                trigger: `.paymentlines .paymentline .payment-name:contains("${name}") ~ .delete-button`,
            },
        ];
    }

    clickEmailButton() {
        return [
            {
                content: `click email button`,
                trigger: `.payment-buttons .js_email`,
            },
        ];
    }

    clickInvoiceButton() {
        return [{ content: "click invoice button", trigger: ".payment-buttons .js_invoice" }];
    }

    clickValidate() {
        return [
            {
                content: "validate payment",
                trigger: `.payment-screen .button.next.highlight`,
            },
        ];
    }

    /**
     * Press the numpad in sequence based on the given space-separated keys.
     * Note: Maximum of 2 characters because NumberBuffer only allows 2 consecutive
     * fast inputs. Fast inputs is the case in tours.
     *
     * @param {String} keys space-separated numpad keys
     */
    pressNumpad(keys) {
        const numberChars = ". +/- 0 1 2 3 4 5 6 7 8 9".split(" ");
        const modeButtons = "+10 +20 +50".split(" ");
        function generateStep(key) {
            let trigger;
            if (numberChars.includes(key)) {
                trigger = `.payment-numpad .number-char:contains("${key}")`;
            } else if (modeButtons.includes(key)) {
                trigger = `.payment-numpad .mode-button:contains("${key}")`;
            } else if (key === "Backspace") {
                trigger = `.payment-numpad .number-char img[alt="Backspace"]`;
            }
            return {
                content: `'${key}' pressed in payment numpad`,
                trigger,
            };
        }
        return keys.split(" ").map(generateStep);
    }

<<<<<<< HEAD
    class Check {
        isShown() {
            return [
                {
                    content: 'payment screen is shown',
                    trigger: '.pos .payment-screen',
                    run: () => {},
                },
            ];
        }
        /**
         * Check if change is the provided amount.
         * @param {String} amount
         */
        changeIs(amount) {
            return [
                {
                    content: `change is ${amount}`,
                    trigger: `.payment-status-change .amount:contains("${amount}")`,
                    run: () => {},
                },
            ];
        }

        /**
         * Check if the remaining is the provided amount.
         * @param {String} amount
         */
        remainingIs(amount) {
            return [
                {
                    content: `remaining amount is ${amount}`,
                    trigger: `.payment-status-remaining .amount:contains("${amount}")`,
                    run: () => {},
                },
            ];
        }

        /**
         * Check if validate button is highlighted.
         * @param {Boolean} isHighlighted
         */
        validateButtonIsHighlighted(isHighlighted = true) {
            return [
                {
                    content: `validate button is ${
                        isHighlighted ? 'highlighted' : 'not highligted'
                    }`,
                    trigger: isHighlighted
                        ? `.payment-screen .button.next.highlight`
                        : `.payment-screen .button.next:not(:has(.highlight))`,
                    run: () => {},
                },
            ];
        }

        /**
         * Check if the paymentlines are empty. Also provide the amount to pay.
         * @param {String} amountToPay
         */
        emptyPaymentlines(amountToPay) {
            return [
                {
                    content: `there are no paymentlines`,
                    trigger: `.paymentlines-empty`,
                    run: () => {},
                },
                {
                    content: `amount to pay is '${amountToPay}'`,
                    trigger: `.paymentlines-empty .total:contains("${amountToPay}")`,
                    run: () => {},
                },
            ];
        }

        /**
         * Check if the selected paymentline has the given payment method and amount.
         * @param {String} paymentMethodName
         * @param {String} amount
         */
        selectedPaymentlineHas(paymentMethodName, amount) {
            return [
                {
                    content: `line paid via '${paymentMethodName}' is selected`,
                    trigger: `.paymentlines .paymentline.selected .payment-name:contains("${paymentMethodName}")`,
                    run: () => {},
                },
                {
                    content: `amount tendered in the line is '${amount}'`,
                    trigger: `.paymentlines .paymentline.selected .payment-amount:contains("${amount}")`,
                    run: () => {},
                },
            ];
        }
        totalIs(amount) {
            return [
                {
                    content: `total is ${amount}`,
                    trigger: `.total:contains("${amount}")`,
                    run: () => {},
                },
            ];
        }
        totalDueIs(amount) {
            return [
                {
                    content: `total due is ${amount}`,
                    trigger: `.payment-status-total-due:contains("${amount}")`,
                    run: () => {},
                },
            ];
        }
=======
    clickBack() {
        return [
            {
                content: "click back button",
                trigger: ".payment-screen .button.back",
            },
        ];
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    clickTipButton() {
        return [
            {
                trigger: ".payment-screen .button.js_tip",
            },
        ];
    }
}

class Check {
    isShown() {
        return [
            {
                content: "payment screen is shown",
                trigger: ".pos .payment-screen",
                run: () => {},
            },
        ];
    }
    /**
     * Check if change is the provided amount.
     * @param {String} amount
     */
    changeIs(amount) {
        return [
            {
                content: `change is ${amount}`,
                trigger: `.payment-status-change .amount:contains("${amount}")`,
                run: () => {},
            },
        ];
    }

    /**
     * Check if the remaining is the provided amount.
     * @param {String} amount
     */
    remainingIs(amount) {
        return [
            {
                content: `remaining amount is ${amount}`,
                trigger: `.payment-status-remaining .amount:contains("${amount}")`,
                run: () => {},
            },
        ];
    }

    /**
     * Check if validate button is highlighted.
     * @param {Boolean} isHighlighted
     */
    validateButtonIsHighlighted(isHighlighted = true) {
        return [
            {
                content: `validate button is ${isHighlighted ? "highlighted" : "not highligted"}`,
                trigger: isHighlighted
                    ? `.payment-screen .button.next.highlight`
                    : `.payment-screen .button.next:not(:has(.highlight))`,
                run: () => {},
            },
        ];
    }

    /**
     * Check if the paymentlines are empty. Also provide the amount to pay.
     * @param {String} amountToPay
     */
    emptyPaymentlines(amountToPay) {
        return [
            {
                content: `there are no paymentlines`,
                trigger: `.paymentlines-empty`,
                run: () => {},
            },
            {
                content: `amount to pay is '${amountToPay}'`,
                trigger: `.paymentlines-empty .total:contains("${amountToPay}")`,
                run: () => {},
            },
        ];
    }

    /**
     * Check if the selected paymentline has the given payment method and amount.
     * @param {String} paymentMethodName
     * @param {String} amount
     */
    selectedPaymentlineHas(paymentMethodName, amount) {
        return [
            {
                content: `line paid via '${paymentMethodName}' is selected`,
                trigger: `.paymentlines .paymentline.selected .payment-name:contains("${paymentMethodName}")`,
                run: () => {},
            },
            {
                content: `amount tendered in the line is '${amount}'`,
                trigger: `.paymentlines .paymentline.selected .payment-amount:contains("${amount}")`,
                run: () => {},
            },
        ];
    }
    totalIs(amount) {
        return [
            {
                content: `total is ${amount}`,
                trigger: `.total:contains("${amount}")`,
                run: () => {},
            },
        ];
    }
    totalDueIs(amount) {
        return [
            {
                content: `total due is ${amount}`,
                trigger: `.payment-status-total-due:contains("${amount}")`,
                run: () => {},
            },
        ];
    }
}

class Execute {
    pay(method, amount) {
        const steps = [];
        steps.push(...this._do.clickPaymentMethod(method));
        for (const char of amount.split("")) {
            steps.push(...this._do.pressNumpad(char));
        }
        steps.push(...this._check.validateButtonIsHighlighted());
        steps.push(...this._do.clickValidate());
        return steps;
    }
}

// FIXME: this is a horrible hack to export an object as named exports.
// eslint-disable-next-line no-undef
Object.assign(__exports, createTourMethods("PaymentScreen", Do, Check, Execute));
