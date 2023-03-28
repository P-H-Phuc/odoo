# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Payment Provider: Adyen',
    'version': '2.0',
    'category': 'Accounting/Payment Providers',
    'sequence': 350,
    'summary': "A Dutch payment provider covering Europe and the US.",
    'depends': ['payment'],
    'data': [
        'views/payment_adyen_templates.xml',
        'views/payment_provider_views.xml',
        'views/payment_templates.xml',  # Only load the SDK on pages with a payment form.

        'data/payment_provider_data.xml',  # Depends on views/payment_adyen_templates.xml

        'wizards/payment_capture_wizard_views.xml',
    ],
<<<<<<< HEAD
    'application': False,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    'post_init_hook': 'post_init_hook',
    'uninstall_hook': 'uninstall_hook',
    'assets': {
        'web.assets_frontend': [
            'payment_adyen/static/src/js/payment_form.js',
        ],
    },
    'license': 'LGPL-3',
}
