# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models

class ResPartner(models.Model):
    _inherit = 'res.partner'

    loyalty_card_count = fields.Integer(
        string="Active loyalty cards",
        compute='_compute_count_active_cards')

    def _compute_count_active_cards(self):
        loyalty_groups = self.env['loyalty.card']._read_group(
            domain=[
                ('partner_id', 'in', self.with_context(active_test=False)._search([('id', 'child_of', self.ids)])),
                ('points', '>', '0'),
                ('program_id.active', '=', 'True'),
                '|',
                    ('expiration_date', '>=', fields.Date().context_today(self)),
                    ('expiration_date', '=', False),
            ],
            fields=['partner_id'],
            groupby=['partner_id'],
        )
        partners = self.browse()
        for group in loyalty_groups:
            partner = self.browse(group['partner_id'][0])
            while partner:
                if partner in self:
                    partner.loyalty_card_count += group['partner_id_count']
                    partners |= partner
                partner = partner.parent_id
        (self - partners).loyalty_card_count = 0

    def action_view_loyalty_cards(self):
        action = self.env['ir.actions.act_window']._for_xml_id('loyalty.loyalty_card_action')
        all_child = self.with_context(active_test=False).search([('id', 'child_of', self.ids)])
        action['domain'] = [('partner_id', 'in', all_child.ids)]
        action['context'] = {'search_default_active' : True}
        return action
