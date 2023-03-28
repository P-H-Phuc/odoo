/** @odoo-module **/
import { patch } from '@web/core/utils/patch';

import { ForecastedHeader as Parent } from "@stock/stock_forecasted/forecasted_header";

export class StockAccountForecastedHeader extends Parent{}

patch(Parent.prototype, 'stock_account.ForecastedHeader', {
    async _onClickValuation() {
<<<<<<< HEAD
        const templates = this.props.docs.product_templates_ids;
        const variants = this.props.docs.product_variants_ids;
        const context = Object.assign({}, this.context);
        if (templates) {
            context.search_default_product_tmpl_id = templates;
        } else {
            context.search_default_product_id = variants;
        }
=======
        const context = this._getActionContext();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return this.action.doAction({
            name: this.env._t('Stock Valuation'),
            res_model: 'stock.valuation.layer',
            type: 'ir.actions.act_window',
            view_mode: 'list,form',
            views: [[false, 'list'], [false, 'form']],
            target: 'current',
            context: context,
        });
    }
});

StockAccountForecastedHeader.template = 'stock_account.ForecastedHeader';
