/** @odoo-module **/

import { useBus, useService } from "@web/core/utils/hooks";
import { RelationalModel } from "@web/views/relational_model";
import { Component, xml, onWillStart, onWillUpdateProps } from "@odoo/owl";
<<<<<<< HEAD

class _Record extends Component {
    setup() {
        const activeFields =
            this.props.info.activeFields ||
            Object.fromEntries(
                this.props.info.fieldNames.map((f) => [f, { attrs: {}, options: {}, domain: "[]" }])
            );

        this.model = useModel(RelationalModel, {
            resId: this.props.info.resId,
            resModel: this.props.info.resModel,
=======

const defaultActiveField = { attrs: {}, options: {}, domain: "[]", string: "" };

class _Record extends Component {
    setup() {
        const resModel = this.props.info.resModel;
        const modelParams = {
            resModel,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            fields: this.props.fields,
            viewMode: "form",
            rootType: "record",
            activeFields: this.getActiveFields(),
        };
        const modelServices = Object.fromEntries(
            RelationalModel.services.map((servName) => {
                return [servName, useService(servName)];
            })
        );
        if (resModel) {
            modelServices.orm = useService("orm");
        }

        this.model = new RelationalModel(this.env, modelParams, modelServices);
        useBus(this.model.bus, "update", () => this.render(true));

        let loadKey;
        const load = (props) => {
            const loadParams = {
                resId: props.info.resId,
                mode: props.info.mode,
                values: props.values,
            };
            const nextLoadKey = JSON.stringify(loadParams);
            if (loadKey === nextLoadKey) {
                return;
            }
            loadKey = nextLoadKey;
            return this.model.load(loadParams);
        };
        onWillStart(() => load(this.props));
        onWillUpdateProps((nextProps) => {
            // don't wait because the keeplast may make willUpdateProps hang forever
            load(nextProps);
        });

        if (this.props.info.onRecordChanged) {
            const load = this.model.load;
            this.model.load = async (...args) => {
                const res = await load.call(this.model, ...args);
                const root = this.model.root;
                root.onChanges = async () => {
                    const changes = root.getChanges();
                    this.props.info.onRecordChanged(root, changes);
                };
                return res;
            };
        }
    }

    getActiveFields() {
        if (this.props.info.activeFields) {
            const activeFields = {};
            for (const [fName, fInfo] of Object.entries(this.props.info.activeFields)) {
                activeFields[fName] = { ...defaultActiveField, ...fInfo };
            }
            return activeFields;
        }
        return Object.fromEntries(
            this.props.info.fieldNames.map((f) => [f, { ...defaultActiveField }])
        );
    }
}
_Record.template = xml`<t t-slot="default" record="model.root"/>`;
_Record.props = ["slots", "info", "fields", "values?"];

export class Record extends Component {
    setup() {
        if (this.props.fields) {
            this.fields = this.props.fields;
        } else {
            const orm = useService("orm");
            onWillStart(async () => {
                this.fields = await orm.call(
                    this.props.resModel,
                    "fields_get",
                    [this.props.fieldNames],
                    {}
                );
            });
        }
    }
}
Record.template = xml`<_Record fields="fields" slots="props.slots" values="props.values" info="props" />`;
Record.components = { _Record };
Record.props = [
    "slots",
<<<<<<< HEAD
    "resModel",
=======
    "resModel?",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    "fieldNames?",
    "activeFields?",
    "fields?",
    "resId?",
    "mode?",
<<<<<<< HEAD
    "initialValues?",
=======
    "values?",
    "onRecordChanged?",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
];
