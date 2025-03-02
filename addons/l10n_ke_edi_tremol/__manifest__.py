# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': "Kenya Tremol Device EDI Integration",
    'summary': """
            Kenya Tremol Device EDI Integration
        """,
    'description': """
       This module integrates with the Kenyan G03 Tremol control unit device to the KRA through TIMS.
    """,
    'author': 'Odoo',
    'category': 'Accounting/Localizations/EDI',
    'version': '1.0',
    'license': 'LGPL-3',
    'depends': ['l10n_ke'],
    'data': [
        'views/account_move_view.xml',
        'views/product_view.xml',
        'views/report_invoice.xml',
        'views/res_config_settings_view.xml',
        'views/res_partner_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
<<<<<<< HEAD
            'l10n_ke_edi_tremol/static/src/js/send_invoice.js',
=======
            'l10n_ke_edi_tremol/static/src/components/*',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
    },
}
