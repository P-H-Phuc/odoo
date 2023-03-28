# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Peru - Accounting',
    'version': '2.0',
    'summary': 'PCGE Simplified',
    'category': 'Accounting/Localizations/Account Charts',
<<<<<<< HEAD
    'author': 'Vauxoo, Odoo',
    'website': 'https://www.odoo.com/documentation/16.0/applications/finance/accounting/fiscal_localizations/localizations/peru.html',
=======
    'author': 'Vauxoo, Odoo S.A.',
    'website': 'https://www.odoo.com/documentation/master/applications/finance/accounting/fiscal_localizations/localizations/peru.html',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'license': 'LGPL-3',
    'depends': [
        'base_vat',
        'base_address_extended',
        'l10n_latam_base',
        'l10n_latam_invoice_document',
        'account_debit_note',
        'account',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/account_tax_view.xml',
        'data/l10n_latam_document_type_data.xml',
        'data/res.city.csv',
        'data/l10n_pe.res.city.district.csv',
        'data/res_country_data.xml',
        'data/l10n_latam_identification_type_data.xml',
        'data/res.bank.csv',
    ],
    'demo': [
        'demo/demo_company.xml',
        'demo/demo_partner.xml',
    ],
}
