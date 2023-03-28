# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
<<<<<<< HEAD
    'name' : 'Poland - Accounting',
    'version' : '2.0',
=======
    'name': 'Poland - Accounting',
    'version': '2.0',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'author': 'Odoo S.A., Grzegorz Grzelak (OpenGLOBE)',
    'website': 'http://www.openglobe.pl',
    'category': 'Accounting/Localizations/Account Charts',
    'description': """
This is the module to manage the accounting chart and taxes for Poland in Odoo.
==================================================================================

To jest moduł do tworzenia wzorcowego planu kont, podatków, obszarów podatkowych i
rejestrów podatkowych. Moduł ustawia też konta do kupna i sprzedaży towarów
zakładając, że wszystkie towary są w obrocie hurtowym.

Niniejszy moduł jest przeznaczony dla odoo 8.0.
Wewnętrzny numer wersji OpenGLOBE 1.02
    """,
    'depends': [
        'base_iban',
        'base_vat',
        'account',
    ],
    'data': [
<<<<<<< HEAD
              'data/l10n_pl_chart_data.xml',
              'data/account.account.template.csv',
              'data/account.group.template.csv',
              'data/res.country.state.csv',
              'data/l10n_pl_chart_post_data.xml',
              'data/account_tax_group_data.xml',
              'data/account_tax_report_data.xml',
              'data/account_tax_data.xml',
              'data/account_fiscal_position_data.xml',
              'data/account_chart_template_data.xml'
=======
        'data/res.country.state.csv',
        'data/account_tax_report_data.xml',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    ],
    'demo': [
        'demo/demo_company.xml',
    ],
    'post_init_hook': '_preserve_tag_on_taxes',
    'license': 'LGPL-3',
}
