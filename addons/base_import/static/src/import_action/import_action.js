/** @odoo-module **/

import { Component, onWillStart, onMounted, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { sprintf } from "@web/core/utils/strings";
import { FileInput } from "@web/core/file_input/file_input";
import { useImportModel } from "../import_model";
import { ImportDataContent } from "../import_data_content/import_data_content";
import { ImportDataProgress } from "../import_data_progress/import_data_progress";
import { ImportDataSidepanel } from "../import_data_sidepanel/import_data_sidepanel";
import { Layout } from "@web/search/layout";

export class ImportAction extends Component {
    static template = "ImportAction";
    static nextId = 1;
    static components = {
        FileInput,
        ImportDataContent,
        ImportDataSidepanel,
        Layout,
    };

    setup() {
        this.notification = useService("notification");
        this.orm = useService("orm");
        this.router = useService("router");
        this.user = useService("user");

        this.env.config.setDisplayName(this.props.action.name || this.env._t("Import a File"));
        this.resModel = this.props.action.params.model;
        this.model = useImportModel({
            env: this.env,
            resModel: this.resModel,
            context: this.props.action.params.context || {},
            orm: this.orm,
        });

        this.state = useState({
            filename: undefined,
            fileLength: 0,
            importMessages: [],
            importProgress: {
                value: 0,
                step: 1,
            },
            isPaused: false,
            previewError: "",
        });

        onWillStart(() => this.model.init());
        onMounted(() => this.enter());
    }

    enter() {
        const newState = { action: "import", model: this.resModel };
        this.router.pushState(newState, { replace: true });
    }

    exit() {
        this.env.config.historyBack();
    }

    get display() {
        return {
            controlPanel: {
                "top-right": false,
                "bottom-left": true,
                "bottom-right": false,
            },
        };
    }

    get importTemplates() {
        return this.model.importTemplates;
    }

    //--------------------------------------------------------------------------
    // Options
    //--------------------------------------------------------------------------

    get formattingOptions() {
        return this.model.formattingOptions;
    }

    get totalToImport() {
        return this.state.fileLength - parseInt(this.importOptions.skip);
    }

    get totalSteps() {
        return this.isBatched ? Math.ceil(this.totalToImport / this.importOptions.limit) : 1;
    }

    get importOptions() {
        return this.model.importOptions;
    }

    get isPreviewing() {
        return this.state.filename !== undefined;
    }

    // Activate the batch configuration panel only if the file length > 100. (In order to let the user choose
    // the batch size even for medium size file. Could be useful to reduce the batch size for complex models).
    get isBatched() {
        return this.state.fileLength > 100;
    }

    async onOptionChanged(name, value, fieldName = null) {
        this.model.block();
        await this.model.setOption(name, value, fieldName);
        this.model.unblock();
    }

    async reload() {
        this.model.block();
        await this.model.updateData();
        this.model.unblock();
    }

    //--------------------------------------------------------------------------
    // File
    //--------------------------------------------------------------------------

    async handleFilesUpload(files) {
        if (!files || files.length <= 0) {
            return;
        }

        this.state.filename = files[0].name;
        this.state.importMessages = [];

        this.model.block(this.env._t("Loading file..."));
        const { res, error } = await this.model.updateData(true);

        if (error) {
            this.state.previewError = error;
        } else {
            this.state.fileLength = res.file_length;
            this.state.previewError = undefined;
        }
        this.model.unblock();
    }

    async handleImport(isTest = true) {
        const message = isTest ? this.env._t("Testing") : this.env._t("Importing");

        let blockComponent;
        if (this.isBatched) {
            blockComponent = {
                class: ImportDataProgress,
                props: {
                    stopImport: () => this.stopImport(),
                    totalSteps: this.totalSteps,
                    importProgress: this.state.importProgress,
                },
            };
        }

        this.model.block(message, blockComponent);

        let res = { ids: [] };
        try {
            const data = await this.model.executeImport(
                isTest,
                this.totalSteps,
                this.state.importProgress
            );
            res = data.res;
        } finally {
            this.model.unblock();
        }

        if (!isTest && res.nextrow) {
            this.state.isPaused = true;
        }

        if (!isTest && res.ids.length) {
            this.notification.add(
                sprintf(this.env._t("%s records successfully imported"), res.ids.length),
                { type: "success" }
            );
            this.exit();
        }
    }

    stopImport() {
        this.model.stopImport();
    }

    //--------------------------------------------------------------------------
    // Fields
    //--------------------------------------------------------------------------

    onFieldChanged(column, value) {
        this.model.setColumnField(column, value);
    }

    isFieldSet(column) {
        return column.fieldInfo != null;
    }
}

registry.category("actions").add("import", ImportAction);
