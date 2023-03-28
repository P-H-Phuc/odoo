# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Payment Provider: Buckaroo',
    'version': '2.0',
    'category': 'Accounting/Payment Providers',
    'sequence': 350,
    'summary': "A Dutch payment provider covering several countries in Europe.",
    'depends': ['payment'],
    'data': [
        'views/payment_buckaroo_templates.xml',
        'views/payment_provider_views.xml',

        'data/payment_provider_data.xml',
    ],
<<<<<<< HEAD
    'application': False,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'post_init_hook': 'post_init_hook',
    'uninstall_hook': 'uninstall_hook',
    'license': 'LGPL-3',
}
