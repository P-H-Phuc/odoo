from odoo import api, fields, models
from odoo.exceptions import UserError
from odoo.tools.translate import _

<<<<<<< HEAD
class AccountTaxTemplate(models.Model):
    _inherit = 'account.tax.template'

    l10n_de_datev_code = fields.Char(size=4)

    def _get_tax_vals(self, company, tax_template_to_tax):
        vals = super(AccountTaxTemplate, self)._get_tax_vals(company, tax_template_to_tax)
        vals['l10n_de_datev_code'] = self.l10n_de_datev_code
        return vals
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

class AccountTax(models.Model):
    _inherit = "account.tax"

    l10n_de_datev_code = fields.Char(size=4, help="4 digits code use by Datev")


class AccountMove(models.Model):
    _inherit = 'account.move'

    def _post(self, soft=True):
        # OVERRIDE to check the invoice lines taxes.
        for invoice in self.filtered(lambda move: move.is_invoice()):
            for line in invoice.invoice_line_ids:
                account_tax = line.account_id.tax_ids.ids
                if account_tax and invoice.company_id.account_fiscal_country_id.code == 'DE':
                    account_name = line.account_id.name
                    for tax in line.tax_ids:
                        if tax.id not in account_tax:
                            raise UserError(_('Account %s does not authorize to have tax %s specified on the line. \
                                Change the tax used in this invoice or remove all taxes from the account') % (account_name, tax.name))
        return super()._post(soft)


class ProductTemplate(models.Model):
    _inherit = "product.template"

    def _get_product_accounts(self):
        """ As taxes with a different rate need a different income/expense account, we add this logic in case people only use
         invoicing to not be blocked by the above constraint"""
        result = super(ProductTemplate, self)._get_product_accounts()
        company = self.env.company
        if company.account_fiscal_country_id.code == "DE":
            if not self.property_account_income_id:
                taxes = self.taxes_id.filtered(lambda t: t.company_id == company)
                if not result['income'] or (result['income'].tax_ids and taxes and taxes[0] not in result['income'].tax_ids):
                    result['income'] = self.env['account.account'].search([('internal_group', '=', 'income'), ('deprecated', '=', False),
                                                                   ('tax_ids', 'in', taxes.ids)], limit=1)
            if not self.property_account_expense_id:
                supplier_taxes = self.supplier_taxes_id.filtered(lambda t: t.company_id == company)
                if not result['expense'] or (result['expense'].tax_ids and supplier_taxes and supplier_taxes[0] not in result['expense'].tax_ids):
                    result['expense'] = self.env['account.account'].search([('internal_group', '=', 'expense'), ('deprecated', '=', False),
                                                                   ('tax_ids', 'in', supplier_taxes.ids)], limit=1)
        return result
