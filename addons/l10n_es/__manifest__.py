# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
<<<<<<< HEAD
    "name" : "Spain - Accounting (PGCE 2008)",
    "version" : "5.1",
    "author" : "Spanish Localization Team",
=======
    'name': 'Spain - Accounting (PGCE 2008)',
    'version': '5.1',
    'author': 'Spanish Localization Team',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
Spanish charts of accounts (PGCE 2008).
========================================

    * Defines the following chart of account templates:
        * Spanish general chart of accounts 2008
        * Spanish general chart of accounts 2008 for small and medium companies
        * Spanish general chart of accounts 2008 for associations
    * Defines templates for sale and purchase VAT
    * Defines tax templates
    * Defines fiscal positions for spanish fiscal legislation
    * Defines tax reports mod 111, 115 and 303
""",
    'depends': [
        'account',
        'base_iban',
        'base_vat',
    ],
    'data': [
        'data/account_tax_data.xml',
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'license': 'LGPL-3',
}
