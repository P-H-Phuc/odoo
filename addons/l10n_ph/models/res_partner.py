# Part of Odoo. See LICENSE file for full copyright and licensing details.

<<<<<<< HEAD
from odoo import fields, api, models

=======
import re

from odoo import fields, api, models

CHECK_VAT_PH_RE = re.compile(r"\d{3}-\d{3}-\d{3}-\d{5}")
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

class ResPartner(models.Model):
    _inherit = "res.partner"

<<<<<<< HEAD
    branch_code = fields.Char("Branch Code", default='000', compute='_compute_branch_code', store=True)
=======
    branch_code = fields.Char("Branch Code", default='000', required=True)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    first_name = fields.Char("First Name")
    middle_name = fields.Char("Middle Name")
    last_name = fields.Char("Last Name")

    @api.model
    def _commercial_fields(self):
        return super()._commercial_fields() + ['branch_code']

<<<<<<< HEAD
    @api.depends('vat', 'country_id')
    def _compute_branch_code(self):
        for partner in self:
            branch_code = '000'
            if partner.country_id.code == 'PH' and partner.vat:
                match = partner.__check_vat_ph_re.match(partner.vat)
                branch_code = match and match.group(1) and match.group(1)[1:] or branch_code
            partner.branch_code = branch_code
=======
    def check_vat_ph(self, vat):
        return len(vat) == 17 and CHECK_VAT_PH_RE.match(vat)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
