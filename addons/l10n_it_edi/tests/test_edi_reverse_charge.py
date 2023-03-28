# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from collections import namedtuple

from odoo import Command
from odoo.tests import tagged
from odoo.addons.l10n_it_edi.tests.common import TestItEdi


@tagged('post_install_l10n', 'post_install', '-at_install')
class TestItEdiReverseCharge(TestItEdi):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # Helper functions -----------
        def get_tag_ids(tag_codes):
            """ Helper function to define tag ids for taxes """
            return cls.env['account.account.tag'].search([
                ('applicability', '=', 'taxes'),
                ('country_id.code', '=', 'IT'),
                ('name', 'in', tag_codes)]).ids

        RepartitionLine = namedtuple('Line', 'factor_percent repartition_type tag_ids')
        def repartition_lines(*lines):
            """ Helper function to define repartition lines in taxes """
            return [(5, 0, 0)] + [(0, 0, {**line._asdict(), 'tag_ids': get_tag_ids(line[2])}) for line in lines]

        # Company -----------
        cls.company.partner_id.l10n_it_pa_index = "0803HR0"

        # Partner -----------
        cls.french_partner = cls.env['res.partner'].create({
            'name': 'Alessi',
            'vat': 'FR15437982937',
            'country_id': cls.env.ref('base.fr').id,
            'street': 'Avenue Test rue',
            'zip': '84000',
            'city': 'Avignon',
            'is_company': True
        })

        cls.san_marino_partner = cls.env['res.partner'].create({
            'name': 'Prospectra',
            'vat': 'SM6784',
            'country_id': cls.env.ref('base.sm').id,
            'street': 'Via Ventotto Luglio 212 Centro Uffici',
            'zip': '47893',
            'city': 'San Marino',
            'company_id': cls.company.id,
            'is_company': True,
        })

        # Taxes -----------
        tax_data = {
            'name': 'Tax 4% (Goods) Reverse Charge',
            'amount': 4.0,
            'amount_type': 'percent',
            'type_tax_use': 'purchase',
            'invoice_repartition_line_ids': repartition_lines(
                RepartitionLine(100, 'base', ('+03', '+vj9')),
                RepartitionLine(100, 'tax', ('+5v',)),
                RepartitionLine(-100, 'tax', ('-4v',))),
            'refund_repartition_line_ids': repartition_lines(
                RepartitionLine(100, 'base', ('-03', '-vj9')),
                RepartitionLine(100, 'tax', False),
                RepartitionLine(-100, 'tax', False)),
        }
        # Purchase tax 4% with Reverse Charge
        cls.purchase_tax_4p = cls.env['account.tax'].with_company(cls.company).create(tax_data)

        # Purchase tax 4% with Reverse Charge, targeting the tax grid for import of goods
        # already in Italy in a VAT deposit
        cls.purchase_tax_4p_already_in_italy = cls.env['account.tax'].with_company(cls.company).create({
            **tax_data,
            'name': 'Tax 4% purchase Reverse Charge, in Italy',
            'invoice_repartition_line_ids': repartition_lines(
                RepartitionLine(100, 'base', ('+03', '+vj3')),
                RepartitionLine(100, 'tax', ('+5v',)),
                RepartitionLine(-100, 'tax', ('-4v',))),
            'refund_repartition_line_ids': repartition_lines(
                RepartitionLine(100, 'base', ('-03', '-vj3')),
                RepartitionLine(100, 'tax', False),
                RepartitionLine(-100, 'tax', False)),
        })

        # Purchase tax 22% with Reverse Charge
        cls.purchase_tax_22p = cls.env['account.tax'].with_company(cls.company).create({
            **tax_data,
            'name': 'Tax 22% purchase Reverse Charge',
            'amount': 22.0,
        })

        # Export tax 0%
        cls.sale_tax_0v = cls.env['account.tax'].with_company(cls.company).create({
            **tax_data,
            'type_tax_use': 'sale',
            'amount': 0,
        })

    def test_invoice_reverse_charge(self):
        invoice = self.env['account.move'].with_company(self.company).create({
            'move_type': 'out_invoice',
            'invoice_date': '2022-03-24',
            'invoice_date_due': '2022-03-24',
            'partner_id': self.french_partner.id,
            'partner_bank_id': self.test_bank.id,
            'invoice_line_ids': [
                Command.create({
                    'name': "Product A",
                    'product_id': self.product_a.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.sale_tax_0v.ids)],
                }),
                Command.create({
                    'name': "Product B",
                    'product_id': self.product_b.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.sale_tax_0v.ids)],
                }),
            ],
        })
        invoice.action_post()
        self._assert_export_invoice(invoice, 'invoice_reverse_charge.xml')

    def test_bill_reverse_charge(self):
        bill = self.env['account.move'].with_company(self.company).create({
            'move_type': 'in_invoice',
            'invoice_date': '2022-03-24',
            'invoice_date_due': '2022-03-24',
            'partner_id': self.french_partner.id,
            'partner_bank_id': self.test_bank.id,
            'invoice_line_ids': [
                Command.create({
                    'name': "Product A",
                    'product_id': self.product_a.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.purchase_tax_22p.ids)],
                }),
                Command.create({
                    'name': "Product B, taxed 4%",
                    'product_id': self.product_b.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.purchase_tax_4p.ids)],
                }),
            ],
        })
        bill.action_post()
        self._assert_export_invoice(bill, 'bill_reverse_charge.xml')

<<<<<<< HEAD
        # Import bill #2
        bill_data_2 = {
            **bill_data,
            'invoice_line_ids': product_lines(
                ProductLine(cls.line_tax_22p, 'Product A', product_a.id),
                ProductLine(cls.line_tax_4p_already_in_italy, 'Product B, taxed 4% Already in Italy', product_b.id),
            ),
        }
        cls.reverse_charge_bill_2 = cls.env['account.move'].with_company(cls.company).create(bill_data_2)
        cls.reverse_charge_refund = cls.reverse_charge_bill.with_company(cls.company)._reverse_moves([{
            'invoice_date': fields.Date.from_string('2022-03-24'),
        }])

        # Import bill San Marino
        bill_data_san_marino = {
            'company_id': cls.company.id,
            'move_type': 'in_invoice',
            'invoice_date': fields.Date.from_string('2022-03-24'),
            'invoice_date_due': fields.Date.from_string('2022-03-24'),
            'partner_id': cls.san_marino_partner.id,
            'partner_bank_id': cls.test_bank.id,
            'invoice_line_ids': product_lines(
                ProductLine(cls.line_tax_22p, 'Product A', product_a.id),
                ProductLine(cls.line_tax_4p, 'Product B, taxed 4%', product_b.id)
            )
        }
        cls.reverse_charge_bill_san_marino = cls.env['account.move'].with_company(cls.company).create(bill_data_san_marino)

        # Posting moves -----------
        cls.reverse_charge_invoice._post()
        cls.reverse_charge_bill._post()
        cls.reverse_charge_bill_2._post()
        cls.reverse_charge_bill_san_marino._post()
        cls.reverse_charge_refund._post()

    def test_reverse_charge_invoice(self):
        self._test_invoice_with_sample_file(self.reverse_charge_invoice, "reverse_charge_invoice.xml")

    def test_reverse_charge_bill(self):
        self._test_invoice_with_sample_file(self.reverse_charge_bill, "reverse_charge_bill.xml")
=======
        credit_note = bill._reverse_moves([{'invoice_date': '2022-03-24', 'invoice_date_due': '2022-03-25'}])
        credit_note.action_post()
        self._assert_export_invoice(credit_note, 'credit_note_reverse_charge.xml')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def test_reverse_charge_bill_2(self):
        bill = self.env['account.move'].with_company(self.company).create({
            'move_type': 'in_invoice',
            'invoice_date': '2022-03-24',
            'invoice_date_due': '2022-03-24',
            'partner_id': self.french_partner.id,
            'partner_bank_id': self.test_bank.id,
            'invoice_line_ids': [
                Command.create({
                    'name': "Product A",
                    'product_id': self.product_a.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.purchase_tax_22p.ids)],
                }),
                Command.create({
                    'name': "Product B, taxed 4% Already in Italy",
                    'product_id': self.product_b.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.purchase_tax_4p_already_in_italy.ids)],
                }),
            ],
        })
        bill.action_post()
        self._assert_export_invoice(bill, 'bill_reverse_charge_2.xml')

<<<<<<< HEAD

    def test_reverse_charge_bill_san_marino(self):
        self._test_invoice_with_sample_file(
            self.reverse_charge_bill_san_marino,
            "reverse_charge_bill.xml",
            xpaths_result={
                "//DatiGeneraliDocumento/Numero": "<Numero/>",
                "(//DettaglioLinee/Descrizione)[2]": "<Descrizione/>",
            },
            xpaths_file={
                "//CedentePrestatore": """
                <CedentePrestatore>
                    <DatiAnagrafici>
                        <IdFiscaleIVA>
                            <IdPaese>SM</IdPaese>
                            <IdCodice>OO99999999999</IdCodice>
                        </IdFiscaleIVA>
                        <Anagrafica>
                            <Denominazione>Prospectra</Denominazione>
                        </Anagrafica>
                        <RegimeFiscale>RF18</RegimeFiscale>
                    </DatiAnagrafici>
                    <Sede>
                        <Indirizzo>Via Ventotto Luglio 212 Centro Uffici</Indirizzo>
                        <CAP>00000</CAP>
                        <Comune>San Marino</Comune>
                        <Nazione>SM</Nazione>
                    </Sede>
                </CedentePrestatore>
                """,
                "//DatiGeneraliDocumento/TipoDocumento": "<TipoDocumento>TD28</TipoDocumento>",
                "//DatiGeneraliDocumento/Numero": "<Numero/>",
                "(//DettaglioLinee/Descrizione)[2]": "<Descrizione/>",
            }
        )

    def test_reverse_charge_refund(self):
        self._test_invoice_with_sample_file(
            self.reverse_charge_refund,
            "reverse_charge_bill.xml",
            xpaths_result={
                "//DatiGeneraliDocumento/Numero": "<Numero/>",
                "//DatiPagamento/DettaglioPagamento/DataScadenzaPagamento": "<DataScadenzaPagamento/>",
            },
            xpaths_file={
                "//DatiGeneraliDocumento/Numero": "<Numero/>",
                "//DatiGeneraliDocumento/ImportoTotaleDocumento": "<ImportoTotaleDocumento>-1808.90</ImportoTotaleDocumento>",
                "//DatiPagamento/DettaglioPagamento/DataScadenzaPagamento": "<DataScadenzaPagamento/>",
                "(//DettaglioLinee/PrezzoUnitario)[1]": "<PrezzoUnitario>-800.400000</PrezzoUnitario>",
                "(//DettaglioLinee/PrezzoUnitario)[2]": "<PrezzoUnitario>-800.400000</PrezzoUnitario>",
                "(//DettaglioLinee/PrezzoTotale)[1]": "<PrezzoTotale>-800.40</PrezzoTotale>",
                "(//DettaglioLinee/PrezzoTotale)[2]": "<PrezzoTotale>-800.40</PrezzoTotale>",
                "(//DatiRiepilogo/ImponibileImporto)[1]": "<ImponibileImporto>-800.40</ImponibileImporto>",
                "(//DatiRiepilogo/ImponibileImporto)[2]": "<ImponibileImporto>-800.40</ImponibileImporto>",
                "(//DatiRiepilogo/Imposta)[1]": "<Imposta>-176.09</Imposta>",
                "(//DatiRiepilogo/Imposta)[2]": "<Imposta>-32.02</Imposta>",
            }
        )
=======
    def test_bill_reverse_charge_san_marino(self):
        bill = self.env['account.move'].with_company(self.company).create({
            'move_type': 'in_invoice',
            'invoice_date': '2022-03-24',
            'invoice_date_due': '2022-03-24',
            'partner_id': self.san_marino_partner.id,
            'partner_bank_id': self.test_bank.id,
            'invoice_line_ids': [
                Command.create({
                    'name': "Product A",
                    'product_id': self.product_a.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.purchase_tax_22p.ids)],
                }),
                Command.create({
                    'name': "Product B, taxed 4%",
                    'product_id': self.product_b.id,
                    'price_unit': 800.40,
                    'tax_ids': [Command.set(self.purchase_tax_4p.ids)],
                }),
            ],
        })
        bill.action_post()
        self._assert_export_invoice(bill, 'bill_reverse_charge_san_marino.xml')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
