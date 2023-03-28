# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models


class StockForecasted(models.AbstractModel):
    _inherit = 'stock.forecasted_product_product'

<<<<<<< HEAD
    def _serialize_docs(self, docs, product_template_ids=False, product_variant_ids=False):
        res = super()._serialize_docs(docs, product_template_ids, product_variant_ids)
        res['draft_purchase_orders'] = docs['draft_purchase_orders'].read(fields=['id', 'name'])
        return res

    def _compute_draft_quantity_count(self, product_template_ids, product_variant_ids, wh_location_ids):
        res = super()._compute_draft_quantity_count(product_template_ids, product_variant_ids, wh_location_ids)
=======
    def _get_report_header(self, product_template_ids, product_ids, wh_location_ids):
        res = super()._get_report_header(product_template_ids, product_ids, wh_location_ids)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        domain = [('state', 'in', ['draft', 'sent', 'to approve'])]
        domain += self._product_purchase_domain(product_template_ids, product_ids)
        warehouse_id = self.env.context.get('warehouse', False)
        if warehouse_id:
            domain += [('order_id.picking_type_id.warehouse_id', '=', warehouse_id)]
        po_lines = self.env['purchase.order.line'].search(domain)
        in_sum = sum(po_lines.mapped('product_uom_qty'))
        res['draft_purchase_qty'] = in_sum
        res['draft_purchase_orders'] = po_lines.mapped("order_id").sorted(key=lambda po: po.name).read(fields=['id', 'name'])
        res['draft_purchase_orders_matched'] = self.env.context.get('purchase_line_to_match_id') in po_lines.ids
        res['qty']['in'] += in_sum
        return res

    def _product_purchase_domain(self, product_template_ids, product_ids):
        if product_ids:
            return [('product_id', 'in', product_ids)]
        elif product_template_ids:
            subquery_products = self.env['product.product']._search(
                [('product_tmpl_id', 'in', product_template_ids)]
            )
            return [('product_id', 'in', subquery_products)]
