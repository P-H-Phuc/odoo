# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': "Spreadsheet dashboard for expenses",
    'version': '1.0',
    'category': 'Hidden',
    'summary': 'Spreadsheet',
    'description': 'Spreadsheet',
    'depends': ['spreadsheet_dashboard', 'sale_expense'],
    'data': [
        "data/dashboards.xml",
    ],
    'installable': True,
    'auto_install': ['sale_expense'],
    'license': 'LGPL-3',
<<<<<<< HEAD
    'assets': {}
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
}
