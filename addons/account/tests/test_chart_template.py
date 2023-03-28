<<<<<<< HEAD
from odoo import Command
from odoo.addons.account.models.chart_template import update_taxes_from_templates
=======
from unittest.mock import patch

from odoo import Command
from odoo.addons.account.models.chart_template import AccountChartTemplate
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
from odoo.tests import tagged
from odoo.tests.common import TransactionCase


<<<<<<< HEAD

@tagged('post_install', '-at_install')
class TestChartTemplate(TransactionCase):

    @classmethod
    def create_tax_template(cls, name, template_name, amount):
        return cls.env['account.tax.template']._load_records([{
            'xml_id': template_name,
            'values': {
                'name': name,
                'amount': amount,
                'chart_template_id': cls.chart_template.id,
                'invoice_repartition_line_ids': [
                    Command.create({
                        'factor_percent': 100,
                        'repartition_type': 'base',
                    }),
                    Command.create({
                        'factor_percent': 100,
                        'repartition_type': 'tax',
                    }),
                ],
                'refund_repartition_line_ids': [
                    Command.create({
                        'factor_percent': 100,
                        'repartition_type': 'base',
                    }),
                    Command.create({
                        'factor_percent': 100,
                        'repartition_type': 'tax',
                    }),
                ],
            },
        }])

    @classmethod
=======
def _get_chart_template_mapping(self):
    return {'test': {
        'name': 'test',
        'country_id': None,
        'country_code': None,
        'modules': ['account'],
        'parent': None,
    }}

def test_get_data(self, template_code):
    return {
        'template_data': {
            'code_digits': 6,
            'currency_id': 'base.EUR',
            'property_account_income_categ_id': 'test_account_income_template',
            'property_account_expense_categ_id': 'test_account_expense_template',
        },
        'account.tax.group': {
            'tax_group_taxes': {
                'name': "Taxes",
                'sequence': 0,
            },
        },
        'account.journal': self._get_account_journal(template_code),
        'res.company': {
            self.env.company.id: {
                'bank_account_code_prefix': '1000',
                'cash_account_code_prefix': '2000',
                'transfer_account_code_prefix': '3000',
            },
        },
        'account.tax': {
            xmlid: _tax_vals(name, amount)
            for name, xmlid, amount in [
                ('Tax 1', 'test_tax_1_template', 15),
                ('Tax 2', 'test_tax_2_template', 0),
            ]
        },
        'account.account': {
            'test_account_income_template': {
                'name': 'property_income_account',
                'code': '222221',
                'account_type': 'income',
            },
            'test_account_expense_template': {
                'name': 'property_expense_account',
                'code': '222222',
                'account_type': 'expense',
            },
        },
        'account.fiscal.position': {
            'test_fiscal_position_template': {
                'name': 'Fiscal Position',
                'country_id': 'base.be',
                'auto_apply': True,
                'tax_ids': [
                    Command.create({
                        'tax_src_id': 'test_tax_1_template',
                        'tax_dest_id': 'test_tax_2_template',
                    })
                ]
            }
        },
    }

def _tax_vals(name, amount):
    return {
        'name': name,
        'amount': amount,
        'tax_group_id': 'tax_group_taxes',
        'invoice_repartition_line_ids': [
            Command.create({'factor_percent': 100, 'repartition_type': 'base'}),
            Command.create({'factor_percent': 100, 'repartition_type': 'tax'}),
        ],
        'refund_repartition_line_ids': [
            Command.create({'factor_percent': 100, 'repartition_type': 'base'}),
            Command.create({'factor_percent': 100, 'repartition_type': 'tax'}),
        ],
    }

@tagged('post_install', '-at_install')
@patch.object(AccountChartTemplate, '_get_chart_template_mapping', _get_chart_template_mapping)
class TestChartTemplate(TransactionCase):

    @classmethod
    @patch.object(AccountChartTemplate, '_get_chart_template_mapping', _get_chart_template_mapping)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    def setUpClass(cls):
        """
            Setups a company with a custom chart template, containing a tax and a fiscal position.
            We need to add xml_ids to the templates because they are loaded from their xml_ids
        """
        super().setUpClass()

        # Create user.
        user = cls.env['res.users'].create({
            'name': 'Because I am accountman!',
            'login': 'accountman',
            'password': 'accountman',
            'groups_id': [Command.set(cls.env.user.groups_id.ids), Command.link(cls.env.ref('account.group_account_user').id)],
        })
        user.partner_id.email = 'accountman@test.com'

        cls.company_1 = cls.env['res.company'].create({
            'name': 'TestCompany1',
            'country_id': cls.env.ref('base.be').id,
        })

        cls.env = cls.env(user=user)
        cls.cr = cls.env.cr

        user.write({
            'company_ids': [Command.set(cls.company_1.ids)],
            'company_id': cls.company_1.id,
        })

<<<<<<< HEAD
        cls.chart_template = cls.env['account.chart.template']._load_records([{
            'xml_id': 'account.test_chart_template',
            'values': {
                'name': 'Test Chart Template',
                'code_digits': 6,
                'currency_id': cls.env.ref('base.EUR').id,
                'bank_account_code_prefix': 1000,
                'cash_account_code_prefix': 2000,
                'transfer_account_code_prefix': 3000,
            },
        }])

        account_templates = cls.env['account.account.template']._load_records([
            {
                'xml_id': 'account.test_account_income_template',
                'values':
                    {
                        'name': 'property_income_account',
                        'code': '222221',
                        'account_type': 'income',
                        'chart_template_id': cls.chart_template.id,
                    }
            },
            {
                'xml_id': 'account.test_account_expense_template',
                'values':
                    {
                        'name': 'property_expense_account',
                        'code': '222222',
                        'account_type': 'expense',
                        'chart_template_id': cls.chart_template.id,
                    }
            },
        ])

        cls.chart_template.property_account_income_categ_id = account_templates[0].id
        cls.chart_template.property_account_expense_categ_id = account_templates[1].id

        cls.tax_1_template = cls.create_tax_template('Tax 1', 'account.test_tax_1_template', 15)
        cls.tax_2_template = cls.create_tax_template('Tax 2', 'account.test_tax_2_template', 0)

        cls.fiscal_position_template = cls.env['account.fiscal.position.template']._load_records([{
            'xml_id': 'account.test_fiscal_position_template',
            'values': {
                'name': 'Fiscal Position',
                'chart_template_id': cls.chart_template.id,
                'country_id': cls.env.ref('base.be').id,
                'auto_apply': True,
            },
        }])

        cls.env['account.fiscal.position.tax.template']._load_records([{
            'xml_id': 'account.test_fiscal_position_tax_template_1',
            'values': {
                'tax_src_id': cls.tax_1_template.id,
                'tax_dest_id': cls.tax_2_template.id,
                'position_id': cls.fiscal_position_template.id,
            },
        }])

        cls.chart_template.try_loading(company=cls.company_1, install_demo=False)
=======
        with patch.object(AccountChartTemplate, '_get_chart_template_data', side_effect=test_get_data, autospec=True):
            cls.env['account.chart.template'].try_loading('test', company=cls.company_1, install_demo=False)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def test_update_taxes_from_templates(self):
        """
            Tests that adding a new tax template and a fiscal position tax template with this new tax template
            creates this new tax and fiscal position line when updating
        """
<<<<<<< HEAD
        fiscal_position = self.env['account.fiscal.position'].search([])
        tax_3_template = self.create_tax_template('Tax 3', 'account.test_tax_3_template', 16)
        tax_4_template = self.create_tax_template('Tax 4', 'account.test_tax_4_template', 17)

        self.env['account.fiscal.position.tax.template']._load_records([
            {
                'xml_id': 'account.test_fiscal_position_new_tax_src_template',
                'values': {
                    'tax_src_id': tax_3_template.id,
                    'tax_dest_id': self.tax_1_template.id,
                    'position_id': self.fiscal_position_template.id,
                },
            },
            {
                'xml_id': 'account.test_fiscal_position_new_tax_dest_template',
                'values': {
                    'tax_src_id': self.tax_2_template.id,
                    'tax_dest_id': tax_4_template.id,
                    'position_id': self.fiscal_position_template.id,
                },
            },
        ])

        taxes = self.env['account.tax'].search([('company_id', '=', self.company_1.id)])

        # Only the template have been created, so it should not be reflected yet on the company's chart template
        self.assertEqual(len(fiscal_position.tax_ids), 1)
        self.assertEqual(len(taxes), 2)

        chart_template_xml_id = self.chart_template.get_external_id()[self.chart_template.id]
        update_taxes_from_templates(self.env.cr, chart_template_xml_id)
=======
        def local_get_data(self, template_code):
            data = test_get_data(self, template_code)
            data['account.tax'].update({
                xmlid: _tax_vals(name, amount)
                for name, xmlid, amount in [
                    ('Tax 3', 'test_tax_3_template', 16),
                    ('Tax 4', 'test_tax_4_template', 17),
                ]
            })
            data['account.fiscal.position']['test_fiscal_position_template']['tax_ids'].extend([
                Command.create({
                    'tax_src_id': 'test_tax_3_template',
                    'tax_dest_id': 'test_tax_1_template',
                }),
                Command.create({
                    'tax_src_id': 'test_tax_2_template',
                    'tax_dest_id': 'test_tax_4_template',
                }),
            ])
            return data

        with patch.object(AccountChartTemplate, '_get_chart_template_data', side_effect=local_get_data, autospec=True):
            self.env['account.chart.template'].try_loading('test', company=self.company_1, install_demo=False)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        taxes = self.env['account.tax'].search([('company_id', '=', self.company_1.id)])
        self.assertRecordValues(taxes, [
            {'name': 'Tax 1'},
            {'name': 'Tax 2'},
            {'name': 'Tax 3'},
            {'name': 'Tax 4'},
        ])

<<<<<<< HEAD
=======
        fiscal_position = self.env['account.fiscal.position'].search([])
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        self.assertRecordValues(fiscal_position.tax_ids.tax_src_id, [
            {'name': 'Tax 1'},
            {'name': 'Tax 3'},
            {'name': 'Tax 2'},
        ])
        self.assertRecordValues(fiscal_position.tax_ids.tax_dest_id, [
            {'name': 'Tax 2'},
            {'name': 'Tax 1'},
            {'name': 'Tax 4'},
        ])

    def test_update_taxes_removed_from_templates(self):
        """
            Tests updating after the removal of taxes and fiscal position mapping from the company

        """
        fiscal_position = self.env['account.fiscal.position'].search([])
        fiscal_position.tax_ids.unlink()
        self.env['account.tax'].search([('company_id', '=', self.company_1.id)]).unlink()

<<<<<<< HEAD
        chart_template_xml_id = self.chart_template.get_external_id()[self.chart_template.id]
        update_taxes_from_templates(self.env.cr, chart_template_xml_id)
=======
        with patch.object(AccountChartTemplate, '_get_chart_template_data', side_effect=test_get_data, autospec=True):
            self.env['account.chart.template'].try_loading('test', company=self.company_1, install_demo=False)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        # if taxes have been deleted, they will be recreated, and the fiscal position mapping for it too
        self.assertEqual(len(self.env['account.tax'].search([('company_id', '=', self.company_1.id)])), 2)
        self.assertEqual(len(fiscal_position.tax_ids), 1)

        fiscal_position.tax_ids.unlink()
<<<<<<< HEAD
        update_taxes_from_templates(self.env.cr, chart_template_xml_id)
=======
        with patch.object(AccountChartTemplate, '_get_chart_template_data', side_effect=test_get_data, autospec=True):
            self.env['account.chart.template'].try_loading('test', company=self.company_1, install_demo=False)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        # if only the fiscal position mapping has been removed, it won't be recreated
        self.assertEqual(len(fiscal_position.tax_ids), 0)

    def test_update_taxes_conflict_name(self):
<<<<<<< HEAD
        chart_template_xml_id = self.chart_template.get_external_id()[self.chart_template.id]
        template_vals = self.tax_1_template._get_tax_vals_complete(self.company_1)
        template_vals['amount'] = 20
        self.chart_template.create_record_with_xmlid(self.company_1, self.tax_1_template, "account.tax", template_vals)
        update_taxes_from_templates(self.env.cr, chart_template_xml_id)
        tax_1_old = self.env['account.tax'].search([('company_id', '=', self.company_1.id), ('name', '=', "[old] " + self.tax_1_template.name)])
        tax_1_new = self.env['account.tax'].search([('company_id', '=', self.company_1.id), ('name', '=', self.tax_1_template.name)])
        self.assertEqual(len(tax_1_old), 1, "Old tax still exists but with a different name.")
=======
        def local_get_data(self, template_code):
            data = test_get_data(self, template_code)
            data['account.tax']['test_tax_1_template']['amount'] = 40
            return data

        tax_1_existing = self.env['account.tax'].search([('company_id', '=', self.company_1.id), ('name', '=', "Tax 1")])
        with patch.object(AccountChartTemplate, '_get_chart_template_data', side_effect=local_get_data, autospec=True):
            self.env['account.chart.template'].try_loading('test', company=self.company_1, install_demo=False)
        tax_1_old = self.env['account.tax'].search([('company_id', '=', self.company_1.id), ('name', '=', "[old] Tax 1")])
        tax_1_new = self.env['account.tax'].search([('company_id', '=', self.company_1.id), ('name', '=', "Tax 1")])
        self.assertEqual(tax_1_old, tax_1_existing, "Old tax still exists but with a different name.")
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        self.assertEqual(len(tax_1_new), 1, "New tax have been created with the original name.")
