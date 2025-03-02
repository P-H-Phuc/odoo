# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Germany - Accounting',
    'author': 'openbig.org',
    'version': '1.1',
    'website': 'http://www.openbig.org',
    'category': 'Accounting/Localizations',
    'description': """
Dieses  Modul beinhaltet einen deutschen Kontenrahmen basierend auf dem SKR03.
==============================================================================

German accounting chart and localization.
    """,
    'depends': [
        'base_iban',
        'base_vat',
        'l10n_din5008',
    ],
    'data': [
        'data/account_account_tags_data.xml',
        'views/account_view.xml',
        'views/res_company_views.xml',
    ],
    'license': 'LGPL-3',
}
