# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Colombia - Accounting',
    'version': '0.8',
    'category': 'Accounting/Localizations/Account Charts',
    'description': 'Colombian Accounting and Tax Preconfiguration',
    'author': 'David Arnold (XOE Solutions)',
    'website': 'https://www.odoo.com/colombia',
    'depends': [
        'account_debit_note',
        'l10n_latam_base',
        'account',
    ],
    'data': [
        'data/account_chart_template_data.xml',
        'data/l10n_latam.identification.type.csv',
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'license': 'LGPL-3',
}
