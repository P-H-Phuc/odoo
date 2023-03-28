/** @odoo-module */

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";

const { Component, onWillStart, onWillUpdateProps } = owl;

export class JsonPopOver extends Component {
    
    setup(){
<<<<<<< HEAD
        this.jsonValue = JSON.parse(this.props.value);
        onWillUpdateProps(nextProps => {
            this.jsonValue = JSON.parse(nextProps.value);
=======
        this.jsonValue = JSON.parse(this.props.record.data[this.props.name]);
        onWillUpdateProps(nextProps => {
            this.jsonValue = JSON.parse(nextProps.record.data[nextProps.name]);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        });
    }
}

<<<<<<< HEAD
JsonPopOver.displayName = _lt("Json Popup");
JsonPopOver.supportedTypes = ["char"];
=======
export const jsonPopOver = {
    component: JsonPopOver,
    displayName: _lt("Json Popup"),
    supportedTypes: ["char"],
};
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class PopOverLeadDays extends JsonPopOver {
    setup() {
        super.setup();
        const user = useService("user");
        onWillStart(async () => {
            this.displayUOM = await user.hasGroup("uom.group_uom");
        });
    }

    get qtyForecast() {
        return this._formatQty("qty_forecast");
    }
    get qtyToOrder() {
        return this._formatQty("qty_to_order");
    }
    get productMaxQty() {
        return this._formatQty("product_max_qty");
    }
    get productMinQty() {
        return this._formatQty("product_min_qty");
    }

    _formatQty(field) {
        return this.displayUOM
            ? `${this.jsonValue[field]} ${this.jsonValue.product_uom_name}`
            : this.jsonValue[field];
    }
}

PopOverLeadDays.template = "stock.leadDays";

<<<<<<< HEAD
export class ReplenishmentHistoryWidget extends JsonPopOver {}
ReplenishmentHistoryWidget.template = "stock.replenishmentHistory";

registry.category("fields").add("lead_days_widget", PopOverLeadDays);
registry.category("fields").add("replenishment_history_widget", ReplenishmentHistoryWidget);
=======
export const popOverLeadDays = {
    ...jsonPopOver,
    component: PopOverLeadDays,
};
registry.category("fields").add("lead_days_widget", popOverLeadDays);

export class ReplenishmentHistoryWidget extends JsonPopOver {}
ReplenishmentHistoryWidget.template = "stock.replenishmentHistory";

export const replenishmentHistoryWidget = {
    ...jsonPopOver,
    component: ReplenishmentHistoryWidget,
};

registry.category("fields").add("replenishment_history_widget", replenishmentHistoryWidget);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
