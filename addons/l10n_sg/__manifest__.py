# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Singapore - Accounting',
    'author': 'Tech Receptives',
    'version': '2.1',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
Singapore accounting chart and localization.
=======================================================

This module add, for accounting:
 - The Chart of Accounts of Singapore
 - Field UEN (Unique Entity Number) on company and partner
 - Field PermitNo and PermitNoDate on invoice

    """,
    'depends': [
        'base',
        'account',
    ],
    'data': [
        'data/l10n_sg_chart_data.xml',
        'data/account_tax_report_data.xml',
        'views/account_invoice_view.xml',
        'views/res_company_view.xml',
        'views/res_partner_view.xml',
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'post_init_hook': '_preserve_tag_on_taxes',
    'license': 'LGPL-3',
}
