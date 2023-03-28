/** @odoo-module **/
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { useService } from "@web/core/utils/hooks";
const { Component, onWillStart} = owl;

export class ForecastedWarehouseFilter extends Component {

    setup() {
        this.orm = useService("orm");
        this.context = this.props.action.context;
<<<<<<< HEAD
        this.warehouses = this.props.warehouses;
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        onWillStart(this.onWillStart)
    }

    async onWillStart() {
<<<<<<< HEAD
=======
        this.warehouses = await this.orm.searchRead('stock.warehouse', [],['id', 'name', 'code']);

        if (!this.context.warehouse) {
            this.props.setWarehouseInContext(this.warehouses[0].id);
        }

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.displayWarehouseFilter = (this.warehouses.length > 1);
    }

    _onSelected(id){
        this.props.setWarehouseInContext(Number(id));
    }

    get activeWarehouse(){
<<<<<<< HEAD
        if (this.context.warehouse)
            return this.warehouses.find(w => w.id == this.context.warehouse);
        else
            return this.warehouses[0];
=======
        return this.context.warehouse ?
            this.warehouses.find(w => w.id == this.context.warehouse) :
            this.warehouses[0];
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
}

ForecastedWarehouseFilter.template = 'stock.ForecastedWarehouseFilter';
ForecastedWarehouseFilter.components = {Dropdown, DropdownItem};
<<<<<<< HEAD
ForecastedWarehouseFilter.props = {action: Object, setWarehouseInContext : Function, warehouses: Array};
=======
ForecastedWarehouseFilter.props = {action: Object, setWarehouseInContext : Function};
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
