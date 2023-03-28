/* @odoo-module */

import { KanbanRecord } from "@web/views/kanban/kanban_record";
import { useState } from "@odoo/owl";
import { ProjectTaskKanbanCompiler } from "./project_task_kanban_compiler";
import { SubtaskKanbanList } from "@project/components/subtask_kanban_list/subtask_kanban_list"

<<<<<<< HEAD
export class ProjectTaskRecord extends Record {
    async _applyChanges(changes) {
        const value = changes.personal_stage_type_ids;
        if (value && Array.isArray(value)) {
            delete changes.personal_stage_type_ids;
            changes.personal_stage_type_id = value;
        }
        await super._applyChanges(changes);
=======
export class ProjectTaskKanbanRecord extends KanbanRecord {
    setup() {
        super.setup();
        this.state = useState({folded: true});
    }

    /**
     * @override
     */
    get renderingContext() {
        const context = super.renderingContext;
        context["state"] = this.state;
        return context;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }
}

ProjectTaskKanbanRecord.Compiler = ProjectTaskKanbanCompiler;
ProjectTaskKanbanRecord.components = {
    ...KanbanRecord.components,
    SubtaskKanbanList,
};
