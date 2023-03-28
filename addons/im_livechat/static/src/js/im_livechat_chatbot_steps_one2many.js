/** @odoo-module */

import { ListRenderer } from "@web/views/list/list_renderer";
import { registry } from "@web/core/registry";
<<<<<<< HEAD
import { patch } from '@web/core/utils/patch';
import { useX2ManyCrud, useOpenX2ManyRecord, X2ManyFieldDialog } from "@web/views/fields/relational_utils";
import { X2ManyField } from "@web/views/fields/x2many/x2many_field";

const fieldRegistry = registry.category("fields");

patch(X2ManyFieldDialog.prototype, 'chatbot_script_step_sequence', {
=======
import { patch } from "@web/core/utils/patch";
import {
    useX2ManyCrud,
    useOpenX2ManyRecord,
    X2ManyFieldDialog,
} from "@web/views/fields/relational_utils";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";

const fieldRegistry = registry.category("fields");

patch(X2ManyFieldDialog.prototype, "chatbot_script_step_sequence", {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    /**
     * Dirty patching of the 'X2ManyFieldDialog'.
     * It is done to force the "save and new" to close the dialog first, and then click again on
     * the "Add a line" link.
<<<<<<< HEAD
     * 
     * This is the only way (or at least the least complicated) to correctly compute the sequence
     * field, which is crucial when creating chatbot.steps, as they depend on each other.
     * 
     */
    async save({ saveAndNew }) {
        if (this.record.resModel !== 'chatbot.script.step') {
=======
     *
     * This is the only way (or at least the least complicated) to correctly compute the sequence
     * field, which is crucial when creating chatbot.steps, as they depend on each other.
     *
     */
    async save({ saveAndNew }) {
        if (this.record.resModel !== "chatbot.script.step") {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            return this._super(...arguments);
        }

        if (await this.record.checkValidity()) {
            this.record = (await this.props.save(this.record, { saveAndNew })) || this.record;
        } else {
            return false;
        }

        if (saveAndNew) {
<<<<<<< HEAD
            document.querySelector('.o_field_x2many_list_row_add a').click();
=======
            document.querySelector(".o_field_x2many_list_row_add a").click();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
        this.props.close();

        return true;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
});

export class ChatbotStepsOne2manyRenderer extends ListRenderer {
    /**
     * Small override to force column entries to be non-sortable.
     * Indeed, we want to force it being sorted on "sequence" at all times.
     */
    setup() {
        super.setup();

        for (const [, properties] of Object.entries(this.fields)) {
            properties.sortable = false;
        }
    }
}

export class ChatbotStepsOne2many extends X2ManyField {
    /**
     * Overrides the "openRecord" method to overload the save.
     *
     * Every time we save a sub-chatbot.script.step, we want to save the whole chatbot.script record
     * and form view.
     *
     * This allows the end-user to easily chain steps, otherwise he would have to save the
     * enclosing form view in-between each step addition.
     */
    setup() {
        super.setup();

<<<<<<< HEAD
        const { saveRecord, updateRecord } = useX2ManyCrud(
            () => this.list,
            this.isMany2Many
        );
=======
        const { saveRecord, updateRecord } = useX2ManyCrud(() => this.list, this.isMany2Many);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        const openRecord = useOpenX2ManyRecord({
            resModel: this.list.resModel,
            activeField: this.activeField,
            activeActions: this.activeActions,
            getList: () => this.list,
            saveRecord: async (record) => {
                await saveRecord(record);
<<<<<<< HEAD
                await this.props.record.save({stayInEdition: true});
=======
                await this.props.record.save({ stayInEdition: true });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            },
            updateRecord: updateRecord,
        });

        this._openRecord = (params) => {
            const activeElement = document.activeElement;
            openRecord({
                ...params,
                onClose: () => {
                    if (activeElement) {
                        activeElement.focus();
                    }
                },
            });
        };
    }
<<<<<<< HEAD
};

fieldRegistry.add("chatbot_steps_one2many", ChatbotStepsOne2many);

ChatbotStepsOne2many.components = {
    ...X2ManyField.components,
    ListRenderer: ChatbotStepsOne2manyRenderer
=======
}

export const chatbotStepsOne2many = {
    ...x2ManyField,
    component: ChatbotStepsOne2many,
};

fieldRegistry.add("chatbot_steps_one2many", chatbotStepsOne2many);

ChatbotStepsOne2many.components = {
    ...X2ManyField.components,
    ListRenderer: ChatbotStepsOne2manyRenderer,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
};
