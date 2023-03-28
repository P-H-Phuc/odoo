/** @odoo-module **/

import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { Many2ManyTagsField } from "@web/views/fields/many2many_tags/many2many_tags_field";
=======
import { Many2ManyTagsField, many2ManyTagsField } from "@web/views/fields/many2many_tags/many2many_tags_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const { onWillUpdateProps } = owl;

export class AutosaveMany2ManyTagsField extends Many2ManyTagsField {
    setup() {
        super.setup();

        onWillUpdateProps((nextProps) => this.willUpdateProps(nextProps));

        this.lastBalance = this.props.record.data.balance;
        this.lastAccount = this.props.record.data.account_id;
        this.lastPartner = this.props.record.data.partner_id;

        const super_update = this.update;
        this.update = (recordlist) => {
            super_update(recordlist);
            this._saveOnUpdate();
        };
    }

    deleteTag(id) {
        super.deleteTag(id);
        this._saveOnUpdate();
    }

    willUpdateProps(nextProps) {
        const line = this.props.record.data;
        if (line.tax_ids.records.length > 0) {
            if (line.balance !== this.lastBalance
                || line.account_id[0] !== this.lastAccount[0]
                || line.partner_id[0] !== this.lastPartner[0]) {
                this.lastBalance = line.balance;
                this.lastAccount = line.account_id;
                this.lastPartner = line.partner_id;
                this._saveOnUpdate();
            }
        }
    }

    async _saveOnUpdate() {
        await this.props.record.model.root.save({ stayInEdition: true });
    }
}

<<<<<<< HEAD
registry.category("fields").add("autosave_many2many_tags", AutosaveMany2ManyTagsField);
=======
export const autosaveMany2ManyTagsField = {
    ...many2ManyTagsField,
    component: AutosaveMany2ManyTagsField,
};

registry.category("fields").add("autosave_many2many_tags", autosaveMany2ManyTagsField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
