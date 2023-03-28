<<<<<<< HEAD
=======
# Part of Odoo. See LICENSE file for full copyright and licensing details.

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
from odoo import fields, models

class SaleOrderTemplateLine(models.Model):
    _inherit = "sale.order.template.line"

    product_id = fields.Many2one(domain="[('sale_ok', '=', True), ('detailed_type', '!=', 'event'), ('company_id', 'in', [company_id, False])]")
