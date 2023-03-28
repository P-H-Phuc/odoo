<<<<<<< HEAD
{
    "name": "Malaysia - Accounting",
    "author": "Odoo PS",
    "version": "1.0",
    "category": "Accounting/Localizations/Account Charts",
    "description": """
This is the base module to manage the accounting chart for Malaysia in Odoo.
==============================================================================
    """,
    "depends": [
        "account",
        "l10n_multilang",
    ],
    "data": [
        "data/l10n_my_chart_data.xml",
        "data/account.account.template.csv",
        "data/account_chart_template_data.xml",
        "data/account.tax.group.csv",
        "data/account_tax_template_data.xml",
        "data/account_chart_template_configure_data.xml",
=======
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Malaysia - Accounting',
    'author': 'Odoo PS',
    'version': '1.0',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
This is the base module to manage the accounting chart for Malaysia in Odoo.
==============================================================================
    """,
    'depends': [
        'account',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
<<<<<<< HEAD
    "icon": "/base/static/img/country_flags/my.png",
    "post_init_hook": "load_translations",
    "license": "LGPL-3",
=======
    'icon': '/base/static/img/country_flags/my.png',
    'license': 'LGPL-3',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
}
