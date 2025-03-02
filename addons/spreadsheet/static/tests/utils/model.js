/** @odoo-module */

import { ormService } from "@web/core/orm_service";
import { registry } from "@web/core/registry";
import { makeTestEnv } from "@web/../tests/helpers/mock_env";
import { nextTick } from "@web/../tests/helpers/utils";

import spreadsheet from "@spreadsheet/o_spreadsheet/o_spreadsheet_extended";
import { DataSources } from "@spreadsheet/data_sources/data_sources";
import { getBasicServerData } from "./data";

const { Model } = spreadsheet;

/**
 * @typedef {import("@spreadsheet/../tests/utils/data").ServerData} ServerData
 * @typedef {import("@spreadsheet/o_spreadsheet/o_spreadsheet").Model} Model
 */

export function setupDataSourceEvaluation(model) {
    model.config.custom.dataSources.addEventListener("data-source-updated", () => {
        const sheetId = model.getters.getActiveSheetId();
        model.dispatch("EVALUATE_CELLS", { sheetId });
    });
}

/**
 * Create a spreadsheet model with a mocked server environnement
 *
 * @param {object} params
 * @param {object} [params.spreadsheetData] Spreadsheet data to import
 * @param {ServerData} [params.serverData] Data to be injected in the mock server
 * @param {function} [params.mockRPC] Mock rpc function
 */
export async function createModelWithDataSource(params = {}) {
    registry.category("services").add("orm", ormService, { force: true });
    const env = await makeTestEnv({
        serverData: params.serverData || getBasicServerData(),
        mockRPC: params.mockRPC,
    });
    const model = new Model(params.spreadsheetData, {
<<<<<<< HEAD
        evalContext: { env },
        //@ts-ignore
        dataSources: new DataSources(env.services.orm),
=======
        custom: {
            env,
            dataSources: new DataSources(env.services.orm),
        },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    });
    setupDataSourceEvaluation(model);
    await nextTick(); // initial async formulas loading
    return model;
}

/**
 * @param {Model} model
 */
export async function waitForDataSourcesLoaded(model) {
    function readAllCellsValue() {
        for (const sheetId of model.getters.getSheetIds()) {
            const cells = model.getters.getEvaluatedCells(sheetId);
            for (const cellId in cells) {
                cells[cellId].value;
            }
        }
    }
    // Read a first time in order to trigger the RPC
    readAllCellsValue();
    //@ts-ignore
    await model.config.custom.dataSources.waitForAllLoaded();
    await nextTick();
    // Read a second time to trigger the compute format (which could trigger a RPC for currency, in list)
    readAllCellsValue();
    await nextTick();
    // Read a third time to trigger the RPC to get the correct currency
    readAllCellsValue();
    await nextTick();
}
