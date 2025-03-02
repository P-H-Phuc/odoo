# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details

from odoo import Command

from odoo.tests.common import TransactionCase, new_test_user


class TestNestedTaskUpdate(TransactionCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.partner = cls.env['res.partner'].create({'name': "Mur en béton"})
        sale_order = cls.env['sale.order'].with_context(tracking_disable=True).create({
            'partner_id': cls.partner.id,
            'partner_invoice_id': cls.partner.id,
            'partner_shipping_id': cls.partner.id,
        })
        product = cls.env['product.product'].create({
            'name': "Prepaid Consulting",
            'type': 'service',
            'service_tracking': 'project_only',
        })
        cls.order_line = cls.env['sale.order.line'].create({
            'name': "Order line",
            'product_id': product.id,
            'order_id': sale_order.id,
        })
        sale_order.action_confirm()

        cls.project = cls.order_line.project_id
        cls.project.sale_line_id = False
        cls.user = new_test_user(cls.env, login='mla')

    #----------------------------------
    #
    # When creating tasks that have a parent_id, they pick some values from  their parent
    #
    #----------------------------------

    def test_default_values_creating_subtask(self):
        parent = self.env['project.task'].create({'name': 'parent', 'user_ids': [Command.link(self.user.id)], 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id})
        self.assertTrue(parent.allow_billable, "The parent task should be billable as the project linked is billable")
        self.assertEqual(parent.partner_id, self.project.partner_id, "The partner set on the parent task should the one set on the project linked")
        self.assertFalse(child.project_id, "The project set on the subtask should be False by default")
        self.assertFalse(child.allow_billable, "The subtask should not be billable as it is parent task since no project is set")
        self.assertEqual(child.partner_id, parent.partner_id, "The partner set on the subtask should be the one of its parent task")

    def test_creating_subtask_user_id_on_parent_dont_go_on_child(self):
        parent = self.env['project.task'].create({'name': 'parent', 'user_ids': [(4, self.user.id)]})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id, 'user_ids': False})
        self.assertFalse(child.user_ids)

    def test_creating_subtask_partner_id_on_parent_goes_on_child(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.user.partner_id.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id})
        child._compute_partner_id()  # the compute will be triggered since the user set the parent_id.
        self.assertEqual(child.partner_id, self.user.partner_id)

        # Another case, it is the parent as a default value
        child = self.env['project.task'].with_context(default_parent_id=parent.id).create({'name': 'child'})
        self.assertEqual(child.partner_id, self.user.partner_id)

    def test_creating_subtask_sale_line_id_on_parent_goes_on_child_if_same_partner_in_values(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': self.partner.id, 'parent_id': parent.id, 'project_id': self.project.id})
        self.assertEqual(child.sale_line_id, parent.sale_line_id)
        parent.write({'sale_line_id': False})
        self.assertEqual(child.sale_line_id, self.order_line)

    def test_creating_subtask_sale_line_id_on_parent_goes_on_child_with_partner_if_not_in_values(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id, 'project_id': self.project.id})
        self.assertEqual(child.partner_id, parent.partner_id)
        self.assertEqual(child.sale_line_id, parent.sale_line_id)

    def test_creating_subtask_sale_line_id_on_parent_dont_go_on_child_if_other_partner(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': self.user.partner_id.id, 'parent_id': parent.id, 'project_id': self.project.id})
        self.assertFalse(child.sale_line_id)
        self.assertNotEqual(child.partner_id, parent.partner_id)

    def test_creating_subtask_sale_line_id_on_parent_go_on_child_if_same_commercial_partner(self):
        commercial_partner = self.env['res.partner'].create({'name': "Jémémy"})
        self.partner.parent_id = commercial_partner
        self.user.partner_id.parent_id = commercial_partner
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': self.user.partner_id.id, 'parent_id': parent.id, 'project_id': self.project.id})
        self.assertEqual(child.sale_line_id, self.order_line, "Sale order line on parent should be transfered to child")
        self.assertNotEqual(child.partner_id, parent.partner_id)

    #----------------------------------------
    #
    #   When writing on a parent task, some values adapt on their children
    #
    #----------------------------------------

    def test_write_user_id_on_parent_dont_write_on_child(self):
        parent = self.env['project.task'].create({'name': 'parent', 'user_ids': False})
        child = self.env['project.task'].create({'name': 'child', 'user_ids': False, 'parent_id': parent.id})
        self.assertFalse(child.user_ids)
        parent.write({'user_ids': [(4, self.user.id)]})
        self.assertFalse(child.user_ids)
        parent.write({'user_ids': False})
        self.assertFalse(child.user_ids)

    def test_write_partner_id_on_parent_write_on_child(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': False})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': False, 'parent_id': parent.id})
        self.assertFalse(child.partner_id)
        parent.write({'partner_id': self.user.partner_id.id})
        self.assertNotEqual(child.partner_id, parent.partner_id)
        parent.write({'partner_id': False})
        self.assertNotEqual(child.partner_id, self.user.partner_id)

    def test_write_sale_line_id_on_parent_write_on_child_if_same_partner(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id, 'partner_id': self.partner.id, 'project_id': self.project.id})
        self.assertFalse(child.sale_line_id)
        parent.write({'sale_line_id': self.order_line.id})
        self.assertEqual(child.sale_line_id, parent.sale_line_id)
        parent.write({'sale_line_id': False})
        self.assertEqual(child.sale_line_id, self.order_line)

    def test_write_sale_line_id_on_parent_write_on_child_with_partner_if_not_set(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id, 'project_id': self.project.id})
        child._compute_partner_id()
        self.assertFalse(child.sale_line_id)
        parent.write({'sale_line_id': self.order_line.id})
        self.assertEqual(child.sale_line_id, parent.sale_line_id)
        self.assertEqual(child.partner_id, self.partner)
        parent.write({'sale_line_id': False})
        self.assertEqual(child.sale_line_id, self.order_line)

    def test_write_sale_line_id_on_parent_dont_write_on_child_if_other_partner(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'parent_id': parent.id, 'partner_id': self.user.partner_id.id})
        self.assertFalse(child.sale_line_id)
        parent.write({'sale_line_id': self.order_line.id})
        self.assertFalse(child.sale_line_id)

    #----------------------------------
    #
    #   When linking two existent task, some values go on the child
    #
    #----------------------------------

    def test_linking_user_id_on_parent_dont_write_on_child(self):
        parent = self.env['project.task'].create({'name': 'parent', 'user_ids': [(4, self.user.id)]})
        child = self.env['project.task'].create({'name': 'child', 'user_ids': False})
        self.assertFalse(child.user_ids)
        child.write({'parent_id': parent.id})
        self.assertFalse(child.user_ids)

    def test_linking_partner_id_on_parent_write_on_child(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.user.partner_id.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': False})
        self.assertFalse(child.partner_id)
        child.write({'parent_id': parent.id})
        self.assertEqual(child.partner_id, self.user.partner_id)

    def test_linking_sale_line_id_on_parent_write_on_child_if_same_partner(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': self.partner.id, 'project_id': self.project.id})
        self.assertFalse(child.sale_line_id)
        child.write({'parent_id': parent.id})
        self.assertEqual(child.sale_line_id, parent.sale_line_id)
        parent.write({'sale_line_id': False})
        self.assertEqual(child.sale_line_id, self.order_line)

    def test_linking_sale_line_id_on_parent_write_on_child_with_partner_if_not_set(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': False, 'project_id': self.project.id})
        self.assertFalse(child.sale_line_id)
        self.assertFalse(child.partner_id)
        child.write({'parent_id': parent.id})
        self.assertEqual(child.partner_id, parent.partner_id)
        self.assertEqual(child.sale_line_id, parent.sale_line_id)

    def test_linking_sale_line_id_on_parent_write_dont_child_if_other_partner(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'project_id': self.project.id})
        child = self.env['project.task'].create({'name': 'child', 'partner_id': self.user.partner_id.id, 'project_id': self.project.id})
        self.assertFalse(child.sale_line_id)
        self.assertNotEqual(child.partner_id, parent.partner_id)
        child.write({'parent_id': parent.id})
        self.assertFalse(child.sale_line_id)

    def test_writing_on_parent_with_multiple_tasks(self):
        parent = self.env['project.task'].create({'name': 'parent', 'user_ids': False, 'partner_id': self.partner.id, 'project_id': self.project.id})
        children_values = [{'name': 'child%s' % i, 'user_ids': False, 'parent_id': parent.id, 'project_id': self.project.id} for i in range(5)]
        children = self.env['project.task'].create(children_values)
        children._compute_partner_id()
        # test writing sale_line_id
        for child in children:
            self.assertFalse(child.sale_line_id)
        parent.write({'sale_line_id': self.order_line.id})
        for child in children:
            self.assertEqual(child.sale_line_id, self.order_line)

    def test_linking_on_parent_with_multiple_tasks(self):
        parent = self.env['project.task'].create({'name': 'parent', 'partner_id': self.partner.id, 'sale_line_id': self.order_line.id, 'user_ids': [(4, self.user.id)], 'project_id': self.project.id})
        children_values = [{'name': 'child%s' % i, 'user_ids': False, 'project_id': self.project.id} for i in range(5)]
        children = self.env['project.task'].create(children_values)
        # test writing user_ids and sale_line_id

        for child in children:
            self.assertFalse(child.user_ids)
            self.assertFalse(child.sale_line_id)

        children.write({'parent_id': parent.id})

        for child in children:
            self.assertEqual(child.sale_line_id, self.order_line)
            self.assertFalse(child.user_ids)
