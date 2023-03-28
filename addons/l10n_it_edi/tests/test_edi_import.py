# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

<<<<<<< HEAD
import datetime
import logging
from freezegun import freeze_time
from lxml import etree
from unittest.mock import MagicMock, patch

from odoo import sql_db
from odoo.tests import tagged
from odoo.addons.l10n_it_edi.tests.common import TestItEdi
from odoo.addons.l10n_it_edi.tools.remove_signature import remove_signature
=======
from unittest.mock import MagicMock, patch

from odoo import fields, sql_db
from odoo.tests import tagged
from odoo.addons.l10n_it_edi.tests.common import TestItEdi
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6


@tagged('post_install_l10n', 'post_install', '-at_install')
class TestItEdiImport(TestItEdi):
    """ Main test class for the l10n_it_edi vendor bills XML import"""

    fake_test_content = """<?xml version="1.0" encoding="UTF-8"?>
        <p:FatturaElettronica versione="FPR12" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
        xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2 http://www.fatturapa.gov.it/export/fatturazione/sdi/fatturapa/v1.2/Schema_del_file_xml_FatturaPA_versione_1.2.xsd">
        <FatturaElettronicaHeader>
          <DatiTrasmissione>
            <ProgressivoInvio>TWICE_TEST</ProgressivoInvio>
          </DatiTrasmissione>
          <CessionarioCommittente>
            <DatiAnagrafici>
              <CodiceFiscale>01234560157</CodiceFiscale>
            </DatiAnagrafici>
          </CessionarioCommittente>
          </FatturaElettronicaHeader>
          <FatturaElettronicaBody>
            <DatiGenerali>
              <DatiGeneraliDocumento>
                <TipoDocumento>TD02</TipoDocumento>
              </DatiGeneraliDocumento>
            </DatiGenerali>
          </FatturaElettronicaBody>
        </p:FatturaElettronica>"""

<<<<<<< HEAD
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # Build test data.
        # invoice_filename1 is used for vendor bill receipts tests
        # invoice_filename2 is used for vendor bill tests
        cls.invoice_filename1 = 'IT01234567890_FPR01.xml'
        cls.invoice_filename2 = 'IT01234567890_FPR02.xml'
        cls.signed_invoice_filename = 'IT01234567890_FPR01.xml.p7m'
        cls.invoice_content = cls._get_test_file_content(cls.invoice_filename1)
        cls.signed_invoice_content = cls._get_test_file_content(cls.signed_invoice_filename)
        cls.invoice = cls.env['account.move'].create({
            'move_type': 'in_invoice',
            'ref': '01234567890'
        })
        cls.attachment = cls.env['ir.attachment'].create({
            'name': cls.invoice_filename1,
            'raw': cls.invoice_content,
            'res_id': cls.invoice.id,
            'res_model': 'account.move',
        })
        cls.edi_document = cls.env['account.edi.document'].create({
            'edi_format_id': cls.edi_format.id,
            'move_id': cls.invoice.id,
            'attachment_id': cls.attachment.id,
            'state': 'sent'
        })

        cls.test_invoice_xmls = {k: cls._get_test_file_content(v) for k, v in [
            ('normal_1', 'IT01234567890_FPR01.xml'),
            ('signed', 'IT01234567890_FPR01.xml.p7m'),
        ]}

    def mock_commit(self):
        pass

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    # -----------------------------
    # Vendor bills
    # -----------------------------

    def test_receive_vendor_bill(self):
        """ Test a sample e-invoice file from
        https://www.fatturapa.gov.it/export/documenti/fatturapa/v1.2/IT01234567890_FPR01.xml
        """
        self._assert_import_invoice('IT01234567890_FPR01.xml', [{
            'invoice_date': fields.Date.from_string('2014-12-18'),
            'amount_untaxed': 5.0,
            'amount_tax': 1.1,
            'invoice_line_ids': [{
                'quantity': 5.0,
                'price_unit': 1.0,
            }],
        }])

    def test_receive_signed_vendor_bill(self):
        """ Test a signed (P7M) sample e-invoice file from
        https://www.fatturapa.gov.it/export/documenti/fatturapa/v1.2/IT01234567890_FPR01.xml
        """
        self._assert_import_invoice('IT01234567890_FPR01.xml.p7m', [{
            'name': 'BILL/2014/12/0001',
            'ref': '01234567890',
            'invoice_date': fields.Date.from_string('2014-12-18'),
            'amount_untaxed': 5.0,
            'amount_tax': 1.1,
            'invoice_line_ids': [{
                'quantity': 5.0,
                'price_unit': 1.0,
            }],
        }])

<<<<<<< HEAD
            self.assertRecordValues(invoices, [{
                'company_id': self.company.id,
                'name': 'BILL/2014/12/0001',
                'invoice_date': datetime.date(2014, 12, 18),
                'ref': '01234567890',
            }])

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    def test_receive_same_vendor_bill_twice(self):
        """ Test that the second time we are receiving an SdiCoop invoice, the second is discarded """

        fattura_pa = self.env.ref('l10n_it_edi.edi_fatturaPA')
        content = self.fake_test_content.encode()

        # Our test content is not encrypted
        proxy_user = MagicMock()
        proxy_user.company_id = self.company
        proxy_user._decrypt_data.return_value = content

<<<<<<< HEAD
        with patch.object(sql_db.Cursor, "commit", self.mock_commit):
=======
        def mock_commit(self):
            pass

        with patch.object(sql_db.Cursor, "commit", mock_commit):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            for dummy in range(2):
                fattura_pa._save_incoming_attachment_fattura_pa(
                    proxy_user=proxy_user,
                    id_transaction='9999999999',
<<<<<<< HEAD
                    filename=self.invoice_filename2,
=======
                    filename='IT01234567890_FPR02.xml',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    content=content,
                    key=None)

        # There should be one attachement with this filename
<<<<<<< HEAD
        attachments = self.env['ir.attachment'].search([('name', '=', self.invoice_filename2)])
=======
        attachments = self.env['ir.attachment'].search([('name', '=', 'IT01234567890_FPR02.xml')])
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        self.assertEqual(len(attachments), 1)
        invoices = self.env['account.move'].search([('payment_reference', '=', 'TWICE_TEST')])
        self.assertEqual(len(invoices), 1)
