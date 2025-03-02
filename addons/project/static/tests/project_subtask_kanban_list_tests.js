/** @odoo-module */
import {
    click,
    getFixture,
} from '@web/../tests/helpers/utils';
import { setupViewRegistries } from "@web/../tests/views/helpers";
import { start, startServer } from '@mail/../tests/helpers/test_utils';
import { addModelNamesToFetch } from '@bus/../tests/helpers/model_definitions_helpers';

addModelNamesToFetch([
    'project.project',
    'project.task',
]);

let target;

QUnit.module('Subtask Kanban List tests', {
    beforeEach: async function () {
        const pyEnv = await startServer();
        const projectId = pyEnv['project.project'].create([
            { name: "Project One", allow_subtasks: true },
        ]);
        const userId = pyEnv['res.users'].create([
            { name: "User One", login: 'one', password: 'one' },
        ]);
        pyEnv['project.task'].create([
            { name: 'task one', project_id: projectId, subtask_count: 2, child_ids: [2, 3], state: '01_in_progress', user_ids: [userId] },
            { name: 'task two', subtask_count: 0, child_ids: [], state: '03_approved' },
            { name: 'task three', subtask_count: 0, child_ids: [], state: '02_changes_requested' },
            { name: 'task four', project_id: projectId, subtask_count: 0, child_ids: [], state: '01_in_progress' },
        ]);
        this.views = {
            "project.task,false,kanban":
                `<kanban js_class="project_task_kanban">
                    <field name="subtask_count"/>
                    <templates>
                        <t t-name="kanban-box">
                            <div>
                                <field name="name" widget="name_with_subtask_count"/>
                                <field name="user_ids" invisible="1"/>
                                <field name="state" invisible="1"/>
                                <a t-if="record.subtask_count.raw_value" class="subtask_list_button" title="See Subtasks" style="width: 29px;"/>
                            </div>
                            <div class="kanban_bottom_subtasks_section"/>
                        </t>
                    </templates>
                </kanban>`,
        };
        target = getFixture();
        setupViewRegistries();
    }
}, function () {
    QUnit.test("Check whether subtask list functionality works as intended", async function (assert) {
        assert.expect(8);

        const views = this.views;
        const { openView } = await start({ serverData: { views } });
        await openView({
            res_model: "project.task",
            views: [[false, "kanban"]],
        });

        assert.containsOnce(target, '.subtask_list_button', "Only kanban boxes of parent tasks should have the drawdown button, in this case this is 1");
        assert.containsNone(target, '.subtask_list', "If the drawdown button is not clicked, the subtasks list should be hidden");

        await click(target, '.subtask_list_button');

        assert.containsOnce(target, '.subtask_list', "Clicking on the button should make the subtask list render, in this case we are expectig 1 list");
        assert.containsN(target, '.subtask_list_row', 2, "The list rendered should show all the subtasks of the task, in this case 2");
        assert.containsN(target, '.subtask_state_widget_col', 2, "Each of the list's rows should have 1 state widget, thus we are looking for 2 in total");
        assert.containsN(target, '.subtask_user_widget_col', 2, "Each of the list's rows should have 1 user widgets, thus we are looking for 2 in total");
        assert.containsN(target, '.subtask_name_col', 2, "Each of the list's rows should display the subtask's name, thus we are looking for 2 in total");

        await click(target, '.subtask_list_button');

        assert.containsNone(target, '.subtask_list', "If the drawdown button is clicked again, the subtasks list should be hidden again");
    });
});
