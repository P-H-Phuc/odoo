/** @odoo-module **/

import { registry } from "@web/core/registry";
import { isMobileOS } from "@web/core/browser/feature_detection";
import { usePopover } from "@web/core/popover/popover_hook";
import { many2OneField, Many2OneField } from "../many2one/many2one_field";

<<<<<<< HEAD
import { Component } from "@odoo/owl";
=======
import { Component, onMounted } from "@odoo/owl";
import { AvatarMany2XAutocomplete } from "@web/views/fields/relational_utils";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class Many2OneAvatarField extends Component {
    static template = "web.Many2OneAvatarField";
    static components = {
        Many2OneField,
    };
    static props = {
        ...Many2OneField.props,
    };

    get relation() {
        return this.props.relation || this.props.record.fields[this.props.name].relation;
    }
    get many2OneProps() {
        return Object.fromEntries(
            Object.entries(this.props).filter(
                ([key, _val]) => key in this.constructor.components.Many2OneField.props
            )
        );
    }
}

export const many2OneAvatarField = {
    ...many2OneField,
    component: Many2OneAvatarField,
};
export class Many2OneFieldPopover extends Many2OneField {
    static props = {
        ...Many2OneField.props,
        close: { type: Function },
    };
    static components = {
        Many2XAutocomplete: AvatarMany2XAutocomplete,
    };
    setup() {
        super.setup();
        onMounted(() => this.focusInput());
    }

    async updateRecord(value) {
        const updatedValue = await super.updateRecord(...arguments);
        await this.props.record.save();
        return updatedValue;
    }
}

export class KanbanMany2OneAvatarField extends Many2OneAvatarField {
    static template = "web.KanbanMany2OneAvatarField";
    setup() {
        super.setup();
        this.popover = usePopover();
    }

    closePopover() {
        this.closePopoverFn();
        this.closePopoverFn = null;
    }
    get popoverProps() {
        return {
            ...this.props,
            readonly: false,
        };
    }
    openPopover(ev) {
        if (this.props.readonly) {
            return;
        }
        if (this.closePopoverFn) {
            this.closePopover();
        }
        this.closePopoverFn = this.popover.add(
            ev.currentTarget,
            Many2OneFieldPopover,
            {
                ...this.popoverProps,
                canCreate: false,
                canCreateEdit: false,
                canQuickCreate: false,
            },
            {
                position: "bottom",
            }
        );
    }

    get canDisplayDelete() {
        return !this.props.readonly && this.props.record.data[this.props.name] && !isMobileOS();
    }
    async remove(ev) {
        if (this.props.readonly) {
            return;
        }
        await this.props.record.update({ [this.props.name]: false });
        await this.props.record.save();
    }
}

export const kanbanMany2OneAvatarField = {
    ...many2OneField,
    component: KanbanMany2OneAvatarField,
    additionalClasses: ["o_field_many2one_avatar_kanban"],
    extractProps(fieldInfo, dynamicInfo) {
        const props = many2OneField.extractProps(...arguments);
        props.readonly = dynamicInfo.readonly;
        return props;
    },
};
registry.category("fields").add("many2one_avatar", many2OneAvatarField);
registry.category("fields").add("kanban.many2one_avatar", kanbanMany2OneAvatarField);
