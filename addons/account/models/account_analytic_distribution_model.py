# -*- coding: utf-8 -*-

from odoo import fields, models


class AccountAnalyticDistributionModel(models.Model):
    _inherit = 'account.analytic.distribution.model'

    account_prefix = fields.Char(
        string='Accounts Prefix',
<<<<<<< HEAD
        help="Prefix that defines which accounts from the financial accounting this model should apply on.",
=======
        help="This analytic distribution will apply to all financial accounts sharing the prefix specified.",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    )
    product_id = fields.Many2one(
        'product.product',
        string='Product',
        ondelete='cascade',
        help="Select a product for which the analytic distribution will be used (e.g. create new customer invoice or Sales order if we select this product, it will automatically take this as an analytic account)",
    )
    product_categ_id = fields.Many2one(
        'product.category',
        string='Product Category',
        ondelete='cascade',
        help="Select a product category which will use analytic account specified in analytic default (e.g. create new customer invoice or Sales order if we select this product, it will automatically take this as an analytic account)",
    )

    def _create_domain(self, fname, value):
        if not fname == 'account_prefix':
            return super()._create_domain(fname, value)
