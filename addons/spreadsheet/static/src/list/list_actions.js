/** @odoo-module */

import spreadsheet from "@spreadsheet/o_spreadsheet/o_spreadsheet_extended";
import { getFirstListFunction, getNumberOfListFormulas } from "./list_helpers";

const { astToFormula } = spreadsheet;

<<<<<<< HEAD
export const SEE_RECORD_LIST = async (cell, env) => {
    const { col, row, sheetId } = env.model.getters.getCellPosition(cell.id);
=======
export const SEE_RECORD_LIST = async (position, env) => {
    const cell = env.model.getters.getCell(position);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    if (!cell) {
        return;
    }
    const { args } = getFirstListFunction(cell.content);
    const evaluatedArgs = args
        .map(astToFormula)
        .map((arg) => env.model.getters.evaluateFormula(arg));
    const listId = env.model.getters.getListIdFromPosition(position);
    const { model } = env.model.getters.getListDefinition(listId);
    const dataSource = await env.model.getters.getAsyncListDataSource(listId);
    const recordId = dataSource.getIdFromPosition(evaluatedArgs[1] - 1);
    if (!recordId) {
        return;
    }
    await env.services.action.doAction({
        type: "ir.actions.act_window",
        res_model: model,
        res_id: recordId,
        views: [[false, "form"]],
        view_mode: "form",
    });
};

<<<<<<< HEAD
export const SEE_RECORD_LIST_VISIBLE = (cell) => {
    return (
        cell &&
        cell.evaluated.value !== "" &&
        !cell.evaluated.error &&
        getNumberOfListFormulas(cell.content) === 1 &&
=======
export const SEE_RECORD_LIST_VISIBLE = (position, env) => {
    const evaluatedCell = env.model.getters.getEvaluatedCell(position);
    const cell = env.model.getters.getCell(position);
    return (
        evaluatedCell.type !== "empty" &&
        evaluatedCell.type !== "error" &&
        getNumberOfListFormulas(cell.content) === 1 &&
        cell &&
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        getFirstListFunction(cell.content).functionName === "ODOO.LIST"
    );
};
