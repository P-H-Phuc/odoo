/** @odoo-module */

<<<<<<< HEAD
import { FloatField } from "@web/views/fields/float/float_field";
=======
import { FloatField, floatField } from "@web/views/fields/float/float_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { formatDate } from "@web/core/l10n/dates";
import { formatFloat } from "@web/views/fields/formatters";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class ForecastWidgetField extends FloatField {
    setup() {
        const { data, fields } = this.props.record;
        this.actionService = useService("action");
        this.orm = useService("orm");
        this.resId = data.id;

        this.reservedAvailability = formatFloat(data.reserved_availability, {
            ...fields.reserved_availability,
            ...this.nodeOptions,
        });
        this.forecastExpectedDate = formatDate(
            data.forecast_expected_date,
            fields.forecast_expected_date
        );
        if (data.forecast_expected_date && data.date_deadline) {
            this.forecastIsLate = data.forecast_expected_date > data.date_deadline;
        }
        this.willBeFulfilled = data.forecast_availability >= data.product_qty;
        this.state = data.state;
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Opens the Forecast Report for the `stock.move` product.
     */
    async _openReport(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (!this.resId) {
            return;
        }
        const action = await this.orm.call("stock.move", "action_product_forecast_report", [
            this.resId,
        ]);
        this.actionService.doAction(action);
    }
}
ForecastWidgetField.template = "stock.ForecastWidget";

<<<<<<< HEAD
registry.category("fields").add("forecast_widget", ForecastWidgetField);
=======
export const forecastWidgetField = {
    ...floatField,
    component: ForecastWidgetField,
};

registry.category("fields").add("forecast_widget", forecastWidgetField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
