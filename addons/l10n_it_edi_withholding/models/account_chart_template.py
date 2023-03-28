# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

<<<<<<< HEAD
import logging
from odoo import models

_logger = logging.getLogger(__name__)


class AccountChartTemplate(models.Model):
    _inherit = 'account.chart.template'

    def _load(self, company):
        """
            Override normal default taxes, which are the ones with lowest sequence.
        """
        result = super()._load(company)
        if company.chart_template_id == self.env.ref('l10n_it.l10n_it_chart_template_generic'):
            company.account_sale_tax_id = self.env.ref(f'l10n_it.{company.id}_22v')
            company.account_purchase_tax_id = self.env.ref(f'l10n_it.{company.id}_22am')
        return result
=======
from odoo import models
from odoo.addons.account.models.chart_template import template


class AccountChartTemplate(models.AbstractModel):
    _inherit = 'account.chart.template'

    @template('it', 'account.account')
    def _get_it_withholding_account_account(self):
        return self._parse_csv('it', 'account.account', module='l10n_it_edi_withholding')

    @template('it', 'account.tax')
    def _get_it_withholding_account_tax(self):
        additionnal = self._parse_csv('it', 'account.tax', module='l10n_it_edi_withholding')
        self._deref_account_tags('it', additionnal)
        return additionnal

    @template('it', 'account.tax.group')
    def _get_it_withholding_account_tax_group(self):
        return self._parse_csv('it', 'account.tax.group', module='l10n_it_edi_withholding')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
