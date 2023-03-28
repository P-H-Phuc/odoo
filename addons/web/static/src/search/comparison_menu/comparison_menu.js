/** @odoo-module **/

import { Dropdown } from "@web/core/dropdown/dropdown";
import { SearchDropdownItem } from "@web/search/search_dropdown_item/search_dropdown_item";
import { FACET_ICONS } from "../utils/misc";
import { useBus } from "@web/core/utils/hooks";

import { Component } from "@odoo/owl";

export class ComparisonMenu extends Component {
    setup() {
        this.icon = FACET_ICONS.comparison;

        useBus(this.env.searchModel, "update", this.render);
    }

    /**
     * @returns {Object[]}
     */
    get items() {
        return this.env.searchModel.getSearchItems(
            (searchItem) => searchItem.type === "comparison"
        );
    }

    /**
     * @param {number} itemId
     */
    onComparisonSelected(itemId) {
        this.env.searchModel.toggleSearchItem(itemId);
    }
}
ComparisonMenu.template = "web.ComparisonMenu";
<<<<<<< HEAD
ComparisonMenu.components = { Dropdown, DropdownItem: SearchDropdownItem };
=======
ComparisonMenu.components = { Dropdown, SearchDropdownItem };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
