# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models


<<<<<<< HEAD
class AccountChartTemplate(models.Model):
    _inherit = 'account.chart.template'

    def _load(self, company):
        """
            Override normal default taxes, which are the ones with lowest sequence.
        """
        result = super()._load(company)
        template = company.chart_template_id
        if template == self.env.ref('l10n_it.l10n_it_chart_template_generic'):
            company.account_sale_tax_id = self.env.ref(f'l10n_it.{company.id}_22v')
            company.account_purchase_tax_id = self.env.ref(f'l10n_it.{company.id}_22am')
=======
class AccountChartTemplate(models.AbstractModel):
    _inherit = 'account.chart.template'

    def _post_load_data(self, template_code, company, template_data):
        """
            Override normal default taxes, which are the ones with lowest sequence.
        """
        result = super()._post_load_data(template_code, company, template_data)
        if template_code == 'it':
            company.account_sale_tax_id = self.ref('22v')
            company.account_purchase_tax_id = self.ref('22am')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return result
