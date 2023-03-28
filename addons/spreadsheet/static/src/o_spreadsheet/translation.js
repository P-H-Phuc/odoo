/** @odoo-module **/

import spreadsheet from "@spreadsheet/o_spreadsheet/o_spreadsheet_extended";
import { _t } from "@web/core/l10n/translation";

<<<<<<< HEAD
const { args, toString } = spreadsheet.helpers;
=======
const { arg, toString } = spreadsheet.helpers;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
const { functionRegistry } = spreadsheet.registries;

functionRegistry.add("_t", {
    description: _t("Get the translated value of the given string"),
<<<<<<< HEAD
    args: args(`
        value (string) ${_t("Value to translate.")}
    `),
=======
    args: [arg("value (string)", _t("Value to translate."))],
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    compute: function (value) {
        return _t(toString(value));
    },
    returns: ["STRING"],
});
