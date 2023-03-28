# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models


class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        res = super().session_info()
        nomenclature = self.env.company.sudo().nomenclature_id
<<<<<<< HEAD
        if nomenclature.is_gs1_nomenclature:
            res['gs1_group_separator_encodings'] = nomenclature.gs1_separator_fnc1
=======
        if not nomenclature.is_gs1_nomenclature:
            return res
        res['gs1_group_separator_encodings'] = nomenclature.gs1_separator_fnc1
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return res
