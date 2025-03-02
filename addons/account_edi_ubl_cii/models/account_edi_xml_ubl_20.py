# -*- coding: utf-8 -*-

from odoo import models, _
from odoo.osv import expression
from odoo.tools import html2plaintext, cleanup_xml_node
from lxml import etree


class AccountEdiXmlUBL20(models.AbstractModel):
    _name = "account.edi.xml.ubl_20"
    _inherit = 'account.edi.common'
    _description = "UBL 2.0"

    # -------------------------------------------------------------------------
    # EXPORT
    # -------------------------------------------------------------------------

    def _export_invoice_filename(self, invoice):
        return f"{invoice.name.replace('/', '_')}_ubl_20.xml"

    def _export_invoice_ecosio_schematrons(self):
        return {
            'invoice': 'org.oasis-open:invoice:2.0',
            'credit_note': 'org.oasis-open:creditnote:2.0',
        }

    def _get_country_vals(self, country):
        return {
            'country': country,

            'identification_code': country.code,
            'name': country.name,
        }

    def _get_partner_party_identification_vals_list(self, partner):
        return []

    def _get_partner_address_vals(self, partner):
        return {
            'street_name': partner.street,
            'additional_street_name': partner.street2,
            'city_name': partner.city,
            'postal_zone': partner.zip,
            'country_subentity': partner.state_id.name,
            'country_subentity_code': partner.state_id.code,
            'country_vals': self._get_country_vals(partner.country_id),
        }

    def _get_partner_party_tax_scheme_vals_list(self, partner, role):
        return [{
            'registration_name': partner.name,
            'company_id': partner.vat,
            'registration_address_vals': self._get_partner_address_vals(partner),
            'TaxScheme_vals': {},
            'tax_scheme_id': 'VAT',
        }]

    def _get_partner_party_legal_entity_vals_list(self, partner):
        commercial_partner = partner.commercial_partner_id

        return [{
            'commercial_partner': commercial_partner,

            'registration_name': commercial_partner.name,
            'company_id': commercial_partner.vat,
            'registration_address_vals': self._get_partner_address_vals(commercial_partner),
        }]

    def _get_partner_contact_vals(self, partner):
        return {
            'id': partner.id,
            'name': partner.name,
            'telephone': partner.phone or partner.mobile,
            'electronic_mail': partner.email,
        }

    def _get_partner_party_vals(self, partner, role):
        return {
            'partner': partner,
            'party_identification_vals': self._get_partner_party_identification_vals_list(partner),
            'party_name_vals': [{'name': partner.name}],
            'postal_address_vals': self._get_partner_address_vals(partner),
            'party_tax_scheme_vals': self._get_partner_party_tax_scheme_vals_list(partner, role),
            'party_legal_entity_vals': self._get_partner_party_legal_entity_vals_list(partner),
            'contact_vals': self._get_partner_contact_vals(partner),
        }

    def _get_invoice_period_vals_list(self, invoice):
        """
        For now, we cannot fill this data from an invoice
        This corresponds to the 'delivery or invoice period'. For UBL Bis 3, in the case of intra-community supply,
        the Actual delivery date (BT-72) or the Invoicing period (BG-14) should be present under the form:
        {
            'start_date': str,
            'end_date': str,
        }.
        """
        return []

    def _get_delivery_vals_list(self, invoice):
        # the data is optional, except for ubl bis3 (see the override, where we need to set a default delivery address)
        if 'partner_shipping_id' in invoice._fields:
            return [{
                'actual_delivery_date': None,
                'delivery_location_vals': {
                    'delivery_address_vals': self._get_partner_address_vals(invoice.partner_shipping_id),
                },
            }]
        else:
            return []

    def _get_bank_address_vals(self, bank):
        return {
            'street_name': bank.street,
            'additional_street_name': bank.street2,
            'city_name': bank.city,
            'postal_zone': bank.zip,
            'country_subentity': bank.state.name,
            'country_subentity_code': bank.state.code,
            'country_vals': self._get_country_vals(bank.country),
        }

    def _get_financial_institution_vals(self, bank):
        return {
            'bank': bank,
            'id': bank.bic,
            'id_attrs': {'schemeID': 'BIC'},
            'name': bank.name,
            'address_vals': self._get_bank_address_vals(bank),
        }

    def _get_financial_institution_branch_vals(self, bank):
        return {
            'bank': bank,
            'id': bank.bic,
            'id_attrs': {'schemeID': 'BIC'},
            'financial_institution_vals': self._get_financial_institution_vals(bank),
        }

    def _get_financial_account_vals(self, partner_bank):
        vals = {
            'bank_account': partner_bank,
            'id': partner_bank.acc_number.replace(' ', ''),
        }

        if partner_bank.bank_id:
            vals['financial_institution_branch_vals'] = self._get_financial_institution_branch_vals(partner_bank.bank_id)

        return vals

    def _get_invoice_payment_means_vals_list(self, invoice):
        vals = {
            'payment_means_code': 30,
            'payment_means_code_attrs': {'name': 'credit transfer'},
            'payment_due_date': invoice.invoice_date_due or invoice.invoice_date,
            'instruction_id': invoice.payment_reference,
            'payment_id_vals': [invoice.payment_reference or invoice.name],
        }

        if invoice.partner_bank_id:
            vals['payee_financial_account_vals'] = self._get_financial_account_vals(invoice.partner_bank_id)

        return [vals]

    def _get_invoice_payment_terms_vals_list(self, invoice):
        payment_term = invoice.invoice_payment_term_id
        if payment_term:
            return [{'note_vals': [payment_term.name]}]
        else:
            return []

    def _get_invoice_tax_totals_vals_list(self, invoice, taxes_vals):
        return [{
            'currency': invoice.currency_id,
            'currency_dp': invoice.currency_id.decimal_places,
            'tax_amount': taxes_vals['tax_amount_currency'],
            'tax_subtotal_vals': [{
                'currency': invoice.currency_id,
                'currency_dp': invoice.currency_id.decimal_places,
                'taxable_amount': vals['base_amount_currency'],
                'tax_amount': vals['tax_amount_currency'],
                'percent': vals['_tax_category_vals_']['percent'],
                'tax_category_vals': vals['_tax_category_vals_'],
            } for vals in taxes_vals['tax_details'].values()],
        }]

    def _get_invoice_line_item_vals(self, line, taxes_vals):
        """ Method used to fill the cac:InvoiceLine/cac:Item node.
        It provides information about what the product you are selling.

        :param line:        An invoice line.
        :param taxes_vals:  The tax details for the current invoice line.
        :return:            A python dictionary.

        """
        product = line.product_id
        taxes = line.tax_ids.flatten_taxes_hierarchy()
        tax_category_vals_list = self._get_tax_category_list(line.move_id, taxes)
        description = line.name and line.name.replace('\n', ', ')

        return {
            # Simple description about what you are selling.
            'description': description,

            # The name of the item.
            'name': product.name,

            # Identifier of the product.
            'sellers_item_identification_vals': {'id': product.code},

            # The main tax applied. Only one is allowed.
            'classified_tax_category_vals': tax_category_vals_list,
        }

    def _get_document_allowance_charge_vals_list(self, invoice):
        """
        https://docs.peppol.eu/poacc/billing/3.0/bis/#_document_level_allowance_or_charge
        The aim is to transform the ecotax/récupel into a charge at the document level.
        Warning, as the charge is transformed into an allowance, we have to make sure no tax is created on the line
        level, otherwise, the TaxInclusiveAmount, will be wrong.
        """
        vals_list = []
        #for line in invoice.line_ids:
        #    for tax in line.tax_ids:
        #        if tax.amount_type == 'fixed':
        #            total_amount += tax.amount
        #            vals_list.append({
        #                'charge_indicator': 'true',
        #                'allowance_charge_reason_code': 'AEO',  # "Collection and recycling"
        #                'allowance_charge_reason': 'Collection and recycling',
        #                'amount': float(tax.amount),
        #                'currency_name': line.currency_id.name,
        #                'currency_dp': line.currency_id.decimal_places,
        #            })
        return vals_list

    def _get_invoice_line_allowance_vals_list(self, line):
        """ Method used to fill the cac:InvoiceLine>cac:AllowanceCharge node.

        Allowances are distinguished from charges using the ChargeIndicator node with 'false' as value.

        Note that allowance charges do not exist for credit notes in UBL 2.0, so if we apply discount in Odoo
        the net price will not be consistent with the unit price, but we cannot do anything about it

        :param line:    An invoice line.
        :return:        A list of python dictionaries.
        """
        if not line.discount:
            return []

        # Price subtotal without discount:
        net_price_subtotal = line.price_subtotal
        # Price subtotal with discount:
        if line.discount == 100.0:
            gross_price_subtotal = 0.0
        else:
            gross_price_subtotal = line.currency_id.round(net_price_subtotal / (1.0 - (line.discount or 0.0) / 100.0))

        allowance_vals = {
            'currency_name': line.currency_id.name,
            'currency_dp': line.currency_id.decimal_places,

            # Must be 'false' since this method is for allowances.
            'charge_indicator': 'false',

            # A reason should be provided. In Odoo, we only manage discounts.
            # Full code list is available here:
            # https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL5189/
            'allowance_charge_reason_code': 95,

            # The discount should be provided as an amount.
            'amount': gross_price_subtotal - net_price_subtotal,
        }

        return [allowance_vals]

    def _get_invoice_line_price_vals(self, line):
        """ Method used to fill the cac:InvoiceLine/cac:Price node.
        It provides information about the price applied for the goods and services invoiced.

        :param line:    An invoice line.
        :return:        A python dictionary.
        """
        # Price subtotal without discount:
        net_price_subtotal = line.price_subtotal
        # Price subtotal with discount:
        if line.discount == 100.0:
            gross_price_subtotal = 0.0
        else:
            gross_price_subtotal = net_price_subtotal / (1.0 - (line.discount or 0.0) / 100.0)
        # Price subtotal with discount / quantity:
        gross_price_unit = line.currency_id.round((gross_price_subtotal / line.quantity) if line.quantity else 0.0)

        uom = super()._get_uom_unece_code(line)

        return {
            'currency': line.currency_id,
            'currency_dp': line.currency_id.decimal_places,

            # The price of an item, exclusive of VAT, after subtracting item price discount.
            'price_amount': gross_price_unit,

            # The number of item units to which the price applies.
            # setting to None -> the xml will not comprise the BaseQuantity (it's not mandatory)
            'base_quantity': None,
            'base_quantity_attrs': {'unitCode': uom},
        }

    def _get_invoice_line_vals(self, line, taxes_vals):
        """ Method used to fill the cac:InvoiceLine node.
        It provides information about the invoice line.

        :param line:    An invoice line.
        :return:        A python dictionary.
        """
        allowance_charge_vals_list = self._get_invoice_line_allowance_vals_list(line)

        uom = super()._get_uom_unece_code(line)

        return {
            'currency': line.currency_id,
            'currency_dp': line.currency_id.decimal_places,

            # The requirement is the id has to be unique by invoice line.
            'id': line.id,

            'invoiced_quantity': line.quantity,
            'invoiced_quantity_attrs': {'unitCode': uom},

            'line_extension_amount': line.price_subtotal,

            'allowance_charge_vals': allowance_charge_vals_list,
            'tax_total_vals': self._get_invoice_tax_totals_vals_list(line.move_id, taxes_vals),
            'item_vals': self._get_invoice_line_item_vals(line, taxes_vals),
            'price_vals': self._get_invoice_line_price_vals(line),
        }

    def _export_invoice_vals(self, invoice):
        def grouping_key_generator(base_line, tax_values):
            tax = tax_values['tax_repartition_line'].tax_id
            tax_category_vals = self._get_tax_category_list(invoice, tax)[0]
            return {
                'tax_category_id': tax_category_vals['id'],
                'tax_category_percent': tax_category_vals['percent'],
                '_tax_category_vals_': tax_category_vals,
            }

        # Compute the tax details for the whole invoice and each invoice line separately.
        taxes_vals = invoice._prepare_edi_tax_details(grouping_key_generator=grouping_key_generator)

        # Compute values for invoice lines.
        line_extension_amount = 0.0

        invoice_lines = invoice.invoice_line_ids.filtered(lambda line: line.display_type not in ('line_note', 'line_section'))
        document_allowance_charge_vals_list = self._get_document_allowance_charge_vals_list(invoice)
        invoice_line_vals_list = []
        for line in invoice_lines:
            line_taxes_vals = taxes_vals['tax_details_per_record'][line]
            line_vals = self._get_invoice_line_vals(line, line_taxes_vals)
            invoice_line_vals_list.append(line_vals)

            line_extension_amount += line_vals['line_extension_amount']

        # Compute the total allowance/charge amounts.
        allowance_total_amount = 0.0
        for allowance_charge_vals in document_allowance_charge_vals_list:
            if allowance_charge_vals['charge_indicator'] == 'false':
                allowance_total_amount += allowance_charge_vals['amount']

        supplier = invoice.company_id.partner_id.commercial_partner_id
        customer = invoice.commercial_partner_id

        # OrderReference/SalesOrderID (sales_order_id) is optional
        sales_order_id = 'sale_line_ids' in invoice.invoice_line_ids._fields \
                         and ",".join(invoice.invoice_line_ids.sale_line_ids.order_id.mapped('name'))
        # OrderReference/ID (order_reference) is mandatory inside the OrderReference node !
        order_reference = invoice.ref or invoice.name if sales_order_id else invoice.ref

        vals = {
            'builder': self,
            'invoice': invoice,
            'supplier': supplier,
            'customer': customer,

            'taxes_vals': taxes_vals,

            'format_float': self.format_float,
            'AddressType_template': 'account_edi_ubl_cii.ubl_20_AddressType',
            'ContactType_template': 'account_edi_ubl_cii.ubl_20_ContactType',
            'PartyType_template': 'account_edi_ubl_cii.ubl_20_PartyType',
            'PaymentMeansType_template': 'account_edi_ubl_cii.ubl_20_PaymentMeansType',
            'TaxCategoryType_template': 'account_edi_ubl_cii.ubl_20_TaxCategoryType',
            'TaxTotalType_template': 'account_edi_ubl_cii.ubl_20_TaxTotalType',
            'AllowanceChargeType_template': 'account_edi_ubl_cii.ubl_20_AllowanceChargeType',
            'InvoiceLineType_template': 'account_edi_ubl_cii.ubl_20_InvoiceLineType',
            'InvoiceType_template': 'account_edi_ubl_cii.ubl_20_InvoiceType',

            'vals': {
                'ubl_version_id': 2.0,
                'id': invoice.name,
                'issue_date': invoice.invoice_date,
                'due_date': invoice.invoice_date_due,
                'note_vals': [html2plaintext(invoice.narration)] if invoice.narration else [],
                'order_reference': order_reference,
                'sales_order_id': sales_order_id,
                'accounting_supplier_party_vals': {
                    'party_vals': self._get_partner_party_vals(supplier, role='supplier'),
                },
                'accounting_customer_party_vals': {
                    'party_vals': self._get_partner_party_vals(customer, role='customer'),
                },
                'invoice_period_vals_list': self._get_invoice_period_vals_list(invoice),
                'delivery_vals_list': self._get_delivery_vals_list(invoice),
                'payment_means_vals_list': self._get_invoice_payment_means_vals_list(invoice),
                'payment_terms_vals': self._get_invoice_payment_terms_vals_list(invoice),
                # allowances at the document level, the allowances on invoices (eg. discount) are on invoice_line_vals
                'allowance_charge_vals': document_allowance_charge_vals_list,
                'tax_total_vals': self._get_invoice_tax_totals_vals_list(invoice, taxes_vals),
                'legal_monetary_total_vals': {
                    'currency': invoice.currency_id,
                    'currency_dp': invoice.currency_id.decimal_places,
                    'line_extension_amount': line_extension_amount,
                    'tax_exclusive_amount': invoice.amount_untaxed,
                    'tax_inclusive_amount': invoice.amount_total,
                    'allowance_total_amount': allowance_total_amount or None,
                    'prepaid_amount': invoice.amount_total - invoice.amount_residual,
                    'payable_amount': invoice.amount_residual,
                },
                'invoice_line_vals': invoice_line_vals_list,
                'currency_dp': invoice.currency_id.decimal_places,  # currency decimal places
            },
        }

        if invoice.move_type == 'out_invoice':
            vals['main_template'] = 'account_edi_ubl_cii.ubl_20_Invoice'
            vals['vals']['invoice_type_code'] = 380
        else:
            vals['main_template'] = 'account_edi_ubl_cii.ubl_20_CreditNote'
            vals['vals']['credit_note_type_code'] = 381

        return vals

    def _export_invoice_constraints(self, invoice, vals):
        constraints = self._invoice_constraints_common(invoice)
        constraints.update({
            'ubl20_supplier_name_required': self._check_required_fields(vals['supplier'], 'name'),
            'ubl20_customer_name_required': self._check_required_fields(vals['customer'], 'name'),
            'ubl20_commercial_customer_name_required': self._check_required_fields(vals['customer'].commercial_partner_id, 'name'),
            'ubl20_invoice_name_required': self._check_required_fields(invoice, 'name'),
            'ubl20_invoice_date_required': self._check_required_fields(invoice, 'invoice_date'),
        })
        return constraints

    def _export_invoice(self, invoice):
        vals = self._export_invoice_vals(invoice)
        errors = [constraint for constraint in self._export_invoice_constraints(invoice, vals).values() if constraint]
        xml_content = self.env['ir.qweb']._render(vals['main_template'], vals)
        xml_content = b"<?xml version='1.0' encoding='UTF-8'?>\n" + etree.tostring(cleanup_xml_node(xml_content))
        return xml_content, set(errors)

    # -------------------------------------------------------------------------
    # IMPORT
    # -------------------------------------------------------------------------

    def _import_fill_invoice_form(self, invoice, tree, qty_factor):
        logs = []

        if qty_factor == -1:
            logs.append(_("The invoice has been converted into a credit note and the quantities have been reverted."))

        # ==== partner_id ====

<<<<<<< HEAD
        partner = self._import_retrieve_info_from_map(
            tree,
            self._import_retrieve_partner_map(self.env.company, journal.type),
        )
        if partner:
            invoice.partner_id = partner
        else:
            logs.append(_("Could not retrieve the %s.", _("customer") if invoice.move_type in ('out_invoice', 'out_refund') else _("vendor")))
=======
        partner = self._import_retrieve_partner(tree, invoice)
        if partner:
            invoice.partner_id = partner
        else:
            logs.append(_("Could not retrieve the %s.", _("customer") if invoice.is_sale_document() else _("vendor")))
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        # ==== currency_id ====

        currency_code_node = tree.find('.//{*}DocumentCurrencyCode')
        if currency_code_node is not None:
            currency = self.env['res.currency'].with_context(active_test=False).search([
                ('name', '=', currency_code_node.text),
            ], limit=1)
            if currency:
                if not currency.active:
                    logs.append(_("The currency '%s' is not active.", currency.name))
                invoice.currency_id = currency
            else:
                logs.append(_("Could not retrieve currency: %s. Did you enable the multicurrency option "
                              "and activate the currency?", currency_code_node.text))

        # ==== invoice_date ====

        invoice_date_node = tree.find('./{*}IssueDate')
        if invoice_date_node is not None and invoice_date_node.text:
            invoice.invoice_date = invoice_date_node.text

        # ==== invoice_date_due ====

        for xpath in ('./{*}DueDate', './/{*}PaymentDueDate'):
            invoice_date_due_node = tree.find(xpath)
            if invoice_date_due_node is not None and invoice_date_due_node.text:
                invoice.invoice_date_due = invoice_date_due_node.text
                break

        # ==== invoice_date ====

        invoice_date_node = tree.find('./{*}IssueDate')
        if invoice_date_node is not None and invoice_date_node.text:
            invoice.invoice_date = invoice_date_node.text

        # ==== invoice_date_due ====

        for xpath in ('./{*}DueDate', './/{*}PaymentDueDate'):
            invoice_date_due_node = tree.find(xpath)
            if invoice_date_due_node is not None and invoice_date_due_node.text:
                invoice.invoice_date_due = invoice_date_due_node.text
                break

        # ==== Reference ====

        ref_node = tree.find('./{*}ID')
        if ref_node is not None:
            if invoice.is_sale_document(include_receipts=True) and invoice.quick_edit_mode:
                invoice.name = ref_node.text
            else:
                invoice.ref = ref_node.text

        # ==== Invoice origin ====

        invoice_origin_node = tree.find('./{*}OrderReference/{*}ID')
        if invoice_origin_node is not None:
            invoice.invoice_origin = invoice_origin_node.text

        # === Note/narration ====

        narration = ""
        note_node = tree.find('./{*}Note')
        if note_node is not None and note_node.text:
            narration += note_node.text + "\n"

        payment_terms_node = tree.find('./{*}PaymentTerms/{*}Note')  # e.g. 'Payment within 10 days, 2% discount'
        if payment_terms_node is not None and payment_terms_node.text:
            narration += payment_terms_node.text + "\n"

        invoice.narration = narration

        # ==== payment_reference ====

        payment_reference_node = tree.find('./{*}PaymentMeans/{*}PaymentID')
        if payment_reference_node is not None:
            invoice.payment_reference = payment_reference_node.text

        # ==== invoice_incoterm_id ====

        incoterm_code_node = tree.find('./{*}TransportExecutionTerms/{*}DeliveryTerms/{*}ID')
        if incoterm_code_node is not None:
            incoterm = self.env['account.incoterms'].search([('code', '=', incoterm_code_node.text)], limit=1)
            if incoterm:
                invoice.invoice_incoterm_id = incoterm

        # ==== invoice_line_ids: AllowanceCharge (document level) ====

        logs += self._import_fill_invoice_allowance_charge(tree, invoice, qty_factor)

        # ==== Down Payment (prepaid amount) ====

        prepaid_node = tree.find('./{*}LegalMonetaryTotal/{*}PrepaidAmount')
        self._import_fill_invoice_down_payment(invoice, prepaid_node, qty_factor)

        # ==== invoice_line_ids: InvoiceLine/CreditNoteLine ====

        invoice_line_tag = 'InvoiceLine' if invoice.move_type in ('in_invoice', 'out_invoice') or qty_factor == -1 else 'CreditNoteLine'
        for i, invl_el in enumerate(tree.findall('./{*}' + invoice_line_tag)):
            invoice_line = invoice.invoice_line_ids.create({'move_id': invoice.id})
            invl_logs = self._import_fill_invoice_line_form(invl_el, invoice_line, qty_factor)
            logs += invl_logs

        return logs

    def _import_fill_invoice_line_form(self, tree, invoice_line, qty_factor):
        logs = []

        # Product
        product = self._import_retrieve_info_from_map(
            tree,
            self._import_retrieve_product_map(invoice_line.move_id.journal_id),
        )
        if product is not None:
            invoice_line.product_id = product

        # Description
        description_node = tree.find('./{*}Item/{*}Description')
        name_node = tree.find('./{*}Item/{*}Name')
        if description_node is not None:
            invoice_line.name = description_node.text
        elif name_node is not None:
            invoice_line.name = name_node.text  # Fallback on Name if Description is not found.

        xpath_dict = {
            'basis_qty': [
                './{*}Price/{*}BaseQuantity',
            ],
            'gross_price_unit': './{*}Price/{*}AllowanceCharge/{*}BaseAmount',
            'rebate': './{*}Price/{*}AllowanceCharge/{*}Amount',
            'net_price_unit': './{*}Price/{*}PriceAmount',
<<<<<<< HEAD
            'billed_qty':  './{*}InvoicedQuantity' if invoice.move_type in ('in_invoice', 'out_invoice') or qty_factor == -1 else './{*}CreditedQuantity',
=======
            'billed_qty':  './{*}InvoicedQuantity' if invoice_line.move_id.move_type in ('in_invoice', 'out_invoice') or qty_factor == -1 else './{*}CreditedQuantity',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'allowance_charge': './/{*}AllowanceCharge',
            'allowance_charge_indicator': './{*}ChargeIndicator',  # below allowance_charge node
            'allowance_charge_amount': './{*}Amount',  # below allowance_charge node
            'line_total_amount': './{*}LineExtensionAmount',
        }
        self._import_fill_invoice_line_values(tree, xpath_dict, invoice_line, qty_factor)

        # Taxes
        inv_line_vals = self._import_fill_invoice_line_values(tree, xpath_dict, invoice_line, qty_factor)
        # retrieve tax nodes
        tax_nodes = tree.findall('.//{*}Item/{*}ClassifiedTaxCategory/{*}Percent')
        if not tax_nodes:
            for elem in tree.findall('.//{*}TaxTotal'):
                tax_nodes += elem.findall('.//{*}TaxSubtotal/{*}Percent')
<<<<<<< HEAD
        return self._import_fill_invoice_line_taxes(journal, tax_nodes, invoice_line, inv_line_vals, logs)
=======
        return self._import_fill_invoice_line_taxes(tax_nodes, invoice_line, inv_line_vals, logs)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def _correct_invoice_tax_amount(self, tree, invoice):
        """ The tax total may have been modified for rounding purpose, if so we should use the imported tax and not
         the computed one """
        # For each tax in our tax total, get the amount as well as the total in the xml.
        for elem in tree.findall('.//{*}TaxTotal/{*}TaxSubtotal'):
            percentage = elem.find('.//{*}TaxCategory/{*}Percent')
            amount = elem.find('.//{*}TaxAmount')
            if (percentage is not None and percentage.text is not None) and (amount is not None and amount.text is not None):
                tax_percent = float(percentage.text)
                # Compare the result with our tax total on the invoice, and apply correction if needed.
                # First look for taxes matching the percentage in the xml.
                taxes = invoice.line_ids.tax_line_id.filtered(lambda tax: tax.amount == tax_percent)
                # If we found taxes with the correct amount, look for a tax line using it, and correct it as needed.
                if taxes:
                    tax_total = float(amount.text)
                    tax_line = invoice.line_ids.filtered(lambda line: line.tax_line_id in taxes)[:1]
                    if tax_line:
                        sign = -1 if invoice.is_inbound(include_receipts=True) else 1
                        tax_line_amount = abs(tax_line.amount_currency)
                        if abs(tax_total - tax_line_amount) <= 0.05:
                            tax_line.amount_currency = tax_total * sign

    # -------------------------------------------------------------------------
    # IMPORT : helpers
    # -------------------------------------------------------------------------

    def _get_import_document_amount_sign(self, tree):
        """
        In UBL, an invoice has tag 'Invoice' and a credit note has tag 'CreditNote'. However, a credit note can be
        expressed as an invoice with negative amounts. For this case, we need a factor to take the opposite
        of each quantity in the invoice.
        """
        if tree.tag == '{urn:oasis:names:specification:ubl:schema:xsd:Invoice-2}Invoice':
            amount_node = tree.find('.//{*}LegalMonetaryTotal/{*}TaxExclusiveAmount')
            if amount_node is not None and float(amount_node.text) < 0:
<<<<<<< HEAD
                return ('in_refund', 'out_refund'), -1
            return ('in_invoice', 'out_invoice'), 1
        if tree.tag == '{urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2}CreditNote':
            return ('in_refund', 'out_refund'), 1
        return None, None

    def _import_retrieve_partner_map(self, company, move_type='purchase'):
        role = "Customer" if move_type == 'sale' else "Supplier"

        def with_vat(tree, extra_domain):
            vat_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}CompanyID')
            vat = None if vat_node is None else vat_node.text
            return self.env['account.edi.format']._retrieve_partner_with_vat(vat, extra_domain)

        def with_phone_mail(tree, extra_domain):
            phone_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}Telephone')
            mail_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}ElectronicMail')

            phone = None if phone_node is None else phone_node.text
            mail = None if mail_node is None else mail_node.text
            return self.env['account.edi.format']._retrieve_partner_with_phone_mail(phone, mail, extra_domain)

        def with_name(tree, extra_domain):
            name_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}Name')
            name = None if name_node is None else name_node.text
            return self.env['account.edi.format']._retrieve_partner_with_name(name, extra_domain)

        return {
            10: lambda tree: with_vat(tree, [('company_id', '=', company.id)]),
            20: lambda tree: with_vat(tree, []),
            30: lambda tree: with_phone_mail(tree, [('company_id', '=', company.id)]),
            40: lambda tree: with_phone_mail(tree, []),
            50: lambda tree: with_name(tree, [('company_id', '=', company.id)]),
            60: lambda tree: with_name(tree, []),
        }
=======
                return 'refund', -1
            return 'invoice', 1
        if tree.tag == '{urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2}CreditNote':
            return 'refund', 1
        return None, None

    def _import_retrieve_partner(self, tree, invoice):
        role = "Customer" if invoice.journal_id.type == 'sale' else "Supplier"
        vat_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}CompanyID')
        vat = None if vat_node is None else vat_node.text
        phone_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}Telephone')
        phone = None if phone_node is None else phone_node.text
        mail_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}ElectronicMail')
        mail = None if mail_node is None else mail_node.text
        name_node = tree.find(f'.//{{*}}Accounting{role}Party/{{*}}Party//{{*}}Name')
        name = None if name_node is None else name_node.text
        return self.env['res.partner']._retrieve_partner(
            name=name,
            phone=phone,
            mail=mail,
            vat=vat,
            company=invoice.company_id,
        )
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def _import_retrieve_product_map(self, company):

        def with_code_barcode(tree, extra_domain):
            domains = []

            default_code_node = tree.find('./{*}Item/{*}SellersItemIdentification/{*}ID')
            if default_code_node is not None:
                domains.append([('default_code', '=', default_code_node.text)])

            barcode_node = tree.find("./{*}Item/{*}StandardItemIdentification/{*}ID[@schemeID='0160']")
            if barcode_node is not None:
                domains.append([('barcode', '=', barcode_node.text)])

            if not domains:
                return None

            return self.env['product.product'].search(extra_domain + expression.OR(domains), limit=1)

        def with_name(tree, extra_domain):
            name_node = tree.find('./{*}Item/{*}Name')

            if name_node is None:
                return None

            return self.env['product.product'].search(extra_domain + [('name', 'ilike', name_node.text)], limit=1)

        return {
            10: lambda tree: with_code_barcode(tree, [('company_id', '=', company.id)]),
            20: lambda tree: with_code_barcode(tree, []),
            30: lambda tree: with_name(tree, [('company_id', '=', company.id)]),
            40: lambda tree: with_name(tree, []),
        }

    def _import_retrieve_info_from_map(self, tree, import_method_map):
        for key in sorted(import_method_map.keys()):
            record = import_method_map[key](tree)
            if record:
                return record

        return None
