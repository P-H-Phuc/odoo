/** @odoo-module **/

<<<<<<< HEAD
=======
/**
 * @param {string} value
 * @returns {boolean}
 */
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
export function isBinarySize(value) {
    return /^\d+(\.\d*)? [^0-9]+$/.test(value);
}
