/** @odoo-module **/

import { Dropdown } from "@web/core/dropdown/dropdown";
import { SearchDropdownItem } from "@web/search/search_dropdown_item/search_dropdown_item";
import { CustomFilterItem } from "./custom_filter_item";
import { FACET_ICONS } from "../utils/misc";
import { useBus } from "@web/core/utils/hooks";

import { Component } from "@odoo/owl";

export class FilterMenu extends Component {
    setup() {
        this.icon = FACET_ICONS.filter;

        useBus(this.env.searchModel, "update", this.render);
    }

    /**
     * @returns {Object[]}
     */
    get items() {
        return this.env.searchModel.getSearchItems((searchItem) =>
            ["filter", "dateFilter"].includes(searchItem.type)
        );
    }

    /**
     * @param {Object} param0
     * @param {number} param0.itemId
     * @param {number} [param0.optionId]
     */
    onFilterSelected({ itemId, optionId }) {
        if (optionId) {
            this.env.searchModel.toggleDateFilter(itemId, optionId);
        } else {
            this.env.searchModel.toggleSearchItem(itemId);
        }
    }
}

<<<<<<< HEAD
FilterMenu.components = { CustomFilterItem, Dropdown, DropdownItem: SearchDropdownItem };
=======
FilterMenu.components = { CustomFilterItem, Dropdown, SearchDropdownItem };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
FilterMenu.template = "web.FilterMenu";
FilterMenu.props = {
    class: { type: String, optional: true },
};
