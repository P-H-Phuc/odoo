/** @odoo-module **/

<<<<<<< HEAD
import { registry } from '@web/core/registry';
import { Many2OneField } from '@web/views/fields/many2one/many2one_field';

export class SaleOrderLineProductField extends Many2OneField {
=======
import { registry } from "@web/core/registry";
import { Many2OneField, many2OneField } from "@web/views/fields/many2one/many2one_field";

export class SaleOrderLineProductField extends Many2OneField {
    static props = {
        ...Many2OneField.props,
        readonlyField: { type: Boolean, optional: true },
    };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    setup() {
        super.setup();
        const { update } = this;
        this.update = async (value) => {
            await update(value);
            let newValue = false;
            // NB: quick creation doesn't go through here, but through quickCreate
            // below
            if (value) {
<<<<<<< HEAD
                if (Array.isArray(value[0]) && this.props.value != value[0]) {
=======
                if (
                    Array.isArray(value[0]) &&
                    this.props.record.data[this.props.name] != value[0]
                ) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    // product (existing)
                    newValue = true;
                } else {
                    // new product (Create & edit)
                    // value[0] is a dict of creation values
                    newValue = true;
                }
            }
            if (newValue) {
<<<<<<< HEAD
                if (this.props.relation === 'product.template') {
=======
                if (this.relation === "product.template") {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    this._onProductTemplateUpdate();
                } else {
                    this._onProductUpdate();
                }
            }
        };

        if (this.props.canQuickCreate) {
            // HACK to make quick creation also open
            //      configurators if needed
            this.quickCreate = async (name, params = {}) => {
<<<<<<< HEAD
                await this.props.record.update({ [this.props.name]: [false, name]});

                if (this.props.relation === 'product.template') {
=======
                await this.props.record.update({ [this.props.name]: [false, name] });

                if (this.relation === "product.template") {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    this._onProductTemplateUpdate();
                } else {
                    this._onProductUpdate();
                }
            };
        }
    }

    get isProductClickable() {
        // product form should be accessible if the widget field is readonly
        // or if the line cannot be edited (e.g. locked SO)
        return (
<<<<<<< HEAD
            this.props.record.isReadonly(this.props.name)
            || this.props.record.model.root.isReadonly
            && this.props.record.model.root.activeFields.order_line
            && this.props.record.model.root.isReadonly('order_line')
        )
=======
            this.props.readonlyField ||
            (this.props.record.model.root.activeFields.order_line &&
                this.props.record.model.root._isReadonly("order_line"))
        );
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
    get hasExternalButton() {
        // Keep external button, even if field is specified as 'no_open' so that the user is not
        // redirected to the product when clicking on the field content
        const res = super.hasExternalButton;
<<<<<<< HEAD
        return res || (!!this.props.value && !this.state.isFloating);
=======
        return res || (!!this.props.record.data[this.props.name] && !this.state.isFloating);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
    get hasConfigurationButton() {
        return this.isConfigurableLine || this.isConfigurableTemplate;
    }
<<<<<<< HEAD
    get isConfigurableLine() { return false; }
    get isConfigurableTemplate() { return false; }
=======
    get isConfigurableLine() {
        return false;
    }
    get isConfigurableTemplate() {
        return false;
    }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    get configurationButtonHelp() {
        return this.env._t("Edit Configuration");
    }

    get configurationButtonIcon() {
<<<<<<< HEAD
        return 'btn btn-secondary fa ' + this.configurationButtonFAIcon();
    }

    configurationButtonFAIcon() {
        return 'fa-pencil';
=======
        return "btn btn-secondary fa " + this.configurationButtonFAIcon();
    }

    configurationButtonFAIcon() {
        return "fa-pencil";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    onClick(ev) {
        // Override to get internal link to products in SOL that cannot be edited
        if (this.props.readonly) {
            ev.stopPropagation();
            this.openAction();
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            super.onClick(ev);
        }
    }

<<<<<<< HEAD
    async _onProductTemplateUpdate() { }
    async _onProductUpdate() { } // event_booth_sale, event_sale, sale_renting
=======
    async _onProductTemplateUpdate() {}
    async _onProductUpdate() {} // event_booth_sale, event_sale, sale_renting
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    onEditConfiguration() {
        if (this.isConfigurableLine) {
            this._editLineConfiguration();
        } else {
            this._editProductConfiguration();
        }
    }
<<<<<<< HEAD
    _editLineConfiguration() { } // event_booth_sale, event_sale, sale_renting
    _editProductConfiguration() { } // sale_product_configurator, sale_product_matrix

=======
    _editLineConfiguration() {} // event_booth_sale, event_sale, sale_renting
    _editProductConfiguration() {} // sale_product_configurator, sale_product_matrix
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
}

SaleOrderLineProductField.template = "sale.SaleProductField";

<<<<<<< HEAD
registry.category("fields").add("sol_product_many2one", SaleOrderLineProductField);
=======
export const saleOrderLineProductField = {
    ...many2OneField,
    component: SaleOrderLineProductField,
    extractProps(fieldInfo, dynamicInfo) {
        const props = many2OneField.extractProps(...arguments);
        props.readonlyField = dynamicInfo.readonly;
        return props;
    },
};

registry.category("fields").add("sol_product_many2one", saleOrderLineProductField);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
