<<<<<<< HEAD
# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': "Mozambique - Accounting",
=======
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Mozambique - Accounting',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'description': """
        Mozambican Accounting localization
    """,
    'version': '1.0',
    'category': 'Accounting/Localizations/Account Charts',
<<<<<<< HEAD
    'depends': ['base', 'account'],
    'data': [
        'data/account_chart_template_data.xml',
        'data/account.account.template.csv',
        'data/account.group.template.csv',
        'data/account_pgcpe_mozambique.xml',
        'data/tax_report.xml',
        'data/account_tax_group_data.xml',
        'data/account_tax_template_data.xml',
        'data/account_fiscal_position_data.xml',
        'data/account_chart_template_configure_data.xml',
=======
    'depends': [
        'base',
        'account',
    ],
    'data': [
        'data/tax_report.xml',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'license': 'LGPL-3',
}
