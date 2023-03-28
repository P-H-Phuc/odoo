# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from collections import defaultdict
<<<<<<< HEAD
import copy

from odoo import api, models
from odoo.tools import float_compare, float_is_zero, format_date, float_round


class ReplenishmentReport(models.AbstractModel):
    _name = 'report.stock.report_product_product_replenishment'
    _description = "Stock Replenishment Report"

    def _product_domain(self, product_template_ids, product_variant_ids):
        if product_template_ids:
            return [('product_tmpl_id', 'in', product_template_ids)]
        return [('product_id', 'in', product_variant_ids)]

    def _move_domain(self, product_template_ids, product_variant_ids, wh_location_ids):
        move_domain = self._product_domain(product_template_ids, product_variant_ids)
=======

from odoo import api, models
from odoo.tools import float_is_zero, format_date, float_round, float_compare


class StockForecasted(models.AbstractModel):
    _name = 'stock.forecasted_product_product'
    _description = "Stock Replenishment Report"

    @api.model
    def get_report_values(self, docids, data=None):
        return {
            'data': data,
            'doc_ids': docids,
            'doc_model': 'product.product',
            'docs': self._get_report_data(product_ids=docids),
            'precision': self.env['decimal.precision'].precision_get('Product Unit of Measure'),
        }

    def _product_domain(self, product_template_ids, product_ids):
        if product_template_ids:
            return [('product_tmpl_id', 'in', product_template_ids)]
        return [('product_id', 'in', product_ids)]

    def _move_domain(self, product_template_ids, product_ids, wh_location_ids):
        move_domain = self._product_domain(product_template_ids, product_ids)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        move_domain += [('product_uom_qty', '!=', 0)]
        out_domain = move_domain + [
            '&',
            ('location_id', 'in', wh_location_ids),
            ('location_dest_id', 'not in', wh_location_ids),
        ]
        in_domain = move_domain + [
            '&',
            ('location_id', 'not in', wh_location_ids),
            ('location_dest_id', 'in', wh_location_ids),
        ]
        return in_domain, out_domain

<<<<<<< HEAD
    def _move_draft_domain(self, product_template_ids, product_variant_ids, wh_location_ids):
        in_domain, out_domain = self._move_domain(product_template_ids, product_variant_ids, wh_location_ids)
=======
    def _move_draft_domain(self, product_template_ids, product_ids, wh_location_ids):
        in_domain, out_domain = self._move_domain(product_template_ids, product_ids, wh_location_ids)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        in_domain += [('state', '=', 'draft')]
        out_domain += [('state', '=', 'draft')]
        return in_domain, out_domain

<<<<<<< HEAD
    def _move_confirmed_domain(self, product_template_ids, product_variant_ids, wh_location_ids):
        in_domain, out_domain = self._move_domain(product_template_ids, product_variant_ids, wh_location_ids)
        out_domain += [('state', 'in', ['waiting', 'assigned', 'confirmed', 'partially_available'])]
        in_domain += [('state', 'in', ['waiting', 'assigned', 'confirmed', 'partially_available'])]
        return in_domain, out_domain

    def _compute_draft_quantity_count(self, product_template_ids, product_variant_ids, wh_location_ids):
        in_domain, out_domain = self._move_draft_domain(product_template_ids, product_variant_ids, wh_location_ids)
=======
    def _move_confirmed_domain(self, product_template_ids, product_ids, wh_location_ids):
        in_domain, out_domain = self._move_domain(product_template_ids, product_ids, wh_location_ids)
        out_domain += [('state', 'not in', ['draft', 'cancel', 'done'])]
        in_domain += [('state', 'not in', ['draft', 'cancel', 'done'])]
        return in_domain, out_domain

    def _get_report_header(self, product_template_ids, product_ids, wh_location_ids):
        # Get the products we're working, fill the rendering context with some of their attributes.
        res = {}
        if product_template_ids:
            products = self.env['product.template'].browse(product_template_ids)
            res.update({
                'product_templates' : products.read(fields=['id', 'display_name']),
                'product_templates_ids' : products.ids,
                'product_variants' : [{
                        'id' : pv.id,
                        'combination_name' : pv.product_template_attribute_value_ids._get_combination_name(),
                    } for pv in products.product_variant_ids],
                'product_variants_ids' : products.product_variant_ids.ids,
                'multiple_product' : len(products.product_variant_ids) > 1,
            })
        elif product_ids:
            products = self.env['product.product'].browse(product_ids)
            res.update({
                'product_templates' : False,
                'product_variants' : products.read(fields=['id', 'display_name']),
                'product_variants_ids' : products.ids,
                'multiple_product' : len(products) > 1,
            })

        res['uom'] = products[:1].uom_id.display_name
        res['quantity_on_hand'] = sum(products.mapped('qty_available'))
        res['virtual_available'] = sum(products.mapped('virtual_available'))
        res['incoming_qty'] = sum(products.mapped('incoming_qty'))
        res['outgoing_qty'] = sum(products.mapped('outgoing_qty'))

        in_domain, out_domain = self._move_draft_domain(product_template_ids, product_ids, wh_location_ids)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        incoming_moves = self.env['stock.move']._read_group(in_domain, ['product_qty:sum'], 'product_id')
        outgoing_moves = self.env['stock.move']._read_group(out_domain, ['product_qty:sum'], 'product_id')
        in_sum = sum(move['product_qty'] for move in incoming_moves)
        out_sum = sum(move['product_qty'] for move in outgoing_moves)
<<<<<<< HEAD
        return {
=======

        res.update({
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'draft_picking_qty': {
                'in': in_sum,
                'out': out_sum
            },
            'qty': {
                'in': in_sum,
                'out': out_sum
            }
<<<<<<< HEAD
        }

    @api.model
    def _fields_for_serialized_moves(self):
        return ['picking_id', 'state']

    def _serialize_docs(self, docs, product_template_ids=False, product_variant_ids=False):
        """
        Since conversion from report to owl client_action, adapt/override this method to make records available from js code.
        """
        res = copy.copy(docs)
        if product_template_ids:
            res['product_templates'] = docs['product_templates'].read(fields=['id', 'display_name'])
            product_variants = []
            for pv in docs['product_variants']:
                product_variants.append({
                        'id' : pv.id,
                        'combination_name' : pv.product_template_attribute_value_ids._get_combination_name(),
                    })
            res['product_variants'] = product_variants
        elif product_variant_ids:
            res['product_variants'] = docs['product_variants'].read(fields=['id', 'display_name'])

        res['lines'] = []
        for index, line in enumerate(docs['lines']):
            res['lines'].append({
                'index': index,
                'document_in' : {
                    '_name' : line['document_in']._name,
                    'id' : line['document_in']['id'],
                    'name' : line['document_in']['name'],
                } if line['document_in'] else False,
                'document_out' : {
                    '_name' : line['document_out']._name,
                    'id' : line['document_out']['id'],
                    'name' : line['document_out']['name'],
                } if line['document_out'] else False,
                'uom_id' : line['uom_id'].read()[0],
                'move_out' : line['move_out'].read(self._fields_for_serialized_moves())[0] if line['move_out'] else False,
                'move_in' : line['move_in'].read(self._fields_for_serialized_moves())[0] if line['move_in'] else False,
                'product': line['product'],
                'replenishment_filled': line['replenishment_filled'],
                'receipt_date': line['receipt_date'],
                'delivery_date': line['delivery_date'],
                'is_late': line['is_late'],
                'quantity': line['quantity'],
                'reservation': line['reservation'],
                'is_matched': line['is_matched'],
            })
            if line['move_out'] and line['move_out']['picking_id']:
                res['lines'][-1]['move_out'].update({
                    'picking_id' : line['move_out']['picking_id'].read(fields=['id', 'priority'])[0],
                    })

        return res

    @api.model
    def get_report_values(self, docids, data=None, serialize=False):
        docs = self._get_report_data(product_variant_ids=docids)
        if serialize:
            docs = self._serialize_docs(docs, product_variant_ids=docids)
        return {
            'data': data,
            'doc_ids': docids,
            'doc_model': 'product.product',
            'docs': docs,
            'precision': self.env['decimal.precision'].precision_get('Product Unit of Measure'),
        }

    def _get_report_data(self, product_template_ids=False, product_variant_ids=False):
        assert product_template_ids or product_variant_ids
=======
        })
        return res

    def _get_reservation_data(self, move):
        return {
            '_name': move.picking_id._name,
            'name': move.picking_id.name,
            'id': move.picking_id.id
        }

    def _get_report_data(self, product_template_ids=False, product_ids=False):
        assert product_template_ids or product_ids
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        res = {}

        if self.env.context.get('warehouse'):
            warehouse = self.env['stock.warehouse'].browse(self.env.context.get('warehouse'))
        else:
<<<<<<< HEAD
            warehouse = self.env['stock.warehouse'].browse(self.get_warehouses()[0]['id'])
=======
            warehouse = self.env['stock.warehouse'].search([['active', '=', True]])[0]
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        wh_location_ids = [loc['id'] for loc in self.env['stock.location'].search_read(
            [('id', 'child_of', warehouse.view_location_id.id)],
            ['id'],
        )]
<<<<<<< HEAD

        # Get the products we're working, fill the rendering context with some of their attributes.
        if product_template_ids:
            product_templates = self.env['product.template'].browse(product_template_ids)
            res['product_templates'] = product_templates
            res['product_templates_ids'] = product_templates.ids
            res['product_variants'] = product_templates.product_variant_ids
            res['multiple_product'] = len(product_templates.product_variant_ids) > 1
            res['uom'] = product_templates[:1].uom_id.display_name
            res['quantity_on_hand'] = sum(product_templates.mapped('qty_available'))
            res['virtual_available'] = sum(product_templates.mapped('virtual_available'))
            res['incoming_qty'] = sum(product_templates.mapped('incoming_qty'))
            res['outgoing_qty'] = sum(product_templates.mapped('outgoing_qty'))
        elif product_variant_ids:
            product_variants = self.env['product.product'].browse(product_variant_ids)
            res['product_templates'] = False
            res['product_variants'] = product_variants
            res['product_variants_ids'] = product_variants.ids
            res['multiple_product'] = len(product_variants) > 1
            res['uom'] = product_variants[:1].uom_id.display_name
            res['quantity_on_hand'] = sum(product_variants.mapped('qty_available'))
            res['virtual_available'] = sum(product_variants.mapped('virtual_available'))
            res['incoming_qty'] = sum(product_variants.mapped('incoming_qty'))
            res['outgoing_qty'] = sum(product_variants.mapped('outgoing_qty'))
        res.update(self._compute_draft_quantity_count(product_template_ids, product_variant_ids, wh_location_ids))

        res['lines'] = self._get_report_lines(product_template_ids, product_variant_ids, wh_location_ids)
        return res

    def _prepare_report_line(self, quantity, move_out=None, move_in=None, replenishment_filled=True, product=False, reservation=False):
=======
        # any quantities in this location will be considered free stock, others are free stock in transit
        wh_stock_location = warehouse.lot_stock_id

        res.update(self._get_report_header(product_template_ids, product_ids, wh_location_ids))

        res['lines'] = self._get_report_lines(product_template_ids, product_ids, wh_location_ids, wh_stock_location)
        return res

    def _prepare_report_line(self, quantity, move_out=None, move_in=None, replenishment_filled=True, product=False, reserved_move=False, in_transit=False, read=True):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        product = product or (move_out.product_id if move_out else move_in.product_id)
        is_late = move_out.date < move_in.date if (move_out and move_in) else False

        move_to_match_ids = self.env.context.get('move_to_match_ids') or []
        move_in_id = move_in.id if move_in else None
        move_out_id = move_out.id if move_out else None
<<<<<<< HEAD

        return {
            'document_in': move_in._get_source_document() if move_in else False,
            'document_out': move_out._get_source_document() if move_out else False,
            'product': {
                'id': product.id,
                'display_name': product.display_name
            },
            'replenishment_filled': replenishment_filled,
            'uom_id': product.uom_id,
            'receipt_date': format_date(self.env, move_in.date) if move_in else False,
            'delivery_date': format_date(self.env, move_out.date) if move_out else False,
=======
        line = {
            'document_in': False,
            'document_out': False,
            'receipt_date': False,
            'delivery_date': False,
            'product': {
                'id': product.id,
                'display_name': product.display_name,
            },
            'replenishment_filled': replenishment_filled,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'is_late': is_late,
            'quantity': float_round(quantity, precision_rounding=product.uom_id.rounding),
            'move_out': move_out,
            'move_in': move_in,
<<<<<<< HEAD
            'reservation': reservation,
            'is_matched': any(move_id in [move_in_id, move_out_id] for move_id in move_to_match_ids),
        }

    def _get_report_lines(self, product_template_ids, product_variant_ids, wh_location_ids):

        def _reconcile_out_with_ins(lines, out, ins, demand, product_rounding, only_matching_move_dest=True):
=======
            'reservation': self._get_reservation_data(reserved_move) if reserved_move else False,
            'in_transit': in_transit,
            'is_matched': any(move_id in [move_in_id, move_out_id] for move_id in move_to_match_ids),
            'uom_id' : product.uom_id.read()[0] if read else product.uom_id,
        }
        if move_in:
            document_in = move_in._get_source_document()
            line.update({
                'move_in' : move_in.read()[0] if read else move_in,
                'document_in' : {
                    '_name' : document_in._name,
                    'id' : document_in.id,
                    'name' : document_in.display_name,
                } if document_in else False,
                'receipt_date': format_date(self.env, move_in.date),
            })

        if move_out:
            document_out = move_out._get_source_document()
            line.update({
                'move_out' : move_out.read()[0] if read else move_out,
                'document_out' : {
                    '_name' : document_out._name,
                    'id' : document_out.id,
                    'name' : document_out.display_name,
                } if document_out else False,
                'delivery_date': format_date(self.env, move_out.date),
            })
            if move_out.picking_id and read:
                line['move_out'].update({
                    'picking_id': move_out.picking_id.read(fields=['id', 'priority'])[0],
                })
        return line

    def _get_report_lines(self, product_template_ids, product_ids, wh_location_ids, wh_stock_location, read=True):

        def _get_out_move_reserved_data(out, ins, used_reserved_moves):
            reserved_out = 0
            linked_moves = self.env['stock.move'].browse(out._rollup_move_origs()).filtered(lambda m: m.id not in ins.ids)
            # the move to show when qty is reserved
            reserved_move = self.env['stock.move']
            for move in linked_moves:
                if move.state not in ('partially_available', 'assigned'):
                    continue
                # count reserved stock.
                reserved = move.product_uom._compute_quantity(move.reserved_availability, move.product_id.uom_id)
                # check if the move reserved qty was counted before (happens if multiple outs share pick/pack)
                reserved = min(reserved - used_reserved_moves[move], out.product_qty)
                if reserved and not reserved_move:
                    reserved_move = move
                # add to reserved line data
                reserved_out += reserved
                used_reserved_moves[move] += reserved
                if float_compare(reserved_out, out.product_qty, precision_rounding=move.product_id.uom_id.rounding) >= 0:
                    break

            return {
                'reserved': reserved_out,
                'reserved_move': reserved_move,
                'linked_moves': linked_moves,
            }

        def _get_out_move_taken_from_stock_data(out, currents, reserved_data):
            reserved_out = reserved_data['reserved']
            demand_out = out.product_qty - reserved_out
            linked_moves = reserved_data['linked_moves']
            taken_from_stock_out = 0
            for move in linked_moves:
                if move.state in ('draft', 'cancel', 'assigned', 'done'):
                    continue
                reserved = move.product_uom._compute_quantity(move.reserved_availability, move.product_id.uom_id)
                demand = max(move.product_qty - reserved, 0)
                # to make sure we don't demand more than the out (useful when same pick/pack goes to multiple out)
                demand = min(demand, demand_out)
                if float_is_zero(demand, precision_rounding=move.product_id.uom_id.rounding):
                    continue
                # check available qty for move if chained, move available is what was move by orig moves
                if move.move_orig_ids:
                    move_in_qty = sum(move.move_orig_ids.filtered(lambda m: m.state == 'done').mapped('quantity_done'))
                    sibling_moves = (move.move_orig_ids.move_dest_ids - move)
                    move_out_qty = sum(sibling_moves.filtered(lambda m: m.state == 'done').mapped('quantity_done'))
                    move_available_qty = move_in_qty - move_out_qty - reserved
                else:
                    move_available_qty = currents[(out.product_id.id, move.location_id.id)]
                # count taken from stock, but avoid taking more than whats in stock in case of move origs,
                # this can happen if stock adjustment is done after orig moves are done
                taken_from_stock = min(demand, move_available_qty, currents[(out.product_id.id, move.location_id.id)])
                if taken_from_stock > 0:
                    currents[(out.product_id.id, move.location_id.id)] -= taken_from_stock
                    taken_from_stock_out += taken_from_stock
                demand_out -= taken_from_stock
            return {
                'taken_from_stock': taken_from_stock_out,
            }

        def _reconcile_out_with_ins(lines, out, ins, demand, product_rounding, only_matching_move_dest=True, read=True):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            index_to_remove = []
            for index, in_ in enumerate(ins):
                if float_is_zero(in_['qty'], precision_rounding=product_rounding):
                    index_to_remove.append(index)
                    continue
                if only_matching_move_dest and in_['move_dests'] and out.id not in in_['move_dests']:
                    continue
                taken_from_in = min(demand, in_['qty'])
                demand -= taken_from_in
<<<<<<< HEAD
                lines.append(self._prepare_report_line(taken_from_in, move_in=in_['move'], move_out=out))
=======
                lines.append(self._prepare_report_line(taken_from_in, move_in=in_['move'], move_out=out, read=read))
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                in_['qty'] -= taken_from_in
                if in_['qty'] <= 0:
                    index_to_remove.append(index)
                if float_is_zero(demand, precision_rounding=product_rounding):
                    break
            for index in reversed(index_to_remove):
                del ins[index]
            return demand

        in_domain, out_domain = self._move_confirmed_domain(
<<<<<<< HEAD
            product_template_ids, product_variant_ids, wh_location_ids
        )
        outs = self.env['stock.move'].search(out_domain, order='reservation_date, priority desc, date, id')
        outs_per_product = defaultdict(list)
        reserved_outs = self.env['stock.move']
        reserved_outs_quantitites = defaultdict(float)
        reserved_outs_per_product = defaultdict(list)
        outs_reservation = {}
        for out in outs:
            outs_per_product[out.product_id.id].append(out)
            out_qty_reserved = 0
            moves_orig = out._get_moves_orig()
            for move in moves_orig:
                rounding = move.product_id.uom_id.rounding
                move_qty_reserved = sum(move.move_line_ids.mapped('reserved_qty'))
                if float_is_zero(move_qty_reserved, precision_rounding=rounding):
                    continue
                already_used_qty = reserved_outs_quantitites.get(move, 0)
                remaining_qty = move_qty_reserved - already_used_qty
                if float_compare(remaining_qty, 0, precision_rounding=rounding) <= 0:
                    continue
                qty_reserved = min(remaining_qty, out.product_qty - out_qty_reserved)
                out_qty_reserved += qty_reserved
                reserved_outs_quantitites[move] += qty_reserved
                if float_compare(out_qty_reserved, out.product_qty, precision_rounding=rounding) >= 0:
                    break
            if not float_is_zero(out_qty_reserved, out.product_id.uom_id.rounding):
                reserved_outs |= out
                reserved_outs_per_product[out.product_id.id].append(out)
                outs_reservation[out.id] = out_qty_reserved
        # Different sort than unreserved outs
        reserved_outs = self.env['stock.move'].search([('id', 'in', reserved_outs.ids)], order="priority desc, date, id")
=======
            product_template_ids, product_ids, wh_location_ids
        )

        outs = self.env['stock.move'].search(out_domain, order='reservation_date, priority desc, date, id')
        outs_per_product = defaultdict(list)
        for out in outs:
            outs_per_product[out.product_id.id].append(out)

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ins = self.env['stock.move'].search(in_domain, order='priority desc, date, id')
        ins_per_product = defaultdict(list)
        for in_ in ins:
            ins_per_product[in_.product_id.id].append({
                'qty': in_.product_qty,
                'move': in_,
<<<<<<< HEAD
                'move_dests': in_._rollup_move_dests(set())
            })
        currents = outs.product_id._get_only_qty_available()

        lines = []
        for product in (ins | outs).product_id:
            product_rounding = product.uom_id.rounding
            for out in reserved_outs_per_product[product.id]:
                # Reconcile with reserved stock.
                reserved = outs_reservation[out.id]
                current = currents[product.id]
                currents[product.id] -= reserved
                lines.append(self._prepare_report_line(reserved, move_out=out, reservation=True))

            unreconciled_outs = []
            for out in outs_per_product[product.id]:
                reserved_availability = outs_reservation.get(out.id, 0)
                # Reconcile with the current stock.
                reserved = 0.0
                if not float_is_zero(reserved_availability, precision_rounding=product_rounding):
                    reserved = out.product_uom._compute_quantity(reserved_availability, product.uom_id)
                demand = out.product_qty - reserved

                if float_is_zero(demand, precision_rounding=product_rounding):
                    continue
                current = currents[product.id]
                taken_from_stock = min(demand, current)
                if not float_is_zero(taken_from_stock, precision_rounding=product_rounding):
                    currents[product.id] -= taken_from_stock
                    demand -= taken_from_stock
                    lines.append(self._prepare_report_line(taken_from_stock, move_out=out))
                # Reconcile with the ins.
                if not float_is_zero(demand, precision_rounding=product_rounding):
                    demand = _reconcile_out_with_ins(lines, out, ins_per_product[product.id], demand, product_rounding, only_matching_move_dest=True)
                if not float_is_zero(demand, precision_rounding=product_rounding):
                    unreconciled_outs.append((demand, out))

            # Another pass, in case there are some ins linked to a dest move but that still have some quantity available
            for (demand, out) in unreconciled_outs:
                demand = _reconcile_out_with_ins(lines, out, ins_per_product[product.id], demand, product_rounding, only_matching_move_dest=False)
                if not float_is_zero(demand, precision_rounding=product_rounding):
                    # Not reconciled
                    lines.append(self._prepare_report_line(demand, move_out=out, replenishment_filled=False))
            # Unused remaining stock.
            free_stock = currents.get(product.id, 0)
            if not float_is_zero(free_stock, precision_rounding=product_rounding):
                lines.append(self._prepare_report_line(free_stock, product=product))
=======
                'move_dests': in_._rollup_move_dests()
            })

        qties = self.env['stock.quant']._read_group([('location_id', 'in', wh_location_ids), ('quantity', '>', 0), ('product_id', 'in', outs.product_id.ids)],
                                                    ['product_id', 'location_id', 'quantity:sum', 'reserved_quantity:sum'], ['product_id', 'location_id'], lazy=False)
        wh_stock_sub_location_ids = wh_stock_location.search([('id', 'child_of', wh_stock_location.id)]).ids
        currents = defaultdict(float)
        for qty in qties:
            location_id = qty['location_id'][0]
            # any sublocation qties will be added to the main stock location qty
            if location_id in wh_stock_sub_location_ids:
                location_id = wh_stock_location.id
            currents[(qty['product_id'][0], location_id)] += qty['quantity'] - qty['reserved_quantity']
        moves_data = {}
        for _, out_moves in outs_per_product.items():
            # to handle multiple out wtih same in (ex: same pick/pack for 2 outs)
            used_reserved_moves = defaultdict(float)
            # for all out moves, check for linked moves and remove qty from current stock
            for out in out_moves:
                moves_data[out] = _get_out_move_reserved_data(out, ins, used_reserved_moves)
                data = _get_out_move_taken_from_stock_data(out, currents, moves_data[out])
                moves_data[out].update(data)
        lines = []
        for product in (ins | outs).product_id:
            product_rounding = product.uom_id.rounding
            unreconciled_outs = []
            # remaining stock
            free_stock = currents[product.id, wh_stock_location.id]
            transit_stock = sum([v if k[0] == product.id else 0 for k, v in currents.items()]) - free_stock
            # add report lines and see if remaining demand can be reconciled by unreservable stock or ins
            for out in outs_per_product[product.id]:
                reserved_out = moves_data[out].get('reserved')
                taken_from_stock_out = moves_data[out].get('taken_from_stock')
                reserved_move = moves_data[out].get('reserved_move')
                demand_out = out.product_qty
                # Reconcile with the reserved stock.
                if reserved_out > 0:
                    demand_out = max(demand_out - reserved_out, 0)
                    in_transit = bool(reserved_move.move_orig_ids)
                    lines.append(self._prepare_report_line(reserved_out, move_out=out, reserved_move=reserved_move, in_transit=in_transit, read=read))

                if float_is_zero(demand_out, precision_rounding=product_rounding):
                    continue

                # Reconcile with the current stock.
                if taken_from_stock_out > 0:
                    demand_out = max(demand_out - taken_from_stock_out, 0)
                    lines.append(self._prepare_report_line(taken_from_stock_out, move_out=out, read=read))

                if float_is_zero(demand_out, precision_rounding=product_rounding):
                    continue

                # Reconcile with unreservable stock, quantities that are in stock but not in correct location to reserve from (in transit)
                unreservable_qty = min(demand_out, transit_stock)
                if unreservable_qty > 0:
                    demand_out -= unreservable_qty
                    transit_stock -= unreservable_qty
                    lines.append(self._prepare_report_line(unreservable_qty, move_out=out, in_transit=True, read=read))

                if float_is_zero(demand_out, precision_rounding=product_rounding):
                    continue

                # Reconcile with the ins.
                if not float_is_zero(demand_out, precision_rounding=product_rounding):
                    demand_out = _reconcile_out_with_ins(lines, out, ins_per_product[product.id], demand_out, product_rounding, only_matching_move_dest=True, read=read)
                if not float_is_zero(demand_out, precision_rounding=product_rounding):
                    unreconciled_outs.append((demand_out, out))

            # Another pass, in case there are some ins linked to a dest move but that still have some quantity available
            for (demand, out) in unreconciled_outs:
                demand = _reconcile_out_with_ins(lines, out, ins_per_product[product.id], demand, product_rounding, only_matching_move_dest=False, read=read)
                if not float_is_zero(demand, precision_rounding=product_rounding):
                    # Not reconciled
                    lines.append(self._prepare_report_line(demand, move_out=out, replenishment_filled=False, read=read))
            # Stock in transit
            if not float_is_zero(transit_stock, precision_rounding=product_rounding):
                lines.append(self._prepare_report_line(transit_stock, product=product, in_transit=True, read=read))

            # Unused remaining stock.
            if not float_is_zero(free_stock, precision_rounding=product_rounding):
                lines.append(self._prepare_report_line(free_stock, product=product, read=read))
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            # In moves not used.
            for in_ in ins_per_product[product.id]:
                if float_is_zero(in_['qty'], precision_rounding=product_rounding):
                    continue
<<<<<<< HEAD
                lines.append(self._prepare_report_line(in_['qty'], move_in=in_['move']))
        return lines

    @api.model
    def get_warehouses(self):
        return self.env['stock.warehouse'].search_read(fields=['id', 'name', 'code'])


class ReplenishmentTemplateReport(models.AbstractModel):
    _name = 'report.stock.report_product_template_replenishment'
    _description = "Stock Replenishment Report"
    _inherit = 'report.stock.report_product_product_replenishment'

    @api.model
    def get_report_values(self, docids, data=None, serialize=False):
        docs = self._get_report_data(product_template_ids=docids)
        if serialize:
            docs = self._serialize_docs(docs, product_template_ids=docids)
=======
                lines.append(self._prepare_report_line(in_['qty'], move_in=in_['move'], read=read))
        return lines

    @api.model
    def action_reserve_linked_picks(self, move_id):
        move_id = self.env['stock.move'].browse(move_id)
        move_ids = move_id.browse(move_id._rollup_move_origs())
        picking_ids = move_ids.picking_id.filtered(lambda p: p.state not in ['draft', 'cancel', 'done'])
        if picking_ids:
            picking_ids.action_assign()
        return move_ids

    @api.model
    def action_unreserve_linked_picks(self, move_id):
        move_id = self.env['stock.move'].browse(move_id)
        move_ids = move_id.browse(move_id._rollup_move_origs())
        move_ids.picking_id.filtered(lambda p: p.state not in ['draft', 'cancel', 'done']).do_unreserve()
        return move_ids


class StockForecastedTemplate(models.AbstractModel):
    _name = 'stock.forecasted_product_template'
    _description = "Stock Replenishment Report"
    _inherit = 'stock.forecasted_product_product'

    @api.model
    def get_report_values(self, docids, data=None):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return {
            'data': data,
            'doc_ids': docids,
            'doc_model': 'product.template',
<<<<<<< HEAD
            'docs': docs,
=======
            'docs': self._get_report_data(product_template_ids=docids),
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'precision': self.env['decimal.precision'].precision_get('Product Unit of Measure'),
        }
