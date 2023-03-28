# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Algeria - Accounting',
    'version': '1.0',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
This is the module to manage the accounting chart for Algeria in Odoo.
======================================================================
This module applies to companies based in Algeria.
""",
    'author': 'Osis',
<<<<<<< HEAD
    'depends': ['account', 'l10n_multilang'],
    'data': [
        'data/account_chart_template_data.xml',
        'data/account.account.template.csv',
        'data/account_chart_template_post_data.xml',
        'data/account_tax_data.xml',
        'data/account_fiscal_position_template_data.xml',
        'data/account_chart_template_configuration_data.xml',
        'report/account_move_report.xml',
=======
    'depends': [
        'account',
    ],
    'demo': [
        'demo/demo_company.xml',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'license': 'LGPL-3',
}
