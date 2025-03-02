/** @odoo-module **/

import { isMobileOS } from "@web/core/browser/feature_detection";
import { usePopover } from "@web/core/popover/popover_hook";
import { registry } from "@web/core/registry";
import {
    many2ManyTagsField,
    Many2ManyTagsField,
} from "@web/views/fields/many2many_tags/many2many_tags_field";
import { TagsList } from "../many2many_tags/tags_list";
import { onMounted, useState } from "@odoo/owl";
import { AvatarMany2XAutocomplete } from "@web/views/fields/relational_utils";

export class Many2ManyTagsAvatarField extends Many2ManyTagsField {
    static template = "web.Many2ManyTagsAvatarField";
    static components = {
        Many2XAutocomplete: AvatarMany2XAutocomplete,
        TagsList,
    };
    static props = {
        ...Many2ManyTagsField.props,
        withCommand: { type: Boolean, optional: true },
    };
    getTagProps(record) {
        return {
            ...super.getTagProps(record),
            img: `/web/image/${this.relation}/${record.resId}/avatar_128`,
        };
    }
}

export const many2ManyTagsAvatarField = {
    ...many2ManyTagsField,
    component: Many2ManyTagsAvatarField,
    extractProps({ viewType }, dynamicInfo) {
        const props = many2ManyTagsField.extractProps(...arguments);
        props.withCommand = viewType === "form";
        props.domain = dynamicInfo.domain;
        return props;
    },
};

registry.category("fields").add("many2many_tags_avatar", many2ManyTagsAvatarField);

<<<<<<< HEAD
export class ListKanbanMany2ManyTagsAvatarField extends Many2ManyTagsAvatarField {
    get itemsVisible() {
        return this.props.record.activeFields[this.props.name].viewType === "list" ? 5 : 3;
    }

    getTagProps(record) {
        return {
            ...super.getTagProps(record),
            img: `/web/image/${this.props.relation}/${record.resId}/avatar_128`,
        };
=======
export class ListMany2ManyTagsAvatarField extends Many2ManyTagsAvatarField {
    itemsVisible = 5;
}

export const listMany2ManyTagsAvatarField = {
    ...many2ManyTagsAvatarField,
    component: ListMany2ManyTagsAvatarField,
};

registry.category("fields").add("list.many2many_tags_avatar", listMany2ManyTagsAvatarField);

export class Many2ManyTagsAvatarFieldPopover extends Many2ManyTagsAvatarField {
    static template = "web.Many2ManyTagsAvatarFieldPopover";
    static props = {
        ...Many2ManyTagsAvatarField.props,
        close: { type: Function },
        deleteTag: { type: Function },
        updateTag: { type: Function },
    };

    setup() {
        super.setup();
        this.state = useState({ tags: this.tags });
        this.update = async (recordList) => {
            const updatedVal = await this.props.updateTag(recordList);
            this.state.tags = updatedVal.map((tag) => ({
                ...tag,
                onDelete: () => this.deleteTag(tag.id),
            }));
        };
        onMounted(() => {
            this.autoCompleteRef.el.querySelector("input").focus();
        });
    }
    async deleteTag(id) {
        const updatedVal = await this.props.deleteTag(id);
        this.state.tags = updatedVal.map((tag) => ({
            ...tag,
            onDelete: () => this.deleteTag(tag.id),
        }));
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
}

export const many2ManyTagsAvatarFieldPopover = {
    ...many2ManyTagsAvatarField,
    component: Many2ManyTagsAvatarFieldPopover,
};
registry.category("fields").add("many2many_tags_avatar_popover", many2ManyTagsAvatarFieldPopover);

export class KanbanMany2ManyTagsAvatarFieldTagsList extends TagsList {
    static template = "web.KanbanMany2ManyTagsAvatarFieldTagsList";

    static props = {
        ...TagsList.props,
        popoverProps: { type: Object },
        readonly: { type: Boolean, optional: true },
    };
    setup() {
        super.setup();
        this.popover = usePopover();
    }
    get visibleTagsCount() {
        return this.props.itemsVisible;
    }
    closePopover() {
        this.closePopoverFn();
        this.closePopoverFn = null;
    }
    openPopover(ev) {
        if (this.props.readonly) {
            return;
        }
        if (this.closePopoverFn) {
            this.closePopover();
        }
        this.closePopoverFn = this.popover.add(
            ev.currentTarget.parentElement,
            Many2ManyTagsAvatarFieldPopover,
            {
                ...this.props.popoverProps,
                readonly: false,
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
        return !this.props.readonly && !isMobileOS();
    }
}

export class KanbanMany2ManyTagsAvatarField extends Many2ManyTagsAvatarField {
    static template = "web.KanbanMany2ManyTagsAvatarField";
    static components = {
        ...Many2ManyTagsAvatarField.components,
        TagsList: KanbanMany2ManyTagsAvatarFieldTagsList,
    };
    itemsVisible = 2;

    get popoverProps() {
        return {
            ...this.props,
            readonly: this.props.readonly,
            deleteTag: this.deleteTag.bind(this),
            updateTag: this.updateTag.bind(this),
        };
    }
    async deleteTag(id) {
        super.deleteTag(id);
        await this.props.record.save({ noReload: true });
        return this.tags;
    }
    async updateTag(recordList) {
        await this.update(recordList);
        await this.props.record.save({ noReload: true });
        return this.tags;
    }

    getTagProps(record) {
        return {
            ...super.getTagProps(record),
            onDelete: () => this.deleteTag(record.id),
        };
    }
}

export const kanbanMany2ManyTagsAvatarField = {
    ...many2ManyTagsAvatarField,
    component: KanbanMany2ManyTagsAvatarField,
    extractProps(fieldInfo, dynamicInfo) {
        const props = many2ManyTagsAvatarField.extractProps(...arguments);
        props.readonly = dynamicInfo.readonly;
        return props;
    },
};

registry.category("fields").add("kanban.many2many_tags_avatar", kanbanMany2ManyTagsAvatarField);
