/** @odoo-module **/

import { afterNextRender, start, startServer } from "@mail/../tests/helpers/test_utils";

import { makeFakeNotificationService } from "@web/../tests/helpers/mock_services";

import { Many2OneAvatarEmployee } from "@hr/js/m2x_avatar_employee";
import { dom } from "web.test_utils";

QUnit.module("M2XAvatarEmployee", {
    beforeEach() {
        Many2OneAvatarEmployee.prototype.partnerIds = {};
    },
});

QUnit.test("many2one_avatar_employee widget in list view", async function (assert) {
    const pyEnv = await startServer();
    const [partnerId_1, partnerId_2] = pyEnv["res.partner"].create([
        { display_name: "Mario" },
        { display_name: "Luigi" },
    ]);
    const [userId_1, userId_2] = pyEnv["res.users"].create([
        { partner_id: partnerId_1 },
        { partner_id: partnerId_2 },
    ]);
    const [employeeId_1, employeeId_2] = pyEnv["hr.employee.public"].create([
        { name: "Mario", user_id: userId_1, user_partner_id: partnerId_1 },
        { name: "Luigi", user_id: userId_2, user_partner_id: partnerId_2 },
    ]);
    pyEnv["m2x.avatar.employee"].create([
        {
            employee_id: employeeId_1,
            employee_ids: [employeeId_1, employeeId_2],
        },
        { employee_id: employeeId_2 },
        { employee_id: employeeId_1 },
    ]);
    const views = {
        "m2x.avatar.employee,false,list":
            '<tree><field name="employee_id" widget="many2one_avatar_employee"/></tree>',
    };
    const { openView } = await start({
        mockRPC(route, args) {
            if (args.method === "read") {
                assert.step(`read ${args.model} ${args.args[0]}`);
            }
        },
        serverData: { views },
    });
    await openView({
        res_model: "m2x.avatar.employee",
        views: [[false, "list"]],
    });
    assert.strictEqual(
        document.querySelector(".o_data_cell span:not(.o_m2o_avatar) span").innerText,
        "Mario"
    );
    assert.strictEqual(
        document.querySelectorAll(".o_data_cell span:not(.o_m2o_avatar) span")[1].innerText,
        "Luigi"
    );
    assert.strictEqual(
        document.querySelectorAll(".o_data_cell span:not(.o_m2o_avatar) span")[2].innerText,
        "Mario"
    );

    // click on first employee
    await afterNextRender(() =>
        dom.click(document.querySelector(".o_data_cell .o_m2o_avatar > img"))
    );
    assert.verifySteps([`read hr.employee.public ${employeeId_1}`]);
    assert.containsOnce(document.body, ".o-mail-ChatWindow-name");
    assert.strictEqual(document.querySelector(".o-mail-ChatWindow-name").textContent, "Mario");

    // click on second employee
    await afterNextRender(() =>
        dom.click(document.querySelectorAll(".o_data_cell .o_m2o_avatar > img")[1])
    );
    assert.verifySteps([`read hr.employee.public ${employeeId_2}`]);
    assert.containsN(document.body, ".o-mail-ChatWindow-name", 2);
    assert.strictEqual(
        document.querySelectorAll(".o-mail-ChatWindow-name")[1].textContent,
        "Luigi"
    );

    // click on third employee (same as first)
    await afterNextRender(() =>
        dom.click(document.querySelectorAll(".o_data_cell .o_m2o_avatar > img")[2])
    );
    assert.verifySteps(
        [],
        "employee should not have been read again because we already know its partner"
    );
    assert.containsN(
        document.body,
        ".o-mail-ChatWindow-name",
        2,
        "should still have only 2 chat windows because third is the same partner as first"
    );
});

QUnit.test("many2one_avatar_employee widget in kanban view", async function (assert) {
    const pyEnv = await startServer();
    const partnerId = pyEnv["res.partner"].create({});
    const userId = pyEnv["res.users"].create({ partner_id: partnerId });
    const employeeId = pyEnv["hr.employee.public"].create({
        user_id: userId,
        user_partner_id: partnerId,
    });
    pyEnv["m2x.avatar.employee"].create({
        employee_id: employeeId,
        employee_ids: [employeeId],
    });
    const views = {
        "m2x.avatar.employee,false,kanban": `<kanban>
                <templates>
                    <t t-name="kanban-box">
                        <div>
                            <field name="employee_id" widget="many2one_avatar_employee"/>
                        </div>
                    </t>
                </templates>
            </kanban>`,
    };
    const { openView } = await start({ serverData: { views } });
    await openView({
        res_model: "m2x.avatar.employee",
        views: [[false, "kanban"]],
    });
    assert.strictEqual(document.querySelector(".o_kanban_record").innerText.trim(), "");
    assert.containsOnce(document.body, ".o_m2o_avatar");
    assert.strictEqual(
        document.querySelector(".o_m2o_avatar > img").getAttribute("data-src"),
        `/web/image/hr.employee.public/${employeeId}/avatar_128`
    );
});

QUnit.test(
    "many2one_avatar_employee: click on an employee not associated with a user",
    async function (assert) {
        const pyEnv = await startServer();
        const employeeId = pyEnv["hr.employee.public"].create({ name: "Mario" });
        const avatarId = pyEnv["m2x.avatar.employee"].create({ employee_id: employeeId });
        const views = {
            "m2x.avatar.employee,false,form":
                '<form><field name="employee_id" widget="many2one_avatar_employee"/></form>',
        };
        const { openView } = await start({
            mockRPC(route, args) {
<<<<<<< HEAD
                if (args.method === 'read') {
                    assert.step(`read ${args.model} ${args.args[0]}`);
                }
            },
            serverData: { views },
        });
        await openView({
            res_model: 'm2x.avatar.employee',
            views: [[false, 'list']],
        });

        assert.strictEqual(document.querySelector('.o_data_cell span:not(.o_m2o_avatar) span').innerText, 'Mario');
        assert.strictEqual(document.querySelectorAll('.o_data_cell span:not(.o_m2o_avatar) span')[1].innerText, 'Luigi');
        assert.strictEqual(document.querySelectorAll('.o_data_cell span:not(.o_m2o_avatar) span')[2].innerText, 'Mario');

        // click on first employee
        await afterNextRender(() =>
            dom.click(document.querySelector('.o_data_cell .o_m2o_avatar > img'))
        );
        assert.verifySteps(
            [`read hr.employee.public ${hrEmployeePublicId1}`],
            "first employee should have been read to find its partner"
        );
        assert.containsOnce(
            document.body,
            '.o_ChatWindowHeader_name',
            'should have opened chat window'
        );
        assert.strictEqual(
            document.querySelector('.o_ChatWindowHeader_name').textContent,
            "Mario",
            'chat window should be with clicked employee'
        );

        // click on second employee
        await afterNextRender(() =>
            dom.click(document.querySelectorAll('.o_data_cell .o_m2o_avatar > img')[1]
        ));
        assert.verifySteps(
            [`read hr.employee.public ${hrEmployeePublicId2}`],
            "second employee should have been read to find its partner"
        );
        assert.containsN(
            document.body,
            '.o_ChatWindowHeader_name',
            2,
            'should have opened second chat window'
        );
        assert.strictEqual(
            document.querySelectorAll('.o_ChatWindowHeader_name')[1].textContent,
            "Luigi",
            'chat window should be with clicked employee'
        );

        // click on third employee (same as first)
        await afterNextRender(() =>
            dom.click(document.querySelectorAll('.o_data_cell .o_m2o_avatar > img')[2])
        );
        assert.verifySteps(
            [],
            "employee should not have been read again because we already know its partner"
        );
        assert.containsN(
            document.body,
            '.o_ChatWindowHeader_name',
            2,
            "should still have only 2 chat windows because third is the same partner as first"
        );
    });

    QUnit.test('many2one_avatar_employee widget in kanban view', async function (assert) {
        assert.expect(3);

        const pyEnv = await startServer();
        const resPartnerId1 = pyEnv['res.partner'].create({});
        const resUsersId1 = pyEnv['res.users'].create({ partner_id: resPartnerId1 });
        const hrEmployeePublicId1 = pyEnv['hr.employee.public'].create({ user_id: resUsersId1, user_partner_id: resPartnerId1 });
        pyEnv['m2x.avatar.employee'].create({ employee_id: hrEmployeePublicId1, employee_ids: [hrEmployeePublicId1] });
        const views = {
            'm2x.avatar.employee,false,kanban':
                `<kanban>
                    <templates>
                        <t t-name="kanban-box">
                            <div>
                                <field name="employee_id" widget="many2one_avatar_employee"/>
                            </div>
                        </t>
                    </templates>
                </kanban>`,
        };
        const { openView } = await start({
            serverData: { views },
        });
        await openView({
            res_model: 'm2x.avatar.employee',
            views: [[false, 'kanban']],
        });

        assert.strictEqual(document.querySelector('.o_kanban_record').innerText.trim(), '');
        assert.containsOnce(document.body, '.o_m2o_avatar');
        assert.strictEqual(document.querySelector('.o_m2o_avatar > img').getAttribute('data-src'), `/web/image/hr.employee.public/${hrEmployeePublicId1}/avatar_128`);
    });

    QUnit.test('many2one_avatar_employee: click on an employee not associated with a user', async function (assert) {
        assert.expect(6);

        const pyEnv = await startServer();
        const hrEmployeePublicId1 = pyEnv['hr.employee.public'].create({ name: 'Mario' });
        const m2xHrAvatarUserId1 = pyEnv['m2x.avatar.employee'].create({ employee_id: hrEmployeePublicId1 });
        const views = {
            'm2x.avatar.employee,false,form': '<form><field name="employee_id" widget="many2one_avatar_employee"/></form>',
        };
        const { openView } = await start({
            mockRPC(route, args) {
                if (args.method === 'read') {
=======
                if (args.method === "read") {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    assert.step(`read ${args.model} ${args.args[0]}`);
                }
            },
            serverData: { views },
            services: {
                notification: makeFakeNotificationService((message) => {
                    assert.step("notification");
                    assert.strictEqual(
                        message,
                        "You can only chat with employees that have a dedicated user."
                    );
                }),
            },
        });
        await openView({
            res_model: "m2x.avatar.employee",
            res_id: avatarId,
            views: [[false, "form"]],
        });
<<<<<<< HEAD
        assert.strictEqual(document.querySelector('.o_field_widget[name=employee_id] input').value.trim(), 'Mario');

        await dom.click(document.querySelector('.o_m2o_avatar > img'));

        assert.verifySteps([
            `read m2x.avatar.employee ${m2xHrAvatarUserId1}`,
            `read hr.employee.public ${hrEmployeePublicId1}`,
        ]);
    });

    QUnit.test('many2many_avatar_employee widget in form view', async function (assert) {
        assert.expect(8);

        const pyEnv = await startServer();
        const [resPartnerId1, resPartnerId2] = pyEnv['res.partner'].create([{}, {}]);
        const [resUsersId1, resUsersId2] = pyEnv['res.users'].create([{}, {}]);
        const [hrEmployeePublicId1, hrEmployeePublicId2] = pyEnv['hr.employee.public'].create([
            { user_id: resUsersId1, user_partner_id: resPartnerId1 },
            { user_id: resUsersId2, user_partner_id: resPartnerId2 },
        ]);
        const m2xAvatarEmployeeId1 = pyEnv['m2x.avatar.employee'].create(
            { employee_ids: [hrEmployeePublicId1, hrEmployeePublicId2] },
        );
        const views = {
            'm2x.avatar.employee,false,form': '<form><field name="employee_ids" widget="many2many_avatar_employee"/></form>',
        };
        const { openView } = await start({
            mockRPC(route, args) {
                if (args.method === 'read') {
                    assert.step(`read ${args.model} ${args.args[0]}`);
                }
            },
            serverData: { views },
        });

        await openView({
            res_model: 'm2x.avatar.employee',
            res_id: m2xAvatarEmployeeId1,
            views: [[false, 'form']],
        });
        assert.containsN(document.body, '.o_field_many2many_avatar_employee .badge', 2,
            "should have 2 records");
        assert.strictEqual(document.querySelector('.o_field_many2many_avatar_employee .badge img').getAttribute('data-src'),
            `/web/image/hr.employee.public/${hrEmployeePublicId1}/avatar_128`,
            "should have correct avatar image");

        await dom.click(document.querySelector('.o_field_many2many_avatar_employee .badge .o_m2m_avatar'));
        await dom.click(document.querySelectorAll('.o_field_many2many_avatar_employee .badge .o_m2m_avatar')[1]);

        assert.verifySteps([
            `read m2x.avatar.employee ${m2xAvatarEmployeeId1}`,
            `read hr.employee.public ${hrEmployeePublicId1},${hrEmployeePublicId2}`,
            `read hr.employee.public ${hrEmployeePublicId1}`,
            `read hr.employee.public ${hrEmployeePublicId2}`,
        ]);

        assert.containsN(
            document.body,
            '.o_ChatWindowHeader_name',
            2,
            "should have 2 chat windows"
        );
    });

    QUnit.test('many2many_avatar_employee widget in list view', async function (assert) {
        assert.expect(10);

        const pyEnv = await startServer();
        const [resPartnerId1, resPartnerId2] = pyEnv['res.partner'].create([
            { name: "Mario" },
            { name: "Yoshi" },
        ]);
        const [resUsersId1, resUsersId2] = pyEnv['res.users'].create([{}, {}]);
        const [hrEmployeePublicId1, hrEmployeePublicId2] = pyEnv['hr.employee.public'].create([
            { user_id: resUsersId1, user_partner_id: resPartnerId1 },
            { user_id: resUsersId2, user_partner_id: resPartnerId2 },
        ]);
        pyEnv['m2x.avatar.employee'].create(
            { employee_ids: [hrEmployeePublicId1, hrEmployeePublicId2] },
        );
        const views = {
            'm2x.avatar.employee,false,list': '<tree><field name="employee_ids" widget="many2many_avatar_employee"/></tree>',
        };
        const { openView } = await start({
            mockRPC(route, args) {
                if (args.method === 'read') {
                    assert.step(`read ${args.model} ${args.args[0]}`);
                }
            },
            serverData: { views },
        });

        await openView({
            res_model: 'm2x.avatar.employee',
            views: [[false, 'list']],
        });
        assert.containsN(document.body, '.o_data_cell:first .o_field_many2many_avatar_employee > div > span', 2,
            "should have two avatar");

        // click on first employee badge
        await afterNextRender(() =>
            dom.click(document.querySelector('.o_data_cell .o_m2m_avatar'))
        );
        assert.verifySteps(
            [`read hr.employee.public ${hrEmployeePublicId1},${hrEmployeePublicId2}`, `read hr.employee.public ${hrEmployeePublicId1}`],
            "first employee should have been read to find its partner"
        );
        assert.containsOnce(
            document.body,
            '.o_ChatWindowHeader_name',
            'should have opened chat window'
        );
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        assert.strictEqual(
            document.querySelector(".o_field_widget[name=employee_id] input").value.trim(),
            "Mario"
        );

        await dom.click(document.querySelector(".o_m2o_avatar > img"));
        assert.verifySteps([
            `read m2x.avatar.employee ${avatarId}`,
            `read hr.employee.public ${employeeId}`,
            "notification",
        ]);
    }
);

QUnit.test("many2many_avatar_employee widget in form view", async function (assert) {
    const pyEnv = await startServer();
    const [partnerId_1, partnerId_2] = pyEnv["res.partner"].create([{}, {}]);
    const [userId_1, userId_2] = pyEnv["res.users"].create([
        { partner_id: partnerId_1 },
        { partner_id: partnerId_2 },
    ]);
    const [employeeId_1, employeeId_2] = pyEnv["hr.employee.public"].create([
        { user_id: userId_1, user_partner_id: partnerId_1 },
        { user_id: userId_2, user_partner_id: partnerId_2 },
    ]);
    const avatarId_1 = pyEnv["m2x.avatar.employee"].create({
        employee_ids: [employeeId_1, employeeId_2],
    });
    const views = {
        "m2x.avatar.employee,false,form":
            '<form><field name="employee_ids" widget="many2many_avatar_employee"/></form>',
    };
    const { openView } = await start({
        mockRPC(route, args) {
            if (args.method === "read") {
                assert.step(`read ${args.model} ${args.args[0]}`);
            }
        },
        serverData: { views },
    });
    await openView({
        res_model: "m2x.avatar.employee",
        res_id: avatarId_1,
        views: [[false, "form"]],
    });
    assert.containsN(
        document.body,
        ".o_field_many2many_avatar_employee .badge",
        2,
        "should have 2 records"
    );
    assert.strictEqual(
        document
            .querySelector(".o_field_many2many_avatar_employee .badge img")
            .getAttribute("data-src"),
        `/web/image/hr.employee.public/${employeeId_1}/avatar_128`
    );

    await dom.click(
        document.querySelector(".o_field_many2many_avatar_employee .badge .o_m2m_avatar")
    );
    await dom.click(
        document.querySelectorAll(".o_field_many2many_avatar_employee .badge .o_m2m_avatar")[1]
    );
    assert.verifySteps([
        `read m2x.avatar.employee ${avatarId_1}`,
        `read hr.employee.public ${employeeId_1},${employeeId_2}`,
        `read hr.employee.public ${employeeId_1}`,
        `read hr.employee.public ${employeeId_2}`,
    ]);
    assert.containsN(document.body, ".o-mail-ChatWindow-name", 2);
});

QUnit.test("many2many_avatar_employee widget in list view", async function (assert) {
    const pyEnv = await startServer();
    const [partnerId_1, partnerId_2] = pyEnv["res.partner"].create([
        { name: "Mario" },
        { name: "Yoshi" },
    ]);
    const [userId_1, userId_2] = pyEnv["res.users"].create([
        { partner_id: partnerId_1 },
        { partner_id: partnerId_2 },
    ]);
    const [employeeId_1, employeeId_2] = pyEnv["hr.employee.public"].create([
        { user_id: userId_1, user_partner_id: partnerId_1 },
        { user_id: userId_2, user_partner_id: partnerId_2 },
    ]);
    pyEnv["m2x.avatar.employee"].create({
        employee_ids: [employeeId_1, employeeId_2],
    });
    const views = {
        "m2x.avatar.employee,false,list":
            '<tree><field name="employee_ids" widget="many2many_avatar_employee"/></tree>',
    };
    const { openView } = await start({
        mockRPC(route, args) {
            if (args.method === "read") {
                assert.step(`read ${args.model} ${args.args[0]}`);
            }
        },
        serverData: { views },
    });
    await openView({
        res_model: "m2x.avatar.employee",
        views: [[false, "list"]],
    });
    assert.containsN(
        document.body,
        ".o_data_cell:first .o_field_many2many_avatar_employee > div > span",
        2,
        "should have two avatar"
    );

    // click on first employee badge
    await afterNextRender(() => dom.click(document.querySelector(".o_data_cell .o_m2m_avatar")));
    assert.verifySteps([
        `read hr.employee.public ${employeeId_1},${employeeId_2}`,
        `read hr.employee.public ${employeeId_1}`,
    ]);
    assert.containsOnce(document.body, ".o-mail-ChatWindow-name");
    assert.strictEqual(document.querySelector(".o-mail-ChatWindow-name").textContent, "Mario");

    // click on second employee
    await afterNextRender(() =>
        dom.click(document.querySelectorAll(".o_data_cell .o_m2m_avatar")[1])
    );
    assert.verifySteps([`read hr.employee.public ${employeeId_2}`]);
    assert.containsN(document.body, ".o-mail-ChatWindow-name", 2);
    assert.strictEqual(
        document.querySelectorAll(".o-mail-ChatWindow-name")[1].textContent,
        "Yoshi"
    );
});

QUnit.test("many2many_avatar_employee widget in kanban view", async function (assert) {
    const pyEnv = await startServer();
    const [partnerId_1, partnerId_2] = pyEnv["res.partner"].create([{}, {}]);
    const [userId_1, userId_2] = pyEnv["res.users"].create([
        { partner_id: partnerId_1 },
        { partner_id: partnerId_2 },
    ]);
    const [employeeId_1, employeeId_2] = pyEnv["hr.employee.public"].create([
        { user_id: userId_1, user_partner_id: partnerId_1 },
        { user_id: userId_2, user_partner_id: partnerId_2 },
    ]);
    pyEnv["m2x.avatar.employee"].create({
        employee_ids: [employeeId_1, employeeId_2],
    });
    const views = {
        "m2x.avatar.employee,false,kanban": `<kanban>
                <templates>
                    <t t-name="kanban-box">
                        <div>
                            <div class="oe_kanban_footer">
                                <div class="o_kanban_record_bottom">
                                    <div class="oe_kanban_bottom_right">
                                        <field name="employee_ids" widget="many2many_avatar_employee"/>
                                    </div>
                                </div>
                            </div>
<<<<<<< HEAD
                        </t>
                    </templates>
                </kanban>`,
        };
        const { openView } = await start({
            mockRPC(route, args) {
                if (args.method === 'read') {
                    assert.step(`read ${args.model} ${args.args[0]}`);
                }
            },
            serverData: { views },
        });

        await openView({
            res_model: 'm2x.avatar.employee',
            views: [[false, 'kanban']],
        });
        assert.containsN(document.body, '.o_kanban_record:first .o_field_many2many_avatar_employee img.o_m2m_avatar', 2,
            "should have 2 avatar images");
        assert.strictEqual(document.querySelector('.o_kanban_record .o_field_many2many_avatar_employee img.o_m2m_avatar').getAttribute('data-src'),
            `/web/image/hr.employee.public/${hrEmployeePublicId1}/avatar_128`,
            "should have correct avatar image");
        assert.strictEqual(document.querySelectorAll('.o_kanban_record .o_field_many2many_avatar_employee img.o_m2m_avatar')[1].getAttribute('data-src'),
            `/web/image/hr.employee.public/${hrEmployeePublicId2}/avatar_128`,
            "should have correct avatar image");

        await dom.click(document.querySelector('.o_kanban_record .o_m2m_avatar'));
        await dom.click(document.querySelectorAll('.o_kanban_record .o_m2m_avatar')[1]);

        assert.verifySteps([
            `read hr.employee.public ${hrEmployeePublicId1},${hrEmployeePublicId2}`,
            `read hr.employee.public ${hrEmployeePublicId1}`,
            `read hr.employee.public ${hrEmployeePublicId2}`
        ]);
=======
                        </div>
                    </t>
                </templates>
            </kanban>`,
    };
    const { openView } = await start({
        mockRPC(route, args) {
            if (args.method === "read") {
                assert.step(`read ${args.model} ${args.args[0]}`);
            }
        },
        serverData: { views },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    });
    await openView({
        res_model: "m2x.avatar.employee",
        views: [[false, "kanban"]],
    });
    assert.containsN(
        document.body,
        ".o_kanban_record:first .o_field_many2many_avatar_employee img.o_m2m_avatar",
        3,
        "should have 2 avatar images and the default empty avatar"
    );
    assert.strictEqual(
        document
            .querySelector(".o_kanban_record .o_field_many2many_avatar_employee img.o_m2m_avatar")
            .getAttribute("data-src"),
        `/web/image/hr.employee.public/${employeeId_1}/avatar_128`
    );
    assert.strictEqual(
        document
            .querySelectorAll(
                ".o_kanban_record .o_field_many2many_avatar_employee img.o_m2m_avatar"
            )[1]
            .getAttribute("data-src"),
        `/web/image/hr.employee.public/${employeeId_2}/avatar_128`
    );

    await dom.click(document.querySelector(".o_kanban_record .o_m2m_avatar"));
    await dom.click(document.querySelectorAll(".o_kanban_record .o_m2m_avatar")[1]);
    assert.verifySteps([
        `read hr.employee.public ${employeeId_1},${employeeId_2}`,
        `read hr.employee.public ${employeeId_1}`,
        `read hr.employee.public ${employeeId_2}`,
    ]);
});

QUnit.test(
    "many2many_avatar_employee: click on an employee not associated with a user",
    async function (assert) {
        const pyEnv = await startServer();
        const partnerId = pyEnv["res.partner"].create({});
        const userId = pyEnv["res.users"].create({ partner_id: partnerId });
        const [employeeId_1, employeeId_2] = pyEnv["hr.employee.public"].create([
            {},
            { user_id: userId, user_partner_id: partnerId },
        ]);
        const avatarId = pyEnv["m2x.avatar.employee"].create({
            employee_ids: [employeeId_1, employeeId_2],
        });
        const views = {
            "m2x.avatar.employee,false,form":
                '<form><field name="employee_ids" widget="many2many_avatar_employee"/></form>',
        };
        const { openView } = await start({
            mockRPC(route, args) {
                if (args.method === "read") {
                    assert.step(`read ${args.model} ${args.args[0]}`);
                }
            },
            serverData: { views },
            services: {
                notification: makeFakeNotificationService((message) => {
                    assert.step("notification");
                    assert.strictEqual(
                        message,
                        "You can only chat with employees that have a dedicated user."
                    );
                }),
            },
        });
        await openView({
            res_model: "m2x.avatar.employee",
            res_id: avatarId,
            views: [[false, "form"]],
        });
        assert.containsN(document.body, ".o_field_many2many_avatar_employee .badge", 2);
        assert.strictEqual(
            document
                .querySelector(".o_field_many2many_avatar_employee .badge img")
                .getAttribute("data-src"),
            `/web/image/hr.employee.public/${employeeId_1}/avatar_128`
        );

<<<<<<< HEAD
        assert.containsN(document.body, '.o_field_many2many_avatar_employee .badge', 2,
            "should have 2 records");
        assert.strictEqual(document.querySelector('.o_field_many2many_avatar_employee .badge img').getAttribute('data-src'),
            `/web/image/hr.employee.public/${hrEmployeePublicId1}/avatar_128`,
            "should have correct avatar image");

        await dom.click(document.querySelector('.o_field_many2many_avatar_employee .badge .o_m2m_avatar'));
        await dom.click(document.querySelectorAll('.o_field_many2many_avatar_employee .badge .o_m2m_avatar')[1]);

=======
        await dom.click(
            document.querySelector(".o_field_many2many_avatar_employee .badge .o_m2m_avatar")
        );
        await dom.click(
            document.querySelectorAll(".o_field_many2many_avatar_employee .badge .o_m2m_avatar")[1]
        );
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        assert.verifySteps([
            `read m2x.avatar.employee ${employeeId_1}`,
            `read hr.employee.public ${employeeId_1},${employeeId_2}`,
            `read hr.employee.public ${employeeId_1}`,
            "notification",
            `read hr.employee.public ${employeeId_2}`,
        ]);

        assert.containsOnce(document.body, ".o-mail-ChatWindow-name");
    }
);
