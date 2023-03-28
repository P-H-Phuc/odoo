/** @odoo-module **/

<<<<<<< HEAD
import { Component } from "@odoo/owl";

export class FormStatusIndicator extends Component {
=======
import { Component, useState } from "@odoo/owl";
import { useBus } from "@web/core/utils/hooks";

export class FormStatusIndicator extends Component {
    setup() {
        this.state = useState({
            fieldIsDirty: false,
        });
        useBus(
            this.props.model.bus,
            "FIELD_IS_DIRTY",
            (ev) => (this.state.fieldIsDirty = ev.detail)
        );
    }

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    get displayButtons() {
        return this.indicatorMode !== "saved";
    }

    get indicatorMode() {
<<<<<<< HEAD
        if (this.props.model.root.isVirtual) {
            return this.props.model.root.isValid ? "dirty" : "invalid";
        } else if (!this.props.model.root.isValid) {
            return "invalid";
        } else if (this.props.model.root.isDirty || this.props.fieldIsDirty) {
=======
        if (this.props.model.root.isNew) {
            return this.props.model.root.isValid ? "dirty" : "invalid";
        } else if (!this.props.model.root.isValid) {
            return "invalid";
        } else if (this.props.model.root.isDirty || this.state.fieldIsDirty) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            return "dirty";
        } else {
            return "saved";
        }
    }

    async discard() {
        await this.props.discard();
    }
    async save() {
        await this.props.save();
    }
}
FormStatusIndicator.template = "web.FormStatusIndicator";
FormStatusIndicator.props = {
    model: Object,
    save: Function,
    discard: Function,
    isDisabled: Boolean,
<<<<<<< HEAD
    fieldIsDirty: Boolean,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
};
