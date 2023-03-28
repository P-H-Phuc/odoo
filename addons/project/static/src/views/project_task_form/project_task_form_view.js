/** @odoo-module */

import { registry } from "@web/core/registry";
import { formViewWithHtmlExpander } from '../form_with_html_expander/form_view_with_html_expander';
<<<<<<< HEAD
import { ProjectTaskFormController } from './project_task_form_controller';
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { ProjectTaskFormRenderer } from "./project_task_form_renderer";

export const projectTaskFormView = {
    ...formViewWithHtmlExpander,
<<<<<<< HEAD
    Controller: ProjectTaskFormController,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    Renderer: ProjectTaskFormRenderer,
};

registry.category("views").add("project_task_form", projectTaskFormView);
