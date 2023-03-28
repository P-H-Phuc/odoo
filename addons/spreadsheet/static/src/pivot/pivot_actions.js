/** @odoo-module */
import spreadsheet from "@spreadsheet/o_spreadsheet/o_spreadsheet_extended";
import { getFirstPivotFunction, getNumberOfPivotFormulas } from "./pivot_helpers";

const { astToFormula } = spreadsheet;

<<<<<<< HEAD
export const SEE_RECORDS_PIVOT = async (cell, env) => {
    const { col, row, sheetId } = env.model.getters.getCellPosition(cell.id);
=======
export const SEE_RECORDS_PIVOT = async (position, env) => {
    const cell = env.model.getters.getCell(position);
    if (!cell) {
        return;
    }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    const { args, functionName } = getFirstPivotFunction(cell.content);
    const evaluatedArgs = args
        .map(astToFormula)
        .map((arg) => env.model.getters.evaluateFormula(arg));
    const pivotId = env.model.getters.getPivotIdFromPosition(position);
    const { model } = env.model.getters.getPivotDefinition(pivotId);
    const dataSource = await env.model.getters.getAsyncPivotDataSource(pivotId);
    const slice = functionName === "ODOO.PIVOT.HEADER" ? 1 : 2;
    let argsDomain = evaluatedArgs.slice(slice);
    if (argsDomain[argsDomain.length - 2] === "measure") {
        // We have to remove the measure from the domain
        argsDomain = argsDomain.slice(0, argsDomain.length - 2);
    }
    const domain = dataSource.getPivotCellDomain(argsDomain);
    const name = await dataSource.getModelLabel();
    await env.services.action.doAction({
        type: "ir.actions.act_window",
        name,
        res_model: model,
        view_mode: "list",
        views: [
            [false, "list"],
            [false, "form"],
        ],
        target: "current",
        domain,
    });
};

<<<<<<< HEAD
export const SEE_RECORDS_PIVOT_VISIBLE = (cell) => {
=======
export const SEE_RECORDS_PIVOT_VISIBLE = (position, env) => {
    const evaluatedCell = env.model.getters.getEvaluatedCell(position);
    const cell = env.model.getters.getCell(position);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    return (
        evaluatedCell.type !== "empty" &&
        evaluatedCell.type !== "error" &&
        cell &&
        getNumberOfPivotFormulas(cell.content) === 1
    );
};
