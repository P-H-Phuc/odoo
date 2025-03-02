/** @odoo-module **/

import { drag, dragAndDrop, getFixture, mount, nextTick } from "@web/../tests/helpers/utils";
import { useSortable } from "@web/core/utils/sortable";

import { Component, reactive, useRef, useState, xml } from "@odoo/owl";

let target;
QUnit.module("Draggable", ({ beforeEach }) => {
    beforeEach(() => (target = getFixture()));

    QUnit.module("Sortable hook");

    QUnit.test("Parameters error handling", async (assert) => {
        assert.expect(6);

        const mountListAndAssert = async (setupList, shouldThrow) => {
            class List extends Component {
                setup() {
                    setupList();
                }
            }

            List.template = xml`
                <div t-ref="root" class="root">
                    <ul class="list">
                        <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" t-esc="i" class="item" />
                    </ul>
                </div>`;

            let err;
            await mount(List, target).catch((e) => (err = e));

            assert.ok(
                shouldThrow ? err : !err,
                `An error should${shouldThrow ? "" : "n't"} have been thrown when mounting.`
            );
        };

        // Incorrect params
        await mountListAndAssert(() => {
            useSortable({});
        }, true);
        await mountListAndAssert(() => {
            useSortable({
                ref: useRef("root"),
            });
        }, true);
        await mountListAndAssert(() => {
            useSortable({
                elements: ".item",
            });
        }, true);
        await mountListAndAssert(() => {
            useSortable({
                elements: ".item",
                groups: ".list",
            });
        }, true);

        // Correct params
        await mountListAndAssert(() => {
            useSortable({
                ref: {},
                elements: ".item",
                enable: false,
            });
        }, false);
        await mountListAndAssert(() => {
            useSortable({
                ref: useRef("root"),
                elements: ".item",
                connectGroups: () => true,
            });
        }, false);
    });

    QUnit.test("Simple sorting in single group", async (assert) => {
        assert.expect(22);

        class List extends Component {
            setup() {
                useSortable({
                    ref: useRef("root"),
                    elements: ".item",
                    onDragStart({ element, group }) {
                        assert.step("start");
                        assert.notOk(group);
                        assert.strictEqual(element.innerText, "1");
                    },
                    onElementEnter({ element }) {
                        assert.step("elemententer");
                        assert.strictEqual(element.innerText, "2");
                    },
                    onDragEnd({ element, group }) {
<<<<<<< HEAD:addons/web/static/tests/core/utils/ui_tests.js
                        assert.step("stop");
=======
                        assert.step("end");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6:addons/web/static/tests/core/utils/sortable_tests.js
                        assert.notOk(group);
                        assert.strictEqual(element.innerText, "1");
                        assert.containsN(target, ".item", 4);
                    },
                    onDrop({ element, group, previous, next, parent }) {
                        assert.step("drop");
                        assert.notOk(group);
                        assert.strictEqual(element.innerText, "1");
                        assert.strictEqual(previous.innerText, "2");
                        assert.strictEqual(next.innerText, "3");
                        assert.notOk(parent);
                    },
                });
            }
        }

        List.template = xml`
            <div t-ref="root" class="root">
                <ul class="list">
                    <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" t-esc="i" class="item" />
                </ul>
            </div>`;

        await mount(List, target);

        assert.containsN(target, ".item", 3);
        assert.containsNone(target, ".o_dragged");
        assert.verifySteps([]);

        // First item after 2nd item
        const { drop, moveTo } = await drag(".item:first-child");
        await moveTo(".item:nth-child(2)");

        assert.hasClass(target.querySelector(".item"), "o_dragged");

        await drop();

        assert.containsN(target, ".item", 3);
        assert.containsNone(target, ".o_dragged");
        assert.verifySteps(["start", "elemententer", "drop", "end"]);
    });

    QUnit.test("Simple sorting in multiple groups", async (assert) => {
        assert.expect(20);

        class List extends Component {
            setup() {
                useSortable({
                    ref: useRef("root"),
                    elements: ".item",
                    groups: ".list",
                    connectGroups: true,
                    onDragStart({ element, group }) {
                        assert.step("start");
                        assert.hasClass(group, "list2");
                        assert.strictEqual(element.innerText, "2 1");
                    },
                    onGroupEnter({ group }) {
                        assert.step("groupenter");
                        assert.hasClass(group, "list1");
                    },
                    onDragEnd({ element, group }) {
<<<<<<< HEAD:addons/web/static/tests/core/utils/ui_tests.js
                        assert.step("stop");
=======
                        assert.step("end");
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6:addons/web/static/tests/core/utils/sortable_tests.js
                        assert.hasClass(group, "list2");
                        assert.strictEqual(element.innerText, "2 1");
                    },
                    onDrop({ element, group, previous, next, parent }) {
                        assert.step("drop");
                        assert.hasClass(group, "list2");
                        assert.strictEqual(element.innerText, "2 1");
                        assert.strictEqual(previous.innerText, "1 3");
                        assert.notOk(next);
                        assert.hasClass(parent, "list1");
                    },
                });
            }
        }

        List.template = xml`
            <div t-ref="root" class="root">
                <ul t-foreach="[1, 2, 3]" t-as="l" t-key="l" t-attf-class="list p-3 list{{ l }}">
                    <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" t-esc="l + ' ' + i" class="item" />
                </ul>
            </div>`;

        await mount(List, target);

        assert.containsN(target, ".list", 3);
        assert.containsN(target, ".item", 9);
        assert.verifySteps([]);

        // First item of 2nd list appended to first list
        await dragAndDrop(".list2 .item:first-child", ".list1");

        assert.containsN(target, ".list", 3);
        assert.containsN(target, ".item", 9);
        assert.verifySteps(["start", "groupenter", "drop", "end"]);
    });

    QUnit.test("Dynamically disable sortable feature", async (assert) => {
        assert.expect(4);

        const state = reactive({ enableSortable: true });
        class List extends Component {
            setup() {
                this.state = useState(state);
                useSortable({
                    ref: useRef("root"),
                    elements: ".item",
                    enable: () => this.state.enableSortable,
                    onDragStart() {
                        assert.step("start");
                    },
                });
            }
        }

        List.template = xml`
            <div t-ref="root" class="root">
                <ul class="list">
                    <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" t-esc="i" class="item" />
                </ul>
            </div>`;

        await mount(List, target);

        assert.verifySteps([]);

        // First item before last item
        await dragAndDrop(".item:first-child", ".item:last-child");

        // Drag should have occurred
        assert.verifySteps(["start"]);

        state.enableSortable = false;
        await nextTick();

        // First item before last item
        await dragAndDrop(".item:first-child", ".item:last-child");

        // Drag shouldn't have occurred
        assert.verifySteps([]);
    });

    QUnit.test(
        "Drag has a default tolerance of 10 pixels before initiating the dragging",
        async (assert) => {
            assert.expect(3);

<<<<<<< HEAD:addons/web/static/tests/core/utils/ui_tests.js
        class List extends Component {
            setup() {
                useSortable({
                    ref: useRef("root"),
                    elements: ".item",
                    onDragStart() {
                        throw new Error("Shouldn't start the sortable feature.");
                    },
                });
=======
            class List extends Component {
                setup() {
                    useSortable({
                        ref: useRef("root"),
                        elements: ".item",
                        onDragStart() {
                            assert.step("Initiation of the drag sequence");
                        },
                    });
                }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6:addons/web/static/tests/core/utils/sortable_tests.js
            }

            List.template = xml`
            <div t-ref="root" class="root">
                <ul class="list">
                    <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" t-esc="i" class="item" />
                </ul>
            </div>`;

            await mount(List, target);

            // Move the element from only 5 pixels
            const listItem = target.querySelector(".item:first-child");
            await dragAndDrop(listItem, listItem, { x: listItem.getBoundingClientRect().width/2, y: listItem.getBoundingClientRect().height/2 + 5 });
            assert.verifySteps([], "No drag sequence should have been initiated");

            // Move the element from more than 10 pixels
            await dragAndDrop(".item:first-child", ".item:first-child", { x: listItem.getBoundingClientRect().width/2 + 10, y: listItem.getBoundingClientRect().height/2 + 10 });
            assert.verifySteps(
                ["Initiation of the drag sequence"],
                "A drag sequence should have been initiated"
            );
        }
    );

    QUnit.test(
        "Drag has a default tolerance of 10 pixels before initiating the dragging",
        async (assert) => {
            assert.expect(3);

            class List extends Component {
                setup() {
                    useSortable({
                        ref: useRef("root"),
                        elements: ".item",
                        onDragStart() {
                            assert.step("Initation of the drag sequence");
                        },
                    });
                }
            }

            List.template = xml`
            <div t-ref="root" class="root">
                <ul class="list">
                    <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" t-esc="i" class="item" />
                </ul>
            </div>`;

            await mount(List, target);

            // Move the element from only 5 pixels
            await dragAndDrop(".item:first-child", ".item:first-child", { x: 5, y: 5 });
            assert.verifySteps([], "No drag sequence should have been initiated");

            // Move the element from more than 10 pixels
            await dragAndDrop(".item:first-child", ".item:first-child", { x: 10, y: 10 });
            assert.verifySteps(
                ["Initation of the drag sequence"],
                "A drag sequence should have been initiated"
            );
        }
    );

    QUnit.test("Ignore specified elements", async (assert) => {
        assert.expect(6);

        class List extends Component {
            setup() {
                useSortable({
                    ref: useRef("root"),
                    elements: ".item",
                    ignore: ".ignored",
                    onDragStart() {
                        assert.step("drag");
                    },
                });
            }
        }

        List.template = xml`
            <div t-ref="root" class="root">
                <ul class="list">
                    <li t-foreach="[1, 2, 3]" t-as="i" t-key="i" class="item">
                        <span class="ignored" t-esc="i" />
                        <span class="not-ignored" t-esc="i" />
                    </li>
                </ul>
            </div>`;

        await mount(List, target);

        assert.verifySteps([]);

        // Drag root item element
        await dragAndDrop(".item:first-child", ".item:nth-child(2)");

        assert.verifySteps(["drag"]);

        // Drag ignored element
        await dragAndDrop(".item:first-child .not-ignored", ".item:nth-child(2)");

        assert.verifySteps(["drag"]);

        // Drag non-ignored element
        await dragAndDrop(".item:first-child .ignored", ".item:nth-child(2)");

        assert.verifySteps([]);
    });
});
