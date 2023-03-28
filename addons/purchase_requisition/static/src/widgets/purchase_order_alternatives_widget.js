/** @odoo-module */

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
<<<<<<< HEAD
import { X2ManyField } from "@web/views/fields/x2many/x2many_field";
=======
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { ListRenderer } from "@web/views/list/list_renderer";


export class FieldMany2ManyAltPOsRenderer extends ListRenderer {
   isCurrentRecord(record) {
      return record.data.id === this.env.model.root.data.id;
  }
}

FieldMany2ManyAltPOsRenderer.recordRowTemplate = "purchase_requisition.AltPOsListRenderer.RecordRow";

export class FieldMany2ManyAltPOs extends X2ManyField {
   setup() {
<<<<<<< HEAD
      this.orm = useService("orm");
      this.action = useService("action");
      // TODO: this is a terrible hack, make this a proper extension of many2many if/when possible
      this.props.record.activeFields[this.props.name].widget = "many2many";
      super.setup();
=======
      super.setup();
      this.orm = useService("orm");
      this.action = useService("action");
   }

   get isMany2Many() {
      return true;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
   }

   /**
    * Override to: avoid reopening currently open record
    *              open record in same window w/breadcrumb extended
    * @override
    */
   async openRecord(record) {
      if (record.data.id !== this.props.record.data.id) {
         const action = await this.orm.call(record.resModel, "get_formview_action", [[record.data.id]], {
               context: this.props.context,
         });
         await this.action.doAction(action);
      }
   }
}

FieldMany2ManyAltPOs.components = {
   ...X2ManyField.components,
   ListRenderer: FieldMany2ManyAltPOsRenderer,
};

<<<<<<< HEAD
registry.category("fields").add("many2many_alt_pos", FieldMany2ManyAltPOs);
=======
export const fieldMany2ManyAltPOs = {
    ...x2ManyField,
    component: FieldMany2ManyAltPOs,
};

registry.category("fields").add("many2many_alt_pos", fieldMany2ManyAltPOs);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
