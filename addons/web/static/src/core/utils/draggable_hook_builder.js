/** @odoo-module **/

<<<<<<< HEAD
import { clamp } from "@web/core/utils/numbers";
import { debounce, setRecurringAnimationFrame } from "@web/core/utils/timing";

/**
 * @typedef Position
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef EdgeScrollingOptions
 * @property {boolean} [enabled=true]
 * @property {number} [speed=10]
 * @property {number} [threshold=20]
 */

/**
 * @typedef DraggableBuilderParams
 *
=======
import { onWillUnmount, reactive, useEffect, useExternalListener } from "@odoo/owl";
import { clamp } from "@web/core/utils/numbers";
import { setRecurringAnimationFrame, useThrottleForAnimation } from "@web/core/utils/timing";

/**
 * @typedef CleanupManager
 * @property {(cleanupFn: Function) => void} add
 * @property {() => void} cleanup
 *
 * @typedef DOMHelpers
 * @property {(el: HTMLElement, ...classNames: string[]) => void} addClass
 * @property {(el: EventTarget, event: string, callback: (...args: any[]) => any, options?: boolean | Record<string, boolean>) => void} addListener
 * @property {(el: HTMLElement, style: Record<string, string | number>) => void} addStyle
 * @property {(el: HTMLElement, options?: { adjust?: boolean }) => DOMRect} getRect
 * @property {(el: HTMLElement, ...classNames: string[]) => void} removeClass
 * @property {(el: HTMLElement, properties: string[]) => void} removeStyle
 *
 * @typedef DraggableBuilderParams
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
 * Hook params
 * @property {string} [name="useAnonymousDraggable"]
 * @property {EdgeScrollingOptions} [edgeScrolling]
 * @property {Record<string, string[]>} [acceptedParams]
 * @property {Record<string, any>} [defaultParams]
<<<<<<< HEAD
 *
 * Build handlers
 * @property {(params: DraggableBuilderHookParams) => any} onComputeParams
 *
 * Runtime handlers
 * @property {(params: DraggableBuilderHookParams) => any} onWillStartDrag
 * @property {(params: DraggableBuilderHookParams) => any} onDragStart
 * @property {(params: DraggableBuilderHookParams) => any} onDrag
 * @property {(params: DraggableBuilderHookParams) => any} onDragEnd
 * @property {(params: DraggableBuilderHookParams) => any} onDrop
 * @property {(params: DraggableBuilderHookParams) => any} onCleanup
 */

/**
 * @typedef DraggableHookRunningContext
=======
 * Build hooks
 * @property {(params: DraggableBuildHandlerParams) => any} onComputeParams
 * Runtime hooks
 * @property {(params: DraggableBuildHandlerParams) => any} onDragStart
 * @property {(params: DraggableBuildHandlerParams) => any} onDrag
 * @property {(params: DraggableBuildHandlerParams) => any} onDragEnd
 * @property {(params: DraggableBuildHandlerParams) => any} onDrop
 * @property {(params: DraggableBuildHandlerParams) => any} onWillStartDrag
 *
 * @typedef DraggableHookContext
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
 * @property {{ el: HTMLElement | null }} ref
 * @property {string | null} [elementSelector=null]
 * @property {string | null} [ignoreSelector=null]
 * @property {string | null} [fullSelector=null]
<<<<<<< HEAD
 * @property {string | null} [cursor=null]
 * @property {HTMLElement | null} [currentContainer=null]
 * @property {HTMLElement | null} [currentElement=null]
 * @property {DOMRect | null} [currentElementRect=null]
 * @property {HTMLElement | null} [scrollParent=null]
 * @property {boolean} [enabled=false]
 * @property {Position} [mouse={ x: 0, y: 0 }]
 * @property {Position} [offset={ x: 0, y: 0 }]
 * @property {EdgeScrollingOptions} [edgeScrolling]
 * @property {Number} [pixelsTolerance=10]
 */

/**
 * @typedef DraggableBuilderHookParams
 * @property {DraggableHookRunningContext} ctx
 * @property {Object} helpers
 * @property {Function} helpers.addListener
 * @property {Function} helpers.addStyle
 * @property {Function} helpers.execHandler
 */

import { useEffect, useEnv, useExternalListener, onWillUnmount, reactive } from "@odoo/owl";

const DEFAULT_ACCEPTED_PARAMS = {
    enable: ["boolean", "function"],
    ref: ["object"],
    elements: ["string"],
    handle: ["string", "function"],
    ignore: ["string", "function"],
    cursor: ["string"],
    edgeScrolling: ["object", "function"],
=======
 * @property {boolean} [followCursor=true]
 * @property {string | null} [cursor=null]
 * @property {() => boolean} [enable=() => false]
 * @property {Position} [mouse={ x: 0, y: 0 }]
 * @property {EdgeScrollingOptions} [edgeScrolling]
 * @property {number} [tolerance]
 * @property {DraggableHookCurrentContext} current
 *
 * @typedef DraggableHookCurrentContext
 * @property {HTMLElement} [current.container]
 * @property {DOMRect} [current.containerRect]
 * @property {HTMLElement} [current.element]
 * @property {DOMRect} [current.elementRect]
 * @property {HTMLElement} [scrollParent]
 * @property {Position} [initialPosition]
 * @property {Position} [offset={ x: 0, y: 0 }]
 *
 * @typedef EdgeScrollingOptions
 * @property {boolean} [enabled=true]
 * @property {number} [speed=10]
 * @property {number} [threshold=20]
 *
 * @typedef Position
 * @property {number} x
 * @property {number} y
 *
 * @typedef {DOMHelpers & {
 *  ctx: DraggableHookContext,
 *  addCleanup(cleanupFn: () => any): void,
 *  addEffectCleanup(cleanupFn: () => any): void,
 *  callHandler(handlerName: string, arg: Record<any, any>): void,
 * }} DraggableBuildHandlerParams
 *
 * @typedef {DOMHelpers & Position & { element: HTMLElement }} DraggableHandlerParams
 */

const DEFAULT_ACCEPTED_PARAMS = {
    enable: [Boolean, Function],
    ref: [Object],
    elements: [String],
    handle: [String, Function],
    ignore: [String, Function],
    cursor: [String],
    edgeScrolling: [Object, Function],
    tolerance: [Number],
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
};
const DEFAULT_DEFAULT_PARAMS = {
    enable: true,
    edgeScrolling: {
        speed: 10,
        threshold: 30,
    },
<<<<<<< HEAD
};
const LEFT_CLICK = 0;
const MANDATORY_PARAMS = ["ref", "elements"];

/**
 * Cancels the default behavior and propagation of a given event.
 * @param {Event} ev
 */
function cancelEvent(ev) {
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    ev.preventDefault();
}

/**
 * Returns the bounding rect of the given element. If the `adjust` option is set
 * to true, the rect will be reduced by the padding of the element.
 * @param {HTMLElement} el
 * @param {Object} [options={}]
 * @param {boolean} [options.adjust=false]
 * @returns {DOMRect}
 */
function getRect(el, options = {}) {
    const rect = el.getBoundingClientRect();
    if (options.adjust) {
        const style = getComputedStyle(el);
        const [pl, pr, pt, pb] = [
            "padding-left",
            "padding-right",
            "padding-top",
            "padding-bottom",
        ].map((prop) => pixelValueToNumber(style.getPropertyValue(prop)));

        rect.x += pl;
        rect.y += pt;
        rect.width -= pl + pr;
        rect.height -= pt + pb;
    }
    return rect;
=======
    tolerance: 10,
};
const DRAGGED_CLASS = "o_dragged";
const LEFT_CLICK = 0;
const MANDATORY_PARAMS = ["ref", "elements"];
const WHITE_LISTED_KEYS = ["Alt", "Control", "Meta", "Shift"];

/**
 * Cache containing the elements in which an attribute has been modified by a hook.
 * It is global since multiple draggable hooks can interact with the same elements.
 * @type {Record<string, Set<HTMLElement>>}
 */
const elCache = {};

/**
 * Transforms a camelCased string to return its kebab-cased version.
 * Typically used to generate CSS properties from JS objects.
 *
 * @param {string} str
 * @returns {string}
 */
function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * @template T
 * @param {T | () => T} valueOrFn
 * @returns {T}
 */
function getReturnValue(valueOrFn) {
    if (typeof valueOrFn === "function") {
        return valueOrFn();
    }
    return valueOrFn;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
}

/**
 * Returns the first scrollable parent of the given element (recursively), or null
 * if none is found. A 'scrollable' element is defined by 2 things:
 *
 * - for either in width or in height: the 'scroll' value is larger than the 'client'
 * value;
 *
 * - its computed 'overflow' property is set to either "auto" or "scroll"
 *
 * If both of these assertions are true, it means that the element can effectively
 * be scrolled on at least one axis.
 * @param {HTMLElement} el
 * @returns {HTMLElement | null}
 */
function getScrollParent(el) {
    if (!el) {
        return null;
    }
    if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
        const overflow = getComputedStyle(el).getPropertyValue("overflow");
        if (/\bauto\b|\bscroll\b/.test(overflow)) {
            return el;
        }
    }
    return getScrollParent(el.parentElement);
}

/**
<<<<<<< HEAD
=======
 * @param {Function} [defaultCleanupFn]
 * @returns {CleanupManager}
 */
function makeCleanupManager(defaultCleanupFn) {
    /**
     * Registers the given cleanup function to be called when cleaning up hooks.
     * @param {Function} [cleanupFn]
     */
    const add = (cleanupFn) => typeof cleanupFn === "function" && cleanups.push(cleanupFn);

    /**
     * Runs all cleanup functions while clearing the cleanups list.
     */
    const cleanup = () => {
        while (cleanups.length) {
            cleanups.pop()();
        }
        add(defaultCleanupFn);
    };

    const cleanups = [];

    add(defaultCleanupFn);

    return { add, cleanup };
}

/**
 * @param {CleanupManager} cleanup
 * @returns {DOMHelpers}
 */
function makeDOMHelpers(cleanup) {
    /**
     * @param {HTMLElement} el
     * @param  {...string} classNames
     */
    const addClass = (el, ...classNames) => {
        if (!el || !classNames.length) {
            return;
        }
        cleanup.add(saveAttribute(el, "class"));
        el.classList.add(...classNames);
    };

    /**
     * Adds an event listener to be cleaned up after the next drag sequence
     * has stopped. An additionnal `timeout` param allows the handler to be
     * delayed after a timeout.
     * @param {EventTarget} el
     * @param {string} event
     * @param {(...args: any[]) => any} callback
     * @param {boolean | Record<string, boolean>} [options]
     */
    const addListener = (el, event, callback, options) => {
        if (!el || !event || !callback) {
            return;
        }
        el.addEventListener(event, callback, options);
        if (/pointer|mouse/.test(event)) {
            // Restore pointer events on elements listening on mouse/pointer events.
            addStyle(el, { pointerEvents: "auto" });
        }
        cleanup.add(() => el.removeEventListener(event, callback, options));
    };

    /**
     * Adds style to an element to be cleaned up after the next drag sequence has
     * stopped.
     * @param {HTMLElement} el
     * @param {Record<string, string | number>} style
     */
    const addStyle = (el, style) => {
        if (!el || !style || !Object.keys(style).length) {
            return;
        }
        cleanup.add(saveAttribute(el, "style"));
        for (const key in style) {
            const [value, priority] = String(style[key]).split(/\s*!\s*/);
            el.style.setProperty(camelToKebab(key), value, priority);
        }
    };

    /**
     * Returns the bounding rect of the given element. If the `adjust` option is set
     * to true, the rect will be reduced by the padding of the element.
     * @param {HTMLElement} el
     * @param {Object} [options={}]
     * @param {boolean} [options.adjust=false]
     * @returns {DOMRect}
     */
    const getRect = (el, options = {}) => {
        if (!el) {
            return {};
        }
        const rect = el.getBoundingClientRect();
        if (options.adjust) {
            const style = getComputedStyle(el);
            const [pl, pr, pt, pb] = [
                "padding-left",
                "padding-right",
                "padding-top",
                "padding-bottom",
            ].map((prop) => pixelValueToNumber(style.getPropertyValue(prop)));

            rect.x += pl;
            rect.y += pt;
            rect.width -= pl + pr;
            rect.height -= pt + pb;
        }
        return rect;
    };

    /**
     * @param {HTMLElement} el
     * @param  {...string} classNames
     */
    const removeClass = (el, ...classNames) => {
        if (!el || !classNames) {
            return;
        }
        cleanup.add(saveAttribute(el, "class"));
        el.classList.remove(...classNames);
    };

    /**
     * Adds style to an element to be cleaned up after the next drag sequence has
     * stopped.
     * @param {HTMLElement} el
     * @param {...string} properties
     */
    const removeStyle = (el, ...properties) => {
        if (!el || !properties?.length) {
            return;
        }
        cleanup.add(saveAttribute(el, "style"));
        for (const key of properties) {
            el.style.removeProperty(camelToKebab(key));
        }
    };

    return { addClass, addListener, addStyle, getRect, removeClass, removeStyle };
}

/**
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
 * Converts a CSS pixel value to a number, removing the 'px' part.
 * @param {string} val
 * @returns {number}
 */
function pixelValueToNumber(val) {
    return Number(val.endsWith("px") ? val.slice(0, -2) : val);
}

<<<<<<< HEAD
=======
function saveAttribute(el, attribute) {
    const restoreAttribute = () => {
        cache.delete(el);
        if (originalValue) {
            el.setAttribute(attribute, originalValue);
        } else {
            el.removeAttribute(attribute);
        }
    };

    if (!(attribute in elCache)) {
        elCache[attribute] = new Set();
    }
    const cache = elCache[attribute];

    if (cache.has(el)) {
        return;
    }

    cache.add(el);
    const originalValue = el.getAttribute(attribute);

    return restoreAttribute;
}

/**
 * @template T
 * @param {T | () => T} value
 * @returns {() => T}
 */
function toFunction(value) {
    return typeof value === "function" ? value : () => value;
}

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
/**
 * @param {DraggableBuilderParams} hookParams
 * @returns {(params: Record<any, any>) => { dragging: boolean }}
 */
<<<<<<< HEAD
export function makeDraggableHook(hookParams = {}) {
=======
export function makeDraggableHook(hookParams) {
    hookParams = getReturnValue(hookParams);

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    const hookName = hookParams.name || "useAnonymousDraggable";
    const allAcceptedParams = { ...DEFAULT_ACCEPTED_PARAMS, ...hookParams.acceptedParams };
    const defaultParams = { ...DEFAULT_DEFAULT_PARAMS, ...hookParams.defaultParams };

    /**
<<<<<<< HEAD
=======
     * Computes the current params and converts the params definition
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
     * @param {SortableParams} params
     * @returns {[string, string | boolean][]}
     */
    const computeParams = (params) => {
<<<<<<< HEAD
        const computedParams = { enable: true };
        for (const prop in allAcceptedParams) {
            if (prop in params) {
                computedParams[prop] = params[prop];
                if (typeof params[prop] === "function") {
                    computedParams[prop] = computedParams[prop]();
=======
        const computedParams = { enable: () => true };
        for (const prop in allAcceptedParams) {
            if (prop in params) {
                if (prop === "enable") {
                    computedParams[prop] = toFunction(params[prop]);
                } else if (
                    allAcceptedParams[prop].length === 1 &&
                    allAcceptedParams[prop][0] === Function
                ) {
                    computedParams[prop] = params[prop];
                } else {
                    computedParams[prop] = getReturnValue(params[prop]);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                }
            }
        }
        return Object.entries(computedParams);
    };

    /**
     * Basic error builder for the hook.
     * @param {string} reason
     * @returns {Error}
     */
    const makeError = (reason) => new Error(`Error in hook ${hookName}: ${reason}.`);

    return {
        [hookName](params) {
            /**
<<<<<<< HEAD
             * Adds an event listener to be cleaned up after the next drag sequence
             * has stopped. An additionnal `timeout` param allows the handler to be
             * delayed after a timeout.
             * @param {EventTarget} el
             * @param {string} event
             * @param {(...args: any[]) => any} callback
             * @param {boolean | Record<string, boolean>} [options]
             */
            const addListener = (el, event, callback, options) => {
                el.addEventListener(event, callback, options);
                cleanups.push(() => el.removeEventListener(event, callback, options));
            };

            /**
             * Adds style to an element to be cleaned up after the next drag sequence has
             * stopped.
             * @param {HTMLElement} el
             * @param {Record<string, string | number>} style
             */
            const addStyle = (el, style) => {
                const originalStyle = el.getAttribute("style");
                cleanups.push(() =>
                    originalStyle
                        ? el.setAttribute("style", originalStyle)
                        : el.removeAttribute("style")
                );
                for (const key in style) {
                    el.style[key] = style[key];
=======
             * Executes a handler from the `hookParams`.
             * @param {string} hookHandlerName
             * @param {Record<any, any>} arg
             */
            const callBuildHandler = (hookHandlerName, arg) => {
                if (typeof hookParams[hookHandlerName] !== "function") {
                    return;
                }
                const returnValue = hookParams[hookHandlerName]({ ctx, ...helpers, ...arg });
                if (returnValue) {
                    callHandler(hookHandlerName, returnValue);
                }
            };

            /**
             * Safely executes a handler from the `params`, so that the drag sequence can
             * be interrupted if an error occurs.
             * @param {string} handlerName
             * @param {Record<any, any>} arg
             */
            const callHandler = (handlerName, arg) => {
                if (typeof params[handlerName] !== "function") {
                    return;
                }
                try {
                    params[handlerName]({ ...dom, ...ctx.mouse, ...arg });
                } catch (err) {
                    dragEnd(null, true);
                    throw err;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                }
            };

            /**
             * Returns whether the user has moved from at least the number of pixels
             * that are tolerated from the initial mouse position.
<<<<<<< HEAD
             * @param {MouseEvent} ev
             */
            const canDrag = (ev) => {
                return (
                    ctx.origin &&
                    Math.hypot(ev.clientX - ctx.origin.x, ev.clientY - ctx.origin.y) >=
                        ctx.pixelsTolerance
=======
             */
            const canStartDrag = () => {
                const {
                    mouse,
                    current: { initialPosition },
                } = ctx;
                return (
                    !ctx.tolerance ||
                    Math.hypot(mouse.x - initialPosition.x, mouse.y - initialPosition.y) >=
                        ctx.tolerance
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                );
            };

            /**
             * Main entry function to start a drag sequence.
             */
            const dragStart = () => {
                state.dragging = true;

                // Compute scrollable parent
<<<<<<< HEAD
                ctx.scrollParent = getScrollParent(ctx.currentContainer);

                const [eRect] = updateRects();

                // Binds handlers on eligible elements
                for (const siblingEl of ctx.ref.el.querySelectorAll(ctx.elementSelector)) {
                    if (siblingEl !== ctx.currentElement) {
                        addStyle(siblingEl, { "pointer-events": "auto" });
                    }
                }

                // Adjusts the offset
                ctx.offset.x -= eRect.x;
                ctx.offset.y -= eRect.y;

                addStyle(ctx.currentElement, {
                    position: "fixed",
                    "pointer-events": "none",
                    "z-index": 1000,
                    width: `${eRect.width}px`,
                    height: `${eRect.height}px`,
                    left: `${eRect.x}px`,
                    top: `${eRect.y}px`,
                });

                const bodyStyle = {
                    "pointer-events": "none",
                    "user-select": "none",
                };
                if (ctx.cursor) {
                    bodyStyle.cursor = ctx.cursor;
                }

                addStyle(document.body, bodyStyle);

                if (ctx.scrollParent && ctx.edgeScrolling.enabled) {
                    const cleanupFn = setRecurringAnimationFrame(handleEdgeScrolling);
                    cleanups.push(cleanupFn);
                }

                execBuildHandler("onDragStart");
=======
                ctx.current.scrollParent = getScrollParent(ctx.current.container);

                updateRects();
                const { x, y, width, height } = ctx.current.elementRect;

                // Adjusts the offset
                ctx.current.offset = {
                    x: ctx.current.initialPosition.x - x,
                    y: ctx.current.initialPosition.y - y,
                };

                if (ctx.followCursor) {
                    dom.addStyle(ctx.current.element, {
                        width: `${width}px`,
                        height: `${height}px`,
                        position: "fixed !important",
                    });

                    // First adjustment
                    updateElementPosition();
                }

                dom.addStyle(document.body, {
                    pointerEvents: "none",
                    userSelect: "none",
                });
                if (ctx.cursor) {
                    dom.addStyle(document.body, { cursor: ctx.cursor });
                }

                if (ctx.current.scrollParent && ctx.edgeScrolling.enabled) {
                    const cleanupFn = setRecurringAnimationFrame(handleEdgeScrolling);
                    cleanup.add(cleanupFn);
                }

                dom.addClass(ctx.current.element, DRAGGED_CLASS);

                callBuildHandler("onDragStart");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };

            /**
             * Main exit function to stop a drag sequence. Note that it can be called
             * even if a drag sequence did not start yet to perform a cleanup of all
             * current context variables.
<<<<<<< HEAD
             * @param {boolean} cancelled
=======
             * @param {HTMLElement | null} target
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
             * @param {boolean} [inErrorState] can be set to true when an error
             *  occurred to avoid falling into an infinite loop if the error
             *  originated from one of the handlers.
             */
<<<<<<< HEAD
            const dragEnd = (cancelled, inErrorState) => {
                if (state.dragging) {
                    if (!inErrorState) {
                        execBuildHandler("onDragEnd");
                        if (!cancelled) {
                            execBuildHandler("onDrop");
                        }
                    }
                }

                execBuildHandler("onCleanup");

                // Performs all registered clean-ups.
                while (cleanups.length) {
                    cleanups.pop()();
                }

                ctx.currentContainer = null;
                ctx.currentElement = null;
                ctx.currentElementRect = null;
                ctx.origin = null;
                ctx.scrollParent = null;

                state.dragging = false;
            };

            /**
             * Executes a handler from the `hookParams`.
             * @param {string} fnName
             * @param {Record<any, any>} arg
             */
            const execBuildHandler = (fnName, arg) => {
                if (typeof hookParams[fnName] === "function") {
                    hookParams[fnName]({ ctx, helpers: buildHelpers, ...arg });
                }
            };

            /**
             * Safely executes a handler from the `params`, so that the drag sequence can
             * be interrupted if an error occurs.
             * @param {string} callbackName
             * @param {Record<any, any>} arg
             */
            const execHandler = (callbackName, arg) => {
                if (typeof params[callbackName] === "function") {
                    try {
                        params[callbackName]({ ...ctx.mouse, ...arg });
                    } catch (err) {
                        dragEnd(true, true);
                        throw err;
                    }
                }
=======
            const dragEnd = (target, inErrorState) => {
                if (state.dragging) {
                    if (!inErrorState) {
                        if (target) {
                            callBuildHandler("onDrop", { target });
                        }
                        callBuildHandler("onDragEnd");
                    }
                }

                cleanup.cleanup();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };

            /**
             * Applies scroll to the container if the current element is near
             * the edge of the container.
             */
            const handleEdgeScrolling = (deltaTime) => {
<<<<<<< HEAD
                const [eRect, cRect] = updateRects();
=======
                updateRects();
                const eRect = ctx.current.elementRect;
                const cRect = ctx.current.containerRect;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                const { speed, threshold } = ctx.edgeScrolling;
                const correctedSpeed = (speed / 16) * deltaTime;
                const maxWidth = cRect.x + cRect.width;
                const maxHeight = cRect.y + cRect.height;

                const diff = {};

                if (eRect.x - cRect.x < threshold) {
                    diff.x = [eRect.x - cRect.x, -1];
                } else if (maxWidth - eRect.x - eRect.width < threshold) {
                    diff.x = [maxWidth - eRect.x - eRect.width, 1];
                }
                if (eRect.y - cRect.y < threshold) {
                    diff.y = [eRect.y - cRect.y, -1];
                } else if (maxHeight - eRect.y - eRect.height < threshold) {
                    diff.y = [maxHeight - eRect.y - eRect.height, 1];
                }

<<<<<<< HEAD
=======
                if (diff.x && !diff.x[0]) {
                    delete diff.x;
                }
                if (diff.y && !diff.y[0]) {
                    delete diff.y;
                }

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                if (diff.x || diff.y) {
                    const diffToScroll = ([delta, sign]) =>
                        (1 - clamp(delta, 0, threshold) / threshold) * correctedSpeed * sign;
                    const scrollParams = {};
                    if (diff.x) {
                        scrollParams.left = diffToScroll(diff.x);
                    }
                    if (diff.y) {
                        scrollParams.top = diffToScroll(diff.y);
                    }
<<<<<<< HEAD
                    ctx.scrollParent.scrollBy(scrollParams);
=======
                    ctx.current.scrollParent.scrollBy(scrollParams);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                }
            };

            /**
             * Window "keydown" event handler.
             * @param {KeyboardEvent} ev
             */
<<<<<<< HEAD
            const onKeydown = (ev) => {
                if (!ctx.enabled || !state.dragging) {
                    return;
                }
                switch (ev.key) {
                    case "Escape":
                    case "Tab": {
                        cancelEvent(ev);
                        dragEnd(true);
                    }
=======
            const onKeyDown = (ev) => {
                if (!state.dragging || !ctx.enable()) {
                    return;
                }
                if (!WHITE_LISTED_KEYS.includes(ev.key)) {
                    ev.stopImmediatePropagation();
                    ev.preventDefault();

                    // Cancels drag sequences on every non-whitelisted key down event.
                    dragEnd(null);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                }
            };

            /**
             * Global (= ref) "mousedown" event handler.
             * @param {MouseEvent} ev
             */
<<<<<<< HEAD
            const onMousedown = (ev) => {
=======
            const onMouseDown = (ev) => {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                updateMousePosition(ev);

                // A drag sequence can still be in progress if the mouseup occurred
                // outside of the window.
<<<<<<< HEAD
                dragEnd(true);

                if (
                    ev.button !== LEFT_CLICK ||
                    !ctx.enabled ||
=======
                dragEnd(null);

                if (
                    ev.button !== LEFT_CLICK ||
                    !ctx.enable() ||
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    !ev.target.closest(ctx.fullSelector) ||
                    (ctx.ignoreSelector && ev.target.closest(ctx.ignoreSelector))
                ) {
                    return;
                }

                // In FireFox: elements with `overflow: hidden` will prevent mouseenter and mouseleave
                // events from firing on elements underneath them. This is the case when dragging a card
                // by the `.o_kanban_record_headings` element. In such cases, we can prevent the default
                // action on the mousedown event to allow mouse events to fire properly.
                // https://bugzilla.mozilla.org/show_bug.cgi?id=1352061
                // https://bugzilla.mozilla.org/show_bug.cgi?id=339293
                ev.preventDefault();

<<<<<<< HEAD
                ctx.currentContainer = ctx.ref.el;
                ctx.currentElement = ev.target.closest(ctx.elementSelector);
                ctx.origin = {
                    x: ev.clientX,
                    y: ev.clientY,
                };

                Object.assign(ctx.offset, ctx.mouse);

                execBuildHandler("onWillStartDrag");
=======
                const { target } = ev;
                ctx.current.initialPosition = { ...ctx.mouse };

                willStartDrag(target);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };

            /**
             * Window "mousemove" event handler.
             * @param {MouseEvent} ev
             */
<<<<<<< HEAD
            const onMousemove = (ev) => {
                if (!ctx.enabled || !ctx.currentElement) {
                    return;
                }
                if (!state.dragging) {
                    // Prevent the drag and drop to start if the user has only moved its mouse from a few pixels
                    if (canDrag(ev)) {
                        dragStart();
                    }
                }

                updateMousePosition(ev);

                if (state.dragging) {
                    const [eRect, cRect] = updateRects();

                    // Updates the position of the dragged element.
                    ctx.currentElement.style.left = `${clamp(
                        ctx.mouse.x - ctx.offset.x,
                        cRect.x,
                        cRect.x + cRect.width - eRect.width
                    )}px`;
                    ctx.currentElement.style.top = `${clamp(
                        ctx.mouse.y - ctx.offset.y,
                        cRect.y,
                        cRect.y + cRect.height - eRect.height
                    )}px`;

                    execBuildHandler("onDrag");
                }
=======
            const onMouseMove = (ev) => {
                updateMousePosition(ev);

                if (!ctx.current.element || !ctx.enable()) {
                    return;
                }

                ev.preventDefault();

                if (!state.dragging) {
                    if (!canStartDrag()) {
                        return;
                    }
                    dragStart();
                }

                if (ctx.followCursor) {
                    updateElementPosition();
                }

                callBuildHandler("onDrag");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };

            /**
             * Window "mouseup" event handler.
             * @param {MouseEvent} ev
             */
<<<<<<< HEAD
            const onMouseup = (ev) => {
                updateMousePosition(ev);
                dragEnd(false);
=======
            const onMouseUp = (ev) => {
                updateMousePosition(ev);
                dragEnd(ev.target);
            };

            /**
             * Updates the position of the current dragged element according to
             * the current mouse position.
             */
            const updateElementPosition = () => {
                const { containerRect, element, elementRect, offset } = ctx.current;
                const { width: ew, height: eh } = elementRect;
                const { x: cx, y: cy, width: cw, height: ch } = containerRect;

                // Updates the position of the dragged element.
                dom.addStyle(element, {
                    left: `${clamp(ctx.mouse.x - offset.x, cx, cx + cw - ew)}px`,
                    top: `${clamp(ctx.mouse.y - offset.y, cy, cy + ch - eh)}px`,
                });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };

            /**
             * Updates the current mouse position from a given event.
             * @param {MouseEvent} ev
             */
            const updateMousePosition = (ev) => {
                ctx.mouse.x = ev.clientX;
                ctx.mouse.y = ev.clientY;
            };

<<<<<<< HEAD
            /**
             * @returns {DOMRect[]}
             */
            const updateRects = () => {
                // Container rect
                const containerRect = getRect(ctx.currentContainer, { adjust: true });
                if (ctx.scrollParent) {
                    // Adjust container rect according to scrollparent
                    const parentRect = getRect(ctx.scrollParent, { adjust: true });
                    containerRect.x = Math.max(containerRect.x, parentRect.x);
                    containerRect.y = Math.max(containerRect.y, parentRect.y);
                    containerRect.width = Math.min(containerRect.width, parentRect.width);
                    containerRect.height = Math.min(containerRect.height, parentRect.height);
                }

                // Element rect
                ctx.currentElementRect = getRect(ctx.currentElement);

                return [ctx.currentElementRect, containerRect];
            };

            // Component infos
            const env = useEnv();
=======
            const updateRects = () => {
                const { current } = ctx;
                const { container, element, scrollParent } = current;
                // Container rect
                current.containerRect = dom.getRect(container, { adjust: true });
                if (scrollParent && ctx.edgeScrolling.enabled) {
                    // Adjust container rect according to scrollparent
                    const parentRect = dom.getRect(scrollParent, { adjust: true });
                    current.containerRect.x = Math.max(current.containerRect.x, parentRect.x);
                    current.containerRect.y = Math.max(current.containerRect.y, parentRect.y);
                    current.containerRect.width = Math.min(
                        current.containerRect.width,
                        parentRect.width
                    );
                    current.containerRect.height = Math.min(
                        current.containerRect.height,
                        parentRect.height
                    );
                }

                // Element rect
                ctx.current.elementRect = dom.getRect(element);
            };

            /**
             * @param {Element} target
             */
            const willStartDrag = (target) => {
                ctx.current.element = target.closest(ctx.elementSelector);
                ctx.current.container = ctx.ref.el;

                cleanup.add(() => (ctx.current = {}));

                callBuildHandler("onWillStartDrag");
            };

            // Initialize helpers
            const cleanup = makeCleanupManager(() => (state.dragging = false));
            const effectCleanup = makeCleanupManager();
            const dom = makeDOMHelpers(cleanup);

            const helpers = {
                ...dom,
                addCleanup: cleanup.add,
                addEffectCleanup: effectCleanup.add,
                callHandler,
            };

            // Component infos
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            const state = reactive({ dragging: false });

            // Basic error handling asserting that the parameters are valid.
            for (const prop in allAcceptedParams) {
<<<<<<< HEAD
                if (params[prop] && !allAcceptedParams[prop].includes(typeof params[prop])) {
                    throw makeError(`invalid type for property "${prop}" in parameters`);
                } else if (!params[prop] && MANDATORY_PARAMS.includes(prop)) {
=======
                const type = typeof params[prop];
                const acceptedTypes = allAcceptedParams[prop].map((t) => t.name.toLowerCase());
                if (params[prop]) {
                    if (!acceptedTypes.includes(type)) {
                        throw makeError(
                            `invalid type for property "${prop}" in parameters: expected { ${acceptedTypes.join(
                                ", "
                            )} } and got ${type}`
                        );
                    }
                } else if (MANDATORY_PARAMS.includes(prop)) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    throw makeError(`missing required property "${prop}" in parameters`);
                }
            }

<<<<<<< HEAD
            // Build helpers
            const buildHelpers = { addListener, addStyle, execHandler };

            /** @type {(() => any)[]} */
            const cleanups = [];

            /** @type {DraggableHookRunningContext} */
            const ctx = {
                ref: params.ref,
                ignoreSelector: null,
                fullSelector: null,
                cursor: null,
                currentContainer: null,
                currentElement: null,
                currentElementRect: null,
                scrollParent: null,
                enabled: false,
                mouse: { x: 0, y: 0 },
                offset: { x: 0, y: 0 },
                edgeScrolling: { enabled: true },
                pixelsTolerance: 10,
=======
            /** @type {DraggableHookContext} */
            const ctx = {
                enable: () => false,
                ref: params.ref,
                ignoreSelector: null,
                fullSelector: null,
                followCursor: true,
                cursor: null,
                mouse: { x: 0, y: 0 },
                edgeScrolling: { enabled: true },
                get dragging() {
                    return state.dragging;
                },
                // Current context
                current: {},
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            };

            // Effect depending on the params to update them.
            useEffect(
                (...deps) => {
                    const actualParams = { ...defaultParams, ...Object.fromEntries(deps) };
<<<<<<< HEAD
                    ctx.enabled = Boolean(ctx.ref.el && !env.isSmall && actualParams.enable);
                    if (!ctx.enabled) {
                        return;
                    }

=======
                    if (!ctx.ref.el) {
                        return;
                    }

                    // Enable getter
                    ctx.enable = actualParams.enable;

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    // Selectors
                    ctx.elementSelector = actualParams.elements;
                    if (!ctx.elementSelector) {
                        throw makeError(
                            `no value found by "elements" selector: ${ctx.elementSelector}`
                        );
                    }
                    const allSelectors = [ctx.elementSelector];
                    ctx.cursor = actualParams.cursor || null;
                    if (actualParams.handle) {
                        allSelectors.push(actualParams.handle);
                    }
                    if (actualParams.ignore) {
                        ctx.ignoreSelector = actualParams.ignore;
                    }
                    ctx.fullSelector = allSelectors.join(" ");

<<<<<<< HEAD
                    Object.assign(ctx.edgeScrolling, actualParams.edgeScrolling);

                    execBuildHandler("onComputeParams", { params: actualParams });
=======
                    // Edge scrolling
                    Object.assign(ctx.edgeScrolling, actualParams.edgeScrolling);

                    // Delay & tolerance
                    ctx.tolerance = actualParams.tolerance;

                    callBuildHandler("onComputeParams", { params: actualParams });

                    // Calls effect cleanup functions when preparing to re-render.
                    return effectCleanup.cleanup;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                },
                () => computeParams(params)
            );
            // Effect depending on the `ref.el` to add triggering mouse events listener.
            useEffect(
                (el) => {
                    if (el) {
<<<<<<< HEAD
                        el.addEventListener("mousedown", onMousedown);
                        return () => el.removeEventListener("mousedown", onMousedown);
=======
                        el.addEventListener("mousedown", onMouseDown);
                        return () => el.removeEventListener("mousedown", onMouseDown);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    }
                },
                () => [ctx.ref.el]
            );
<<<<<<< HEAD
            // Other global mouse event listeners.
            const debouncedOnMouseMove = debounce(onMousemove, "animationFrame", true);
            useExternalListener(window, "mousemove", debouncedOnMouseMove);
            useExternalListener(window, "mouseup", onMouseup);
            useExternalListener(window, "keydown", onKeydown, true);
            onWillUnmount(() => dragEnd(true));
=======
            // Other global event listeners.
            const throttledOnMouseMove = useThrottleForAnimation(onMouseMove);
            useExternalListener(window, "mousemove", throttledOnMouseMove);
            useExternalListener(window, "mouseup", onMouseUp);
            useExternalListener(window, "keydown", onKeyDown, true);
            onWillUnmount(() => dragEnd(null));
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

            return state;
        },
    }[hookName];
}
