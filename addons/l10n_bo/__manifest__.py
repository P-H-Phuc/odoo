# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Bolivia - Accounting',
    'version': '2.0',
    'description': """
Bolivian accounting chart and tax localization.

Plan contable boliviano e impuestos de acuerdo a disposiciones vigentes

    """,
<<<<<<< HEAD
    "author": "Odoo / Cubic ERP",
    'category': 'Accounting/Localizations/Account Charts',
    "depends": ['l10n_multilang'],
    "data": [
        "data/l10n_bo_chart_data.xml",
        "data/account.account.template.csv",
        "data/account.group.template.csv",
        "data/l10n_bo_chart_post_data.xml",
        'data/account_tax_group_data.xml',
        'data/account_tax_report_data.xml',
        "data/account_tax_template_data.xml",
        "data/account_fiscal_position_template_data.xml",
        "data/account_chart_template_data.xml",
=======
    'author': 'Odoo / Cubic ERP',
    'category': 'Accounting/Localizations/Account Charts',
    'depends': [
        'account',
    ],
    'data': [
        'data/account_tax_report_data.xml',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'license': 'LGPL-3',
    'post_init_hook': 'load_translations',
}
