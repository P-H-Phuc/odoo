/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
<<<<<<< HEAD
import { FloatField } from "@web/views/fields/float/float_field";
=======
import { FloatField, floatField } from "@web/views/fields/float/float_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { _lt } from "@web/core/l10n/translation";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

 /**
    * Dialog called if user changes a value in the sale order line.
    * The wizard will open only if
    *  (1) Sale order line is 3 or more
    *  (2) First sale order line is changed
    *  (3) value is the same in all other sale order line
 */

export class ProductDiscountField extends FloatField {
    setup() {
        super.setup();
        this.dialogService = useService("dialog");
    }

    onChange(ev) {
        const x2mList = this.props.record.model.root.data.order_line;
        const orderLines = x2mList.records.filter(line => !line.data.display_type);

        if (orderLines.length < 3) {
            return;
        }

        const isFirstOrderLine = this.props.record.data.id === orderLines[0].data.id;
        if (isFirstOrderLine && sameValue(orderLines)) {
            this.dialogService.add(ConfirmationDialog, {
<<<<<<< HEAD
                body: _lt("Do you want to apply this value to all lines ?"),
=======
                body: _lt("Do you want to apply this value to all lines?"),
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                confirm: () => {
                    const commands = orderLines.slice(1).map((line) => {
                        return {
                            operation: "UPDATE",
                            record: line,
<<<<<<< HEAD
                            data: {["discount"]: this.props.value},
=======
                            data: {["discount"]: this.props.record.data[this.props.name]},
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                        };
                    });

                    x2mList.applyCommands('order_line', commands);
                },
            });
        }
    }
}

// TODO remove this function, no need to export it anymore.
export function sameValue(orderLines) {
    const compareValue = orderLines[1].data.discount;
    return orderLines.slice(1).every(line => line.data.discount === compareValue);
}


ProductDiscountField.components = { ConfirmationDialog };
ProductDiscountField.template = "sale.ProductDiscountField";
<<<<<<< HEAD
ProductDiscountField.displayName = _lt("Disc.%");

registry.category("fields").add("sol_discount", ProductDiscountField)
=======

export const productDiscountField = {
    ...floatField,
    component: ProductDiscountField,
    displayName: _lt("Disc.%"),
};

registry.category("fields").add("sol_discount", productDiscountField)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
