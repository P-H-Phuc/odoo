/** @odoo-module **/

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { useBus, useService } from "@web/core/utils/hooks";

const { Component, xml } = owl;

export class BarcodeHandlerField extends Component {
    setup() {
        const barcode = useService("barcode");
        useBus(barcode.bus, "barcode_scanned", this.onBarcodeScanned);
    }
    onBarcodeScanned(event) {
        const { barcode } = event.detail;
<<<<<<< HEAD
        this.props.update(barcode);
=======
        this.props.record.update({ [this.props.name]: barcode });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
}

BarcodeHandlerField.template = xml``;
BarcodeHandlerField.props = { ...standardFieldProps };

<<<<<<< HEAD
registry.category("fields").add("barcode_handler", BarcodeHandlerField);
=======
export const barcodeHandlerField = {
    component: BarcodeHandlerField,
};

registry.category("fields").add("barcode_handler", barcodeHandlerField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
