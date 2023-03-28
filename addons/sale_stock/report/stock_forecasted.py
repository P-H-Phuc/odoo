# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models


<<<<<<< HEAD
class ReplenishmentReport(models.AbstractModel):
    _inherit = 'report.stock.report_product_product_replenishment'

    def _serialize_docs(self, docs, product_template_ids=False, product_variant_ids=False):
        res = super()._serialize_docs(docs, product_template_ids, product_variant_ids)
        res['draft_sale_orders'] = docs['draft_sale_orders'].read(fields=['id', 'name'])
        for i in range(len(docs['lines'])):
            if not docs['lines'][i]['move_out'] or not docs['lines'][i]['move_out']['picking_id'] or not docs['lines'][i]['move_out']['picking_id']['sale_id']:
                continue
            picking = docs['lines'][i]['move_out']['picking_id']
            res['lines'][i]['move_out'].update({
                'picking_id' : {
                    'id' : picking.id,
                    'priority' : picking.priority,
                    'sale_id' : {
                        'id' : picking.sale_id.id,
                        'amount_untaxed' : picking.sale_id.amount_untaxed,
                        'currency_id' : picking.sale_id.currency_id.read(fields=['id', 'name'])[0],
                        'partner_id' : picking.sale_id.partner_id.read(fields=['id', 'name'])[0],
                    }
                }
            })
        return res

    def _compute_draft_quantity_count(self, product_template_ids, product_variant_ids, wh_location_ids):
        res = super()._compute_draft_quantity_count(product_template_ids, product_variant_ids, wh_location_ids)
        domain = self._product_sale_domain(product_template_ids, product_variant_ids)
=======
class StockForecasted(models.AbstractModel):
    _inherit = 'stock.forecasted_product_product'

    def _prepare_report_line(self, quantity, move_out=None, move_in=None, replenishment_filled=True, product=False, reserved_move=False, in_transit=False, read=True):
        line = super()._prepare_report_line(quantity, move_out, move_in, replenishment_filled, product, reserved_move, in_transit, read)

        if not move_out or not move_out.picking_id or not move_out.picking_id.sale_id:
            return line

        picking = move_out.picking_id
        line['move_out'].update({
            'picking_id' : {
                'id' : picking.id,
                'priority' : picking.priority,
                'sale_id' : {
                    'id' : picking.sale_id.id,
                    'amount_untaxed' : picking.sale_id.amount_untaxed,
                    'currency_id' : picking.sale_id.currency_id.read(fields=['id', 'name'])[0] if read else picking.sale_id.currency_id,
                    'partner_id' : picking.sale_id.partner_id.read(fields=['id', 'name'])[0] if read else picking.sale_id.partner_id,
                }
            }
        })
        return line

    def _get_report_header(self, product_template_ids, product_ids, wh_location_ids):
        res = super()._get_report_header(product_template_ids, product_ids, wh_location_ids)
        domain = self._product_sale_domain(product_template_ids, product_ids)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        so_lines = self.env['sale.order.line'].search(domain)
        out_sum = 0
        if so_lines:
            product_uom = so_lines[0].product_id.uom_id
            quantities = so_lines.mapped(lambda line: line.product_uom._compute_quantity(line.product_uom_qty, product_uom))
            out_sum = sum(quantities)
        res['draft_sale_qty'] = out_sum
<<<<<<< HEAD
        res['draft_sale_orders'] = so_lines.mapped("order_id").sorted(key=lambda so: so.name)
=======
        res['draft_sale_orders'] = so_lines.mapped("order_id").sorted(key=lambda so: so.name).read(fields=['id', 'name'])
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        res['draft_sale_orders_matched'] = self.env.context.get('sale_line_to_match_id') in so_lines.ids
        res['qty']['out'] += out_sum
        return res

<<<<<<< HEAD
    def _product_sale_domain(self, product_template_ids, product_variant_ids):
        domain = [('state', 'in', ['draft', 'sent'])]
        if product_template_ids:
            domain += [('product_template_id', 'in', product_template_ids)]
        elif product_variant_ids:
            domain += [('product_id', 'in', product_variant_ids)]
=======
    def _product_sale_domain(self, product_template_ids, product_ids):
        domain = [('state', 'in', ['draft', 'sent'])]
        if product_template_ids:
            domain += [('product_template_id', 'in', product_template_ids)]
        elif product_ids:
            domain += [('product_id', 'in', product_ids)]
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        warehouse_id = self.env.context.get('warehouse', False)
        if warehouse_id:
            domain += [('warehouse_id', '=', warehouse_id)]
        return domain
