# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
<<<<<<< HEAD
    "name" : "Norway - Accounting",
    "version" : "2.1",
    "author" : "Rolv Råen",
=======
    'name': 'Norway - Accounting',
    'version': '2.1',
    'author': 'Rolv Råen',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'category': 'Accounting/Localizations/Account Charts',
    'description': """This is the module to manage the accounting chart for Norway in Odoo.

Updated for Odoo 9 by Bringsvor Consulting AS <www.bringsvor.com>
""",
    'depends': [
        'base_iban',
        'base_vat',
        'account',
    ],
    'data': [
        'data/account_tax_report_data.xml',
        'views/res_partner_views.xml',
        'views/res_company_views.xml',
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'post_init_hook': '_preserve_tag_on_taxes',
    'license': 'LGPL-3',
}
