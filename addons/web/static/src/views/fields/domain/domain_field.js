/** @odoo-module **/

import { DomainSelector } from "@web/core/domain_selector/domain_selector";
import { DomainSelectorDialog } from "@web/core/domain_selector_dialog/domain_selector_dialog";
import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useBus, useService, useOwnedDialogs } from "@web/core/utils/hooks";
import { Domain } from "@web/core/domain";
import { SelectCreateDialog } from "@web/views/view_dialogs/select_create_dialog";
import { standardFieldProps } from "../standard_field_props";

import { Component, onWillStart, onWillUpdateProps, useState } from "@odoo/owl";

export class DomainField extends Component {
    static template = "web.DomainField";
    static components = {
        DomainSelector,
    };
    static props = {
        ...standardFieldProps,
        context: { type: Object, optional: true },
        editInDialog: { type: Boolean, optional: true },
        resModel: { type: String, optional: true },
    };
    static defaultProps = {
        editInDialog: false,
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            recordCount: null,
            isValid: true,
        });
        this.addDialog = useOwnedDialogs();

        this.displayedDomain = null;
        this.isDebugEdited = false;

        onWillStart(() => {
            this.displayedDomain = this.props.record.data[this.props.name];
            this.loadCount(this.props);
        });
        onWillUpdateProps((nextProps) => {
            this.isDebugEdited = this.isDebugEdited && this.props.readonly === nextProps.readonly;
            if (!this.isDebugEdited) {
                this.displayedDomain = nextProps.record.data[nextProps.name];
                this.loadCount(nextProps);
            }
        });

        useBus(this.props.record.model.bus, "NEED_LOCAL_CHANGES", async (ev) => {
            if (this.isDebugEdited) {
                const prom = this.loadCount(this.props);
                ev.detail.proms.push(prom);
                await prom;
                if (!this.state.isValid) {
                    this.props.record.setInvalidField(this.props.name);
                }
            }
        });
    }

    getContext(p) {
        return p.context;
    }
    getResModel(p) {
        let resModel = p.resModel;
        if (p.record.fieldNames.includes(resModel)) {
            resModel = p.record.data[resModel];
        }
        return resModel;
    }

    onButtonClick() {
        this.addDialog(
            SelectCreateDialog,
            {
                title: this.env._t("Selected records"),
                noCreate: true,
                multiSelect: false,
                resModel: this.getResModel(this.props),
<<<<<<< HEAD
                domain: this.getDomain(this.props.value).toList(this.getContext(this.props)) || [],
=======
                domain:
                    this.getDomain(this.props.record.data[this.props.name]).toList(
                        this.getContext(this.props)
                    ) || [],
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                context: this.getContext(this.props) || {},
            },
            {
                // The counter is reloaded "on close" because some modal allows to modify data that can impact the counter
                onClose: () => this.loadCount(this.props),
            }
        );
    }
    get isValidDomain() {
        try {
            this.getDomain(this.props.record.data[this.props.name]).toList();
            return true;
        } catch {
            // WOWL TODO: rethrow error when not the expected type
            return false;
        }
    }

    getDomain(value) {
        return new Domain(value || "[]");
    }
    async loadCount(props) {
        if (!this.getResModel(props)) {
            Object.assign(this.state, { recordCount: 0, isValid: true });
        }

        let recordCount;
        try {
            const domain = this.getDomain(props.record.data[props.name]).toList(
                this.getContext(props)
            );
            recordCount = await this.orm.silent.call(
                this.getResModel(props),
                "search_count",
                [domain],
                { context: this.getContext(props) }
            );
        } catch {
            // WOWL TODO: rethrow error when not the expected type
            Object.assign(this.state, { recordCount: 0, isValid: false });
            return;
        }
        Object.assign(this.state, { recordCount, isValid: true });
    }

    update(domain, isDebugEdited) {
        this.isDebugEdited = isDebugEdited;
        this.props.record.update({ [this.props.name]: domain });
    }

    onEditDialogBtnClick() {
        this.addDialog(DomainSelectorDialog, {
            resModel: this.getResModel(this.props),
            initialValue: this.props.record.data[this.props.name] || "[]",
            readonly: this.props.readonly,
            isDebugMode: !!this.env.debug,
            onSelected: (value) => this.props.record.update({ [this.props.name]: value }),
        });
    }
}

export const domainField = {
    component: DomainField,
    displayName: _lt("Domain"),
    supportedTypes: ["char"],
    isEmpty: () => false,
    extractProps({ options }, dynamicInfo) {
        return {
            editInDialog: options.in_dialog,
            resModel: options.model,
            context: dynamicInfo.context,
        };
    },
};

registry.category("fields").add("domain", domainField);
