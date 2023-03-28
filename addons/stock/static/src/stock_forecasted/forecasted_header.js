/** @odoo-module **/
import { useService } from "@web/core/utils/hooks";
import { formatFloat } from "@web/views/fields/formatters";

const { Component } = owl;

export class ForecastedHeader extends Component{
    setup(){
        this.orm = useService("orm");
        this.action = useService("action");

        this._formatFloat = (num) => formatFloat(num, { digits: this.props.docs.precision });
    }
<<<<<<< HEAD
    
    async _onClickInventory(){
        const templates = this.props.docs.product_templates_ids;
        const variants = this.props.docs.product_variants_ids;
        const context = { ...this.context};
        if (templates) {
            context.search_default_product_tmpl_id = templates;
        } else {
            context.search_default_product_id = variants;
        }
        
        const action = await this.orm.call('stock.quant', 'action_view_quants', [], {context : context});
        return this.action.doAction(action);
=======

    async _onClickInventory(){
        const context = this._getActionContext();
        const action = await this.orm.call('stock.quant', 'action_view_quants', [], { context });
        return this.action.doAction(action);
    }

    _getActionContext(){
        const context = { ...this.context };
        const templates = this.props.docs.product_templates_ids;
        if (templates) {
            context.search_default_product_tmpl_id = templates;
        } else {
            context.search_default_product_id = this.props.docs.product_variants_ids;
        }
        return context;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
}
ForecastedHeader.template = 'stock.ForecastedHeader';
ForecastedHeader.props = {docs: Object, openView: Function};
