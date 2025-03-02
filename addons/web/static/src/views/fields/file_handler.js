/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";
import { sprintf } from "@web/core/utils/strings";
import { getDataURLFromFile } from "@web/core/utils/urls";
import { session } from "@web/session";
import { formatFloat } from "./formatters";

import { Component, useRef, useState } from "@odoo/owl";

const DEFAULT_MAX_FILE_SIZE = 128 * 1024 * 1024;

export class FileUploader extends Component {
    setup() {
        this.notification = useService("notification");
        this.id = `o_fileupload_${++FileUploader.nextId}`;
        this.fileInputRef = useRef("fileInput");
        this.state = useState({
            isUploading: false,
        });
    }

    get maxUploadSize() {
        return session.max_file_upload_size || DEFAULT_MAX_FILE_SIZE;
    }
    /**
     * @param {Event} ev
     */
    async onFileChange(ev) {
        if (!ev.target.files.length) {
            return;
        }
        for (const file of ev.target.files) {
            if (file.size > this.maxUploadSize) {
                this.notification.add(
                    sprintf(
                        this.env._t("The selected file exceed the maximum file size of %s."),
                        formatFloat(this.maxUploadSize, { humanReadable: true })
                    ),
                    {
                        title: this.env._t("File upload"),
                        type: "danger",
                    }
                );
            }
            this.state.isUploading = true;
            const data = await getDataURLFromFile(file);
            if (!file.size) {
                console.warn(`Error while uploading file : ${file.name}`);
                this.notification.add(
                    this.env._t("There was a problem while uploading your file."),
                    {
                        type: "danger",
                    }
                );
            }
            await this.props.onUploaded({
                name: file.name,
                size: file.size,
                type: file.type,
                data: data.split(",")[1],
                objectUrl: file.type === "application/pdf" ? URL.createObjectURL(file) : null,
            });
            this.state.isUploading = false;
        }
        this.fileInputRef.el.value = null;
        if (this.props.multiUpload && this.props.onUploadComplete) {
            this.props.onUploadComplete({});
        }
    }

    async onSelectFileButtonClick(ev) {
        if (this.props.onClick) {
            const ok = await this.props.onClick(ev);
            if (ok !== undefined && !ok) {
                return;
            }
        }
        this.fileInputRef.el.click();
    }
}

FileUploader.template = "web.FileUploader";
FileUploader.nextId = 0;
FileUploader.props = {
    onClick: { type: Function, optional: true },
    onUploaded: Function,
    onUploadComplete: { type: Function, optional: true },
    multiUpload: { type: Boolean, optional: true },
    inputName: { type: String, optional: true },
    fileUploadClass: { type: String, optional: true },
    acceptedFileExtensions: { type: String, optional: true },
    slots: { type: Object, optional: true },
};
