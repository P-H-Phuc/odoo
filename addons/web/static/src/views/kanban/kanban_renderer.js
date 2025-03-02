/** @odoo-module **/

import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { useHotkey } from "@web/core/hotkeys/hotkey_hook";
import { RPCError } from "@web/core/network/rpc_service";
import { registry } from "@web/core/registry";
import { useBus, useService } from "@web/core/utils/hooks";
import { useSortable } from "@web/core/utils/sortable";
import { sprintf } from "@web/core/utils/strings";
<<<<<<< HEAD
import { session } from "@web/session";
import { isAllowedDateField } from "@web/views/relational_model";
import { isNull, isRelational } from "@web/views/utils";
=======
import { archParseBoolean, isNull, isRelational } from "@web/views/utils";
import { ColumnProgress } from "@web/views/view_components/column_progress";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { FormViewDialog } from "@web/views/view_dialogs/form_view_dialog";
import { useBounceButton } from "@web/views/view_hook";
import { KanbanColumnQuickCreate } from "./kanban_column_quick_create";
import { KanbanRecord } from "./kanban_record";
import { KanbanRecordQuickCreate } from "./kanban_record_quick_create";

<<<<<<< HEAD
import { Component, useState, useRef, onPatched, onWillPatch, onWillDestroy } from "@odoo/owl";
=======
import { Component, onWillDestroy, useRef, useState, onPatched, onWillPatch } from "@odoo/owl";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const DRAGGABLE_GROUP_TYPES = ["many2one"];
const MOVABLE_RECORD_TYPES = ["char", "boolean", "integer", "selection", "many2one"];
const QUICK_CREATE_FIELD_TYPES = ["char", "boolean", "many2one", "selection", "many2many"];

/**
 * @param {Object} groupByField
 * @returns {boolean}
 */
export function isAllowedDateField(groupByField) {
    return (
        ["date", "datetime"].includes(groupByField.type) &&
        archParseBoolean(groupByField.attrs.allow_group_range_value)
    );
}

/**
 * @param {DynamicList} list
 * @returns {boolean}
 */
export function canQuickCreate(list) {
    if (list.groups && !list.groups.length) {
        return false;
    }

    return (
        list.groupByField &&
        (isAllowedDateField(list.groupByField) ||
            QUICK_CREATE_FIELD_TYPES.includes(list.groupByField.type))
    );
}

export class KanbanRenderer extends Component {
    static template = "web.KanbanRenderer";
    static components = {
        Dropdown,
        DropdownItem,
        ColumnProgress,
        KanbanColumnQuickCreate,
        KanbanRecord,
        KanbanRecordQuickCreate,
    };
    static props = [
        "archInfo",
        "Compiler?", // optional in stable for backward compatibility
        "list",
        "openRecord",
        "readonly",
        "forceGlobalClick?",
        "noContentHelp?",
        "scrollTop?",
    ];
    static defaultProps = {
        scrollTop: () => {},
    };

    setup() {
        this.dialogClose = [];
        /**
         * @type {{ processedIds: string[], columnQuickCreateIsFolded: boolean }}
         */
        this.state = useState({
            processedIds: [],
            columnQuickCreateIsFolded:
                !this.props.list.isGrouped || this.props.list.groups.length > 0,
        });
        this.dialog = useService("dialog");
        this.exampleData = registry
            .category("kanban_examples")
            .get(this.props.archInfo.examples, null);
        this.ghostColumns = this.generateGhostColumns();

        // Sortable
        let dataRecordId;
        let dataGroupId;
<<<<<<< HEAD
        const rootRef = useRef("root");
=======
        this.rootRef = useRef("root");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (this.canUseSortable) {
            useSortable({
                enable: () => this.canResequenceRecords,
                // Params
                ref: this.rootRef,
                elements: ".o_draggable",
                ignore: ".dropdown",
                groups: () => this.props.list.isGrouped && ".o_kanban_group",
                connectGroups: () => this.canMoveRecords,
                cursor: "move",
                // Hooks
                onDragStart: (params) => {
                    const { element, group } = params;
                    dataRecordId = element.dataset.id;
                    dataGroupId = group && group.dataset.id;
                    return this.sortStart(params);
                },
                onDragEnd: (params) => this.sortStop(params),
                onGroupEnter: (params) => this.sortRecordGroupEnter(params),
                onGroupLeave: (params) => this.sortRecordGroupLeave(params),
                onDrop: (params) => this.sortRecordDrop(dataRecordId, dataGroupId, params),
            });
            useSortable({
                enable: () => this.canResequenceGroups,
                // Params
                ref: this.rootRef,
                elements: ".o_group_draggable",
                handle: ".o_column_title",
                cursor: "move",
                // Hooks
                onDragStart: (params) => {
                    const { element } = params;
                    dataGroupId = element.dataset.id;
                    return this.sortStart(params);
                },
                onDragEnd: (params) => this.sortStop(params),
                onDrop: (params) => this.sortGroupDrop(dataGroupId, params),
            });
        }

        useBounceButton(this.rootRef, (clickedEl) => {
            if (!this.props.list.count || this.props.list.model.useSampleModel) {
                return clickedEl.matches(
                    [
                        ".o_kanban_renderer",
                        ".o_kanban_group",
                        ".o_kanban_header",
                        ".o_column_quick_create",
                        ".o_view_nocontent_smiling_face",
                    ].join(", ")
                );
            }
            return false;
        });
        onWillDestroy(() => {
            this.dialogClose.forEach((close) => close());
        });

        if (this.env.searchModel) {
            useBus(this.env.searchModel, "focus-view", () => {
                const { model } = this.props.list;
                if (model.useSampleModel || !model.hasData()) {
                    return;
                }
<<<<<<< HEAD
                const firstCard = rootRef.el.querySelector(".o_kanban_record");
=======
                const firstCard = this.rootRef.el.querySelector(".o_kanban_record");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                if (firstCard) {
                    // Focus first kanban card
                    firstCard.focus();
                }
            });
        }

        useHotkey(
            "Enter",
            ({ target }) => {
                if (!target.classList.contains("o_kanban_record")) {
                    return;
                }

                // Open first link
                const firstLink = target.querySelector("a, button");
                if (firstLink && firstLink instanceof HTMLElement) {
                    firstLink.click();
                }
                return;
            },
            { area: () => this.rootRef.el }
        );

<<<<<<< HEAD
        const arrowsOptions = { area: () => rootRef.el, allowRepeat: true };
=======
        const arrowsOptions = { area: () => this.rootRef.el, allowRepeat: true };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (this.env.searchModel) {
            useHotkey(
                "ArrowUp",
                ({ area }) => {
                    if (!this.focusNextCard(area, "up")) {
                        this.env.searchModel.trigger("focus-search");
                    }
                },
                arrowsOptions
            );
        }
        useHotkey("ArrowDown", ({ area }) => this.focusNextCard(area, "down"), arrowsOptions);
        useHotkey("ArrowLeft", ({ area }) => this.focusNextCard(area, "left"), arrowsOptions);
        useHotkey("ArrowRight", ({ area }) => this.focusNextCard(area, "right"), arrowsOptions);

        let previousScrollTop = 0;
        onWillPatch(() => {
<<<<<<< HEAD
            previousScrollTop = rootRef.el.scrollTop;
        });
        onPatched(() => {
            rootRef.el.scrollTop = previousScrollTop;
=======
            previousScrollTop = this.rootRef.el.scrollTop;
        });
        onPatched(() => {
            this.rootRef.el.scrollTop = previousScrollTop;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        });
    }

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------

    get canUseSortable() {
        return !this.env.isSmall;
    }

    get canMoveRecords() {
        if (!this.canResequenceRecords) {
            return false;
        }
        if (!this.props.list.groupByField) {
            return true;
        }
        const { groupByField, fields } = this.props.list;
        const { modifiers, type } = groupByField;
        return Boolean(
            !(modifiers && "readonly" in modifiers
                ? modifiers.readonly
                : fields[groupByField.name].readonly) &&
                (isAllowedDateField(groupByField) || MOVABLE_RECORD_TYPES.includes(type))
        );
    }

    get canResequenceGroups() {
        if (!this.props.list.isGrouped) {
            return false;
        }
        const { groupByField, fields } = this.props.list;
        const { modifiers, type } = groupByField;
        const { groupsDraggable } = this.props.archInfo;
        return (
            groupsDraggable &&
            !(modifiers && "readonly" in modifiers
                ? modifiers.readonly
                : fields[groupByField.name].readonly) &&
            DRAGGABLE_GROUP_TYPES.includes(type)
        );
    }

    get canResequenceRecords() {
        const { isGrouped, orderBy } = this.props.list;
        const { handleField, recordsDraggable } = this.props.archInfo;
        return Boolean(
            recordsDraggable &&
                (isGrouped || (handleField && (!orderBy[0] || orderBy[0].name === handleField)))
        );
    }

    get showNoContentHelper() {
        const { model, isGrouped, groupByField, groups } = this.props.list;
        if (model.useSampleModel) {
            return true;
        }
        if (isGrouped) {
            if (this.canCreateGroup() && !this.state.columnQuickCreateIsFolded) {
                return false;
            }
            if (groups.length === 0) {
                return groupByField.type !== "many2one";
            }
        }
        return !model.hasData();
    }

    /**
     * When the kanban records are grouped, the 'false' or 'undefined' group
     * must appear first.
     * @returns {any[]}
     */
    getGroupsOrRecords() {
        const { list } = this.props;
        if (list.isGrouped) {
            return list.groups
                .sort((a, b) => (a.value && !b.value ? 1 : !a.value && b.value ? -1 : 0))
                .map((group, i) => ({
                    group,
                    key: isNull(group.value) ? `group_key_${i}` : String(group.value),
                }));
        } else {
            return list.records.map((record) => ({ record, key: record.id }));
        }
    }

    getGroupName({ groupByField, count, displayName, isFolded }) {
        let name = displayName;
        if (groupByField.type === "boolean") {
            name = name ? this.env._t("Yes") : this.env._t("No");
        } else if (!name) {
            if (
                isRelational(groupByField) ||
                groupByField.type === "date" ||
                groupByField.type === "datetime" ||
                isNull(name)
            ) {
                name = this.env._t("None");
            }
        }
        return !this.env.isSmall && isFolded ? `${name} (${count})` : name;
    }

    /**
     * @param {RelationalGroup} group
     * @param {boolean} isGroupProcessing
     * @returns {string}
     */
    getGroupClasses(group, isGroupProcessing) {
        const classes = [];
        if (!isGroupProcessing && this.canResequenceGroups && group.value) {
            classes.push("o_group_draggable");
        }
        if (!group.count) {
            classes.push("o_kanban_no_records");
        }
        if (!this.env.isSmall && group.isFolded) {
            classes.push("o_column_folded");
        }
<<<<<<< HEAD
        if (!group.isFolded && !group.hasActiveProgressValue) {
=======
        if (!group.isFolded) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            classes.push("bg-100");
        }
        if (group.progressBars.length) {
            classes.push("o_kanban_has_progressbar");
            if (!group.isFolded && group.hasActiveProgressValue) {
                const progressBar = group.activeProgressBar;
                classes.push("o_kanban_group_show", `o_kanban_group_show_${progressBar.color}`);
            }
        }
        return classes.join(" ");
    }

    getGroupUnloadedCount(group) {
        const progressBar = group.activeProgressBar;
        const records = group.list.records.filter((r) => !r.isInQuickCreation);
        return (progressBar ? progressBar.count : group.count) - records.length;
    }

    getGroupAggregate(group) {
        const { sumField } = this.props.list.model.progressAttributes;
        const value = group.getAggregates(sumField && sumField.name);
        const title = sumField ? sumField.string : this.env._t("Count");
        return { value, title };
    }

    generateGhostColumns() {
        let colNames;
        if (this.exampleData && this.exampleData.ghostColumns) {
            colNames = this.exampleData.ghostColumns;
        } else {
            colNames = [1, 2, 3, 4].map((num) => sprintf(this.env._t("Column %s"), num));
        }
        return colNames.map((colName) => ({
            name: colName,
            cards: new Array(Math.floor(Math.random() * 4) + 2),
        }));
    }

    /**
     * @param {string} id
     * @returns {boolean}
     */
    isProcessing(id) {
        return this.state.processedIds.includes(id);
    }

    // ------------------------------------------------------------------------
    // Permissions
    // ------------------------------------------------------------------------

    canArchiveGroup(group) {
        const { activeActions } = this.props.archInfo;
        const hasActiveField = "active" in group.fields;
<<<<<<< HEAD
        return activeActions.archiveGroup && hasActiveField && !this.props.list.groupedBy("m2m");
=======
        return (
            activeActions.archiveGroup &&
            hasActiveField &&
            this.props.list.groupByField.type !== "many2many"
        );
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    canCreateGroup() {
        const { activeActions } = this.props.archInfo;
<<<<<<< HEAD
        return activeActions.createGroup && this.props.list.groupedBy("m2o");
=======
        return activeActions.createGroup && this.props.list.groupByField.type === "many2one";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    canDeleteGroup(group) {
        const { activeActions } = this.props.archInfo;
        const { groupByField } = this.props.list;
        return activeActions.deleteGroup && isRelational(groupByField) && group.value;
    }

    canDeleteRecord() {
        const { activeActions } = this.props.archInfo;
        return activeActions.delete && this.props.list.groupByField.type !== "many2many";
    }

    canEditGroup(group) {
        const { activeActions } = this.props.archInfo;
        const { groupByField } = this.props.list;
        return activeActions.editGroup && isRelational(groupByField) && group.value;
    }

    canEditRecord() {
        return this.props.archInfo.activeActions.edit;
    }

    canQuickCreate() {
        return this.props.archInfo.activeActions.quickCreate && canQuickCreate(this.props.list);
    }

    // ------------------------------------------------------------------------
    // Edition methods
    // ------------------------------------------------------------------------

    quickCreate(group) {
        return this.props.list.quickCreate(group);
    }

    async validateQuickCreate(mode, group) {
        const values = group.quickCreateRecord.data;
        let record = group.quickCreateRecord;
        try {
            record = await group.validateQuickCreate(record, mode);
        } catch (e) {
            // TODO: filter RPC errors more specifically (eg, for access denied, there is no point in opening a dialog)
            if (!(e instanceof RPCError)) {
                throw e;
            }
            const context = { ...group.context };
            context[`default_${group.groupByField.name}`] = group.value;
            context.default_name = values.name || values.display_name;
            this.dialogClose.push(
                this.dialog.add(
                    FormViewDialog,
                    {
                        resModel: this.props.list.resModel,
                        context,
                        title: this.env._t("Create"),
                        onRecordSaved: async (record) => {
                            await group.addExistingRecord(record.resId, true);
                        },
                    },
                    {
                        onClose: () => {
                            this.props.list.quickCreate(group);
                        },
                    }
                )
            );
        }

        if (mode === "edit" && record) {
            await this.props.openRecord(record, "edit");
        }
    }

    toggleGroup(group) {
        return group.toggle();
    }

    loadMore(group) {
        return group.list.loadMore();
    }

    editGroup(group) {
        this.dialogClose.push(
            this.dialog.add(FormViewDialog, {
                context: group.context,
                resId: group.value,
                resModel: group.resModel,
                title: sprintf(this.env._t("Edit: %s"), group.displayName),

                onRecordSaved: async () => {
                    await this.props.list.load();
                    this.props.list.model.notify();
                },
            })
        );
    }

    archiveGroup(group) {
        this.dialog.add(ConfirmationDialog, {
            body: this.env._t(
                "Are you sure that you want to archive all the records from this column?"
            ),
            confirm: () => group.list.archive(),
            cancel: () => {},
        });
    }

    unarchiveGroup(group) {
        group.list.unarchive();
    }

    deleteGroup(group) {
        this.dialog.add(ConfirmationDialog, {
            body: this.env._t("Are you sure you want to delete this column?"),
            confirm: async () => {
                await this.props.list.deleteGroups([group]);
                if (this.props.list.groups.length === 0) {
                    this.state.columnQuickCreateIsFolded = false;
                }
            },
            cancel: () => {},
        });
    }

    getGroupEl(groupId) {
        return this.rootRef.el.querySelector(`.o_kanban_group[data-id="${groupId}"]`);
    }

    /**
     * @param {string} id
     * @param {boolean} isProcessing
     */
    toggleProcessing(id, isProcessing) {
        if (isProcessing) {
            this.state.processedIds = [...this.state.processedIds, id];
        } else {
            this.state.processedIds = this.state.processedIds.filter(
                (processedId) => processedId !== id
            );
        }
    }

    // ------------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------------

    async onGroupClick(group, ev) {
        if (!this.env.isSmall && group.isFolded) {
            await group.toggle();
            this.props.scrollTop();
        }
    }

    /**
     * @param {string} dataGroupId
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     * @param {HTMLElement} [params.next]
     * @param {HTMLElement} [params.parent]
     * @param {HTMLElement} [params.previous]
     */
    async sortGroupDrop(dataGroupId, { previous }) {
        this.toggleProcessing(dataGroupId, true);

        const refId = previous ? previous.dataset.id : null;
        await this.props.list.resequence(dataGroupId, refId);

        this.toggleProcessing(dataGroupId, false);
    }

    /**
     * @param {string} dataRecordId
     * @param {string} dataGroupId
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     * @param {HTMLElement} [params.next]
     * @param {HTMLElement} [params.parent]
     * @param {HTMLElement} [params.previous]
     */
    async sortRecordDrop(dataRecordId, dataGroupId, { element, parent, previous }) {
        if (
            !this.props.list.isGrouped ||
            parent.classList.contains("o_kanban_hover") ||
            parent.dataset.id === element.parentElement.dataset.id
        ) {
            this.toggleProcessing(dataRecordId, true);

            parent?.classList.remove("o_kanban_hover");
            while (previous && !previous.dataset.id) {
                previous = previous.previousElementSibling;
            }
            const refId = previous ? previous.dataset.id : null;
            const targetGroupId = parent?.dataset.id;
            await this.props.list.moveRecord(dataRecordId, dataGroupId, refId, targetGroupId);

            this.toggleProcessing(dataRecordId, false);
        }
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.group
     */
    sortRecordGroupEnter({ group }) {
        group.classList.add("o_kanban_hover");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.group
     */
    sortRecordGroupLeave({ group }) {
        group.classList.remove("o_kanban_hover");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     */
    sortStart({ element }) {
        element.classList.add("shadow");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     */
    sortStop({ element, group }) {
        element.classList.remove("shadow");
        if (group) {
            group.classList.remove("o_kanban_hover");
        }
    }

    /**
     * @param {string} dataGroupId
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     * @param {HTMLElement} [params.next]
     * @param {HTMLElement} [params.parent]
     * @param {HTMLElement} [params.previous]
     */
    async sortGroupDrop(dataGroupId, { element, previous }) {
        element.classList.remove("o_group_draggable");
        const refId = previous ? previous.dataset.id : null;
        await this.props.list.resequence(dataGroupId, refId);
        element.classList.add("o_group_draggable");
    }

    /**
     * @param {string} dataRecordId
     * @param {string} dataGroupId
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     * @param {HTMLElement} [params.next]
     * @param {HTMLElement} [params.parent]
     * @param {HTMLElement} [params.previous]
     */
    async sortRecordDrop(dataRecordId, dataGroupId, { element, parent, previous }) {
        element.classList.remove("o_record_draggable");
        if (
            !this.props.list.isGrouped ||
            parent.classList.contains("o_kanban_hover") ||
            parent.dataset.id === element.parentElement.dataset.id
        ) {
            parent && parent.classList && parent.classList.remove("o_kanban_hover");
            while (previous && !previous.dataset.id) {
                previous = previous.previousElementSibling;
            }
            const refId = previous ? previous.dataset.id : null;
            const targetGroupId = parent && parent.dataset.id;
            await this.props.list.moveRecord(dataRecordId, dataGroupId, refId, targetGroupId);
        }
        element.classList.add("o_record_draggable");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.group
     */
    sortRecordGroupEnter({ group }) {
        group.classList.add("o_kanban_hover");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.group
     */
    sortRecordGroupLeave({ group }) {
        group.classList.remove("o_kanban_hover");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     */
    sortStart({ element }) {
        element.classList.add("o_dragged", "shadow");
    }

    /**
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {HTMLElement} [params.group]
     */
    sortStop({ element, group }) {
        element.classList.remove("o_dragged", "shadow");
        if (group) {
            group.classList.remove("o_kanban_hover");
        }
    }

    /**
     * Focus next card in the area within the chosen direction.
     *
     * @param {HTMLElement} area
     * @param {"down"|"up"|"right"|"left"} direction
     * @returns {true?} true if the next card has been focused
     */
    focusNextCard(area, direction) {
        const { isGrouped } = this.props.list;
        const closestCard = document.activeElement.closest(".o_kanban_record");
        if (!closestCard) {
            return;
        }
        const groups = isGrouped ? [...area.querySelectorAll(".o_kanban_group")] : [area];
        const cards = [...groups]
            .map((group) => [...group.querySelectorAll(".o_kanban_record")])
            .filter((group) => group.length);

        let iGroup;
        let iCard;
        for (iGroup = 0; iGroup < cards.length; iGroup++) {
            const i = cards[iGroup].indexOf(closestCard);
            if (i !== -1) {
                iCard = i;
                break;
            }
        }
        // Find next card to focus
        let nextCard;
        switch (direction) {
            case "down":
                nextCard = iCard < cards[iGroup].length - 1 && cards[iGroup][iCard + 1];
                break;
            case "up":
                nextCard = iCard > 0 && cards[iGroup][iCard - 1];
                break;
            case "right":
                if (isGrouped) {
                    nextCard = iGroup < cards.length - 1 && cards[iGroup + 1][0];
                } else {
                    nextCard = iCard < cards[0].length - 1 && cards[0][iCard + 1];
                }
                break;
            case "left":
                if (isGrouped) {
                    nextCard = iGroup > 0 && cards[iGroup - 1][0];
                } else {
                    nextCard = iCard > 0 && cards[0][iCard - 1];
                }
                break;
        }

        if (nextCard && nextCard instanceof HTMLElement) {
            nextCard.focus();
            return true;
        }
    }

    tooltipAttributes(group) {
        if (!group.tooltip.length) {
            return {};
        }
        return {
            "data-tooltip-template": "web.KanbanGroupTooltip",
            "data-tooltip-info": JSON.stringify({ entries: group.tooltip }),
        };
    }
}
<<<<<<< HEAD

KanbanRenderer.props = [
    "archInfo",
    "Compiler?", // optional in stable for backward compatibility
    "list",
    "openRecord",
    "readonly",
    "forceGlobalClick?",
    "noContentHelp?",
];
KanbanRenderer.components = {
    Dropdown,
    DropdownItem,
    KanbanAnimatedNumber,
    KanbanColumnQuickCreate,
    KanbanRecord,
    KanbanRecordQuickCreate,
};
KanbanRenderer.template = "web.KanbanRenderer";
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
