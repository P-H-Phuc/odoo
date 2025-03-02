odoo.define('web.GroupByMenu', function (require) {
    "use strict";

    const { Dropdown } = require("@web/core/dropdown/dropdown");
    const { SearchDropdownItem } = require("@web/search/search_dropdown_item/search_dropdown_item");
    const { CustomGroupByItem } = require('@web/search/group_by_menu/custom_group_by_item');
    const { FACET_ICONS, GROUPABLE_TYPES } = require('web.searchUtils');
    const { useModel } = require('web.Model');
    const { LegacyComponent } = require("@web/legacy/legacy_component");

    class GroupByMenu extends LegacyComponent {

        setup() {
            this.icon = FACET_ICONS.groupBy;

            this.fields = Object.values(this.props.fields)
                .filter(field => this._validateField(field))
                .sort(({ string: a }, { string: b }) => a > b ? 1 : a < b ? -1 : 0);

            this.model = useModel('searchModel');
        }

        //---------------------------------------------------------------------
        // Getters
        //---------------------------------------------------------------------

        /**
         * @override
         */
        get items() {
            return this.model.get('filters', f => f.type === 'groupBy');
        }

        //---------------------------------------------------------------------
        // Private
        //---------------------------------------------------------------------

        /**
         * @see {@link odoo/fields.py} Field._description_sortable
         * @see {@link odoo/fields.py} Many2Many.groupable
         * @private
         * @param {Object} field
         * @returns {boolean}
         */
        _validateField(field) {
            return (field.type === "many2many" ? field.store : field.sortable) &&
                field.name !== "id" &&
                GROUPABLE_TYPES.includes(field.type);
        }

        //---------------------------------------------------------------------
        // Handlers
        //---------------------------------------------------------------------

        /**
         * @param {Object} param0
         * @param {number} param0.itemId
         * @param {number} [param0.optionId]
         */
        onGroupBySelected({ itemId, optionId }) {
            if (optionId) {
                this.model.dispatch('toggleFilterWithOptions', itemId, optionId);
            } else {
                this.model.dispatch('toggleFilter', itemId);
            }
        }
        onAddCustomGroup(fieldName) {
            const field = this.props.fields[fieldName];
            this.model.dispatch("createNewGroupBy", field);
        }
    }

<<<<<<< HEAD
    GroupByMenu.components = { CustomGroupByItem, Dropdown, DropdownItem: SearchDropdownItem };
=======
    GroupByMenu.components = { CustomGroupByItem, Dropdown, SearchDropdownItem };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    GroupByMenu.props = { fields: Object };
    GroupByMenu.template = "web.GroupByMenu";

    return GroupByMenu;
});
