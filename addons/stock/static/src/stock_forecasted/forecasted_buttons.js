/** @odoo-module **/
import { useService } from "@web/core/utils/hooks";
const { Component} = owl;

export class ForecastedButtons extends Component {

    setup() {
        this.actionService = useService("action");
        this.orm = useService("orm");
        this.context = this.props.action.context;
        this.productId = this.context.active_id;
<<<<<<< HEAD
        this.resModel = this.props.resModel || 'product.template';
    }

    async _onClickReplenish() {
        const context = { ...this.context};
=======
        this.resModel = this.props.resModel || this.context.active_model || this.context.params?.active_model || 'product.template';
    }

    /**
     * Called when an action open a wizard. If the wizard is discarded, this
     * method does nothing, otherwise it reloads the report.
     * @param {Object | undefined} res
     */
    _onClose(res) {
        return res?.special || this.props.reloadReport();
    }

    async _onClickReplenish() {
        const context = { ...this.context };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (this.resModel === 'product.product') {
            context.default_product_id = this.productId;
        } else if (this.resModel === 'product.template') {
            context.default_product_tmpl_id = this.productId;
        }
        context.default_warehouse_id = this.context.warehouse;

        const action = {
            res_model: 'product.replenish',
            name: this.env._t('Product Replenish'),
            type: 'ir.actions.act_window',
            views: [[false, 'form']],
            target: 'new',
            context: context,
        };
<<<<<<< HEAD
        return this.actionService.doAction(action, {
            onClose: (res) => {
                if (res && res.special) {
                    // Do nothing when the wizard is discarded.
                    return;
                }
                // Otherwise, reload the report.
                this.props.reloadReport();
            },
        });
    }
}

ForecastedButtons.props = {action : Object, resModel: { type: String, optional: true }, reloadReport : Function};
=======
        return this.actionService.doAction(action, { onClose: this._onClose.bind(this) });
    }

    async _onClickUpdateQuantity() {
        const action = await this.orm.call(this.resModel, "action_update_quantity_on_hand", [[this.productId]]);
        if (action.res_model === "stock.quant") { // Quant view in inventory mode.
            action.views = [[false, "tree"]];
        }
        return this.actionService.doAction(action, { onClose: this._onClose.bind(this) });
    }
}

ForecastedButtons.props = {
    action : Object,
    resModel: {type: String, optional: true},
    reloadReport : Function,
};
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
ForecastedButtons.template = 'stock.ForecastedButtons';
