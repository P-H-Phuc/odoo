# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models, api, Command


<<<<<<< HEAD
class AccountChartTemplate(models.Model):
    _inherit = 'account.chart.template'

    @api.model
    def _get_demo_data(self):
        """We need to deactivate einvoice here, as we can not send e-invoice and e-waybill in the same demo company"""
        if self.env.company == self.env.ref('l10n_in_edi_ewaybill.demo_company_in_ewaybill'):
            val = self.env['account.journal'].search([
                ('type', '=', 'sale'),
                ('company_id', '=', self.env.ref('l10n_in_edi_ewaybill.demo_company_in_ewaybill').id)])
            val.write({'edi_format_ids': [Command.unlink(self.env.ref('l10n_in_edi.edi_in_einvoice_json_1_03').id)]})
        return super()._get_demo_data()
=======
class AccountChartTemplate(models.AbstractModel):
    _inherit = 'account.chart.template'

    @api.model
    def _get_demo_data(self, company=False):
        company = company or self.env.company
        """We need to deactivate einvoice here, as we can not send e-invoice and e-waybill in the same demo company"""
        if company == self.env.ref('l10n_in_edi_ewaybill.demo_company_in_ewaybill'):
            val = self.env['account.journal'].search([
                ('type', '=', 'sale'),
                ('company_id', '=', company.id)])
            val.write({'edi_format_ids': [Command.unlink(self.env.ref('l10n_in_edi.edi_in_einvoice_json_1_03').id)]})
        return super()._get_demo_data(company)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
