/** @odoo-module **/

<<<<<<< HEAD

import { registry } from "@web/core/registry";
import { Many2ManyTagsField } from "@web/views/fields/many2many_tags/many2many_tags_field";
=======
import { registry } from "@web/core/registry";
import {
    Many2ManyTagsField,
    many2ManyTagsField,
} from "@web/views/fields/many2many_tags/many2many_tags_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const fieldRegistry = registry.category("fields");

export class ChatbotScriptTriggeringAnswersMany2Many extends Many2ManyTagsField {
    /**
     * Force the chatbot script ID we are currently editing into the context.
     * This allows to filter triggering question answers on steps of this script.
     */
    setup() {
        super.setup();

        if (this.props.record.model.root.data.id) {
            this.env.services.user.updateContext({
<<<<<<< HEAD
                force_domain_chatbot_script_id: this.props.record.model.root.data.id
            });
        }
    }
};

fieldRegistry.add("chatbot_triggering_answers_widget", ChatbotScriptTriggeringAnswersMany2Many);
=======
                force_domain_chatbot_script_id: this.props.record.model.root.data.id,
            });
        }
    }
}

export const chatbotScriptTriggeringAnswersMany2Many = {
    ...many2ManyTagsField,
    component: ChatbotScriptTriggeringAnswersMany2Many,
};

fieldRegistry.add("chatbot_triggering_answers_widget", chatbotScriptTriggeringAnswersMany2Many);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
