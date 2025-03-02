/** @odoo-module */

import spreadsheet from "@spreadsheet/o_spreadsheet/o_spreadsheet_extended";
import { SEE_RECORDS_PIVOT, SEE_RECORDS_PIVOT_VISIBLE } from "@spreadsheet/pivot/pivot_actions";
import { getFirstPivotFunction } from "@spreadsheet/pivot/pivot_helpers";

const { clickableCellRegistry } = spreadsheet.registries;

clickableCellRegistry.add("pivot", {
    condition: SEE_RECORDS_PIVOT_VISIBLE,
    action: SEE_RECORDS_PIVOT,
    sequence: 3,
});

clickableCellRegistry.add("pivot_set_filter_matching", {
<<<<<<< HEAD
    condition: (cell, env) => {
        return (
            SEE_RECORDS_PIVOT_VISIBLE(cell) &&
=======
    condition: (position, env) => {
        const cell = env.model.getters.getCell(position);
        return (
            SEE_RECORDS_PIVOT_VISIBLE(position, env) &&
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            getFirstPivotFunction(cell.content).functionName === "ODOO.PIVOT.HEADER" &&
            env.model.getters.getFiltersMatchingPivot(cell.content).length > 0
        );
    },
<<<<<<< HEAD
    action: (cell, env) => {
=======
    action: (position, env) => {
        const cell = env.model.getters.getCell(position);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        const filters = env.model.getters.getFiltersMatchingPivot(cell.content);
        env.model.dispatch("SET_MANY_GLOBAL_FILTER_VALUE", { filters });
    },
    sequence: 2,
});
