# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'United States - Accounting',
    'version': '1.1',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
United States - Chart of accounts.
==================================
    """,
    'depends': ['account'],
    'data': [
        'data/res_company_data.xml',
        'views/res_partner_bank_views.xml'
    ],
    'license': 'LGPL-3',
}
