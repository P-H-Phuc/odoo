# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Japan - Accounting',
    'version': '2.2',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """

Overview:
---------

* Chart of Accounts and Taxes template for companies in Japan.
* This probably does not cover all the necessary accounts for a company. You are expected to add/delete/modify accounts based on this template.

Note:
-----

* Fiscal positions '内税' and '外税' have been added to handle special requirements which might arise from POS implementation. [1]  Under normal circumstances, you might not need to use those at all.

[1] See https://github.com/odoo/odoo/pull/6470 for detail.

    """,
    'author': 'Quartile Limited',
    'website': 'https://www.quartile.co/',
    'depends': [
        'account',
<<<<<<< HEAD
        'l10n_multilang',
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'data': [
        'data/account_tax_report_data.xml',
<<<<<<< HEAD
        'data/account_tax_template_data.xml',
        'data/account_chart_template_data.xml',
        'data/account.fiscal.position.template.csv',
        'data/account_fiscal_position_tax_template_data.xml',
        'data/account_chart_template_configure_data.xml',
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'post_init_hook': 'load_translations',
    'license': 'LGPL-3',
}
