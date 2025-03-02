/** @odoo-module */

import { DataSources } from "@spreadsheet/data_sources/data_sources";
import { migrate } from "@spreadsheet/o_spreadsheet/migration";
import { download } from "@web/core/network/download";
import { registry } from "@web/core/registry";
import spreadsheet from "../o_spreadsheet/o_spreadsheet_extended";
import { _t } from "@web/core/l10n/translation";

const { Model } = spreadsheet;

async function downloadSpreadsheet(env, action) {
    const { orm, name, data, stateUpdateMessages } = action.params;
    const dataSources = new DataSources(orm);
<<<<<<< HEAD
    const model = new Model(migrate(data), { dataSources }, stateUpdateMessages);
=======
    const model = new Model(migrate(data), { custom: { dataSources } }, stateUpdateMessages);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    await waitForDataLoaded(model);
    const { files } = model.exportXLSX();
    await download({
        url: "/spreadsheet/xlsx",
        data: {
            zip_name: `${name}.xlsx`,
            files: JSON.stringify(files),
        },
    });
}

/**
 * Ensure that the spreadsheet does not contains cells that are in loading state
 * @param {Model} model
 * @returns {Promise<void>}
 */
async function waitForDataLoaded(model) {
<<<<<<< HEAD
    const dataSources = model.config.dataSources;
=======
    const dataSources = model.config.custom.dataSources;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    return new Promise((resolve, reject) => {
        function check() {
            model.dispatch("EVALUATE_CELLS");
            if (isLoaded(model)) {
                dataSources.removeEventListener("data-source-updated", check);
                resolve();
            }
        }
        dataSources.addEventListener("data-source-updated", check);
        check();
    });
}

function isLoaded(model) {
    for (const sheetId of model.getters.getSheetIds()) {
<<<<<<< HEAD
        for (const cell of Object.values(model.getters.getCells(sheetId))) {
            if (
                cell.evaluated &&
                cell.evaluated.type === "error" &&
                cell.evaluated.error.message === _t("Data is loading")
            ) {
=======
        for (const cell of Object.values(model.getters.getEvaluatedCells(sheetId))) {
            if (cell.type === "error" && cell.error.message === _t("Data is loading")) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                return false;
            }
        }
    }
    return true;
}

registry
    .category("actions")
    .add("action_download_spreadsheet", downloadSpreadsheet, { force: true });
