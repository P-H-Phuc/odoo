from datetime import datetime, time
from dateutil.relativedelta import relativedelta

from markupsafe import escape, Markup
from pytz import timezone, UTC
from werkzeug.urls import url_encode

from odoo import api, fields, models, _
from odoo.osv import expression
from odoo.tools import DEFAULT_SERVER_DATETIME_FORMAT, format_amount, format_date, formatLang, get_lang, groupby
from odoo.tools.float_utils import float_compare, float_is_zero, float_round
from odoo.exceptions import UserError, ValidationError


class RequestForQuotation(models.Model):
    _name = "request.for.quotation"
    _description = "Request For Quotation"
    _inherit = ['mail.thread']
    
    def _get_config_approver(self):
        return self.env['configure.approver'].search([('apply_for', 'in', ['purchase', 'both'])], limit=1)
    
    def _get_default_pic(self):
        config_approver = self._get_config_approver()
        return config_approver.pic_id.id
    
    @api.model
    def _get_default_name(self):
        return self.env['ir.sequence'].next_by_code('request.for.quotation')
    
    name = fields.Char(string='RFQ Number', required=True, default=_('New'), tracking=True, readonly=True, copy=False, inverse='_compute_name')
    prepared_id = fields.Many2one(
        comodel_name='res.users', string='Prepared By', default=_get_default_pic, readonly=True)
    is_pic = fields.Boolean(string='Is PIC', compute='_compute_is_pic')
    company_id = fields.Many2one(
        comodel_name='res.company', string='Company', index=True, default=lambda self: self.env.company.id, tracking=True)
    partner_id = fields.Many2one(
        comodel_name='res.partner', string='Vendor', required=True, tracking=True)
    origin = fields.Char(string='Source Document', tracking=True)
    date_order = fields.Datetime(string='Order Deadline', required=True, index=True, copy=False, default=fields.Datetime.now, tracking=True)
    currency_id = fields.Many2one(
        comodel_name='res.currency', string='Currency', required=True, default=lambda self: self.env.company.currency_id.id)
    state = fields.Selection([
        ('draft', 'RFQ'),
        ('sent', 'RFQ Sent'),
        ('done', 'Done')
    ], string='Status', readonly=True, copy=False, index=True, tracking=True, default='draft')
    order_line = fields.One2many(
        comodel_name='request.for.quotation.line', inverse_name='order_id', string='Order Lines', copy=False)
    notes = fields.Html(string='Terms and Conditions', tracking=True)
    date_planned = fields.Datetime(string='Expected Arrival', index=True, copy=False, tracking=True)
    amount_untaxed = fields.Monetary(string='Untaxed Amount', store=True, readonly=True, compute='_amount_all', tracking=True)
    tax_totals = fields.Binary(compute='_compute_tax_totals', exportable=False)
    amount_tax = fields.Monetary(string='Taxes', store=True, readonly=True, compute='_amount_all')
    amount_total = fields.Monetary(string='Total', store=True, readonly=True, compute='_amount_all')
    date_sent = fields.Datetime(string='Sent Date', readonly=True, copy=False)
    
    ######## Overwrite ########
    
    ######## COMPUTE ########
    def _compute_name(self):
        for order in self:
            rfqs = self.env['request.for.quotation'].search_count([])
            print(rfqs)
            order.name = 'RFQ' + str(rfqs).zfill(6)
    
    @api.depends('order_line.price_total')
    def _amount_all(self):
        for order in self:
            order_lines = order.order_line.filtered(lambda l: l.state != 'cancel')
            order.amount_untaxed = sum(order_lines.mapped('price_subtotal'))
            order.amount_tax = sum(order_lines.mapped('price_tax'))
            order.amount_total = order.amount_untaxed + order.amount_tax
            
    @api.depends('order_line.taxes_id', 'order_line.price_subtotal', 'amount_total', 'amount_untaxed')
    def  _compute_tax_totals(self):
        for order in self:
            order_lines = order.order_line.filtered(lambda x: x.state != 'cancel')
            order.tax_totals = self.env['account.tax']._prepare_tax_totals(
                [x._convert_to_tax_base_line_dict() for x in order_lines],
                order.currency_id or order.company_id.currency_id,
            )
            
    @api.depends('prepared_id')
    def _compute_is_pic(self):
        for order in self:
            order.is_pic = order.prepared_id.id == self.env.user.id
            
    ######## ACTION ########
                
    def action_rfq_send(self):
        '''
        This function opens a window to compose an email, with the edi purchase template message loaded by default
        '''
        self.ensure_one()
        ir_model_data = self.env['ir.model.data']
        try:
            if self.env.context.get('send_rfq', False):
                template_id = ir_model_data._xmlid_lookup('purchase.email_template_edi_purchase')[2]
            else:
                template_id = ir_model_data._xmlid_lookup('purchase.email_template_edi_purchase_done')[2]
        except ValueError:
            template_id = False
        try:
            compose_form_id = ir_model_data._xmlid_lookup('mail.email_compose_message_wizard_form')[2]
        except ValueError:
            compose_form_id = False
        ctx = dict(self.env.context or {})
        ctx.update({
            'default_model': 'request.for.quotation',
            'active_model': 'request.for.quotation',
            'active_id': self.ids[0],
            'default_res_id': self.ids[0],
            'default_use_template': bool(template_id),
            'default_template_id': template_id,
            'default_composition_mode': 'comment',
            'default_email_layout_xmlid': "mail.mail_notification_layout_with_responsible_signature",
            'force_email': True,
        })

        # In the case of a RFQ or a PO, we want the "View..." button in line with the state of the
        # object. Therefore, we pass the model description in the context, in the language in which
        # the template is rendered.
        lang = self.env.context.get('lang')
        if {'default_template_id', 'default_model', 'default_res_id'} <= ctx.keys():
            template = self.env['mail.template'].browse(ctx['default_template_id'])
            if template and template.lang:
                lang = template._render_lang([ctx['default_res_id']])[ctx['default_res_id']]

        self = self.with_context(lang=lang)
        if self.state in ['draft', 'sent']:
            ctx['model_description'] = _('Request for Quotation')

        return {
            'name': _('Compose Email'),
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'mail.compose.message',
            'views': [(compose_form_id, 'form')],
            'view_id': compose_form_id,
            'target': 'new',
            'context': ctx,
        }
    
    def print_quotation(self):
        self.write({'state': "sent"})
        return self.env.ref('hsvn_purchase.report_purchase_rfq').report_action(self)
    
    def button_confirm(self):
        self.write({'state': "done"})
    
    
class RequestForQuotationLine(models.Model):
    _name = "request.for.quotation.line"
    _description = "Request For Quotation Line"
    _inherit = 'analytic.mixin'
    _order = 'order_id, sequence, id'
    
    sequence = fields.Integer(string='Sequence', default=10)
    order_id = fields.Many2one(
        comodel_name='request.for.quotation', string='RFQ Reference', required=True, ondelete='cascade', index=True, copy=False)
    state = fields.Selection(related='order_id.state', store=True, readonly=False)
    partner_id = fields.Many2one(
        comodel_name='res.partner', string='Vendor', related='order_id.partner_id', store=True, readonly=False)
    product_id = fields.Many2one(
        comodel_name='product.template', string='Product Name', required=True)
    product_code = fields.Char(string='Product Code', related='product_id.default_code', store=True, readonly=False)
    product_group_id = fields.Many2one(
        comodel_name='product.category', string='Product Group', related='product_id.categ_id', store=True, readonly=False)
    product_qty = fields.Float(string='Quantity', digits='Product Unit of Measure', required=True, default=1.0)
    product_uom_id = fields.Many2one(
        comodel_name='uom.uom', string='Unit of Measure', related="product_id.uom_id", store=True, readonly=False)
    taxes_id = fields.Many2many(
        comodel_name='account.tax', string='Taxes', store=True, readonly=False)
    currency_id = fields.Many2one(
        comodel_name='res.currency', string='Currency', related='order_id.currency_id', store=True, readonly=False)
    price_unit = fields.Float(
        string='Unit Price', required=True, digits='Product Price',
        compute="_compute_price_unit_and_date_planned_and_name", readonly=False, store=True)
    price_subtotal = fields.Monetary(compute='_compute_amount', string='Subtotal', store=True)
    price_total = fields.Monetary(compute='_compute_amount', string='Total', store=True)
    price_tax = fields.Float(compute='_compute_amount', string='Tax', store=True)
    date_planned = fields.Datetime(related='order_id.date_planned', string='Expected Arrival', store=True)
    
    ######  Compute Methods  ########
    
    @api.onchange('product_group_id')
    def onchange_product_group_id(self):
        for rec in self:
            product_ids = self.env['product.product'].search([('categ_id', '=', rec.product_group_id.id)])   
            return {'domain': {'product_id': [('id', 'in', product_ids.ids)]}}
        
    @api.onchange('product_code')
    def onchange_product_code(self):
        for rec in self:
            product_ids = self.env['product.product'].search([('default_code', '=', rec.product_code)])   
            return {'domain': {'product_id': [('id', 'in', product_ids.ids)]}}
    
    @api.depends('product_qty', 'price_unit', 'taxes_id')
    def _compute_amount(self):
        for line in self:
            tax_results = self.env['account.tax']._compute_taxes([line._convert_to_tax_base_line_dict()])
            totals = list(tax_results['totals'].values())[0]
            amount_untaxed = totals['amount_untaxed']
            amount_tax = totals['amount_tax']

            line.update({
                'price_subtotal': amount_untaxed,
                'price_tax': amount_tax,
                'price_total': amount_untaxed + amount_tax,
            })

    def _convert_to_tax_base_line_dict(self):
        """ Convert the current record to a dictionary in order to use the generic taxes computation method
        defined on account.tax.

        :return: A python dictionary.
        """
        self.ensure_one()
        return self.env['account.tax']._convert_to_tax_base_line_dict(
            self,
            partner=self.order_id.partner_id,
            currency=self.order_id.currency_id,
            product=self.product_id,
            taxes=self.taxes_id,
            price_unit=self.price_unit,
            quantity=self.product_qty,
            price_subtotal=self.price_subtotal,
        )
    
    ######### Action #########
    def action_purchase_history(self):
        self.ensure_one()
        action = self.env["ir.actions.actions"]._for_xml_id("purchase.action_purchase_history")
        action['domain'] = [('state', 'in', ['purchase', 'done']), ('product_id', '=', self.product_id.id)]
        action['display_name'] = _("Purchase History for %s", self.product_id.display_name)
        action['context'] = {
            'search_default_partner_id': self.partner_id.id
        }
        return action
