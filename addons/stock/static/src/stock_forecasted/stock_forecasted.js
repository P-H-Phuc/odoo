/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { View } from "@web/views/view";
<<<<<<< HEAD
import { useSetupAction } from "@web/webclient/actions/action_hook";
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { ControlPanel } from "@web/search/control_panel/control_panel";

import { ForecastedButtons } from "./forecasted_buttons";
import { ForecastedDetails } from "./forecasted_details";
import { ForecastedHeader } from "./forecasted_header";
import { ForecastedWarehouseFilter } from "./forecasted_warehouse_filter";

<<<<<<< HEAD
const { Component, onWillStart, useState, useSubEnv} = owl;

class StockForecasted extends Component{
    setup(){
        useSetupAction();
        useSubEnv({
            //ControlPanel trick : Allow the use of ControlPanel's bottom-right while disabling search to avoid errors
            searchModel:{
                searchMenuTypes : [],
            },
        });
        this.env.config.viewSwitcherEntries = [];

=======
const { Component, onWillStart, useState } = owl;

export class StockForecasted extends Component {
    setup() {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.orm = useService("orm");
        this.action = useService("action");

        this.context = useState(this.props.action.context);
        this.productId = this.context.active_id;
<<<<<<< HEAD
=======
        this.resModel = this.context.active_model;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.title = this.props.action.name || _t("Forecasted Report");
        if(!this.context.active_id){
            this.context.active_id = this.props.action.params.active_id;
            this.reloadReport();
        }

<<<<<<< HEAD
        this.docs = useState({});
        this.warehouses = useState([]);

        onWillStart(this._getReportValues);
    }

    async _getReportValues(){
        this.resModel = this.context.active_model || (this.context.params && this.context.params.active_model);
        if (!this.resModel) {
            if (this.props.action.res_model) {
                const actionModel = await this.orm.read('ir.model', [Number(this.props.action.res_model)], ['model']);
                if (actionModel.length && actionModel[0].model) {
=======
        onWillStart(this._getReportValues);
    }

    async _getReportValues() {
        await this._getResModel();
        const isTemplate = !this.resModel || this.resModel === 'product.template';
        this.reportModelName = `stock.forecasted_product_${isTemplate ? "template" : "product"}`;
        const reportValues = await this.orm.call(this.reportModelName, "get_report_values", [], {
            context: this.context,
            docids: [this.productId],
        });
        this.docs = { ...reportValues.docs, ...reportValues.precision };
    }

    async _getResModel(){
        this.resModel = this.context.active_model || this.context.params?.active_model;
        //Following is used as a fallback when the forecast is not called by an action but through browser's history
        if (!this.resModel) {
            if (this.props.action.res_model) {
                const actionModel = await this.orm.read('ir.model', [Number(this.props.action.res_model)], ['model']);
                if (actionModel[0]?.model) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    this.resModel = actionModel[0].model
                }
            } else if (this.props.action._originalAction) {
                const originalContextAction = JSON.parse(this.props.action._originalAction).context;
                if (originalContextAction) {
<<<<<<< HEAD
                    this.resModel = originalContextAction.active_model
                }
            }
        }
        const isTemplate = !this.resModel || this.resModel === 'product.template';
        this.reportModelName = `report.stock.report_product_${isTemplate ? 'template' : 'product'}_replenishment`;
        this.warehouses.splice(0, this.warehouses.length);
        this.warehouses.push(...await this.orm.call('report.stock.report_product_product_replenishment', 'get_warehouses', []));
        if (!this.context.warehouse) {
            this.updateWarehouse(this.warehouses[0].id);
        }
        const reportValues = await this.orm.call(
            this.reportModelName, 'get_report_values',
            [],
            {
                context : this.context,
                docids : [this.productId],
                serialize : true,
            }
            );
        this.docs = {...reportValues.docs, ...reportValues.precision};
    }

    async updateWarehouse(id){
        const hasPreviousValue = this.context.warehouse !== undefined;
        this.context.warehouse = id;
        if(hasPreviousValue)
            await this.reloadReport();
    }

    async reloadReport(){
        return this.action.doAction({
            type: "ir.actions.client",
            tag: "replenish_report",
            context: this.context,
            name : this.title,
        },
        {
            stackPosition: 'replaceCurrentAction'
        });
        //await this._getReportValues();
=======
                    this.resModel = originalContextAction.active_model || JSON.parse(originalContextAction.replace(/'/g, '"')).active_model;
                }
            }
        }
    }

    async updateWarehouse(id) {
        const hasPreviousValue = this.context.warehouse !== undefined;
        this.context.warehouse = id;
        if (hasPreviousValue) {
            await this.reloadReport();
        }
    }

    async reloadReport() {
        const actionRequest = {
            type: "ir.actions.client",
            tag: "stock_forecasted",
            context: this.context,
            name: this.title,
        };
        const options = { stackPosition: "replaceCurrentAction" };
        return this.action.doAction(actionRequest, options);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    get graphDomain() {
        const domain = [
<<<<<<< HEAD
            ['state', '=', 'forecast'],
            ['warehouse_id', '=', this.context.warehouse],
        ];
        if (this.resModel === undefined || this.resModel === 'product.template') {
            domain.push(['product_tmpl_id', '=', this.productId]);
        } else if (this.resModel === 'product.product') {
            domain.push(['product_id', '=', this.productId]);
=======
            ["state", "=", "forecast"],
            ["warehouse_id", "=", this.context.warehouse],
        ];
        if (this.resModel === "product.template") {
            domain.push(["product_tmpl_id", "=", this.productId]);
        } else if (this.resModel === "product.product") {
            domain.push(["product_id", "=", this.productId]);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        return domain;
    }

    get graphInfo() {
<<<<<<< HEAD
        return {noContentHelp: this.env._t('Try to add some incoming or outgoing transfers.')};
=======
        return { noContentHelp: this.env._t("Try to add some incoming or outgoing transfers.") };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    async openView(resModel, view, resId) {
        const action = {
<<<<<<< HEAD
            type: 'ir.actions.act_window',
=======
            type: "ir.actions.act_window",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            res_model: resModel,
            views: [[false, view]],
            view_mode: view,
            res_id: resId,
<<<<<<< HEAD
        }
=======
        };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return this.action.doAction(action);
    }
}

<<<<<<< HEAD
StockForecasted.template = 'stock.Forecasted';
StockForecasted.components = {ControlPanel, ForecastedButtons, ForecastedWarehouseFilter, ForecastedHeader, View, ForecastedDetails};
registry.category("actions").add("replenish_report", StockForecasted);
=======
StockForecasted.template = "stock.Forecasted";
StockForecasted.components = {
    ControlPanel,
    ForecastedButtons,
    ForecastedWarehouseFilter,
    ForecastedHeader,
    View,
    ForecastedDetails,
};
registry.category("actions").add("stock_forecasted", StockForecasted);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
