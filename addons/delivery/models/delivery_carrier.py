# Part of Odoo. See LICENSE file for full copyright and licensing details.

import psycopg2
import re

<<<<<<< HEAD
from odoo import api, fields, models, registry, SUPERUSER_ID, _
from odoo.tools.float_utils import float_round
from odoo.tools.misc import groupby
from odoo.exceptions import UserError

from .delivery_request_objects import DeliveryCommodity, DeliveryPackage
=======
from odoo import _, api, fields, models, registry, Command, SUPERUSER_ID
from odoo.exceptions import UserError
from odoo.tools.safe_eval import safe_eval
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6


class DeliveryCarrier(models.Model):
    _name = 'delivery.carrier'
    _description = "Shipping Methods"
    _order = 'sequence, id'

    ''' A Shipping Provider

    In order to add your own external provider, follow these steps:

    1. Create your model MyProvider that _inherit 'delivery.carrier'
    2. Extend the selection of the field "delivery_type" with a pair
       ('<my_provider>', 'My Provider')
    3. Add your methods:
       <my_provider>_rate_shipment
       <my_provider>_send_shipping
       <my_provider>_get_tracking_link
       <my_provider>_cancel_shipment
       _<my_provider>_get_default_custom_package_code
       (they are documented hereunder)
    '''

    # -------------------------------- #
    # Internals for shipping providers #
    # -------------------------------- #

    name = fields.Char('Delivery Method', required=True, translate=True)
    active = fields.Boolean(default=True)
    sequence = fields.Integer(help="Determine the display order", default=10)
    # This field will be overwritten by internal shipping providers by adding their own type (ex: 'fedex')
    delivery_type = fields.Selection(
        [('base_on_rule', 'Based on Rules'), ('fixed', 'Fixed Price')],
        string='Provider',
        default='fixed',
        required=True,
    )
    integration_level = fields.Selection([('rate', 'Get Rate'), ('rate_and_ship', 'Get Rate and Create Shipment')], string="Integration Level", default='rate_and_ship', help="Action while validating Delivery Orders")
    prod_environment = fields.Boolean("Environment", help="Set to True if your credentials are certified for production.")
    debug_logging = fields.Boolean('Debug logging', help="Log requests in order to ease debugging")
    company_id = fields.Many2one('res.company', string='Company', related='product_id.company_id', store=True, readonly=False)
    product_id = fields.Many2one('product.product', string='Delivery Product', required=True, ondelete='restrict')
    currency_id = fields.Many2one(related='product_id.currency_id')

    invoice_policy = fields.Selection(
        selection=[('estimated', "Estimated cost")],
        string="Invoicing Policy",
        default='estimated',
        required=True,
        help="Estimated Cost: the customer will be invoiced the estimated cost of the shipping.",
    )

    country_ids = fields.Many2many('res.country', 'delivery_carrier_country_rel', 'carrier_id', 'country_id', 'Countries')
    state_ids = fields.Many2many('res.country.state', 'delivery_carrier_state_rel', 'carrier_id', 'state_id', 'States')
    zip_prefix_ids = fields.Many2many(
        'delivery.zip.prefix', 'delivery_zip_prefix_rel', 'carrier_id', 'zip_prefix_id', 'Zip Prefixes',
        help="Prefixes of zip codes that this carrier applies to. Note that regular expressions can be used to support countries with varying zip code lengths, i.e. '$' can be added to end of prefix to match the exact zip (e.g. '100$' will only match '100' and not '1000')")
    carrier_description = fields.Text(
        'Carrier Description', translate=True,
        help="A description of the delivery method that you want to communicate to your customers on the Sales Order and sales confirmation email."
             "E.g. instructions for customers to follow.")

    margin = fields.Float(help='This percentage will be added to the shipping price.')
    fixed_margin = fields.Float(help='This fixed amount will be added to the shipping price.')
    free_over = fields.Boolean('Free if order amount is above', help="If the order total amount (shipping excluded) is above or equal to this value, the customer benefits from a free shipping", default=False)
    amount = fields.Float(
        string="Amount",
        default=1000,
        help="Amount of the order to benefit from a free shipping, expressed in the company currency",
    )

    can_generate_return = fields.Boolean(compute="_compute_can_generate_return")
    return_label_on_delivery = fields.Boolean(string="Generate Return Label", help="The return label is automatically generated at the delivery.")
    get_return_label_from_portal = fields.Boolean(string="Return Label Accessible from Customer Portal", help="The return label can be downloaded by the customer from the customer portal.")

    supports_shipping_insurance = fields.Boolean(compute="_compute_supports_shipping_insurance")
    shipping_insurance = fields.Integer(
        "Insurance Percentage",
        help="Shipping insurance is a service which may reimburse senders whose parcels are lost, stolen, and/or damaged in transit.",
        default=0
    )

    price_rule_ids = fields.One2many(
        'delivery.price.rule', 'carrier_id', 'Pricing Rules', copy=True
    )

    _sql_constraints = [
        ('margin_not_under_100_percent', 'CHECK (margin >= -1)', 'Margin cannot be lower than -100%'),
        ('shipping_insurance_is_percentage', 'CHECK(shipping_insurance >= 0 AND shipping_insurance <= 100)', "The shipping insurance must be a percentage between 0 and 100."),
    ]

    @api.depends('delivery_type')
    def _compute_can_generate_return(self):
        for carrier in self:
            carrier.can_generate_return = False

    @api.depends('delivery_type')
    def _compute_supports_shipping_insurance(self):
        for carrier in self:
            carrier.supports_shipping_insurance = False

    def toggle_prod_environment(self):
        for c in self:
            c.prod_environment = not c.prod_environment

    def toggle_debug(self):
        for c in self:
            c.debug_logging = not c.debug_logging

    def install_more_provider(self):
        exclude_apps = ['delivery_barcode', 'delivery_stock_picking_batch', 'delivery_iot']
        return {
            'name': _('New Providers'),
            'view_mode': 'kanban,form',
            'res_model': 'ir.module.module',
            'domain': [['name', '=like', 'delivery_%'], ['name', 'not in', exclude_apps]],
            'type': 'ir.actions.act_window',
            'help': _('''<p class="o_view_nocontent">
                    Buy Odoo Enterprise now to get more providers.
                </p>'''),
        }

    def available_carriers(self, partner):
        return self.filtered(lambda c: c._match_address(partner))

    def _match_address(self, partner):
        self.ensure_one()
        if self.country_ids and partner.country_id not in self.country_ids:
            return False
        if self.state_ids and partner.state_id not in self.state_ids:
            return False
        if self.zip_prefix_ids:
            regex = re.compile('|'.join(['^' + zip_prefix for zip_prefix in self.zip_prefix_ids.mapped('name')]))
            if not re.match(regex, partner.zip.upper()):
                return False
        return True

    @api.onchange('integration_level')
    def _onchange_integration_level(self):
        if self.integration_level == 'rate':
            self.invoice_policy = 'estimated'

    @api.onchange('can_generate_return')
    def _onchange_can_generate_return(self):
        if not self.can_generate_return:
            self.return_label_on_delivery = False

    @api.onchange('return_label_on_delivery')
    def _onchange_return_label_on_delivery(self):
        if not self.return_label_on_delivery:
            self.get_return_label_from_portal = False

    @api.onchange('country_ids')
    def _onchange_country_ids(self):
        self.state_ids -= self.state_ids.filtered(
            lambda state: state._origin.id not in self.country_ids.state_ids.ids
        )
        if not self.country_ids:
            self.zip_prefix_ids = [Command.clear()]

    def _get_delivery_type(self):
        """Return the delivery type.

        This method needs to be overridden by a delivery carrier module if the delivery type is not
        stored on the field `delivery_type`.
        """
        self.ensure_one()
        return self.delivery_type

    # -------------------------- #
    # API for external providers #
    # -------------------------- #

    def rate_shipment(self, order):
        ''' Compute the price of the order shipment

        :param order: record of sale.order
        :return dict: {'success': boolean,
                       'price': a float,
                       'error_message': a string containing an error message,
                       'warning_message': a string containing a warning message}
                       # TODO maybe the currency code?
        '''
        self.ensure_one()
        if hasattr(self, '%s_rate_shipment' % self.delivery_type):
            res = getattr(self, '%s_rate_shipment' % self.delivery_type)(order)
            # apply fiscal position
            company = self.company_id or order.company_id or self.env.company
            res['price'] = self.product_id._get_tax_included_unit_price(
                company,
                company.currency_id,
                order.date_order,
                'sale',
                fiscal_position=order.fiscal_position_id,
                product_price_unit=res['price'],
                product_currency=company.currency_id
            )
            # apply margin on computed price
            res['price'] = float(res['price']) * (1.0 + self.margin) + self.fixed_margin
            # save the real price in case a free_over rule overide it to 0
            res['carrier_price'] = res['price']
            # free when order is large enough
            if res['success'] and self.free_over and order._compute_amount_total_without_delivery() >= self.amount:
                res['warning_message'] = _('The shipping is free since the order amount exceeds %.2f.') % (self.amount)
                res['price'] = 0.0
            return res

    def log_xml(self, xml_string, func):
        self.ensure_one()

        if self.debug_logging:
            self.env.flush_all()
            db_name = self._cr.dbname

            # Use a new cursor to avoid rollback that could be caused by an upper method
            try:
                db_registry = registry(db_name)
                with db_registry.cursor() as cr:
                    env = api.Environment(cr, SUPERUSER_ID, {})
                    IrLogging = env['ir.logging']
                    IrLogging.sudo().create({'name': 'delivery.carrier',
                              'type': 'server',
                              'dbname': db_name,
                              'level': 'DEBUG',
                              'message': xml_string,
                              'path': self.delivery_type,
                              'func': func,
                              'line': 1})
            except psycopg2.Error:
                pass

    # ------------------------------------------------ #
    # Fixed price shipping, aka a very simple provider #
    # ------------------------------------------------ #

    fixed_price = fields.Float(compute='_compute_fixed_price', inverse='_set_product_fixed_price', store=True, string='Fixed Price')

    @api.depends('product_id.list_price', 'product_id.product_tmpl_id.list_price')
    def _compute_fixed_price(self):
        for carrier in self:
            carrier.fixed_price = carrier.product_id.list_price

    def _set_product_fixed_price(self):
        for carrier in self:
            carrier.product_id.list_price = carrier.fixed_price

    def fixed_rate_shipment(self, order):
        carrier = self._match_address(order.partner_shipping_id)
        if not carrier:
            return {'success': False,
                    'price': 0.0,
                    'error_message': _('Error: this delivery method is not available for this address.'),
                    'warning_message': False}
        price = order.pricelist_id._get_product_price(self.product_id, 1.0)
        return {'success': True,
                'price': price,
                'error_message': False,
                'warning_message': False}

    # ----------------------------------- #
    # Based on rule delivery type methods #
    # ----------------------------------- #

    def base_on_rule_rate_shipment(self, order):
        carrier = self._match_address(order.partner_shipping_id)
        if not carrier:
            return {'success': False,
                    'price': 0.0,
                    'error_message': _('Error: this delivery method is not available for this address.'),
                    'warning_message': False}

        try:
            price_unit = self._get_price_available(order)
        except UserError as e:
            return {'success': False,
                    'price': 0.0,
                    'error_message': e.args[0],
                    'warning_message': False}

        price_unit = self._compute_currency(order, price_unit, 'company_to_pricelist')

        return {'success': True,
                'price': price_unit,
                'error_message': False,
                'warning_message': False}

    def _get_conversion_currencies(self, order, conversion):
        if conversion == 'company_to_pricelist':
            from_currency, to_currency = order.company_id.currency_id, order.currency_id
        elif conversion == 'pricelist_to_company':
            from_currency, to_currency = order.currency_id, order.company_id.currency_id

<<<<<<< HEAD
        total_weight = order._get_estimated_weight() + default_package_type.base_weight
        if total_weight == 0.0:
            weight_uom_name = self.env['product.template']._get_weight_uom_name_from_ir_config_parameter()
            raise UserError(_("The package cannot be created because the total weight of the products in the picking is 0.0 %s") % (weight_uom_name))
        # If max weight == 0 => division by 0. If this happens, we want to have
        # more in the max weight than in the total weight, so that it only
        # creates ONE package with everything.
        max_weight = default_package_type.max_weight or total_weight + 1
        total_full_packages = int(total_weight / max_weight)
        last_package_weight = total_weight % max_weight

        package_weights = [max_weight] * total_full_packages + ([last_package_weight] if last_package_weight else [])
        partial_cost = total_cost / len(package_weights)  # separate the cost uniformly
        order_commodities = self._get_commodities_from_order(order)

        # Split the commodities value uniformly as well
        for commodity in order_commodities:
            commodity.monetary_value /= len(package_weights)
            commodity.qty = max(1, commodity.qty // len(package_weights))

        for weight in package_weights:
            packages.append(DeliveryPackage(order_commodities, weight, default_package_type, total_cost=partial_cost, currency=order.company_id.currency_id, order=order))
        return packages
=======
        return from_currency, to_currency

    def _compute_currency(self, order, price, conversion):
        from_currency, to_currency = self._get_conversion_currencies(order, conversion)
        if from_currency.id == to_currency.id:
            return price
        return from_currency._convert(price, to_currency, order.company_id, order.date_order or fields.Date.today())
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def _get_price_available(self, order):
        self.ensure_one()
        self = self.sudo()
        order = order.sudo()
        total = weight = volume = quantity = 0
        total_delivery = 0.0
        for line in order.order_line:
            if line.state == 'cancel':
                continue
            if line.is_delivery:
                total_delivery += line.price_total
            if not line.product_id or line.is_delivery:
                continue
            if line.product_id.type == "service":
                continue
            qty = line.product_uom._compute_quantity(line.product_uom_qty, line.product_id.uom_id)
            weight += (line.product_id.weight or 0.0) * qty
            volume += (line.product_id.volume or 0.0) * qty
            quantity += qty
        total = (order.amount_total or 0.0) - total_delivery

        total = self._compute_currency(order, total, 'pricelist_to_company')
        # weight is either,
        # 1- weight chosen by user in choose.delivery.carrier wizard passed by context
        # 2- saved weight to use on sale order
        # 3- total order line weight as fallback
        weight = self.env.context.get('order_weight') or order.shipping_weight or weight
        return self._get_price_from_picking(total, weight, volume, quantity)

    def _get_price_dict(self, total, weight, volume, quantity):
        '''Hook allowing to retrieve dict to be used in _get_price_from_picking() function.
        Hook to be overridden when we need to add some field to product and use it in variable factor from price rules. '''
        return {
            'price': total,
            'volume': volume,
            'weight': weight,
            'wv': volume * weight,
            'quantity': quantity
        }

<<<<<<< HEAD
        # Create one package: either everything is in pack or nothing is.
        if picking.weight_bulk:
            commodities = self._get_commodities_from_stock_move_lines(picking.move_line_ids)
            package_total_cost = 0.0
            for move_line in picking.move_line_ids:
                package_total_cost += self._product_price_to_company_currency(move_line.qty_done, move_line.product_id, picking.company_id)
            packages.append(DeliveryPackage(commodities, picking.weight_bulk, default_package_type, name='Bulk Content', total_cost=package_total_cost, currency=picking.company_id.currency_id, picking=picking))
        elif not packages:
            raise UserError(_("The package cannot be created because the total weight of the products in the picking is 0.0 %s") % (picking.weight_uom_name))

        return packages

    def _get_commodities_from_order(self, order):
        commodities = []

        for line in order.order_line.filtered(lambda line: not line.is_delivery and not line.display_type):
            unit_quantity = line.product_uom._compute_quantity(line.product_uom_qty, line.product_id.uom_id)
            rounded_qty = max(1, float_round(unit_quantity, precision_digits=0))
            country_of_origin = line.product_id.country_of_origin.code or order.warehouse_id.partner_id.country_id.code
            commodities.append(DeliveryCommodity(line.product_id, amount=rounded_qty, monetary_value=line.price_reduce_taxinc, country_of_origin=country_of_origin))

        return commodities

    def _get_commodities_from_stock_move_lines(self, move_lines):
        commodities = []

        product_lines = move_lines.filtered(lambda line: line.product_id.type in ['product', 'consu'])
        for product, lines in groupby(product_lines, lambda x: x.product_id):
            unit_quantity = sum(
                line.product_uom_id._compute_quantity(
                    line.qty_done if line.state == 'done' else line.reserved_uom_qty,
                    product.uom_id)
                for line in lines)
            rounded_qty = max(1, float_round(unit_quantity, precision_digits=0))
            country_of_origin = product.country_of_origin.code or lines[0].picking_id.picking_type_id.warehouse_id.partner_id.country_id.code
            unit_price = sum(line.sale_price for line in lines) / rounded_qty
            commodities.append(DeliveryCommodity(product, amount=rounded_qty, monetary_value=unit_price, country_of_origin=country_of_origin))

        return commodities

    def _product_price_to_company_currency(self, quantity, product, company):
        return company.currency_id._convert(quantity * product.standard_price, product.currency_id, company, fields.Date.today())
=======
    def _get_price_from_picking(self, total, weight, volume, quantity):
        price = 0.0
        criteria_found = False
        price_dict = self._get_price_dict(total, weight, volume, quantity)
        if self.free_over and total >= self.amount:
            return 0
        for line in self.price_rule_ids:
            test = safe_eval(line.variable + line.operator + str(line.max_value), price_dict)
            if test:
                price = line.list_base_price + line.list_price * price_dict[line.variable_factor]
                criteria_found = True
                break
        if not criteria_found:
            raise UserError(_("Not available for current order"))

        return price
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
