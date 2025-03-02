/** @odoo-module */

/**
 * This file is meant to load the different subparts of the module
 * to guarantee their plugins are loaded in the right order
 *
 * dependency:
 *             other plugins
 *                   |
 *                  ...
 *                   |
 *                filters
 *                /\    \
 *               /  \    \
 *           pivot  list  Odoo chart
 */

/** TODO: Introduce a position parameter to the plugin registry in order to load them in a specific order */
import spreadsheet from "@spreadsheet/o_spreadsheet/o_spreadsheet_extended";
<<<<<<< HEAD
const { corePluginRegistry, uiPluginRegistry } = spreadsheet.registries;
=======
const { corePluginRegistry, coreViewsPluginRegistry } = spreadsheet.registries;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

import { GlobalFiltersCorePlugin, GlobalFiltersUIPlugin } from "@spreadsheet/global_filters/index";
import { PivotCorePlugin, PivotUIPlugin } from "@spreadsheet/pivot/index"; // list depends on filter for its getters
import { ListCorePlugin, ListUIPlugin } from "@spreadsheet/list/index"; // pivot depends on filter for its getters
import {
    ChartOdooMenuPlugin,
    OdooChartCorePlugin,
    OdooChartUIPlugin,
} from "@spreadsheet/chart/index"; // Odoochart depends on filter for its getters

corePluginRegistry.add("OdooGlobalFiltersCorePlugin", GlobalFiltersCorePlugin);
corePluginRegistry.add("OdooPivotCorePlugin", PivotCorePlugin);
corePluginRegistry.add("OdooListCorePlugin", ListCorePlugin);
corePluginRegistry.add("odooChartCorePlugin", OdooChartCorePlugin);
corePluginRegistry.add("chartOdooMenuPlugin", ChartOdooMenuPlugin);

<<<<<<< HEAD
uiPluginRegistry.add("OdooGlobalFiltersUIPlugin", GlobalFiltersUIPlugin);
uiPluginRegistry.add("OdooPivotUIPlugin", PivotUIPlugin);
uiPluginRegistry.add("OdooListUIPlugin", ListUIPlugin);
uiPluginRegistry.add("odooChartUIPlugin", OdooChartUIPlugin);
=======
coreViewsPluginRegistry.add("OdooGlobalFiltersUIPlugin", GlobalFiltersUIPlugin);
coreViewsPluginRegistry.add("OdooPivotUIPlugin", PivotUIPlugin);
coreViewsPluginRegistry.add("OdooListUIPlugin", ListUIPlugin);
coreViewsPluginRegistry.add("odooChartUIPlugin", OdooChartUIPlugin);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
