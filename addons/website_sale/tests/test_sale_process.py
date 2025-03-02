# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import odoo.tests

from odoo import api
from odoo.addons.base.tests.common import HttpCaseWithUserDemo, TransactionCaseWithUserDemo
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.website.tools import MockRequest


@odoo.tests.tagged('post_install', '-at_install')
class TestUi(HttpCaseWithUserDemo):

    def setUp(self):
        super(TestUi, self).setUp()
        self.env['product.pricelist'].sudo().search([]).action_archive()
        product_product_7 = self.env['product.product'].create({
            'name': 'Storage Box',
            'standard_price': 70.0,
            'list_price': 79.0,
            'website_published': True,
        })
        self.product_attribute_1 = self.env['product.attribute'].create({
            'name': 'Legs',
            'sequence': 10,
        })
        product_attribute_value_1 = self.env['product.attribute.value'].create({
            'name': 'Steel',
            'attribute_id': self.product_attribute_1.id,
            'sequence': 1,
        })
        product_attribute_value_2 = self.env['product.attribute.value'].create({
            'name': 'Aluminium',
            'attribute_id': self.product_attribute_1.id,
            'sequence': 2,
        })
        self.product_product_11_product_template = self.env['product.template'].create({
            'name': 'Conference Chair',
            'list_price': 16.50,
            'accessory_product_ids': [(4, product_product_7.id)],
        })
        self.env['product.template.attribute.line'].create({
            'product_tmpl_id': self.product_product_11_product_template.id,
            'attribute_id': self.product_attribute_1.id,
            'value_ids': [(4, product_attribute_value_1.id), (4, product_attribute_value_2.id)],
        })

        self.product_product_1_product_template = self.env['product.template'].create({
            'name': 'Chair floor protection',
            'list_price': 12.0,
        })

        self.env['account.journal'].create({'name': 'Cash - Test', 'type': 'cash', 'code': 'CASH - Test'})

        # Avoid Shipping/Billing address page
        (self.env.ref('base.partner_admin') + self.partner_demo).write({
            'street': '215 Vine St',
            'city': 'Scranton',
            'zip': '18503',
            'country_id': self.env.ref('base.us').id,
            'state_id': self.env.ref('base.state_us_39').id,
            'phone': '+1 555-555-5555',
            'email': 'admin@yourcompany.example.com',
        })

    def test_01_admin_shop_tour(self):
        self.start_tour(self.env['website'].get_client_action_url('/shop'), 'shop', login='admin')

    def test_02_admin_checkout(self):
        if self.env['ir.module.module']._get('payment_custom').state != 'installed':
            self.skipTest("Transfer provider is not installed")

        transfer_provider = self.env.ref('payment.payment_provider_transfer')
        transfer_provider.write({
            'state': 'enabled',
            'is_published': True,
        })
        transfer_provider._transfer_ensure_pending_msg_is_set()
        self.start_tour("/", 'shop_buy_product', login="admin")

    def test_03_demo_checkout(self):
        if self.env['ir.module.module']._get('payment_custom').state != 'installed':
            self.skipTest("Transfer provider is not installed")

        transfer_provider = self.env.ref('payment.payment_provider_transfer')
        transfer_provider.write({
            'state': 'enabled',
            'is_published': True,
        })
        transfer_provider._transfer_ensure_pending_msg_is_set()
        self.start_tour("/", 'shop_buy_product', login="demo")

    def test_04_admin_website_sale_tour(self):
        if self.env['ir.module.module']._get('payment_custom').state != 'installed':
            self.skipTest("Transfer provider is not installed")

        self.env.ref('payment.payment_provider_transfer').write({
            'state': 'enabled',
            'is_published': True,
        })
        tax_group = self.env['account.tax.group'].create({'name': 'Tax 15%'})
        tax = self.env['account.tax'].create({
            'name': 'Tax 15%',
            'amount': 15,
            'type_tax_use': 'sale',
            'tax_group_id': tax_group.id
        })
        # storage box
        self.product_product_7 = self.env['product.product'].create({
            'name': 'Storage Box Test',
            'standard_price': 70.0,
            'list_price': 79.0,
            'categ_id': self.env.ref('product.product_category_all').id,
            'website_published': True,
            'invoice_policy': 'delivery',
        })
        self.product_product_7.taxes_id = [tax.id]
        self.env['res.config.settings'].create({
            'auth_signup_uninvited': 'b2c',
            'show_line_subtotals_tax_selection': 'tax_excluded',
        }).execute()

        self.start_tour("/", 'website_sale_tour_1')
        self.start_tour(self.env['website'].get_client_action_url('/shop/cart'), 'website_sale_tour_backend', login='admin')
        self.start_tour("/", 'website_sale_tour_2', login="admin")

    def test_05_google_analytics_tracking(self):
        self.env['website'].browse(1).write({'google_analytics_key': 'G-XXXXXXXXXXX'})
        self.start_tour("/shop", 'google_analytics_view_item')
        self.start_tour("/shop", 'google_analytics_add_to_cart')


@odoo.tests.tagged('post_install', '-at_install')
class TestWebsiteSaleCheckoutAddress(TransactionCaseWithUserDemo):
    ''' The goal of this method class is to test the address management on
        the checkout (new/edit billing/shipping, company_id, website_id..).
    '''

    def setUp(self):
        super(TestWebsiteSaleCheckoutAddress, self).setUp()
        self.website = self.env.ref('website.default_website')
        self.country_id = self.env.ref('base.be').id
        self.WebsiteSaleController = WebsiteSale()
        self.default_address_values = {
            'name': 'a res.partner address', 'email': 'email@email.email', 'street': 'ooo',
            'city': 'ooo', 'zip': '1200', 'country_id': self.country_id, 'submitted': 1,
        }

    def _create_so(self, partner_id=None, company_id=None):
        values = {
            'partner_id': partner_id,
            'website_id': self.website.id,
            'order_line': [(0, 0, {
                'product_id': self.env['product.product'].create({
                    'name': 'Product A',
                    'list_price': 100,
                    'website_published': True,
                    'sale_ok': True}).id,
                'name': 'Product A',
            })]
        }
        if company_id:
            values['company_id'] = company_id
        return self.env['sale.order'].create(values)

    def _get_last_address(self, partner):
        ''' Useful to retrieve the last created shipping address '''
        return partner.child_ids.sorted('id', reverse=True)[0]

    # TEST WEBSITE
    def test_01_create_shipping_address_specific_user_account(self):
        ''' Ensure `website_id` is correctly set (specific_user_account) '''
        p = self.env.user.partner_id
        so = self._create_so(p.id)

        with MockRequest(self.env, website=self.website, sale_order_id=so.id) as req:
            req.httprequest.method = "POST"
            self.WebsiteSaleController.address(**self.default_address_values)
            self.assertFalse(self._get_last_address(p).website_id, "New shipping address should not have a website set on it (no specific_user_account).")

            self.website.specific_user_account = True

            self.WebsiteSaleController.address(**self.default_address_values)
            self.assertEqual(self._get_last_address(p).website_id, self.website, "New shipping address should have a website set on it (specific_user_account).")

    # TEST COMPANY
    def _setUp_multicompany_env(self):
        ''' Have 2 companies A & B.
            Have 1 website 1 which company is B
            Have admin on company A
        '''
        self.company_a = self.env['res.company'].create({
            'name': 'Company A',
        })
        self.company_b = self.env['res.company'].create({
            'name': 'Company B',
        })
        self.company_c = self.env['res.company'].create({
            'name': 'Company C',
        })
        self.website.company_id = self.company_b
        self.env.user.company_id = self.company_a

        self.demo_user = self.user_demo
        self.demo_user.company_ids += self.company_c
        self.demo_user.company_id = self.company_c
        self.demo_partner = self.demo_user.partner_id

    def test_02_demo_address_and_company(self):
        ''' This test ensure that the company_id of the address (partner) is
            correctly set and also, is not wrongly changed.
            eg: new shipping should use the company of the website and not the
                one from the admin, and editing a billing should not change its
                company.
        '''
        self._setUp_multicompany_env()
        so = self._create_so(self.demo_partner.id)

        env = api.Environment(self.env.cr, self.demo_user.id, {})
        # change also website env for `sale_get_order` to not change order partner_id
        with MockRequest(env, website=self.website.with_env(env), sale_order_id=so.id) as req:
            req.httprequest.method = "POST"

            # 1. Logged in user, new shipping
            self.WebsiteSaleController.address(**self.default_address_values)
            new_shipping = self._get_last_address(self.demo_partner)
            self.assertTrue(new_shipping.company_id != self.env.user.company_id, "Logged in user new shipping should not get the company of the sudo() neither the one from it's partner..")
            self.assertEqual(new_shipping.company_id, self.website.company_id, ".. but the one from the website.")

            # 2. Logged in user, edit billing
            self.default_address_values['partner_id'] = self.demo_partner.id
            # Name cannot be changed if there are issued invoices
            self.default_address_values['name'] = self.demo_partner.name
            self.WebsiteSaleController.address(**self.default_address_values)
            self.assertEqual(self.demo_partner.company_id, self.company_c, "Logged in user edited billing (the partner itself) should not get its company modified.")

    def test_03_public_user_address_and_company(self):
        ''' Same as test_02 but with public user '''
        self._setUp_multicompany_env()
        so = self._create_so(self.website.user_id.partner_id.id)

        env = api.Environment(self.env.cr, self.website.user_id.id, {})
        # change also website env for `sale_get_order` to not change order partner_id
        with MockRequest(env, website=self.website.with_env(env), sale_order_id=so.id) as req:
            req.httprequest.method = "POST"

            # 1. Public user, new billing
            self.default_address_values['partner_id'] = -1
            self.WebsiteSaleController.address(**self.default_address_values)
            new_partner = so.partner_id
            self.assertNotEqual(new_partner, self.website.user_id.partner_id, "New billing should have created a new partner and assign it on the SO")
            self.assertEqual(new_partner.company_id, self.website.company_id, "The new partner should get the company of the website")

            # 2. Public user, edit billing
            self.default_address_values['partner_id'] = new_partner.id
            self.WebsiteSaleController.address(**self.default_address_values)
            self.assertEqual(new_partner.company_id, self.website.company_id, "Public user edited billing (the partner itself) should not get its company modified.")

    def test_04_apply_empty_pl(self):
        ''' Ensure empty pl code reset the applied pl '''
        so = self._create_so(self.env.user.partner_id.id)
        eur_pl = self.env['product.pricelist'].create({
            'name': 'EUR_test',
            'website_id': self.website.id,
            'code': 'EUR_test',
        })

        with MockRequest(self.env, website=self.website, sale_order_id=so.id):
            self.WebsiteSaleController.pricelist('EUR_test')
            self.assertEqual(so.pricelist_id, eur_pl, "Ensure EUR_test is applied")

            self.WebsiteSaleController.pricelist('')
            self.assertNotEqual(so.pricelist_id, eur_pl, "Pricelist should be removed when sending an empty pl code")

    def test_04_pl_reset_on_login(self):
        """Check that after login, the SO pricelist is correctly recomputed."""
        test_user = self.env['res.users'].create({
            'name': 'Toto',
            'login': 'long_enough_password',
            'password': 'long_enough_password',
        })
        eur_pl = self.env['product.pricelist'].create({
            'name': 'EUR_test',
            'website_id': self.website.id,
            'code': 'EUR_test',
        })
        test_user.partner_id.property_product_pricelist = eur_pl

        public_user_env = self.env(user=self.website.user_id)
        so = self._create_so(public_user_env.user.partner_id.id)

        with MockRequest(self.env, website=self.website, sale_order_id=so.id, website_sale_current_pl=so.pricelist_id.id):
            order = self.website.sale_get_order()
            pl = order.pricelist_id
            self.assertNotEqual(pl, eur_pl)
            order_b = self.website.with_user(test_user).sale_get_order()
            self.assertEqual(order, order_b)
            self.assertEqual(order_b.pricelist_id, eur_pl)

    # TEST WEBSITE & MULTI COMPANY

    def test_05_create_so_with_website_and_multi_company(self):
        ''' This test ensure that the company_id of the website set on the order
            is the same as the env company or the one set on the order.
        '''
        self._setUp_multicompany_env()
        # No company on the SO
        so = self._create_so(self.demo_partner.id)
        self.assertEqual(so.company_id, self.website.company_id)

        # Same company on the SO and the env user company but no website
        with self.assertRaises(ValueError, msg="Should not be able to create SO with company different than the website company"):
            self._create_so(self.demo_partner.id, self.company_a.id)

        # Same company on the SO and the website company
        so = self._create_so(self.demo_partner.id, self.company_b.id)
        self.assertEqual(so.company_id, self.website.company_id)

        # Different company on the SO and the env user company
        with self.assertRaises(ValueError, msg="Should not be able to create SO with company different than the website company"):
            self._create_so(self.demo_partner.id, self.company_c.id)
