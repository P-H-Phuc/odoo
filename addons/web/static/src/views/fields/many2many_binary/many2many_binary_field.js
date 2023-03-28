/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "../standard_field_props";
import { FileInput } from "@web/core/file_input/file_input";
import { useX2ManyCrud } from "@web/views/fields/relational_utils";

import { Component } from "@odoo/owl";

export class Many2ManyBinaryField extends Component {
    static template = "web.Many2ManyBinaryField";
    static components = {
        FileInput,
    };
    static props = {
        ...standardFieldProps,
        acceptedFileExtensions: { type: String, optional: true },
        className: { type: String, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.operations = useX2ManyCrud(() => this.props.record.data[this.props.name], true);
    }

    get uploadText() {
        return this.props.record.fields[this.props.name].string;
    }
    get files() {
        return this.props.record.data[this.props.name].records.map((record) => record.data);
    }

    getUrl(id) {
        return "/web/content/" + id + "?download=true";
    }

    getExtension(file) {
        return file.name.replace(/^.*\./, "");
    }

    async onFileUploaded(files) {
        for (const file of files) {
            if (file.error) {
                return this.notification.add(file.error, {
                    title: this.env._t("Uploading error"),
                    type: "danger",
                });
            }
            await this.operations.saveRecord([file.id]);
        }
    }

    async onFileRemove(deleteId) {
        const record = this.props.record.data[this.props.name].records.find(
            (record) => record.data.id === deleteId
        );
        this.operations.removeRecord(record);
    }
}

<<<<<<< HEAD
Many2ManyBinaryField.template = "web.Many2ManyBinaryField";
Many2ManyBinaryField.components = {
    FileInput,
};
Many2ManyBinaryField.props = {
    ...standardFieldProps,
    acceptedFileExtensions: { type: String, optional: true },
    className: { type: String, optional: true },
    uploadText: { type: String, optional: true },
};
Many2ManyBinaryField.supportedTypes = ["many2many"];
Many2ManyBinaryField.fieldsToFetch = {
    name: { type: "char" },
    mimetype: { type: "char" },
};

Many2ManyBinaryField.isEmpty = () => false;
Many2ManyBinaryField.extractProps = ({ attrs, field }) => {
    return {
        acceptedFileExtensions: attrs.options.accepted_file_extensions,
=======
export const many2ManyBinaryField = {
    component: Many2ManyBinaryField,
    supportedTypes: ["many2many"],
    isEmpty: () => false,
    relatedFields: [
        { name: "name", type: "char" },
        { name: "mimetype", type: "char" },
    ],
    extractProps: ({ attrs, options }) => ({
        acceptedFileExtensions: options.accepted_file_extensions,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        className: attrs.class,
    }),
};

registry.category("fields").add("many2many_binary", many2ManyBinaryField);
