/** @odoo-module **/
import { formatFloat } from "@web/views/fields/formatters";
import { useService } from "@web/core/utils/hooks";

<<<<<<< HEAD
const { Component} = owl;

export class ForecastedDetails extends Component{
    setup(){
        this.orm = useService("orm");

        this.onHandCondition = this.props.docs.lines.length && !this.props.docs.lines.some(line => line.document_in || line.replenishment_filled);

        this._formatFloat = (num) => {return formatFloat(num,{ digits: this.props.docs.precision });}
    }

    async _reserve(model, modelId){
        await this.orm.call(
            model,
            'action_assign',
            [[modelId]],
            // {modelId}
=======
const { Component } = owl;

export class ForecastedDetails extends Component {
    setup() {
        this.orm = useService("orm");

        this.onHandCondition =
            this.props.docs.lines.length &&
            !this.props.docs.lines.some((line) => line.document_in || line.replenishment_filled);

        this._formatFloat = (num) => {
            return formatFloat(num, { digits: this.props.docs.precision });
        };
    }

    async _reserve(move_id){
        await this.orm.call(
            'stock.forecasted_product_product',
            'action_reserve_linked_picks',
            [move_id],
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        );
        this.props.reloadReport();
    }

<<<<<<< HEAD
    async _unreserve(model, modelId){
        await this.orm.call(
            model,
            'do_unreserve',
            [[modelId]],
=======
    async _unreserve(move_id){
        await this.orm.call(
            'stock.forecasted_product_product',
            'action_unreserve_linked_picks',
            [move_id],
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        );
        this.props.reloadReport();
    }

<<<<<<< HEAD
    async _onClickChangePriority(modelName, model){
        const value = model.priority == '0' ? '1':'0';

        await this.orm.call(
            modelName,
            'write',
            [[model.id], {priority : value}],
        );
=======
    async _onClickChangePriority(modelName, record) {
        const value = record.priority == "0" ? "1" : "0";

        await this.orm.call(modelName, "write", [[record.id], { priority: value }]);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.props.reloadReport();
    }

    displayReserve(line){
<<<<<<< HEAD
        return line.move_out && ['confirmed', 'partially_available'].includes(line.move_out.state) && line.move_out.picking_id;
    }

    get futureVirtualAvailable(){
        return this.props.docs.virtual_available + this.props.docs.qty.in - this.props.docs.qty.out;
    }
}
ForecastedDetails.template = 'stock.ForecastedDetails';
ForecastedDetails.props = {docs: Object, openView: Function, reloadReport: Function};
=======
        return !line.in_transit && this.canReserveOperation(line);
    }

    canReserveOperation(line){
        return line.move_out?.picking_id;
    }

    get futureVirtualAvailable() {
        return this.props.docs.virtual_available + this.props.docs.qty.in - this.props.docs.qty.out;
    }
}
ForecastedDetails.template = "stock.ForecastedDetails";
ForecastedDetails.props = { docs: Object, openView: Function, reloadReport: Function };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
