/** @odoo-module **/

import { makeDraggableHook } from "@web/core/utils/draggable_hook_builder";
<<<<<<< HEAD
=======
import { pick } from "@web/core/utils/objects";

/** @typedef {import("@web/core/utils/draggable_hook_builder").DraggableHandlerParams} DraggableHandlerParams */
/** @typedef {DraggableHandlerParams & { group: HTMLElement | null }} SortableHandlerParams */
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

/**
 * @typedef SortableParams
 *
 * MANDATORY
 *
 * @property {{ el: HTMLElement | null }} ref
 * @property {string} elements defines sortable elements
 *
 * OPTIONAL
 *
 * @property {boolean | (() => boolean)} [enable] whether the sortable system should
 *  be enabled.
 * @property {string | (() => string)} [groups] defines parent groups of sortable
 *  elements. This allows to add `onGroupEnter` and `onGroupLeave` callbacks to
 *  work on group elements during the dragging sequence.
 * @property {string | (() => string)} [handle] additional selector for when the dragging
 *  sequence must be initiated when dragging on a certain part of the element.
 * @property {string | (() => string)} [ignore] selector targetting elements that must
 *  initiate a drag.
 * @property {boolean | (() => boolean)} [connectGroups] whether elements can be dragged
 *  accross different parent groups. Note that it requires a `groups` param to work.
 * @property {string | (() => string)} [cursor] cursor style during the dragging sequence.
 *
 * HANDLERS (also optional)
 *
<<<<<<< HEAD
 * @property {({ element: HTMLElement, group: HTMLElement | null }) => any} [onDragStart]
 *  called when a dragging sequence is initiated.
 * @property {({ element: HTMLElement }) => any} [onElementEnter] called when the cursor
 *  enters another sortable element.
 * @property {({ element: HTMLElement }) => any} [onElementLeave] called when the cursor
 *  leaves another sortable element.
 * @property {({ group: HTMLElement }) => any} [onGroupEnter] (if a `groups` is specified):
 *  will be called when the cursor enters another group element.
 * @property {({ group: HTMLElement }) => any} [onGroupLeave] (if a `groups` is specified):
 *  will be called when the cursor leaves another group element.
 * @property {({ element: HTMLElement group: HTMLElement | null }) => any} [onDragEnd]
=======
 * @property {(params: SortableHandlerParams) => any} [onDragStart]
 *  called when a dragging sequence is initiated.
 * @property {(params: DraggableHandlerParams) => any} [onElementEnter] called when the cursor
 *  enters another sortable element.
 * @property {(params: DraggableHandlerParams) => any} [onElementLeave] called when the cursor
 *  leaves another sortable element.
 * @property {(params: SortableHandlerParams) => any} [onGroupEnter] (if a `groups` is specified):
 *  will be called when the cursor enters another group element.
 * @property {(params: SortableHandlerParams) => any} [onGroupLeave] (if a `groups` is specified):
 *  will be called when the cursor leaves another group element.
 * @property {(params: SortableHandlerParams) => any} [onDragEnd]
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
 *  called when the dragging sequence ends, regardless of the reason.
 * @property {(params: DropParams) => any} [onDrop] called when the dragging sequence
 *  ends on a mouseup action AND the dragged element has been moved elsewhere. The
 *  callback will be given an object with any useful element regarding the new position
 *  of the dragged element (@see DropParams ).
 */

/**
 * @typedef DropParams
 * @property {HTMLElement} element
 * @property {HTMLElement | null} group
 * @property {HTMLElement | null} previous
 * @property {HTMLElement | null} next
 * @property {HTMLElement | null} parent
 */

/**
 * @typedef SortableState
 * @property {boolean} dragging
 */

/** @type {(params: SortableParams) => SortableState} */
export const useSortable = makeDraggableHook({
    name: "useSortable",
    acceptedParams: {
<<<<<<< HEAD
        groups: ["string", "function"],
        connectGroups: ["boolean", "function"],
    },
    defaultParams: {
        connectGroups: false,
        currentGroup: null,
        edgeScrolling: { speed: 20, threshold: 60 },
        ghostElement: null,
=======
        groups: [String, Function],
        connectGroups: [Boolean, Function],
    },
    defaultParams: {
        connectGroups: false,
        edgeScrolling: { speed: 20, threshold: 60 },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        groupSelector: null,
    },

    // Build steps
    onComputeParams({ ctx, params }) {
        // Group selector
        ctx.groupSelector = params.groups || null;
        if (ctx.groupSelector) {
            ctx.fullSelector = [ctx.groupSelector, ctx.fullSelector].join(" ");
        }

        // Connection accross groups
        ctx.connectGroups = params.connectGroups;
    },

    // Runtime steps
<<<<<<< HEAD
    onDragStart({ ctx, helpers }) {
=======
    onDragStart({ ctx, addListener, addStyle, callHandler }) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        /**
         * Element "mouseenter" event handler.
         * @param {MouseEvent} ev
         */
        const onElementMouseenter = (ev) => {
            const element = ev.currentTarget;
            if (
<<<<<<< HEAD
                ctx.connectGroups ||
                !ctx.groupSelector ||
                ctx.currentGroup === element.closest(ctx.groupSelector)
            ) {
                const pos = ctx.ghostElement.compareDocumentPosition(element);
                if (pos === 2 /* BEFORE */) {
                    element.before(ctx.ghostElement);
                } else if (pos === 4 /* AFTER */) {
                    element.after(ctx.ghostElement);
                }
            }
            helpers.execHandler("onElementEnter", { element });
=======
                connectGroups ||
                !groupSelector ||
                current.group === element.closest(groupSelector)
            ) {
                const pos = current.placeHolder.compareDocumentPosition(element);
                if (pos === 2 /* BEFORE */) {
                    element.before(current.placeHolder);
                } else if (pos === 4 /* AFTER */) {
                    element.after(current.placeHolder);
                }
            }
            callHandler("onElementEnter", { element });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        };

        /**
         * Element "mouseleave" event handler.
         * @param {MouseEvent} ev
         */
        const onElementMouseleave = (ev) => {
            const element = ev.currentTarget;
<<<<<<< HEAD
            helpers.execHandler("onElementLeave", { element });
=======
            callHandler("onElementLeave", { element });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        };

        /**
         * Group "mouseenter" event handler.
         * @param {MouseEvent} ev
         */
        const onGroupMouseenter = (ev) => {
            const group = ev.currentTarget;
<<<<<<< HEAD
            group.appendChild(ctx.ghostElement);
            helpers.execHandler("onGroupEnter", { group });
=======
            group.appendChild(current.placeHolder);
            callHandler("onGroupEnter", { group });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        };

        /**
         * Group "mouseleave" event handler.
         * @param {MouseEvent} ev
         */
        const onGroupMouseleave = (ev) => {
            const group = ev.currentTarget;
<<<<<<< HEAD
            helpers.execHandler("onGroupLeave", { group });
        };

        const { width, height } = ctx.currentElementRect;

        // Prepares the ghost element
        ctx.ghostElement = ctx.currentElement.cloneNode(false);
        ctx.ghostElement.style = `visibility: hidden; display: block; width: ${width}px; height:${height}px;`;

        // Binds handlers on eligible groups, if the elements are not confined to
        // their parents and a 'groupSelector' has been provided.
        if (ctx.connectGroups && ctx.groupSelector) {
            for (const siblingGroup of ctx.ref.el.querySelectorAll(ctx.groupSelector)) {
                helpers.addListener(siblingGroup, "mouseenter", onGroupMouseenter);
                helpers.addListener(siblingGroup, "mouseleave", onGroupMouseleave);
                helpers.addStyle(siblingGroup, { "pointer-events": "auto" });
=======
            callHandler("onGroupLeave", { group });
        };

        const { connectGroups, current, elementSelector, groupSelector, ref } = ctx;
        const { width, height } = current.elementRect;

        // Adjusts size for the placeholder element
        addStyle(current.placeHolder, {
            visibility: "hidden",
            display: "block",
            width: `${width}px`,
            height: `${height}px`,
        });

        // Binds handlers on eligible groups, if the elements are not confined to
        // their parents and a 'groupSelector' has been provided.
        if (connectGroups && groupSelector) {
            for (const siblingGroup of ref.el.querySelectorAll(groupSelector)) {
                addListener(siblingGroup, "mouseenter", onGroupMouseenter);
                addListener(siblingGroup, "mouseleave", onGroupMouseleave);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            }
        }

        // Binds handlers on eligible elements
<<<<<<< HEAD
        for (const siblingEl of ctx.ref.el.querySelectorAll(ctx.elementSelector)) {
            if (siblingEl !== ctx.currentElement && siblingEl !== ctx.ghostElement) {
                helpers.addListener(siblingEl, "mouseenter", onElementMouseenter);
                helpers.addListener(siblingEl, "mouseleave", onElementMouseleave);
            }
        }

        // Ghost is initially added right after the current element.
        ctx.currentElement.after(ctx.ghostElement);

        // Calls "onDragStart" handler
        helpers.execHandler("onDragStart", {
            element: ctx.currentElement,
            group: ctx.currentGroup,
        });
    },
    onDragEnd({ ctx, helpers }) {
        helpers.execHandler("onDragEnd", { element: ctx.currentElement, group: ctx.currentGroup });
    },
    onDrop({ ctx, helpers }) {
        const previous = ctx.ghostElement.previousElementSibling;
        const next = ctx.ghostElement.nextElementSibling;
        if (previous !== ctx.currentElement && next !== ctx.currentElement) {
            helpers.execHandler("onDrop", {
                element: ctx.currentElement,
                group: ctx.currentGroup,
                previous,
                next,
                parent: ctx.groupSelector && ctx.ghostElement.closest(ctx.groupSelector),
            });
        }
    },
    onWillStartDrag({ ctx }) {
        if (ctx.groupSelector) {
            ctx.currentGroup = ctx.currentElement.closest(ctx.groupSelector);
            if (!ctx.connectGroups) {
                ctx.currentContainer = ctx.currentGroup;
            }
        }
    },
    onCleanup({ ctx }) {
        if (ctx.ghostElement) {
            ctx.ghostElement.remove();
        }

        ctx.currentGroup = null;
        ctx.ghostElement = null;
=======
        for (const siblingEl of ref.el.querySelectorAll(elementSelector)) {
            if (siblingEl !== current.element && siblingEl !== current.placeHolder) {
                addListener(siblingEl, "mouseenter", onElementMouseenter);
                addListener(siblingEl, "mouseleave", onElementMouseleave);
            }
        }

        // Placeholder is initially added right after the current element.
        current.element.after(current.placeHolder);

        return pick(current, "element", "group");
    },
    onDragEnd({ ctx }) {
        return pick(ctx.current, "element", "group");
    },
    onDrop({ ctx }) {
        const { current, groupSelector } = ctx;
        const previous = current.placeHolder.previousElementSibling;
        const next = current.placeHolder.nextElementSibling;
        if (previous !== current.element && next !== current.element) {
            return {
                element: current.element,
                group: current.group,
                previous,
                next,
                parent: groupSelector && current.placeHolder.closest(groupSelector),
            };
        }
    },
    onWillStartDrag({ ctx, addCleanup }) {
        const { connectGroups, current, groupSelector } = ctx;

        if (groupSelector) {
            current.group = current.element.closest(groupSelector);
            if (!connectGroups) {
                current.container = current.group;
            }
        }

        current.placeHolder = current.element.cloneNode(false);

        addCleanup(() => current.placeHolder.remove());
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    },
});
