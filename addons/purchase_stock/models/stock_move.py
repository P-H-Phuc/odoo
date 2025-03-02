# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

<<<<<<< HEAD
from odoo import api, fields, models, _
=======
from odoo import api, Command, fields, models, _
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
from odoo.tools.float_utils import float_round, float_is_zero, float_compare
from odoo.exceptions import UserError


class StockMove(models.Model):
    _inherit = 'stock.move'

    purchase_line_id = fields.Many2one(
        'purchase.order.line', 'Purchase Order Line',
        ondelete='set null', index='btree_not_null', readonly=True)
    created_purchase_line_ids = fields.Many2many(
        'purchase.order.line', 'stock_move_created_purchase_line_rel',
        'move_id', 'created_purchase_line_id', 'Created Purchase Order Lines', copy=False)

    @api.model
    def _prepare_merge_moves_distinct_fields(self):
        distinct_fields = super(StockMove, self)._prepare_merge_moves_distinct_fields()
        distinct_fields += ['purchase_line_id', 'created_purchase_line_ids']
        return distinct_fields

    @api.model
    def _prepare_merge_negative_moves_excluded_distinct_fields(self):
        return super()._prepare_merge_negative_moves_excluded_distinct_fields() + ['created_purchase_line_ids']

    def _compute_partner_id(self):
        # dropshipped moves should have their partner_ids directly set
        not_dropshipped_moves = self.filtered(lambda m: not m._is_dropshipped())
        super(StockMove, not_dropshipped_moves)._compute_partner_id()

    def _get_price_unit(self):
        """ Returns the unit price for the move"""
        self.ensure_one()
        if self.origin_returned_move_id or not self.purchase_line_id or not self.product_id.id:
            return super(StockMove, self)._get_price_unit()
        price_unit_prec = self.env['decimal.precision'].precision_get('Product Price')
        line = self.purchase_line_id
        order = line.order_id
        received_qty = line.qty_received
        if self.state == 'done':
            received_qty -= self.product_uom._compute_quantity(self.quantity_done, line.product_uom)
        if float_compare(line.qty_invoiced, received_qty, precision_rounding=line.product_uom.rounding) > 0:
            move_layer = line.move_ids.stock_valuation_layer_ids
            invoiced_layer = line.invoice_lines.stock_valuation_layer_ids
            receipt_value = sum(move_layer.mapped('value')) + sum(invoiced_layer.mapped('value'))
            invoiced_value = 0
            invoiced_qty = 0
            for invoice_line in line.invoice_lines:
                if invoice_line.tax_ids:
                    invoiced_value += invoice_line.tax_ids.with_context(round=False).compute_all(
                        invoice_line.price_unit, currency=invoice_line.account_id.currency_id, quantity=invoice_line.quantity)['total_void']
                else:
                    invoiced_value += invoice_line.price_unit * invoice_line.quantity
                invoiced_qty += invoice_line.product_uom_id._compute_quantity(invoice_line.quantity, line.product_id.uom_id)
            # TODO currency check
            remaining_value = invoiced_value - receipt_value
            # TODO qty_received in product uom
            remaining_qty = invoiced_qty - line.product_uom._compute_quantity(received_qty, line.product_id.uom_id)
            price_unit = float_round(remaining_value / remaining_qty, precision_digits=price_unit_prec)
        else:
            price_unit = line.price_unit
            if line.taxes_id:
                qty = line.product_qty or 1
                price_unit = line.taxes_id.with_context(round=False).compute_all(price_unit, currency=line.order_id.currency_id, quantity=qty)['total_void']
                price_unit = float_round(price_unit / qty, precision_digits=price_unit_prec)
            if line.product_uom.id != line.product_id.uom_id.id:
                price_unit *= line.product_uom.factor / line.product_id.uom_id.factor
        if order.currency_id != order.company_id.currency_id:
            # The date must be today, and not the date of the move since the move move is still
            # in assigned state. However, the move date is the scheduled date until move is
            # done, then date of actual move processing. See:
            # https://github.com/odoo/odoo/blob/2f789b6863407e63f90b3a2d4cc3be09815f7002/addons/stock/models/stock_move.py#L36
            price_unit = order.currency_id._convert(
                price_unit, order.company_id.currency_id, order.company_id, fields.Date.context_today(self), round=False)
        return price_unit

    def _generate_valuation_lines_data(self, partner_id, qty, debit_value, credit_value, debit_account_id, credit_account_id, svl_id, description):
        """ Overridden from stock_account to support amount_currency on valuation lines generated from po
        """
        self.ensure_one()

        rslt = super(StockMove, self)._generate_valuation_lines_data(partner_id, qty, debit_value, credit_value, debit_account_id, credit_account_id, svl_id, description)
        purchase_currency = self.purchase_line_id.currency_id
        if not self.purchase_line_id or purchase_currency == self.company_id.currency_id:
            return rslt
        svl = self.env['stock.valuation.layer'].browse(svl_id)
        if not svl.account_move_line_id:
            if(self.purchase_line_id.product_id.cost_method == 'standard'):
                purchase_price_unit = self.purchase_line_id.product_id.cost_currency_id._convert(
                    self.purchase_line_id.product_id.standard_price,
                    purchase_currency,
                    self.company_id,
                    self.date,
                    round=False,
                )
            else:
                # Do not use price_unit since we want the price tax excluded. And by the way, qty
                # is in the UOM of the product, not the UOM of the PO line.
                purchase_price_unit = (
                    self.purchase_line_id.price_subtotal / self.purchase_line_id.product_uom_qty
                    if self.purchase_line_id.product_uom_qty
                    else self.purchase_line_id.price_unit
                )
            currency_move_valuation = purchase_currency.round(purchase_price_unit * abs(qty))
            rslt['credit_line_vals']['amount_currency'] = rslt['credit_line_vals']['balance'] < 0 and -currency_move_valuation or currency_move_valuation
            rslt['debit_line_vals']['amount_currency'] = rslt['debit_line_vals']['balance'] < 0 and -currency_move_valuation or currency_move_valuation
            rslt['debit_line_vals']['currency_id'] = purchase_currency.id
            rslt['credit_line_vals']['currency_id'] = purchase_currency.id
        else:
            rslt['credit_line_vals']['amount_currency'] = 0
            rslt['debit_line_vals']['amount_currency'] = 0
            rslt['debit_line_vals']['currency_id'] = purchase_currency.id
            rslt['credit_line_vals']['currency_id'] = purchase_currency.id
            if not svl.price_diff_value:
                return rslt
            # The idea is to force using the company currency during the reconciliation process
            rslt['debit_line_vals_curr'] = {
                'name': _("Currency exchange rate difference"),
                'product_id': self.product_id.id,
                'quantity': 0,
                'product_uom_id': self.product_id.uom_id.id,
                'partner_id': partner_id,
                'balance': 0,
                'account_id': debit_account_id,
                'currency_id': purchase_currency.id,
                'amount_currency': -svl.price_diff_value,
            }
            rslt['credit_line_vals_curr'] = {
                'name': _("Currency exchange rate difference"),
                'product_id': self.product_id.id,
                'quantity': 0,
                'product_uom_id': self.product_id.uom_id.id,
                'partner_id': partner_id,
                'balance': 0,
                'account_id': credit_account_id,
                'currency_id': purchase_currency.id,
                'amount_currency': svl.price_diff_value,
            }
        return rslt

    def _prepare_extra_move_vals(self, qty):
        vals = super(StockMove, self)._prepare_extra_move_vals(qty)
        vals['purchase_line_id'] = self.purchase_line_id.id
        return vals

    def _prepare_move_split_vals(self, uom_qty):
        vals = super(StockMove, self)._prepare_move_split_vals(uom_qty)
        vals['purchase_line_id'] = self.purchase_line_id.id
        return vals

    def _prepare_procurement_values(self):
        proc_values = super()._prepare_procurement_values()
        if self.restrict_partner_id:
            proc_values['supplierinfo_name'] = self.restrict_partner_id
            self.restrict_partner_id = False
        return proc_values

    def _clean_merged(self):
        super(StockMove, self)._clean_merged()
        self.write({'created_purchase_line_ids': [Command.clear()]})

    def _get_upstream_documents_and_responsibles(self, visited):
        created_pl = self.created_purchase_line_ids.filtered(lambda cpl: cpl.state not in ('done', 'cancel') and (cpl.state != 'draft' or self._context.get('include_draft_documents')))
        if created_pl:
            return [(pl.order_id, pl.order_id.user_id, visited) for pl in created_pl]
        elif self.purchase_line_id and self.purchase_line_id.state not in ('done', 'cancel'):
            return[(self.purchase_line_id.order_id, self.purchase_line_id.order_id.user_id, visited)]
        else:
            return super(StockMove, self)._get_upstream_documents_and_responsibles(visited)

    def _get_related_invoices(self):
        """ Overridden to return the vendor bills related to this stock move.
        """
        rslt = super(StockMove, self)._get_related_invoices()
        rslt += self.mapped('picking_id.purchase_id.invoice_ids').filtered(lambda x: x.state == 'posted')
        return rslt

    def _get_source_document(self):
        res = super()._get_source_document()
        return self.purchase_line_id.order_id or res

    def _get_valuation_price_and_qty(self, related_aml, to_curr):
        valuation_price_unit_total = 0
        valuation_total_qty = 0
        for val_stock_move in self:
            # In case val_stock_move is a return move, its valuation entries have been made with the
            # currency rate corresponding to the original stock move
            valuation_date = val_stock_move.origin_returned_move_id.date or val_stock_move.date
            svl = val_stock_move.with_context(active_test=False).mapped('stock_valuation_layer_ids').filtered(
                lambda l: l.quantity)
            layers_qty = sum(svl.mapped('quantity'))
            layers_values = sum(svl.mapped('value'))
            valuation_price_unit_total += related_aml.company_currency_id._convert(
                layers_values, to_curr, related_aml.company_id, valuation_date, round=False,
            )
            valuation_total_qty += layers_qty
        if float_is_zero(valuation_total_qty, precision_rounding=related_aml.product_uom_id.rounding or related_aml.product_id.uom_id.rounding):
            raise UserError(
                _('Odoo is not able to generate the anglo saxon entries. The total valuation of %s is zero.') % related_aml.product_id.display_name)
        return valuation_price_unit_total, valuation_total_qty

    def _is_purchase_return(self):
        self.ensure_one()
        return self.location_dest_id.usage == "supplier" or (
                self.location_dest_id.usage == "internal"
                and self.location_id.usage != "supplier"
                and self.warehouse_id
                and self.location_dest_id not in self.env["stock.location"].search([("id", "child_of", self.warehouse_id.view_location_id.id)])
        )

    def _get_all_related_aml(self):
        # The back and for between account_move and account_move_line is necessary to catch the
        # additional lines from a cogs correction
        return super()._get_all_related_aml() | self.purchase_line_id.invoice_lines.move_id.line_ids.filtered(
            lambda aml: aml.product_id == self.purchase_line_id.product_id)

    def _get_all_related_sm(self, product):
        return super()._get_all_related_sm(product) | self.filtered(lambda m: m.purchase_line_id.product_id == product)
