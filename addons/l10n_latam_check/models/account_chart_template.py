from odoo import models, Command, api, _
<<<<<<< HEAD


class AccountChartTemplate(models.Model):
=======
from odoo.addons.account.models.chart_template import template


class AccountChartTemplate(models.AbstractModel):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    _inherit = 'account.chart.template'

    @api.model
    def _get_third_party_checks_country_codes(self):
        """ Return the list of country codes for the countries where third party checks journals should be created
        when installing the COA"""
        return ["AR"]

<<<<<<< HEAD
    def _create_bank_journals(self, company, acc_template_ref):
        res = super()._create_bank_journals(company, acc_template_ref)

        if company.country_id.code in self._get_third_party_checks_country_codes():
            self.env['account.journal'].create({
                'name': _('Third Party Checks'),
                'type': 'cash',
                'company_id': company.id,
                'outbound_payment_method_line_ids': [
                    Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_out_third_party_checks').id}),
                ],
                'inbound_payment_method_line_ids': [
                    Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_new_third_party_checks').id}),
                    Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_in_third_party_checks').id}),
                ]})
            self.env['account.journal'].create({
                'name': _('Rejected Third Party Checks'),
                'type': 'cash',
                'company_id': company.id,
                'outbound_payment_method_line_ids': [
                    Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_out_third_party_checks').id}),
                ],
                'inbound_payment_method_line_ids': [
                    Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_new_third_party_checks').id}),
                    Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_in_third_party_checks').id}),
                ]})
        return res
=======
    @template(model='account.journal')
    def _get_latam_check_account_journal(self, template_code):
        if self.env.company.country_id.code in self._get_third_party_checks_country_codes():
            return {
                "third_party_check": {
                    'name': _('Third Party Checks'),
                    'type': 'cash',
                    'outbound_payment_method_line_ids': [
                        Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_out_third_party_checks').id}),
                    ],
                    'inbound_payment_method_line_ids': [
                        Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_new_third_party_checks').id}),
                        Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_in_third_party_checks').id}),
                    ],
                },
                "rejected_third_party_check": {
                    'name': _('Rejected Third Party Checks'),
                    'type': 'cash',
                    'outbound_payment_method_line_ids': [
                        Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_out_third_party_checks').id}),
                    ],
                    'inbound_payment_method_line_ids': [
                        Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_new_third_party_checks').id}),
                        Command.create({'payment_method_id': self.env.ref('l10n_latam_check.account_payment_method_in_third_party_checks').id}),
                    ],
                },
            }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
