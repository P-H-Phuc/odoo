# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Luxembourg - Accounting',
    'version': '2.1',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
This is the base module to manage the accounting chart for Luxembourg.
======================================================================

    * the Luxembourg Official Chart of Accounts (law of June 2009 + 2015 chart and Taxes),
    * the Tax Code Chart for Luxembourg
    * the main taxes used in Luxembourg
    * default fiscal position for local, intracom, extracom

Notes:
    * the 2015 chart of taxes is implemented to a large extent,
      see the first sheet of tax.xls for details of coverage
    * to update the chart of tax template, update tax.xls and run tax2csv.py
""",
    'author': 'Odoo S.A., ADN, ACSONE SA/NV',
    'depends': [
        'account',
        'base_iban',
        'base_vat',
    ],
    'data': [
        'data/l10n_lu_chart_data.xml',
        'data/account_tax_report_line.xml',
<<<<<<< HEAD
        'data/account.tax.group.csv',
        'data/account_tax_template_2015.xml',
        'data/account.fiscal.position.template-2011.csv',
        'data/account.fiscal.position.tax.template-2015.csv',
        'data/account_reconcile_model_template_data.xml',
        # configuration wizard, views, reports...
        'data/account.chart.template.csv',
        'data/account_chart_template_data.xml',
        'data/l10n_lu_chart_template_data.xml',
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'post_init_hook': '_post_init_hook',
    'license': 'LGPL-3',
}
