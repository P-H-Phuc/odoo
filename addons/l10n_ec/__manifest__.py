# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
<<<<<<< HEAD
    "name": "Ecuadorian Accounting",
    "version": "3.4",
    "description": """
=======
    'name': 'Ecuadorian Accounting',
    'version': '3.3',
    'description': """
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
Functional
----------

This module adds accounting features for Ecuadorian localization, which
represent the minimum requirements to operate a business in Ecuador in compliance
with local regulation bodies such as the ecuadorian tax authority -SRI- and the 
Superintendency of Companies -Super Intendencia de Compañías-

Follow the next configuration steps:
1. Go to your company and configure your country as Ecuador
2. Install the invoicing or accounting module, everything will be handled automatically

Highlights:
* Ecuadorian chart of accounts will be automatically installed, based on example provided by Super Intendencia de Compañías
* List of taxes (including withholds) will also be installed, you can switch off the ones your company doesn't use
* Fiscal position, document types, list of local banks, list of local states, etc, will also be installed

Technical
---------
Master Data:
* Chart of Accounts, based on recomendation by Super Cías
* Ecuadorian Taxes, Tax Tags, and Tax Groups
* Ecuadorian Fiscal Positions
* Document types (there are about 41 purchase documents types in Ecuador)
* Identification types
* Ecuador banks
* Partners: Consumidor Final, SRI, IESS, and also basic VAT validation
    """,
<<<<<<< HEAD
    "author": "TRESCLOUD, OPA CONSULTING",
    "category": "Accounting/Localizations/Account Charts",
    "maintainer": "TRESCLOUD",
    "website": "https://www.odoo.com/documentation/16.0/applications/finance/fiscal_localizations/ecuador.html",
    "license": "LGPL-3",
    "depends": [
        "base",
        "base_iban",
        "account",
        "account_debit_note",
        "l10n_latam_invoice_document",
        "l10n_latam_base",
    ],
    "data": [
        # Security
        "security/ir.model.access.csv",
        # Chart of Accounts
        "data/account_chart_template_data.xml",
        "data/account_group_template_data.xml",
        "data/account.account.template.csv",
        "data/account_chart_template_setup_accounts.xml",
        # Taxes
        "data/account_tax_group_data.xml",
        "data/account_tax_report_data.xml",
        "data/account_tax_template_vat_data.xml",
        "data/account_tax_template_withhold_profit_data.xml",
        "data/account_tax_template_withhold_vat_data.xml",
        "data/account_fiscal_position_template.xml",
        # Partners data
        "data/res.bank.csv",
        "data/l10n_latam_identification_type_data.xml",
        "data/res_partner_data.xml",
        # Other data
        "data/l10n_latam.document.type.csv",
        "data/l10n_ec.sri.payment.csv",
        # Views
        "views/root_sri_menu.xml",
        "views/account_tax_view.xml",
        "views/l10n_latam_document_type_view.xml",
        "views/l10n_ec_sri_payment.xml",
        "views/account_journal_view.xml",
        # Try loading CoA
        "data/account_chart_template_configure_data.xml",
=======
    'author': 'OPA CONSULTING & TRESCLOUD',
    'category': 'Accounting/Localizations/Account Charts',
    'maintainer': 'OPA CONSULTING',
    'website': 'https://opa-consulting.com',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'base_iban',
        'account_debit_note',
        'l10n_latam_invoice_document',
        'l10n_latam_base',
        'account',
    ],
    'data': [
        'data/account_tax_report_data.xml',
        'data/res.bank.csv',
        'data/l10n_latam_identification_type_data.xml',
        'data/res_partner_data.xml',
        'data/l10n_latam.document.type.csv',
        'data/l10n_ec.sri.payment.csv',
        'views/account_tax_view.xml',
        'views/l10n_latam_document_type_view.xml',
        'views/l10n_ec_sri_payment.xml',
        'views/account_journal_view.xml',
        'security/ir.model.access.csv',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'installable': True,
}
