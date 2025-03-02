# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'OHADA - Accounting',
    'category': 'Accounting/Localizations/Account Charts',
    'icon': '/l10n_syscohada/static/description/icon.jpeg',
    'description': """
This module implements the accounting chart for OHADA area.
===========================================================

It allows any company or association to manage its financial accounting.

Countries that use OHADA are the following:
-------------------------------------------
    Benin, Burkina Faso, Cameroon, Central African Republic, Comoros, Congo,

    Ivory Coast, Gabon, Guinea, Guinea Bissau, Equatorial Guinea, Mali, Niger,

    Democratic Republic of the Congo, Senegal, Chad, Togo.
    """,
    'website': 'http://biblio.ohada.org/pmb/opac_css/doc_num.php?explnum_id=2063',
    'depends': [
        'account',
    ],
    'data': [
        'data/menuitem_data.xml',
<<<<<<< HEAD
        'data/account_tax_group_data.xml',
        'data/l10n_syscohada_chart_data.xml',
        'data/account.account.template.csv',
        'data/l10n_syscohada_chart_post_data.xml',
        'data/account_tax_template_data.xml',
        'data/account_chart_template_data.xml',
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'license': 'LGPL-3',
}
