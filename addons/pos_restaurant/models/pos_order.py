# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
from odoo.tools import groupby
from re import search
from functools import partial

import pytz

from odoo import api, fields, models


class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'

    note = fields.Char('Kitchen Note added by the waiter.')
    uuid = fields.Char(string='Uuid', readonly=True, copy=False)
    mp_skip = fields.Boolean('Skip line when sending ticket to kitchen printers.')


class PosOrder(models.Model):
    _inherit = 'pos.order'

    table_id = fields.Many2one('restaurant.table', string='Table', help='The table where this order was served', index='btree_not_null', readonly=True)
    customer_count = fields.Integer(string='Guests', help='The amount of customers that have been served by this order.', readonly=True)
    multiprint_resume = fields.Char(string='Multiprint Resume', help="Last printed state of the order")

<<<<<<< HEAD
    def _get_pack_lot_lines(self, order_lines):
        """Add pack_lot_lines to the order_lines.

        The function doesn't return anything but adds the results directly to the order_lines.

        :param order_lines: order_lines for which the pack_lot_lines are to be requested.
        :type order_lines: pos.order.line.
        """
        pack_lots = self.env['pos.pack.operation.lot'].search_read(
                domain = [('pos_order_line_id', 'in', [order_line['id'] for order_line in order_lines])],
                fields = [
                    'id',
                    'lot_name',
                    'pos_order_line_id'
                    ])
        for pack_lot in pack_lots:
            pack_lot['order_line'] = pack_lot['pos_order_line_id'][0]
            pack_lot['server_id'] = pack_lot['id']

            del pack_lot['pos_order_line_id']
            del pack_lot['id']

        for order_line_id, pack_lot_ids in groupby(pack_lots, key=lambda x:x['order_line']):
            next(order_line for order_line in order_lines if order_line['id'] == order_line_id)['pack_lot_ids'] = list(pack_lot_ids)

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    def _get_fields_for_order_line(self):
        fields = super(PosOrder, self)._get_fields_for_order_line()
        fields.extend([
            'note',
            'uuid',
            'mp_skip',
        ])
        return fields

<<<<<<< HEAD
    def _prepare_order_line(self, order_line):
        """Method that will allow the cleaning of values to send the correct information.
        :param order_line: order_line that will be cleaned.
        :type order_line: pos.order.line.
        :returns: dict -- dict representing the order line's values.
        """
        order_line = super()._prepare_order_line(order_line)
        order_line["product_id"] = order_line["product_id"][0]
        order_line["server_id"] = order_line["id"]

        del order_line["id"]
        if not "pack_lot_ids" in order_line:
            order_line["pack_lot_ids"] = []
        else:
            order_line["pack_lot_ids"] = [[0, 0, lot] for lot in order_line["pack_lot_ids"]]
        return order_line

    def _get_order_lines(self, orders):
        """Add pos_order_lines to the orders.

        The function doesn't return anything but adds the results directly to the orders.

        :param orders: orders for which the order_lines are to be requested.
        :type orders: pos.order.
        """
        order_lines = self.env['pos.order.line'].search_read(
                domain = [('order_id', 'in', [to['id'] for to in orders])],
                fields = self._get_fields_for_order_line())

        if order_lines != []:
            self._get_pack_lot_lines(order_lines)

        extended_order_lines = []
        for order_line in order_lines:
            extended_order_lines.append([0, 0, self._prepare_order_line(order_line)])

        for order_id, order_lines in groupby(extended_order_lines, key=lambda x:x[2]['order_id']):
            next(order for order in orders if order['id'] == order_id[0])['lines'] = list(order_lines)

    def _get_fields_for_payment_lines(self):
        return [
            'id',
            'amount',
            'pos_order_id',
            'payment_method_id',
            'card_type',
            'cardholder_name',
            'transaction_id',
            'payment_status'
            ]

    def _get_payments_lines_list(self, orders):
        payment_lines = self.env['pos.payment'].search_read(
                domain = [('pos_order_id', 'in', [po['id'] for po in orders])],
                fields = self._get_fields_for_payment_lines())

        extended_payment_lines = []
        for payment_line in payment_lines:
            payment_line['server_id'] = payment_line['id']
            payment_line['payment_method_id'] = payment_line['payment_method_id'][0]

            del payment_line['id']
            extended_payment_lines.append([0, 0, payment_line])
        return extended_payment_lines

    def _get_payment_lines(self, orders):
        """Add account_bank_statement_lines to the orders.

        The function doesn't return anything but adds the results directly to the orders.

        :param orders: orders for which the payment_lines are to be requested.
        :type orders: pos.order.
        """
        extended_payment_lines = self._get_payments_lines_list(orders)
        for order_id, payment_lines in groupby(extended_payment_lines, key=lambda x:x[2]['pos_order_id']):
            next(order for order in orders if order['id'] == order_id[0])['statement_ids'] = list(payment_lines)

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    def _get_fields_for_draft_order(self):
        fields = super()._get_fields_for_draft_order()
        fields.extend([
            'table_id',
            'customer_count',
            'multiprint_resume',
<<<<<<< HEAD
            'access_token',
        ]
=======
        ])
        return fields

    def _get_domain_for_draft_orders(self, table_ids):
        """ Get the domain to search for draft orders on a table.
        :param table_ids: Ids of the selected tables.
        :type table_ids: list of int.
        "returns: list -- list of tuples that represents a domain.
        """
        return [('state', '=', 'draft'), ('table_id', 'in', table_ids)]
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def _get_domain_for_draft_orders(self, table_ids):
        """ Get the domain to search for draft orders on a table.
        :param table_ids: Ids of the selected tables.
        :type table_ids: list of int.
        "returns: list -- list of tuples that represents a domain.
        """
        return [('state', '=', 'draft'), ('table_id', 'in', table_ids)]

    def _add_activated_coupon_to_draft_orders(self, table_orders):
        table_orders = super()._add_activated_coupon_to_draft_orders(table_orders)
        return table_orders

    @api.model
    def get_table_draft_orders(self, table_ids):
        """Generate an object of all draft orders for the given table.

        Generate and return an JSON object with all draft orders for the given table, to send to the
        front end application.

        :param table_ids: Ids of the selected tables.
        :type table_ids: list of int.
        :returns: list -- list of dict representing the table orders
        """
        table_orders = self.search_read(
                domain=self._get_domain_for_draft_orders(table_ids),
                fields=self._get_fields_for_draft_order())

        self._get_order_lines(table_orders)
        self._get_payment_lines(table_orders)

        self._prepare_order(table_orders)

        return self._add_activated_coupon_to_draft_orders(table_orders)

    @api.model
    def _prepare_order(self, orders):
        super(PosOrder, self)._prepare_order(orders)
        for order in orders:
            if order['table_id']:
                order['table_id'] = order['table_id'][0]

    def set_tip(self, tip_line_vals):
        """Set tip to `self` based on values in `tip_line_vals`."""

        self.ensure_one()
        PosOrderLine = self.env['pos.order.line']
        process_line = partial(PosOrderLine._order_line_fields, session_id=self.session_id.id)

        # 1. add/modify tip orderline
        processed_tip_line_vals = process_line([0, 0, tip_line_vals])[2]
        processed_tip_line_vals.update({ "order_id": self.id })
        tip_line = self.lines.filtered(lambda line: line.product_id == self.session_id.config_id.tip_product_id)
        if not tip_line:
            tip_line = PosOrderLine.create(processed_tip_line_vals)
        else:
            tip_line.write(processed_tip_line_vals)

        # 2. modify payment
        payment_line = self.payment_ids.filtered(lambda line: not line.is_change)[0]
        # TODO it would be better to throw error if there are multiple payment lines
        # then ask the user to select which payment to update, no?
        payment_line._update_payment_line_for_tip(tip_line.price_subtotal_incl)

        # 3. flag order as tipped and update order fields
        self.write({
            "is_tipped": True,
            "tip_amount": tip_line.price_subtotal_incl,
            "amount_total": self.amount_total + tip_line.price_subtotal_incl,
            "amount_paid": self.amount_paid + tip_line.price_subtotal_incl,
        })

    def set_no_tip(self):
        """Override this method to introduce action when setting no tip."""
        self.ensure_one()
        self.write({
            "is_tipped": True,
            "tip_amount": 0,
        })

    @api.model
    def _order_fields(self, ui_order):
        order_fields = super(PosOrder, self)._order_fields(ui_order)
        order_fields['table_id'] = ui_order.get('table_id', False)
        order_fields['customer_count'] = ui_order.get('customer_count', 0)
        order_fields['multiprint_resume'] = ui_order.get('multiprint_resume', False)
        return order_fields

    def _export_for_ui(self, order):
        result = super(PosOrder, self)._export_for_ui(order)
        result['table_id'] = order.table_id.id
        return result
