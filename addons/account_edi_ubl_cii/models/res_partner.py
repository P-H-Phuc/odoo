# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api
from odoo.addons.account_edi_ubl_cii.models.account_edi_common import EAS_MAPPING


class ResPartner(models.Model):
    _inherit = 'res.partner'

    ubl_cii_format = fields.Selection(
        string="Format",
        selection=[
            ('facturx', "Factur-X (CII)"),
            ('xrechnung', "XRechnung (UBL)"),
            ('nlcius', "NLCIUS"),
            ('ubl_bis3', "Peppol Bis Billing 3.0"),
            ('ubl_a_nz', "A-NZ BIS Billing 3.0"),
            ('ubl_sg', "SG BIS Billing 3.0"),
        ],
        compute='_compute_ubl_cii_format',
        store=True,
        readonly=False,
    )
    peppol_endpoint = fields.Char(
        string="Peppol Endpoint",
        help="Unique identifier used by the Peppol BIS Billing 3.0 and its derivatives, also known as 'Endpoint ID'.",
        compute="_compute_peppol_endpoint",
        store=True,
        readonly=False,
    )
    peppol_eas = fields.Selection(
        string="Peppol e-address (EAS)",
        help="""Code used to identify the Endpoint for Peppol BIS Billing 3.0 and its derivatives.
             List available at https://docs.peppol.eu/poacc/billing/3.0/codelist/eas/""",
        compute="_compute_peppol_eas",
        store=True,
        readonly=False,
        selection=[
            ('0002', "0002 - System Information et Repertoire des Entreprise et des Etablissements: SIRENE"),
            ('0007', "0007 - Organisationsnummer (Swedish legal entities)"),
            ('0009', "0009 - SIRET-CODE"),
            ('0037', "0037 - LY-tunnus"),
            ('0060', "0060 - Data Universal Numbering System (D-U-N-S Number)"),
            ('0088', "0088 - EAN Location Code"),
            ('0096', "0096 - DANISH CHAMBER OF COMMERCE Scheme (EDIRA compliant)"),
            ('0097', "0097 - FTI - Ediforum Italia, (EDIRA compliant)"),
            ('0106', "0106 - Association of Chambers of Commerce and Industry in the Netherlands, (EDIRA compliant)"),
            ('0130', "0130 - Directorates of the European Commission"),
            ('0135', "0135 - SIA Object Identifiers"),
            ('0142', "0142 - SECETI Object Identifiers"),
            ('0151', "0151 - Australian Business Number (ABN) Scheme"),
            ('0183', "0183 - Swiss Unique Business Identification Number (UIDB)"),
            ('0184', "0184 - DIGSTORG"),
            ('0188', "0188 - Corporate Number of The Social Security and Tax Number System"),
            ('0190', "0190 - Dutch Originator's Identification Number"),
            ('0191', "0191 - Centre of Registers and Information Systems of the Ministry of Justice"),
            ('0192', "0192 - Enhetsregisteret ved Bronnoysundregisterne"),
            ('0193', "0193 - UBL.BE party identifier"),
            ('0195', "0195 - Singapore UEN identifier"),
            ('0196', "0196 - Kennitala - Iceland legal id for individuals and legal entities"),
            ('0198', "0198 - ERSTORG"),
            ('0199', "0199 - Legal Entity Identifier (LEI)"),
            ('0200', "0200 - Legal entity code (Lithuania)"),
            ('0201', "0201 - Codice Univoco Unità Organizzativa iPA"),
            ('0202', "0202 - Indirizzo di Posta Elettronica Certificata"),
            ('0204', "0204 - Leitweg-ID"),
            ('0208', "0208 - Numero d'entreprise / ondernemingsnummer / Unternehmensnummer"),
            ('0209', "0209 - GS1 identification keys"),
            ('0210', "0210 - CODICE FISCALE"),
            ('0211', "0211 - PARTITA IVA"),
            ('0212', "0212 - Finnish Organization Identifier"),
            ('0213', "0213 - Finnish Organization Value Add Tax Identifier"),
            ('0215', "0215 - Net service ID"),
            ('0216', "0216 - OVTcode"),
            ('9901', "9901 - Danish Ministry of the Interior and Health"),
            ('9910', "9910 - Hungary VAT number"),
            ('9913', "9913 - Business Registers Network"),
            ('9914', "9914 - Österreichische Umsatzsteuer-Identifikationsnummer"),
            ('9915', "9915 - Österreichisches Verwaltungs bzw. Organisationskennzeichen"),
            ('9918', "9918 - SOCIETY FOR WORLDWIDE INTERBANK FINANCIAL, TELECOMMUNICATION S.W.I.F.T"),
            ('9919', "9919 - Kennziffer des Unternehmensregisters"),
            ('9920', "9920 - Agencia Española de Administración Tributaria"),
            ('9922', "9922 - Andorra VAT number"),
            ('9923', "9923 - Albania VAT number"),
            ('9924', "9924 - Bosnia and Herzegovina VAT number"),
            ('9925', "9925 - Belgium VAT number"),
            ('9926', "9926 - Bulgaria VAT number"),
            ('9927', "9927 - Switzerland VAT number"),
            ('9928', "9928 - Cyprus VAT number"),
            ('9929', "9929 - Czech Republic VAT number"),
            ('9930', "9930 - Germany VAT number"),
            ('9931', "9931 - Estonia VAT number"),
            ('9932', "9932 - United Kingdom VAT number"),
            ('9933', "9933 - Greece VAT number"),
            ('9934', "9934 - Croatia VAT number"),
            ('9935', "9935 - Ireland VAT number"),
            ('9936', "9936 - Liechtenstein VAT number"),
            ('9937', "9937 - Lithuania VAT number"),
            ('9938', "9938 - Luxemburg VAT number"),
            ('9939', "9939 - Latvia VAT number"),
            ('9940', "9940 - Monaco VAT number"),
            ('9941', "9941 - Montenegro VAT number"),
            ('9942', "9942 - Macedonia, the former Yugoslav Republic of VAT number"),
            ('9943', "9943 - Malta VAT number"),
            ('9944', "9944 - Netherlands VAT number"),
            ('9945', "9945 - Poland VAT number"),
            ('9946', "9946 - Portugal VAT number"),
            ('9947', "9947 - Romania VAT number"),
            ('9948', "9948 - Serbia VAT number"),
            ('9949', "9949 - Slovenia VAT number"),
            ('9950', "9950 - Slovakia VAT number"),
            ('9951', "9951 - San Marino VAT number"),
            ('9952', "9952 - Turkey VAT number"),
            ('9953', "9953 - Holy See (Vatican City State) VAT number"),
            ('9955', "9955 - Swedish VAT number"),
            ('9957', "9957 - French VAT number"),
            ('9959', "9959 - Employer Identification Number (EIN, USA)"),
        ]
    )

    @api.depends('country_code')
    def _compute_ubl_cii_format(self):
        for partner in self:
            if partner.country_code == 'DE':
                partner.ubl_cii_format = 'xrechnung'
            elif partner.country_code in ('AU', 'NZ'):
                partner.ubl_cii_format = 'ubl_a_nz'
            elif partner.country_code == 'NL':
                partner.ubl_cii_format = 'nlcius'
            elif partner.country_code == 'FR':
                partner.ubl_cii_format = 'facturx'
            elif partner.country_code == 'SG':
                partner.ubl_cii_format = 'ubl_sg'
            elif partner.country_code in EAS_MAPPING:
                partner.ubl_cii_format = 'ubl_bis3'
            else:
                partner.ubl_cii_format = partner.ubl_cii_format

    @api.depends('country_code', 'vat')
    def _compute_peppol_endpoint(self):
        for partner in self:
            if partner.ubl_cii_format != 'facturx' and partner.country_code in EAS_MAPPING:
                eas_to_field = EAS_MAPPING[partner.country_code]
                # Try to set both the peppol_eas and the peppol_endpoint
                for field_name in eas_to_field.values():
                    if field_name and field_name in partner._fields and partner[field_name]:
                        partner.peppol_endpoint = partner[field_name]
                # If it's not possible to set the peppol_endpoint, just set the peppol_eas
                if not partner.peppol_endpoint:
                    partner.peppol_endpoint = partner.peppol_endpoint
            else:
                partner.peppol_endpoint = partner.peppol_endpoint

    @api.depends('country_code', 'vat')
    def _compute_peppol_eas(self):
        for partner in self:
            if partner.ubl_cii_format != 'facturx' and partner.country_code in EAS_MAPPING:
                eas_to_field = EAS_MAPPING[partner.country_code]
                # Try to set both the peppol_eas and the peppol_endpoint
                for eas, field_name in eas_to_field.items():
                    if field_name in partner._fields and partner[field_name]:
                        partner.peppol_eas = eas
                # If it's not possible to set the peppol_endpoint, just set the peppol_eas
                if not partner.peppol_eas:
                    partner.peppol_eas = list(eas_to_field.keys())[0]
            else:
                partner.peppol_eas = partner.peppol_eas

    def _get_edi_builder(self):
        self.ensure_one()
        if self.ubl_cii_format == 'xrechnung':
            return self.env['account.edi.xml.ubl_de']
        if self.ubl_cii_format == 'facturx':
            return self.env['account.edi.xml.cii']
        if self.ubl_cii_format == 'ubl_a_nz':
            return self.env['account.edi.xml.ubl_a_nz']
        if self.ubl_cii_format == 'nlcius':
            return self.env['account.edi.xml.ubl_nl']
        if self.ubl_cii_format == 'ubl_bis3':
            return self.env['account.edi.xml.ubl_bis3']
        if self.ubl_cii_format == 'ubl_sg':
            return self.env['account.edi.xml.ubl_sg']
