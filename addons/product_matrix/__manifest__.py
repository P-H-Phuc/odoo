# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': "Product Matrix",
    'summary': """
       Technical module: Matrix Implementation
    """,
    'description': """
Please refer to Sale Matrix or Purchase Matrix for the use of this module.
    """,
    'category': 'Sales/Sales',
    'version': '1.0',
    'depends': ['account'],
    # Account dependency for section_and_note widget.
    'data': [
        'views/matrix_templates.xml',
    ],
    'demo': [
        'data/product_matrix_demo.xml',
    ],
    'assets': {
        'web.assets_backend': [
<<<<<<< HEAD
=======
            'product_matrix/static/src/js/product_matrix_dialog.js',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'product_matrix/static/src/scss/product_matrix.scss',
            'product_matrix/static/src/xml/**/*',
        ],
    },
    'license': 'LGPL-3',
}
