# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

<<<<<<< HEAD
from itertools import product
from unittest.mock import patch
=======
import base64
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

from ast import literal_eval
from datetime import timedelta
from freezegun import freeze_time
from itertools import product
from unittest.mock import DEFAULT, patch

from odoo.addons.base.tests.test_ir_cron import CronMixinCase
from odoo.addons.mail.tests.common import mail_new_test_user
from odoo.addons.mail.wizard.mail_compose_message import MailComposer
from odoo.addons.test_mail.models.test_mail_models import MailTestTicket
from odoo.addons.test_mail.tests.common import TestMailCommon, TestRecipients
from odoo.fields import Datetime as FieldDatetime
from odoo.exceptions import AccessError
from odoo.tests import tagged
from odoo.tests.common import users, Form
from odoo.tools import mute_logger, formataddr


@tagged('mail_composer')
class TestMailComposer(TestMailCommon, TestRecipients):
    """ Test Composer internals """

    @classmethod
    def setUpClass(cls):
        super(TestMailComposer, cls).setUpClass()
        cls.reference_now = FieldDatetime.from_string('2022-12-24 12:00:00')
        cls.env.cr._now = cls.reference_now  # force create_date to check schedulers

        # ensure employee can create partners, necessary for templates
        cls.user_employee.write({
            'groups_id': [(4, cls.env.ref('base.group_partner_manager').id)],
        })

        cls.user_employee_2 = mail_new_test_user(
            cls.env, login='employee2', groups='base.group_user',
            notification_type='email', email='eglantine@example.com',
            name='Eglantine Employee', signature='--\nEglantine')
        cls.partner_employee_2 = cls.user_employee_2.partner_id

        # User without the group "mail.group_mail_template_editor"
        cls.user_rendering_restricted = mail_new_test_user(
            cls.env, login='user_rendering_restricted',
            groups='base.group_user',
            company_id=cls.company_admin.id,
            name='Code Template Restricted User',
            notification_type='inbox',
            signature='--\nErnest'
        )
        cls.env.ref('mail.group_mail_template_editor').users -= cls.user_rendering_restricted

        cls.test_record = cls.env['mail.test.ticket'].with_context(cls._test_context).create({
            'name': 'TestRecord',
            'customer_id': cls.partner_1.id,
            'user_id': cls.user_employee_2.id,
        })
        cls.test_records, cls.test_partners = cls._create_records_for_batch(
            'mail.test.ticket', 2,
            additional_values={'user_id': cls.user_employee_2.id},
        )

        cls.test_report, cls.test_report_2 = cls.env['ir.actions.report'].create([
            {
                'name': 'Test Report on Mail Test Ticket',
                'model': 'mail.test.ticket',
                'print_report_name': "'TestReport for %s' % object.name",
                'report_type': 'qweb-pdf',
                'report_name': 'test_mail.mail_test_ticket_test_template',
            }, {
                'name': 'Test Report 2 on Mail Test Ticket',
                'model': 'mail.test.ticket',
                'print_report_name': "'TestReport2 for %s' % object.name",
                'report_type': 'qweb-pdf',
                'report_name': 'test_mail.mail_test_ticket_test_template_2',
            }
        ])

        cls.test_from = '"John Doe" <john.doe@test.example.com>'

        cls.template = cls.env['mail.template'].create({
            'auto_delete': True,
            'name': 'TestTemplate',
            'subject': 'TemplateSubject {{ object.name }}',
            'body_html': '<p>TemplateBody <t t-esc="object.name"></t></p>',
            'partner_to': '{{ object.customer_id.id if object.customer_id else "" }}',
            'email_to': '{{ (object.email_from if not object.customer_id else "") }}',
            'email_from': '{{ (object.user_id.email_formatted or user.email_formatted) }}',
            'lang': '{{ object.customer_id.lang }}',
            'mail_server_id': cls.mail_server_domain.id,
            'model_id': cls.env['ir.model']._get('mail.test.ticket').id,
            'reply_to': '{{ ctx.get("custom_reply_to") or "info@test.example.com" }}',
            'scheduled_date': '{{ (object.create_date or datetime.datetime(2022, 12, 26, 18, 0, 0)) + datetime.timedelta(days=2) }}',
        })

        # activate translations
        cls._activate_multi_lang(
            layout_arch_db=None,  # use default mail.test_layout
            test_record=cls.test_records,
            test_template=cls.template,
        )

    def _get_web_context(self, records, add_web=True, **values):
        """ Helper to generate composer context. Will make tests a bit less
        verbose.

        :param add_web: add web context, generally making noise especially in
          mass mail mode (active_id/ids both present in context)
        """
        base_context = {
            'default_model': records._name,
            'default_res_ids': records.ids,
        }
        if len(records) == 1:
            base_context['default_composition_mode'] = 'comment'
        else:
            base_context['default_composition_mode'] = 'mass_mail'
        if add_web:
            base_context['active_model'] = records._name
            base_context['active_id'] = records[0].id
            base_context['active_ids'] = records.ids
        if values:
            base_context.update(**values)
        return base_context


@tagged('mail_composer')
class TestComposerForm(TestMailComposer):

<<<<<<< HEAD
=======
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.template.write({
            'email_layout_xmlid': 'mail.test_layout',
        })

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    def test_assert_initial_data(self):
        """ Ensure class initial data to ease understanding """
        self.assertTrue(self.template.auto_delete)

        self.assertEqual(len(self.test_records), 2)
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)

    @users('employee')
    def test_mail_composer_comment(self):
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record, add_web=True)
        ))
        self.assertTrue(composer_form.auto_delete, 'MailComposer: comment mode should remove notification emails by default')
        self.assertFalse(composer_form.auto_delete_keep_log, 'MailComposer: keep_log makes no sense in comment mode, only auto_delete')
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertFalse(composer_form.body)
        self.assertFalse(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'comment')
        self.assertEqual(composer_form.email_from, self.env.user.email_formatted)
        self.assertFalse(composer_form.email_layout_xmlid)
        self.assertTrue(composer_form.force_send, 'MailComposer: single record post send notifications right away')
        self.assertFalse(composer_form.mail_server_id)
        self.assertEqual(composer_form.model, self.test_record._name)
        self.assertFalse(composer_form.partner_ids)
        self.assertEqual(composer_form.record_name, self.test_record.name, 'MailComposer: comment mode should compute record name')
        self.assertFalse(composer_form.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
<<<<<<< HEAD
        self.assertEqual(composer_form.res_id, self.test_record.id)
        self.assertEqual(
            composer_form.subject, 'Re: %s' % self.test_record.name,
            'MailComposer: comment mode should have default subject Re: record_name')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
=======
        self.assertFalse(composer_form.scheduled_date)
        self.assertEqual(literal_eval(composer_form.res_ids), self.test_record.ids)
        self.assertEqual(composer_form.subject, self.test_record._message_compute_subject())
        self.assertIn(f'Ticket for {self.test_record.name}', composer_form.subject,
                      'Check effective content')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
        self.assertFalse(composer_form.subtype_is_log)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @users('employee')
    def test_mail_composer_comment_attachments(self):
        """Tests that all attachments are added to the composer, static attachments
        are not duplicated and while reports are re-generated, and that intermediary
        attachments are dropped."""
        attachment_data = self._generate_attachments_data(2, self.template._name, self.template.id)
        template_1 = self.template.copy({
            'attachment_ids': [(0, 0, a) for a in attachment_data],
            'report_template_ids': [(6, 0, (self.test_report + self.test_report_2).ids)],
        })
        template_1_attachments = template_1.attachment_ids
        self.assertEqual(len(template_1_attachments), 2)
        template_2 = self.template.copy({
            'attachment_ids': False,
            'report_template_ids': [(6, 0, self.test_report.ids)],
        })

        # begins without attachments
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record, add_web=True, default_attachment_ids=[])
        ))
        self.assertEqual(len(composer_form.attachment_ids), 0)

        # change template: 2 static (attachment_ids) and 2 dynamic (reports)
        composer_form.template_id = template_1
        self.assertEqual(len(composer_form.attachment_ids), 4)
        report_attachments = [att for att in composer_form.attachment_ids if att not in template_1_attachments]
        self.assertEqual(len(report_attachments), 2)
        tpl_attachments = composer_form.attachment_ids[:] - self.env['ir.attachment'].concat(*report_attachments)
        self.assertEqual(tpl_attachments, template_1_attachments)

        # change template: 0 static (attachment_ids) and 1 dynamic (report)
        composer_form.template_id = template_2
        self.assertEqual(len(composer_form.attachment_ids), 1)
        report_attachments = [att for att in composer_form.attachment_ids if att not in template_1_attachments]
        self.assertEqual(len(report_attachments), 1)
        tpl_attachments = composer_form.attachment_ids[:] - self.env['ir.attachment'].concat(*report_attachments)
        self.assertFalse(tpl_attachments)

        # change back to template 1
        composer_form.template_id = template_1
        self.assertEqual(len(composer_form.attachment_ids), 4)
        report_attachments = [att for att in composer_form.attachment_ids if att not in template_1_attachments]
        self.assertEqual(len(report_attachments), 2)
        tpl_attachments = composer_form.attachment_ids[:] - self.env['ir.attachment'].concat(*report_attachments)
        self.assertEqual(tpl_attachments, template_1_attachments)

        # reset template
        composer_form.template_id = self.env['mail.template']
        self.assertEqual(len(composer_form.attachment_ids), 0)

    @users('employee')
    def test_mail_composer_comment_wtpl(self):
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record, add_web=True, default_template_id=self.template.id)
        ))
        self.assertTrue(composer_form.auto_delete, 'Should take template value')
        self.assertFalse(composer_form.auto_delete_keep_log, 'MailComposer: keep_log makes no sense in comment mode, only auto_delete')
        self.assertEqual(composer_form.author_id, self.user_employee_2.partner_id,
                         'MailComposer: author is synchronized with email_from when possible')
        self.assertEqual(composer_form.body, f'<p>TemplateBody {self.test_record.name}</p>')
        self.assertFalse(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'comment')
        self.assertEqual(composer_form.email_from, self.user_employee_2.email_formatted)
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertTrue(composer_form.force_send, 'MailComposer: single record post send notifications right away')
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_record._name)
        self.assertEqual(composer_form.partner_ids[:], self.partner_1)
        self.assertEqual(composer_form.record_name, self.test_record.name, 'MailComposer: comment mode should compute record name')
        self.assertEqual(composer_form.reply_to, 'info@test.example.com')
        self.assertFalse(composer_form.reply_to_force_new)
<<<<<<< HEAD
        self.assertEqual(composer_form.res_id, self.test_record.id)
        self.assertEqual(composer_form.subject, 'TemplateSubject %s' % self.test_record.name)
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
=======
        self.assertEqual(literal_eval(composer_form.res_ids), self.test_record.ids)
        self.assertEqual(composer_form.scheduled_date, FieldDatetime.to_string(self.reference_now + timedelta(days=2)))
        self.assertEqual(composer_form.subject, f'TemplateSubject {self.test_record.name}')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
        self.assertFalse(composer_form.subtype_is_log)

    @users('employee')
    def test_mail_composer_comment_wtpl_batch(self):
        """ Batch mode of composer in comment mode. """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(
                self.test_records,
                add_web=True,
                default_composition_mode='comment',
                default_template_id=self.template.id),
        ))
        self.assertTrue(composer_form.auto_delete, 'Should take composer value')
        self.assertFalse(composer_form.auto_delete_keep_log, 'MailComposer: keep_log makes no sense in comment mode, only auto_delete')
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, self.template.body_html,
                         'MailComposer: comment in batch mode should have template raw body if template')
        self.assertTrue(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'comment')
        self.assertEqual(composer_form.email_from, self.template.email_from,
                         'MailComposer: comment in batch mode should have template raw email_from if template')
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertFalse(composer_form.force_send, 'MailComposer: batch record post use email queue for notifications')
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_record._name)
        self.assertFalse(composer_form.record_name, 'MailComposer: comment in batch mode should have void record name')
        self.assertEqual(composer_form.reply_to, self.template.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
        self.assertEqual(literal_eval(composer_form.res_ids), self.test_records.ids)
        self.assertEqual(composer_form.scheduled_date, self.template.scheduled_date)
        self.assertEqual(composer_form.subject, self.template.subject,
                         'MailComposer: comment in batch mode should have template raw subject if template')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
        self.assertFalse(composer_form.subtype_is_log)

    @users('employee')
    def test_mail_composer_comment_wtpl_domain(self):
        """ Batch mode of composer in comment mode, using a domain. """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='comment',
            default_model=self.test_records._name,
            default_res_domain=[('id', 'in', self.test_records.ids)],
            default_template_id=self.template.id,
        ))
        self.assertTrue(composer_form.auto_delete, 'Should take composer value')
        self.assertFalse(composer_form.auto_delete_keep_log, 'MailComposer: keep_log makes no sense in comment mode, only auto_delete')
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, self.template.body_html,
                         'MailComposer: comment in batch mode should have template raw body if template')
        self.assertTrue(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'comment')
        self.assertEqual(composer_form.email_from, self.template.email_from,
                         'MailComposer: comment in batch mode should have template raw email_from if template')
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertFalse(composer_form.force_send, 'MailComposer: batch record post use email queue for notifications')
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_record._name)
        self.assertFalse(composer_form.record_name, 'MailComposer: comment in batch mode should have void record name')
        self.assertEqual(composer_form.reply_to, self.template.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
        self.assertFalse(composer_form.res_ids)
        self.assertEqual(literal_eval(composer_form.res_domain), [('id', 'in', self.test_records.ids)])
        self.assertEqual(composer_form.scheduled_date, self.template.scheduled_date)
        self.assertEqual(composer_form.subject, self.template.subject,
                         'MailComposer: comment in batch mode should have template raw subject if template')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
        self.assertFalse(composer_form.subtype_is_log)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @users('employee')
    def test_mail_composer_comment_wtpl_norecords(self):
        """ Test specific case when running without records, to see the rendering
        when nothing is given as context. """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='comment',
            default_model='mail.test.ticket',
            default_template_id=self.template.id,
        ))
<<<<<<< HEAD
        # self.assertTrue(composer_form.auto_delete)
        self.assertFalse(composer_form.auto_delete)  # FIXME: currently not taking template value
        self.assertFalse(composer_form.auto_delete_message)
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, '<p>TemplateBody </p>')
        self.assertEqual(composer_form.composition_mode, 'comment')
        self.assertEqual(composer_form.email_from, self.env.user.partner_id.email_formatted)
=======
        self.assertTrue(composer_form.auto_delete, 'Should take composer value')
        self.assertFalse(composer_form.auto_delete_keep_log, 'MailComposer: keep_log makes no sense in comment mode, only auto_delete')
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, '<p>TemplateBody </p>')
        self.assertFalse(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'comment')
        self.assertEqual(composer_form.email_from, self.env.user.partner_id.email_formatted)
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertTrue(composer_form.force_send)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_record._name)
        self.assertFalse(composer_form.partner_ids[:])
        self.assertFalse(composer_form.record_name)
        self.assertEqual(composer_form.reply_to, 'info@test.example.com')
        self.assertFalse(composer_form.reply_to_force_new)
<<<<<<< HEAD
        self.assertFalse(composer_form.res_id)
        self.assertEqual(composer_form.subject, 'TemplateSubject ')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
=======
        self.assertFalse(composer_form.res_ids)
        self.assertEqual(composer_form.scheduled_date,
                         '2022-12-28 18:00:00',
                         'No record but rendered, see expression in template')
        self.assertEqual(composer_form.subject, 'TemplateSubject ')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
        self.assertFalse(composer_form.subtype_is_log)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @users('employee')
    def test_mail_composer_mass(self):
        """ Test composer called in mass mailing mode. """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True)
        ))
        self.assertFalse(composer_form.auto_delete)
        self.assertFalse(composer_form.auto_delete_keep_log, 'MailComposer: if emails are kept, logs are automatically kept')
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertFalse(composer_form.body)
        self.assertTrue(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'mass_mail')
        self.assertEqual(composer_form.email_from, self.env.user.email_formatted)
        self.assertFalse(composer_form.email_layout_xmlid)
        self.assertTrue(composer_form.force_send, 'MailComposer: mass mode sends emails right away')
        self.assertFalse(composer_form.mail_server_id)
        self.assertEqual(composer_form.model, self.test_records._name)
        self.assertFalse(composer_form.record_name, 'MailComposer: mass mode should have void record name')
        self.assertFalse(composer_form.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
        self.assertEqual(sorted(literal_eval(composer_form.res_ids)), sorted(self.test_records.ids))
        self.assertFalse(composer_form.scheduled_date)
        self.assertFalse(composer_form.subject, 'MailComposer: mass mode should have void default subject if no template')
<<<<<<< HEAD
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
=======
        self.assertFalse(composer_form.subtype_id, 'MailComposer: subtype is not used in mail mode')
        self.assertFalse(composer_form.subtype_is_log, 'MailComposer: subtype is log has no meaning in mail mode')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @users('employee')
    def test_mail_composer_mass_wtpl(self):
        """ Test composer called in mass mailing mode with a template. It globally
        takes the template value raw (aka not rendered). """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True, default_template_id=self.template.id)
        ))
        self.assertTrue(composer_form.auto_delete, 'Should take composer value')
        self.assertTrue(composer_form.auto_delete_keep_log)
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, self.template.body_html,
                         'MailComposer: mass mode should have template raw body if template')
        self.assertTrue(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'mass_mail')
        self.assertEqual(composer_form.email_from, self.template.email_from,
                         'MailComposer: mass mode should have template raw email_from if template')
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertTrue(composer_form.force_send, 'MailComposer: mass mode sends emails right away')
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_records._name)
        self.assertFalse(composer_form.record_name, 'MailComposer: mass mode should have void record name')
        self.assertEqual(composer_form.reply_to, self.template.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
        self.assertEqual(sorted(literal_eval(composer_form.res_ids)), sorted(self.test_records.ids))
        self.assertEqual(composer_form.scheduled_date, self.template.scheduled_date)
        self.assertEqual(composer_form.subject, self.template.subject,
                         'MailComposer: mass mode should have template raw subject if template')
<<<<<<< HEAD
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
=======
        self.assertFalse(composer_form.subtype_id, 'MailComposer: subtype is not used in mail mode')
        self.assertFalse(composer_form.subtype_is_log, 'MailComposer: subtype is log has no meaning in mail mode')

    @users('employee')
    def test_mail_composer_mass_wtpl_domain(self):
        """ Same as test_mail_composer_mass_wtpl, but using a domain instead
        of res_ids, to check support of domain. """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='mass_mail',
            default_model=self.test_records._name,
            default_res_domain=[('id', 'in', self.test_records.ids)],
            default_template_id=self.template.id,
        ))
        self.assertTrue(composer_form.auto_delete, 'Should take composer value')
        self.assertTrue(composer_form.auto_delete_keep_log)
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, self.template.body_html,
                         'MailComposer: mass mode should have template raw body if template')
        self.assertTrue(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'mass_mail')
        self.assertEqual(composer_form.email_from, self.template.email_from,
                         'MailComposer: mass mode should have template raw email_from if template')
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertTrue(composer_form.force_send, 'MailComposer: mass mode sends emails right away')
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_records._name)
        self.assertFalse(composer_form.record_name, 'MailComposer: mass mode should have void record name')
        self.assertEqual(composer_form.reply_to, self.template.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
        self.assertFalse(composer_form.res_ids)
        self.assertEqual(literal_eval(composer_form.res_domain), [('id', 'in', self.test_records.ids)])
        self.assertEqual(composer_form.scheduled_date, self.template.scheduled_date)
        self.assertEqual(composer_form.subject, self.template.subject,
                         'MailComposer: mass mode should have template raw subject if template')
        self.assertFalse(composer_form.subtype_id, 'MailComposer: subtype is not used in mail mode')
        self.assertFalse(composer_form.subtype_is_log, 'MailComposer: subtype is log has no meaning in mail mode')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @users('employee')
    def test_mail_composer_mass_wtpl_norecords(self):
        """ Test specific case when running without records, to see the rendering
        when nothing is given as context. """
        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='mass_mail',
            default_model='mail.test.ticket',
            default_template_id=self.template.id,
        ))
<<<<<<< HEAD
        # self.assertTrue(composer_form.auto_delete)
        self.assertFalse(composer_form.auto_delete)  # FIXME: currently not taking template value
        self.assertFalse(composer_form.auto_delete_message)
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, self.template.body_html,
                         'MailComposer: mass mode should have template raw body if template')
        self.assertEqual(composer_form.composition_mode, 'mass_mail')
        self.assertEqual(composer_form.email_from, self.template.email_from,
                         'MailComposer: mass mode should have template raw email_from if template')
=======
        self.assertTrue(composer_form.auto_delete, 'Should take composer value')
        self.assertTrue(composer_form.auto_delete_keep_log)
        self.assertEqual(composer_form.author_id, self.env.user.partner_id)
        self.assertEqual(composer_form.body, self.template.body_html,
                         'MailComposer: mass mode should have template raw body if template')
        self.assertFalse(composer_form.composition_batch)
        self.assertEqual(composer_form.composition_mode, 'mass_mail')
        self.assertEqual(composer_form.email_from, self.template.email_from,
                         'MailComposer: mass mode should have template raw email_from if template')
        self.assertEqual(composer_form.email_layout_xmlid, 'mail.test_layout')
        self.assertTrue(composer_form.force_send, 'MailComposer: mass mode sends emails right away')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        self.assertEqual(composer_form.mail_server_id, self.mail_server_domain)
        self.assertEqual(composer_form.model, self.test_records._name)
        self.assertFalse(composer_form.record_name, 'MailComposer: mass mode should have void record name')
        self.assertEqual(composer_form.reply_to, self.template.reply_to)
        self.assertFalse(composer_form.reply_to_force_new)
<<<<<<< HEAD
        self.assertEqual(composer_form.res_id, 0)
        self.assertEqual(composer_form.subject, self.template.subject,
                         'MailComposer: mass mode should have template raw subject if template')
        self.assertEqual(composer_form.subtype_id, self.env.ref('mail.mt_comment'))
=======
        self.assertFalse(composer_form.res_ids)
        self.assertEqual(composer_form.scheduled_date, self.template.scheduled_date)
        self.assertEqual(composer_form.subject, self.template.subject,
                         'MailComposer: mass mode should have template raw subject if template')
        self.assertFalse(composer_form.subtype_id, 'MailComposer: subtype is not used in mail mode')
        self.assertFalse(composer_form.subtype_is_log, 'MailComposer: subtype is log has no meaning in mail mode')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6


@tagged('mail_composer')
class TestComposerInternals(TestMailComposer):

    @users('employee')
    @mute_logger('odoo.addons.mail.models.mail_mail')
    def test_mail_composer_attachments(self):
        """ Test attachments management in both comment and mass mail mode. """
        attachment_data = self._generate_attachments_data(3, self.template._name, self.template.id)
        self.template.write({
            'attachment_ids': [(0, 0, a) for a in attachment_data],
            'report_template_ids': [(6, 0, (self.test_report + self.test_report_2).ids)],
        })
        template_void = self.template.copy(default={
            'attachment_ids': False,
            'report_template_ids': False,
        })
        template_void = self.template.copy(default={
            'attachment_ids': False,
            'report_name': False,
            'report_template': False,
        })
        attachs = self.env['ir.attachment'].search([('name', 'in', [a['name'] for a in attachment_data])])
        self.assertEqual(len(attachs), 3)
<<<<<<< HEAD

        for composition_mode, batch in (('comment', False), ('mass_mail', True)):
            with self.subTest(composition_mode=composition_mode, batch=batch):
                test_records = self.test_records if batch else self.test_record
                ctx = self._get_web_context(
                    test_records, add_web=False,
                    default_composition_mode=composition_mode,
                    default_template_id=self.template.id
                )

                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body</p>',
                })
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values coming from template: attachment_ids + report in comment
                if composition_mode == 'comment':
                    self.assertEqual(len(composer.attachment_ids), 4)
                    for attach in attachs:
                        self.assertIn(attach, composer.attachment_ids)
                    generated = composer.attachment_ids - attachs
                    self.assertEqual(len(generated), 1, 'MailComposer: should have 1 additional attachment for report')
                    self.assertEqual(generated.name, f'TestReport for {self.test_record.name}.html')
                    self.assertEqual(generated.res_model, 'mail.compose.message')
                    self.assertEqual(generated.res_id, 0)
=======
        extra_attach = self.env['ir.attachment'].create({
            'datas': base64.b64encode(b'ExtraData'),
            'mimetype': 'text/plain',
            'name': 'ExtraAttFileName.txt',
            'res_model': False,
            'res_id': False,
        })

        for composition_mode, batch_mode in product(('comment', 'mass_mail'),
                                                    (False, True, 'domain')):
            with self.subTest(composition_mode=composition_mode, batch_mode=batch_mode):
                batch = bool(batch_mode)
                test_records = self.test_records if batch else self.test_record
                ctx = {
                    'default_model': test_records._name,
                    'default_composition_mode': composition_mode,
                    'default_template_id': self.template.id,
                }
                if batch_mode == 'domain':
                    ctx['default_res_domain'] = [('id', 'in', test_records.ids)]
                else:
                    ctx['default_res_ids'] = test_records.ids

                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body</p>',
                })

                # values coming from template: attachment_ids + report in comment
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(len(composer.attachment_ids), 5)
                    for attach in attachs:
                        self.assertIn(attach, composer.attachment_ids)
                    generated = composer.attachment_ids - attachs
                    self.assertEqual(len(generated), 2, 'MailComposer: should have 2 additional attachments for reports')
                    self.assertEqual(
                        sorted(generated.mapped('name')),
                        sorted([f'TestReport for {self.test_record.name}.html', f'TestReport2 for {self.test_record.name}.html']))
                    self.assertEqual(generated.mapped('res_model'), ['mail.compose.message'] * 2)
                    self.assertEqual(generated.mapped('res_id'), [0] * 2)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                # values coming from template: attachment_ids only (report is dynamic)
                else:
                    self.assertEqual(
                        sorted(composer.attachment_ids.ids),
                        sorted(attachs.ids)
                    )

<<<<<<< HEAD
                # update with template with void values: values are kept
                composer.write({'template_id': template_void.id})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                if composition_mode == 'comment':
                    self.assertEqual(composer.attachment_ids, attachs + generated,
                                     'TODO: Values are kept (should be reset ?)')
                else:
                    self.assertEqual(composer.attachment_ids, attachs,
                                     'TODO: Values are kept (should be reset ?)')

                # reset template: values are kept
                composer.write({'template_id': False})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                if composition_mode == 'comment':
                    self.assertEqual(composer.attachment_ids, attachs + generated,
                                     'TODO: Values are kept (should be reset ?)')
                else:
                    self.assertEqual(composer.attachment_ids, attachs,
                                     'TODO: Values are kept (should be reset ?)')
=======
                # manual update
                composer.write({
                    'attachment_ids': [(4, extra_attach.id)],
                })
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.attachment_ids, attachs + extra_attach + generated)
                else:
                    self.assertEqual(composer.attachment_ids, attachs + extra_attach)

                # update with template with void values: values are kept, void
                # value is not forced in rendering mode as well as when copying
                # template values
                composer.write({'template_id': template_void.id})

                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.attachment_ids, attachs + extra_attach + generated)
                else:
                    self.assertEqual(composer.attachment_ids, attachs + extra_attach)

                # reset template: values are reset
                composer.write({'template_id': False})
                if composition_mode == 'comment' and not batch:
                    self.assertFalse(composer.attachment_ids)
                else:
                    self.assertFalse(composer.attachment_ids)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @users('employee')
    @mute_logger('odoo.addons.mail.models.mail_mail')
    def test_mail_composer_author(self):
        """ Test author_id / email_from synchronization, in both comment and mass
        mail modes. """
        template_void = self.template.copy(default={
            'email_from': False,
        })

<<<<<<< HEAD
        for composition_mode, batch in (('comment', False), ('mass_mail', True)):
            with self.subTest(composition_mode=composition_mode, batch=batch):
                test_records = self.test_records if batch else self.test_record
                ctx = self._get_web_context(
                    test_records, add_web=False,
                    default_composition_mode=composition_mode
                )
=======
        for composition_mode, batch_mode in product(('comment', 'mass_mail'),
                                                    (False, True, 'domain')):
            with self.subTest(composition_mode=composition_mode, batch_mode=batch_mode):
                batch = bool(batch_mode)
                test_records = self.test_records if batch else self.test_record
                ctx = {
                    'default_model': test_records._name,
                    'default_composition_mode': composition_mode,
                }
                if batch_mode == 'domain':
                    ctx['default_res_domain'] = [('id', 'in', test_records.ids)]
                else:
                    ctx['default_res_ids'] = test_records.ids
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body</p>',
                })

                # default values are current user
                self.assertEqual(composer.author_id, self.env.user.partner_id)
<<<<<<< HEAD
                self.assertEqual(composer.email_from, self.env.user.email_formatted)

                # author values reset email (FIXME: currently not synchronized)
                composer.write({'author_id': self.partner_1})
                self.assertEqual(composer.author_id, self.partner_1)
                self.assertEqual(composer.email_from, self.env.user.email_formatted)
                # self.assertEqual(composer.email_from, self.partner_1.email_formatted)

                # changing template should update its email_from
                composer.write({'template_id': self.template.id, 'author_id': self.env.user.partner_id})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()
                self.assertEqual(composer.author_id, self.env.user.partner_id,
                                 'MailComposer: should take value given by user')
                if composition_mode == 'comment':
                    self.assertEqual(composer.email_from, self.test_record.user_id.email_formatted,
                                     'MailComposer: should take email_from rendered from template')
                else:
                    self.assertEqual(composer.email_from, self.template.email_from,
                                     'MailComposer: should take email_from raw from template')

                # manual values are kept over template values
                composer.write({'email_from': self.test_from})
                self.assertEqual(composer.author_id, self.env.user.partner_id)
                self.assertEqual(composer.email_from, self.test_from)
=======
                self.assertEqual(composer.composition_mode, composition_mode)
                self.assertEqual(composer.email_from, self.env.user.email_formatted)

                # author update should reset email (FIXME: currently not synchronized)
                composer.write({'author_id': self.partner_1})
                self.assertEqual(composer.author_id, self.partner_1)
                self.assertEqual(composer.email_from, self.env.user.email_formatted,
                                 'MailComposer: TODO: author / email_from are not synchronized')
                # self.assertEqual(composer.email_from, self.partner_1.email_formatted)

                # changing template should update its email_from
                composer.write({'template_id': self.template.id})

                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.author_id, self.test_record.user_id.partner_id,
                                     f'MailComposer: should try to link in rendered mode: {composer.author_id.name}, expected {self.env.user.name}')
                    self.assertEqual(composer.email_from, self.test_record.user_id.email_formatted,
                                     'MailComposer: should take email_from rendered from template')
                else:
                    self.assertEqual(composer.author_id, self.env.user.partner_id,
                                     f'MailComposer: should reset to current user in raw mode: {composer.author_id.name}, expected {self.env.user.name}')
                    self.assertEqual(composer.email_from, self.template.email_from,
                                     'MailComposer: should take email_from raw from template')

                # manual values are kept over template values; if email does not
                # match any author, reset author
                composer.write({'email_from': self.test_from})
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.author_id, self.test_record.user_id.partner_id,
                                     'MailComposer: TODO: compute not called')
                    self.assertEqual(composer.email_from, self.test_from,
                                     'MailComposer: manual values should be kept')
                else:
                    self.assertEqual(composer.author_id, self.env.user.partner_id,
                                     'MailComposer: TODO: compute not called')
                    self.assertEqual(composer.email_from, self.test_from,
                                     'MailComposer: manual values should be kept')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # update with template with void values: void value is not forced in
                # rendering mode as well as when copying template values
                composer.write({'template_id': template_void.id})
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()
                if composition_mode == 'comment':
                    self.assertEqual(composer.author_id, self.env.user.partner_id)
                    self.assertEqual(composer.email_from, self.test_from)
                else:
                    self.assertEqual(composer.author_id, self.env.user.partner_id)
=======

                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.author_id, self.env.user.partner_id,
                                     'MailComposer: TODO: author / email_from are not synchronized')
                    self.assertEqual(composer.email_from, self.test_from)
                else:
                    self.assertEqual(composer.author_id, self.env.user.partner_id,
                                     'MailComposer: TODO: author / email_from are not synchronized')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.email_from, self.test_from)

                # reset template: values are reset due to call to default_get
                composer.write({'template_id': False})
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()
                if composition_mode == 'comment':
                    self.assertEqual(composer.author_id, self.env.user.partner_id)
                    self.assertEqual(composer.email_from, self.env.user.email_formatted)
                else:
                    self.assertEqual(composer.author_id, self.env.user.partner_id)
=======

                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.author_id, self.env.user.partner_id,
                                     'MailComposer: TODO: author / email_from are not synchronized')
                    self.assertEqual(composer.email_from, self.env.user.email_formatted)
                else:
                    self.assertEqual(composer.author_id, self.env.user.partner_id,
                                     'MailComposer: TODO: author / email_from are not synchronized')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.email_from, self.env.user.email_formatted)

    @users('employee')
    def test_mail_composer_configuration(self):
        """ Test content configuration (auto_delete_*, email_*, message_type,
        subtype) in both comment and mass mailing mode. Template update is also
        tested when it applies. """
        template_falsy = self.template.copy(default={
            'auto_delete': False,
        })

<<<<<<< HEAD
        for composition_mode, batch in (('comment', False), ('mass_mail', True)):
            with self.subTest(composition_mode=composition_mode, batch=batch):
                test_records = self.test_records if batch else self.test_record
                ctx = self._get_web_context(
                    test_records, add_web=False,
                    default_composition_mode=composition_mode
                )
=======
        for composition_mode, batch_mode in product(('comment', 'mass_mail'),
                                                    (False, True, 'domain')):
            with self.subTest(composition_mode=composition_mode, batch_mode=batch_mode):
                batch = bool(batch_mode)
                test_records = self.test_records if batch else self.test_record
                ctx = {
                    'default_model': test_records._name,
                    'default_composition_mode': composition_mode,
                }
                if batch_mode == 'domain':
                    ctx['default_res_domain'] = [('id', 'in', test_records.ids)]
                else:
                    ctx['default_res_ids'] = test_records.ids
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # 1. check without template (default values) + template update
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'email_layout_xmlid': 'mail.test_layout',
                })

                # default creation values
<<<<<<< HEAD
                self.assertFalse(composer.auto_delete)
                self.assertFalse(composer.auto_delete_message)
                self.assertTrue(composer.email_add_signature)
                self.assertEqual(composer.email_layout_xmlid, 'mail.test_layout')
                self.assertEqual(composer.message_type, 'comment')
                self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_comment'))

                # changing template should update its content
                composer.write({'template_id': self.template.id})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values come from template
                if composition_mode == 'comment':
                    self.assertFalse(composer.auto_delete, 'TODO: should be updated with template')
                    self.assertFalse(composer.auto_delete_message)
                    self.assertTrue(composer.email_add_signature, 'TODO: should be False as template negates this config')
=======
                if composition_mode == 'comment':
                    self.assertTrue(composer.auto_delete, 'By default, remove notification emails')
                    self.assertFalse(composer.auto_delete_keep_log, 'Not used in comment mode')
                    self.assertTrue(composer.email_add_signature, 'Default value in comment mode')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_comment'))
                else:
                    self.assertFalse(composer.auto_delete, 'By default, keep mailing emails')
                    self.assertFalse(composer.auto_delete_keep_log, 'Emails are not unlinked, logs are already kept')
                    self.assertFalse(composer.email_add_signature, 'Not supported in mass mailing mode')
                    self.assertFalse(composer.subtype_id)
                self.assertEqual(composer.email_layout_xmlid, 'mail.test_layout')
                self.assertEqual(composer.message_type, 'comment')

                # changing template should update its content
                composer.write({'template_id': self.template.id})

                # values come from template
                if composition_mode == 'comment':
                    self.assertTrue(composer.auto_delete)
                    self.assertFalse(composer.auto_delete_keep_log, 'Not used in comment mode')
                    self.assertFalse(composer.email_add_signature, 'Template is considered as complete')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.email_layout_xmlid, 'mail.test_layout')
                    self.assertEqual(composer.message_type, 'comment')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_comment'))
                else:
<<<<<<< HEAD
                    self.assertFalse(composer.auto_delete, 'TODO: should be updated with template')
                    self.assertFalse(composer.auto_delete_message)
                    self.assertTrue(composer.email_add_signature, 'TODO: should be False as template negates this config')
                    self.assertEqual(composer.email_layout_xmlid, 'mail.test_layout')
                    self.assertEqual(composer.message_type, 'comment')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_comment'))
=======
                    self.assertTrue(composer.auto_delete)
                    self.assertTrue(composer.auto_delete_keep_log)
                    self.assertFalse(composer.email_add_signature, 'Template is considered as complete')
                    self.assertEqual(composer.email_layout_xmlid, 'mail.test_layout')
                    self.assertEqual(composer.message_type, 'comment')
                    self.assertFalse(composer.subtype_id)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # manual update
                composer.write({
                    'message_type': 'notification',
                    'subtype_id': self.env.ref('mail.mt_note').id,
                })
                self.assertEqual(composer.message_type, 'notification')
                self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_note'))
<<<<<<< HEAD

                # force some composer values to see changes (due to previous bugs)
                composer.write({
                    'auto_delete': True,
                })
                # update with template with void values: void value is forced for
                # booleans, cannot distinguish
                composer.write({'template_id': template_falsy.id})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                if composition_mode == 'comment':
                    # self.assertFalse(composer.auto_delete, 'TODO: should be updated')
                    self.assertTrue(composer.auto_delete)
                    self.assertEqual(composer.message_type, 'notification')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_note'))
                else:
                    # self.assertFalse(composer.auto_delete, 'TODO: should be updated')
                    self.assertTrue(composer.auto_delete)
                    self.assertEqual(composer.message_type, 'notification')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_note'))

    @users('employee')
    def test_mail_composer_content(self):
        """ Test content management (body, mail_server_id, record_name, subject)
        in both comment and mass mailing mode. Template update is also tested. """
        template_void = self.template.copy(default={
            'body_html': False,
            'mail_server_id': False,
            'subject': False,
        })

        for composition_mode, batch in (('comment', False), ('mass_mail', True)):
            with self.subTest(composition_mode=composition_mode, batch=batch):
                test_records = self.test_records if batch else self.test_record
                ctx = self._get_web_context(
                    test_records, add_web=False,
                    default_composition_mode=composition_mode
                )
=======
                self.assertTrue(composer.subtype_is_log)

                # update with template with void values: void value is forced for
                # booleans, cannot distinguish
                composer.write({'template_id': template_falsy.id})

                if composition_mode == 'comment':
                    self.assertFalse(composer.auto_delete)
                    self.assertEqual(composer.message_type, 'notification')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_note'))
                    self.assertTrue(composer.subtype_is_log)
                else:
                    self.assertFalse(composer.auto_delete)
                    self.assertEqual(composer.message_type, 'notification')
                    self.assertEqual(composer.subtype_id, self.env.ref('mail.mt_note'))
                    self.assertTrue(composer.subtype_is_log)

    @users('employee')
    def test_mail_composer_content(self):
        """ Test content management (body, mail_server_id, record_name, scheduled_date,
        subject) in both comment and mass mailing mode. Template update is also
        tested. """
        template_void = self.template.copy(default={
            'body_html': False,
            'mail_server_id': False,
            'scheduled_date': False,
            'subject': False,
        })

        for composition_mode, batch_mode in product(('comment', 'mass_mail'),
                                                    (False, True, 'domain')):
            with self.subTest(composition_mode=composition_mode, batch_mode=batch_mode):
                batch = bool(batch_mode)
                test_records = self.test_records if batch else self.test_record
                ctx = {
                    'default_model': test_records._name,
                    'default_composition_mode': composition_mode,
                }
                if batch_mode == 'domain':
                    ctx['default_res_domain'] = [('id', 'in', test_records.ids)]
                else:
                    ctx['default_res_ids'] = test_records.ids
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # 1. check without template + template update
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body <t t-out="record.name>/></p>',
                    'mail_server_id': self.mail_server_global.id,
<<<<<<< HEAD
=======
                    'scheduled_date': '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    'subject': 'My amazing subject for {{ record.name }}',
                })

                # creation values are taken
                self.assertEqual(composer.body, '<p>Test Body <t t-out="record.name>/></p>')
                self.assertEqual(composer.mail_server_id, self.mail_server_global)
<<<<<<< HEAD
                self.assertEqual(composer.subject, 'My amazing subject for {{ record.name }}')
                if composition_mode == 'comment':
                    self.assertEqual(composer.record_name, self.test_record.name)
                else:
                    self.assertFalse(composer.record_name)

                # changing template should update its content
                composer.write({'template_id': self.template.id})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values come from template
                if composition_mode == 'comment':
                    self.assertEqual(composer.body, f'<p>TemplateBody {self.test_record.name}</p>')
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertEqual(composer.record_name, self.test_record.name)
=======
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.record_name, self.test_record.name)
                else:
                    self.assertFalse(composer.record_name)
                self.assertEqual(composer.scheduled_date, '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}')
                self.assertEqual(composer.subject, 'My amazing subject for {{ record.name }}')

                # changing template should update its content
                composer.write({'template_id': self.template.id})

                # values come from template
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.body, f'<p>TemplateBody {self.test_record.name}</p>')
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertEqual(composer.record_name, self.test_record.name)
                    self.assertEqual(FieldDatetime.from_string(composer.scheduled_date),
                                     self.reference_now + timedelta(days=2))
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, f'TemplateSubject {self.test_record.name}')
                else:
                    self.assertEqual(composer.body, self.template.body_html)
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertFalse(composer.record_name)
<<<<<<< HEAD
=======
                    self.assertEqual(composer.scheduled_date, self.template.scheduled_date)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, self.template.subject)

                # manual values is kept over template
                composer.write({
                    'body': '<p>Back to my amazing body <t t-out="record.name>/></p>',
                    'mail_server_id': self.mail_server_global.id,
                    'record_name': 'Manual update',
<<<<<<< HEAD
=======
                    'scheduled_date': '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    'subject': 'Back to my amazing subject for {{ record.name }}',
                })
                self.assertEqual(composer.body, '<p>Back to my amazing body <t t-out="record.name>/></p>')
                self.assertEqual(composer.mail_server_id, self.mail_server_global)
                self.assertEqual(composer.record_name, 'Manual update')
<<<<<<< HEAD
                self.assertEqual(composer.subject, 'Back to my amazing subject for {{ record.name }}')

                # update with template with void values: void value is not forced in
                # rendering mode as well as when copying template values, except for
                # body in rendering mode
                composer.write({'template_id': template_void.id})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                if composition_mode == 'comment':
                    self.assertFalse(composer.body, 'Void template body resets while other fields not, maybe to fix')
                    self.assertEqual(composer.mail_server_id, self.mail_server_global)
                    self.assertEqual(composer.record_name, 'Manual update')
=======
                self.assertEqual(composer.scheduled_date, '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}')
                self.assertEqual(composer.subject, 'Back to my amazing subject for {{ record.name }}')

                # update with template with void values: void value is not forced in
                # rendering mode as well as in raw mode
                composer.write({'template_id': template_void.id})

                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.body, '<p>Back to my amazing body <t t-out="record.name>/></p>')
                    self.assertEqual(composer.mail_server_id, self.mail_server_global)
                    self.assertEqual(composer.record_name, 'Manual update')
                    self.assertEqual(composer.scheduled_date, '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, 'Back to my amazing subject for {{ record.name }}')
                else:
                    self.assertEqual(composer.body, '<p>Back to my amazing body <t t-out="record.name>/></p>')
                    self.assertEqual(composer.mail_server_id, self.mail_server_global)
                    self.assertEqual(composer.record_name, 'Manual update')
<<<<<<< HEAD
                    self.assertEqual(composer.subject, 'Back to my amazing subject for {{ record.name }}')

                # reset template should reset values
                composer.write({'body': '<p>Back to my amazing body <t t-out="record.name>/></p>'})
                composer.write({'template_id': False})
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values are reset with default_get call, if it returns value
                # (aka subject for comment mode), and not record_name because
                # it was forgotten probably
                if composition_mode == 'comment':
                    self.assertFalse(composer.body)
                    # self.assertFalse(composer.mail_server_id.id)
                    self.assertEqual(composer.mail_server_id, self.mail_server_global,
                                     'TODO: Values are kept (should be reset ?)')
                    # self.assertEqual(composer.record_name, self.test_record.name)
                    self.assertEqual(composer.record_name, 'Manual update',
                                     'TODO: Reset not called')
                    self.assertEqual(composer.subject, 'Re: %s' % self.test_record.name)
                else:
                    self.assertFalse(composer.body)
                    # self.assertFalse(composer.mail_server_id.id)
                    self.assertEqual(composer.mail_server_id, self.mail_server_global,
                                     'TODO: Values are kept (should be reset ?)')
                    # self.assertFalse(composer.record_name)
                    self.assertEqual(composer.record_name, 'Manual update',
                                     'TODO: Reset not called')
                    # self.assertFalse(composer.subject)
                    self.assertEqual(composer.subject, 'Back to my amazing subject for {{ record.name }}',
                                     'TODO: Values are kept (should be reset ?)')
=======
                    self.assertEqual(composer.scheduled_date, '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}')
                    self.assertEqual(composer.subject, 'Back to my amazing subject for {{ record.name }}')

                # reset template should reset values
                composer.write({'template_id': False})

                # values are reset with compute field
                if composition_mode == 'comment' and not batch:
                    self.assertFalse(composer.body)
                    self.assertFalse(composer.mail_server_id.id)
                    self.assertEqual(composer.record_name, 'Manual update',
                                     'MailComposer: record name does not depend on template')
                    self.assertFalse(composer.scheduled_date)
                    self.assertEqual(composer.subject, self.test_record._message_compute_subject())
                    self.assertIn(f'Ticket for {self.test_record.name}', composer.subject,
                                  'Check effective content')
                else:
                    self.assertFalse(composer.body)
                    self.assertFalse(composer.mail_server_id.id)
                    self.assertEqual(composer.record_name, 'Manual update',
                                     'MailComposer: record name does not depend on template')
                    self.assertFalse(composer.scheduled_date)
                    self.assertFalse(composer.subject)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # 2. check with default
                ctx['default_template_id'] = self.template.id
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'template_id': self.template.id,
                })
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values come from template
                if composition_mode == 'comment':
                    self.assertEqual(composer.body, f'<p>TemplateBody {self.test_record.name}</p>')
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertEqual(composer.record_name, self.test_record.name)
=======

                # values come from template
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.body, f'<p>TemplateBody {self.test_record.name}</p>')
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertEqual(composer.record_name, self.test_record.name)
                    self.assertEqual(FieldDatetime.from_string(composer.scheduled_date), self.reference_now + timedelta(days=2))
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, f'TemplateSubject {self.test_record.name}')
                else:
                    self.assertEqual(composer.body, self.template.body_html)
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertFalse(composer.record_name)
<<<<<<< HEAD
=======
                    self.assertEqual(composer.scheduled_date, self.template.scheduled_date)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, self.template.subject)

                # 3. check at create
                ctx.pop('default_template_id')
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'template_id': self.template.id,
                })
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values come from template
                if composition_mode == 'comment':
                    self.assertEqual(composer.body, f'<p>TemplateBody {self.test_record.name}</p>')
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertEqual(composer.record_name, self.test_record.name)
=======

                # values come from template
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.body, f'<p>TemplateBody {self.test_record.name}</p>')
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertEqual(composer.record_name, self.test_record.name)
                    self.assertEqual(FieldDatetime.from_string(composer.scheduled_date), self.reference_now + timedelta(days=2))
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, f'TemplateSubject {self.test_record.name}')
                else:
                    self.assertEqual(composer.body, self.template.body_html)
                    self.assertEqual(composer.mail_server_id, self.template.mail_server_id)
                    self.assertFalse(composer.record_name)
<<<<<<< HEAD
=======
                    self.assertEqual(composer.scheduled_date, self.template.scheduled_date)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.subject, self.template.subject)

                # 4. template + user input
                ctx['default_template_id'] = self.template.id
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body</p>',
                    'mail_server_id': False,
                    'record_name': 'CustomName',
<<<<<<< HEAD
=======
                    'scheduled_date': '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    'subject': 'My amazing subject',
                })

                # creation values are taken
                self.assertEqual(composer.body, '<p>Test Body</p>')
                self.assertEqual(composer.mail_server_id.id, False)
                self.assertEqual(composer.record_name, 'CustomName')
<<<<<<< HEAD
=======
                self.assertEqual(composer.scheduled_date, '{{ datetime.datetime(2023, 1, 10, 10, 0, 0) }}')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                self.assertEqual(composer.subject, 'My amazing subject')

    @users('employee')
    @mute_logger('odoo.models.unlink')
    def test_mail_composer_recipients(self):
        """ Test content management (partner_ids, reply_to) in both comment and
        mass mailing mode. Template update is also tested. Add some tests for
        partner creation based on unknown emails as this is part of the process. """
        base_recipients = self.partner_1 + self.partner_2
        self.template.write({
            'email_cc': 'test.cc.1@test.example.com, test.cc.2@test.example.com'
        })
        template_void = self.template.copy(default={
            'email_cc': False,
            'email_to': False,
            'partner_to': False,
            'reply_to': False,
        })

<<<<<<< HEAD
        for composition_mode, batch in (('comment', False), ('mass_mail', True)):
            with self.subTest(composition_mode=composition_mode, batch=batch):
=======
        for composition_mode, batch_mode in product(('comment', 'mass_mail'),
                                                    (False, True, 'domain')):
            with self.subTest(composition_mode=composition_mode, batch_mode=batch_mode):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                self.assertFalse(
                    self.env['res.partner'].search([
                        ('email_normalized', 'in', ['test.cc.1@test.example.com',
                                                    'test.cc.2@test.example.com'])
                    ])
                )

<<<<<<< HEAD
                test_records = self.test_records if batch else self.test_record
                ctx = self._get_web_context(
                    test_records, add_web=False,
                    default_composition_mode=composition_mode
                )
=======
                batch = bool(batch_mode)
                test_records = self.test_records if batch else self.test_record
                ctx = {
                    'default_model': test_records._name,
                    'default_composition_mode': composition_mode,
                }
                if batch_mode == 'domain':
                    ctx['default_res_domain'] = [('id', 'in', test_records.ids)]
                else:
                    ctx['default_res_ids'] = test_records.ids
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # 1. check without template + template update
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body</p>',
                    'partner_ids': base_recipients.ids,
                    'reply_to': 'my_reply_to@test.example.com',
                    'subject': 'My amazing subject',
                })

                # creation values are taken
                self.assertEqual(composer.partner_ids, base_recipients)
                self.assertEqual(composer.reply_to, 'my_reply_to@test.example.com')
                self.assertFalse(composer.reply_to_force_new)
                self.assertEqual(composer.reply_to_mode, 'update')

                # update with template with void values: void value is not forced in
                # rendering mode as well as when copying template values (and recipients
                # are not computed until sending in rendering mode)
                composer.write({'template_id': template_void.id})
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                if composition_mode == 'comment':
                    self.assertEqual(composer.partner_ids, base_recipients)
                    self.assertEqual(composer.reply_to, 'my_reply_to@test.example.com')
                    self.assertFalse(composer.reply_to_force_new)
                else:
                    self.assertEqual(composer.partner_ids, base_recipients)
                    self.assertEqual(composer.reply_to, 'my_reply_to@test.example.com')
                    self.assertFalse(composer.reply_to_force_new)

                # changing template should update its content
                composer.write({'template_id': self.template.id})
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()
=======
                composer.flush_recordset()  # to be able to search for new partners

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                new_partners = self.env['res.partner'].search(
                    [('email_normalized', 'in', ['test.cc.1@test.example.com',
                                                 'test.cc.2@test.example.com'])
                    ]
                )

                # values come from template
<<<<<<< HEAD
                if composition_mode == 'comment':
=======
                if composition_mode == 'comment' and not batch:
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(len(new_partners), 2)
                    self.assertEqual(composer.partner_ids, self.partner_1 + new_partners, 'Template took customer_id as set on record')
                    self.assertEqual(composer.reply_to, 'info@test.example.com', 'Template was rendered')
                    self.assertFalse(composer.reply_to_force_new)  # should not change in comment mode
                else:
                    self.assertEqual(len(new_partners), 0)
                    self.assertEqual(composer.partner_ids, base_recipients, 'Mass mode: kept original values')
                    self.assertEqual(composer.reply_to, self.template.reply_to, 'Mass mode: raw template value')
                    self.assertFalse(composer.reply_to_force_new)  # should probably become True, not supported currently

                # manual values is kept over template
                composer.write({'partner_ids': [(5, 0), (4, self.partner_admin.id)]})
                self.assertEqual(composer.partner_ids, self.partner_admin)

                # reset template should reset values
                composer.write({'template_id': False})
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values are kept, should probably be reset
                if composition_mode == 'comment':
                    self.assertEqual(composer.partner_ids, self.partner_admin,
                                     'TODO: Values are kept (should be reset ?)')
                    self.assertEqual(composer.reply_to, 'info@test.example.com',
                                     'TODO: Values are kept (should be reset ?)')
                    self.assertFalse(composer.reply_to_force_new)
                else:
                    self.assertEqual(composer.partner_ids, self.partner_admin,
                                     'TODO: Values are kept (should be reset ?)')
                    self.assertEqual(composer.reply_to, self.template.reply_to,
                                     'TODO: Values are kept (should be reset ?)')
=======

                # values are reset
                if composition_mode == 'comment' and not batch:
                    self.assertFalse(composer.partner_ids)
                    self.assertFalse(composer.reply_to)
                    self.assertFalse(composer.reply_to_force_new)
                else:
                    self.assertFalse(composer.partner_ids)
                    self.assertFalse(composer.reply_to)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertFalse(composer.reply_to_force_new)

                # 2. check with default
                ctx['default_template_id'] = self.template.id
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'template_id': self.template.id,
                })
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values come from template
                if composition_mode == 'comment':
                    self.assertEqual(composer.partner_ids, self.partner_1 + new_partners)
                else:
                    self.assertFalse(composer.partner_ids)
                if composition_mode == 'comment':
=======

                # values come from template
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.partner_ids, self.partner_1 + new_partners)
                else:
                    self.assertFalse(composer.partner_ids)
                if composition_mode == 'comment' and not batch:
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.reply_to, "info@test.example.com")
                else:
                    self.assertEqual(composer.reply_to, self.template.reply_to)
                self.assertFalse(composer.reply_to_force_new)  # note: this should be updated with reply-to
                self.assertEqual(composer.reply_to_mode, 'update')  # note: this should be updated with reply-to

                # 3. check at create
                ctx.pop('default_template_id')
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'template_id': self.template.id,
                })
<<<<<<< HEAD
                # currently onchange necessary
                composer._onchange_template_id_wrapper()

                # values come from template
                if composition_mode == 'comment':
                    self.assertEqual(composer.partner_ids, self.partner_1 + new_partners)
                else:
                    self.assertFalse(composer.partner_ids)
                if composition_mode == 'comment':
=======

                # values come from template
                if composition_mode == 'comment' and not batch:
                    self.assertEqual(composer.partner_ids, self.partner_1 + new_partners)
                else:
                    self.assertFalse(composer.partner_ids)
                if composition_mode == 'comment' and not batch:
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    self.assertEqual(composer.reply_to, "info@test.example.com")
                else:
                    self.assertEqual(composer.reply_to, self.template.reply_to)
                self.assertFalse(composer.reply_to_force_new)
                self.assertEqual(composer.reply_to_mode, 'update')

                # 4. template + user input
                ctx['default_template_id'] = self.template.id
                composer = self.env['mail.compose.message'].with_context(ctx).create({
                    'body': '<p>Test Body</p>',
                    'partner_ids': base_recipients.ids,
                    'subject': 'My amazing subject',
                    'reply_to': False,
                })

                # creation values are taken
                self.assertEqual(composer.partner_ids, base_recipients)
                self.assertFalse(composer.reply_to)
                self.assertFalse(composer.reply_to_force_new)
                self.assertEqual(composer.reply_to_mode, 'update')

                self.env['res.partner'].search([
                    ('email_normalized', 'in', ['test.cc.1@test.example.com',
                                                'test.cc.2@test.example.com'])
                ]).unlink()

    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_parent(self):
        """ Test specific management in comment mode when having parent_id set:
        record_name, subject, parent's partners. """
        parent_subject = "Parent Subject"
        parent = self.test_record.message_post(
            body='Test',
            partner_ids=(self.partner_1 + self.partner_2).ids,
            subject=parent_subject,
        )

        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record, add_web=False, default_parent_id=parent.id)
        ).create({
            'body': '<p>Test Body</p>',
        })

        # creation values taken from parent
        self.assertEqual(composer.body, '<p>Test Body</p>')
        self.assertEqual(composer.parent_id, parent)
        self.assertEqual(composer.partner_ids, self.partner_1 + self.partner_2)
        self.assertEqual(composer.record_name, self.test_record.name)
        self.assertEqual(composer.subject, parent_subject)

    @users('user_rendering_restricted')
    @mute_logger('odoo.tests', 'odoo.addons.base.models.ir_rule', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_rights_attachments(self):
        """ Ensure a user without write access to a template can send an email"""
        template_1 = self.template.copy({
            'report_template_ids': [(6, 0, self.test_report.ids)],
        })
        attachment_data = self._generate_attachments_data(2, self.template._name, self.template.id)
        template_1.write({
            'attachment_ids': [(0, 0, dict(a, res_model="mail.template", res_id=template_1.id)) for a in attachment_data]
        })
        with self.assertRaises(AccessError):
            # ensure user_rendering_restricted has no write access
            template_1.with_user(self.env.user).write({'name': 'New Name'})

        template_1_attachments = template_1.attachment_ids
        self.assertEqual(len(template_1_attachments), 2)
        template_1_attachment_name = list(template_1_attachments.mapped('name')) + [f"TestReport for {self.test_record.name}.html"]

        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record)
        ).create({
            'body': '<p>Template Body</p>',
<<<<<<< HEAD
            'partner_ids': [self.partner_employee_2.id],
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'template_id': template_1.id,
        })
        composer._action_send_mail()

        self.assertEqual(
            self.test_record.message_ids[0].subject,
            f'TemplateSubject {self.test_record.name}')
        self.assertEqual(
            sorted(self.test_record.message_ids[0].attachment_ids.mapped('name')),
            sorted(template_1_attachment_name))

    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_rights_portal(self):
        portal_user = self._create_portal_user()
        # give read access to the record to portal (for check access rule)
        self.test_record.message_subscribe(partner_ids=portal_user.partner_id.ids)

        # patch check access rights for write access, required to post a message by default
        with patch.object(MailTestTicket, 'check_access_rights', return_value=True):
            self.env['mail.compose.message'].with_user(portal_user).with_context(
                self._get_web_context(self.test_record)
            ).create({
                'subject': 'Subject',
                'body': '<p>Body text</p>',
                'partner_ids': []
            })._action_send_mail()

            self.assertEqual(self.test_record.message_ids[0].body, '<p>Body text</p>')
            self.assertEqual(self.test_record.message_ids[0].author_id, portal_user.partner_id)

            self.env['mail.compose.message'].with_user(portal_user).with_context({
                'default_composition_mode': 'comment',
                'default_parent_id': self.test_record.message_ids.ids[0],
            }).create({
                'subject': 'Subject',
                'body': '<p>Body text 2</p>'
            })._action_send_mail()

            self.assertEqual(self.test_record.message_ids[0].body, '<p>Body text 2</p>')
            self.assertEqual(self.test_record.message_ids[0].author_id, portal_user.partner_id)

    @users('employee')
    def test_mail_composer_save_template(self):
        self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record, add_web=False)
        ).create({
            'subject': 'Template Subject',
            'body': '<p>Template Body</p>',
        }).action_save_as_template()

        # Test: email_template subject, body_html, model
        template = self.env['mail.template'].search([
            ('model', '=', self.test_record._name),
            ('subject', '=', 'Template Subject')
        ], limit=1)
        self.assertEqual(template.name, "%s: %s" % (self.env['ir.model']._get(self.test_record._name).name, 'Template Subject'))
        self.assertEqual(template.body_html, '<p>Template Body</p>', 'email_template incorrect body_html')


@tagged('mail_composer', 'multi_lang')
<<<<<<< HEAD
class TestComposerResultsComment(TestMailComposer):
=======
class TestComposerResultsComment(TestMailComposer, CronMixinCase):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    """ Test global output of composer used in comment mode. Test notably
    notification and emails generated during this process. """

    def test_assert_initial_data(self):
        """ Ensure class initial data to ease understanding """
        self.assertTrue(self.template.auto_delete)

        self.assertEqual(len(self.test_records), 2)
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)
        self.assertEqual(self.test_records[0].customer_id.lang, 'en_US')
        self.assertEqual(self.test_records[1].customer_id.lang, 'en_US')

        self.assertEqual(len(self.test_partners), 2)

        self.assertEqual(self.user_employee.lang, 'en_US')
        self.assertEqual(self.user_employee_2.lang, 'en_US')

<<<<<<< HEAD
=======
    @users('employee')
    def test_mail_composer_default_subject(self):
        """ Make sure the default subject is applied in the composer. """
        simple_record = self.env['mail.test.simple'].create({'name': 'TestSimple'})
        ticket_record = self.env['mail.test.ticket'].create({'name': 'TestTicket'})

        # default behavior: use record name
        _, message = self.env['mail.compose.message'].with_context(
            self._get_web_context(simple_record, add_web=False, composition_mode='comment')
        ).create({
            'body': '<p>Test Body</p>',
        })._action_send_mail()
        self.assertEqual(message.subject, simple_record.name)

        # overridden in model
        _, message = self.env['mail.compose.message'].with_context(
            self._get_web_context(ticket_record, add_web=False, composition_mode='comment')
        ).create({
            'body': '<p>Test Body</p>',
        })._action_send_mail()
        self.assertEqual(message.subject, ticket_record._message_compute_subject())
        self.assertIn(f'Ticket for {ticket_record.name}', message.subject)

        # forced value
        _, message = self.env['mail.compose.message'].with_context(
            self._get_web_context(ticket_record, add_web=False, composition_mode='comment')
        ).create({
            'body': '<p>Test Body</p>',
            'subject': 'Forced Subject',
        })._action_send_mail()
        self.assertEqual(message.subject, 'Forced Subject',)

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_notifications_delete(self):
        """ Notifications are correctly deleted once sent """
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record)
        ).create({
            'body': '<p>Test Body</p>',
            'partner_ids': [(4, self.partner_1.id), (4, self.partner_2.id)]
        })
<<<<<<< HEAD
        self.assertFalse(composer.auto_delete)
        self.assertFalse(composer.auto_delete_message)
=======
        self.assertTrue(composer.auto_delete, 'Comment mode removes notification emails by default')
        self.assertFalse(composer.auto_delete_keep_log, 'Not used in comment mode')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # notifications
        message = self.test_record.message_ids[0]
        self.assertEqual(message.notified_partner_ids, self.partner_employee_2 + self.partner_1 + self.partner_2)

        # global outgoing
        self.assertEqual(len(self._mails), 3, 'Should have sent an email each recipient')
        self.assertEqual(len(self._new_mails), 2, 'Should have created 2 mail.mail (1 for users, 1 for customers)')
        self.assertFalse(self._new_mails.exists(), 'Should have deleted mail.mail records')

        # Check ``auto_delete`` field usage (note: currently not correctly managed)
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record),
        ).create({
            'auto_delete': False,
            'body': '<p>Test Body</p>',
            'partner_ids': [(4, self.partner_1.id), (4, self.partner_2.id)]
        })
        self.assertFalse(composer.auto_delete)
<<<<<<< HEAD
        self.assertFalse(composer.auto_delete_message)
        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # notifications
        message = self.test_record.message_ids[0]
        self.assertEqual(message.notified_partner_ids, self.partner_employee_2 + self.partner_1 + self.partner_2)

        # global outgoing
        self.assertEqual(len(self._mails), 3, 'Should have sent an email each recipient')
        self.assertEqual(len(self._new_mails), 2, 'Should have created 2 mail.mail (1 for users, 1 for customers)')
        self.assertEqual(len(self._new_mails.exists()), 0, 'To fix: does not respect auto_delete')

        # ensure ``mail_auto_delete`` context key allow to override this behavior
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record),
            mail_auto_delete=False,
        ).create({
            'body': '<p>Test Body</p>',
            'partner_ids': [(4, self.partner_1.id), (4, self.partner_2.id)]
        })
=======
        self.assertFalse(composer.auto_delete_keep_log, 'Not used in comment mode')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # notifications
        message = self.test_record.message_ids[0]
        self.assertEqual(message.notified_partner_ids, self.partner_employee_2 + self.partner_1 + self.partner_2)

        # global outgoing
        self.assertEqual(len(self._mails), 3, 'Should have sent an email each recipient')
        self.assertEqual(len(self._new_mails), 2, 'Should have created 2 mail.mail (1 for users, 1 for customers)')
        self.assertEqual(len(self._new_mails.exists()), 2, 'Should not have deleted mail.mail records')

    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_post_parameters(self):
        """ Test various fields and tweaks in comment mode used for message_post
        parameters and process.. """
        # default behavior
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record)
        ).create({
            'body': '<p>Test Body</p>',
        })
        _mail, message = composer._action_send_mail()
        self.assertEqual(message.body, '<p>Test Body</p>')
        self.assertTrue(message.email_add_signature)
        self.assertFalse(message.email_layout_xmlid)
        self.assertEqual(message.message_type, 'comment', 'Mail: default message type with composer is user comment')
        self.assertEqual(message.record_name, self.test_record.name)
        self.assertEqual(message.subtype_id, self.env.ref('mail.mt_comment', 'Mail: default subtype is comment'))

        # tweaks
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record)
        ).create({
            'body': '<p>Test Body 2</p>',
            'email_add_signature': False,
            'email_layout_xmlid': 'mail.mail_notification_light',
            'message_type': 'notification',
            'subtype_id': self.env.ref('mail.mt_note').id,
            'partner_ids': [(4, self.partner_1.id), (4, self.partner_2.id)],
            'record_name': 'Custom record name',
        })
        _mail, message = composer._action_send_mail()
        self.assertEqual(message.body, '<p>Test Body 2</p>')
        self.assertFalse(message.email_add_signature)
        self.assertEqual(message.email_layout_xmlid, 'mail.mail_notification_light')
        self.assertEqual(message.message_type, 'notification')
        self.assertEqual(message.record_name, 'Custom record name')
        self.assertEqual(message.subtype_id, self.env.ref('mail.mt_note'))

<<<<<<< HEAD
        # log forces note
        composer.write({
            'is_log': True,
            'subtype_id': self.env.ref('mail.mt_comment').id,
=======
        # subtype through xml id
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record),
            default_subtype_xmlid='mail.mt_note',
        ).create({
            'body': '<p>Default subtype through xml id</p>',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        })
        _mail, message = composer._action_send_mail()
        self.assertEqual(message.subtype_id, self.env.ref('mail.mt_note'))

    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_recipients(self):
        """ Test partner_ids given to composer are given to the final message. """
        composer = self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record)
        ).create({
            'body': '<p>Test Body</p>',
            'partner_ids': [(4, self.partner_1.id), (4, self.partner_2.id)]
        })
        composer._action_send_mail()

        message = self.test_record.message_ids[0]
        self.assertEqual(message.author_id, self.user_employee.partner_id)
        self.assertEqual(message.body, '<p>Test Body</p>')
        self.assertEqual(message.subject, self.test_record._message_compute_subject())
        self.assertEqual(message.subtype_id, self.env.ref('mail.mt_comment'))
        self.assertEqual(message.partner_ids, self.partner_1 | self.partner_2)

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail', 'odoo.addons.mail.models.mail_message_schedule')
    def test_mail_composer_wtpl_complete(self):
        """ Test a posting process using a complex template, holding several
        additional recipients and attachments. It is done in monorecord and
        in batch since this is now supported.

        This tests notifies: 2 new email_to (+ 1 duplicated), 1 email_cc,
<<<<<<< HEAD
        test_record followers and partner_admin added in partner_to.
=======
        test_records followers and partner_admin added in partner_to.

        Global notification
          * monorecord: send notifications right away (force_send=True)
          * multirecord: delay notification sending (force_send=False)

        Use cases
          * scheduled_date: creates mail.message.schedule (no email sent), then
            scheduling send notifications with notification parameters kept
          * otherwise: global behavior
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        Test with and without notification layout specified.

        Test with and without languages.
<<<<<<< HEAD
=======

        Setup with batch and langs
          * record1: customer lang=es_ES
                     follower partner_employee_2 lang=en_US
                     3 new partners (en_US) created by template
          * record2: customer lang=en_US
                     follower partner_employee_2 lang=en_US
                     3 new partners (en_US) created by template
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        """
        attachment_data = self._generate_attachments_data(2, self.template._name, self.template.id)
        email_to_1 = 'test.to.1@test.example.com'
        email_to_2 = 'test.to.2@test.example.com'
        email_to_3 = 'test.to.1@test.example.com'  # duplicate: should not sent twice the email
        email_cc_1 = 'test.cc.1@test.example.com'
        self.template.write({
            'auto_delete': False,  # keep sent emails to check content
            'attachment_ids': [(0, 0, a) for a in attachment_data],
            'email_to': '%s, %s, %s' % (email_to_1, email_to_2, email_to_3),
            'email_cc': email_cc_1,
            'partner_to': '%s, {{ object.customer_id.id if object.customer_id else "" }}' % self.partner_admin.id,
            'report_template_ids': [(6, 0, (self.test_report + self.test_report_2).ids)],
        })
        attachs = self.env['ir.attachment'].search([('name', 'in', [a['name'] for a in attachment_data])])
        self.assertEqual(len(attachs), 2)

        for batch_mode, scheduled_date, email_layout_xmlid, use_lang in product(
            (False, True, 'domain'),
            (False, '{{ (object.create_date or datetime.datetime(2022, 12, 26, 18, 0, 0)) + datetime.timedelta(days=2) }}'),
            (False, 'mail.test_layout'),
            (False, True),
        ):
            with self.subTest(batch_mode=batch_mode,
                              scheduled_date=scheduled_date,
                              email_layout_xmlid=email_layout_xmlid,
                              use_lang=use_lang):
                # update test configuration
                batch = bool(batch_mode)
                self.template.write({
                    'scheduled_date': scheduled_date,
                    'email_layout_xmlid': email_layout_xmlid,
                })
                if use_lang:
                    if batch:
                        langs = ('es_ES', 'en_US')
                        self.test_partners[0].lang = langs[0]
                        self.test_partners[1].lang = langs[1]
                    else:
                        langs = ('es_ES',)
                        self.partner_1.lang = langs[0]
                if not use_lang:
                    if batch:
                        langs = (False, False)
                        self.test_partners.lang = False
                    else:
                        langs = (False,)
                        self.partner_1.lang = False
                test_records = self.test_records if batch else self.test_record

<<<<<<< HEAD
        for email_layout_xmlid, use_lang in product(
            (False, 'mail.test_layout'),
            (False, True),
        ):
            with self.subTest(email_layout_xmlid=email_layout_xmlid,
                              use_lang=use_lang):
                # update test configuration
                if use_lang:
                    exp_lang = 'es_ES'
                    self.partner_1.lang = exp_lang
                if not use_lang:
                    exp_lang = False
                    self.partner_1.lang = False

                test_record = self.test_record.with_env(self.env)

                # ensure initial data
                self.assertEqual(test_record.user_id, self.user_employee_2)
                self.assertEqual(test_record.message_partner_ids, self.partner_employee_2)

                ctx = {
                    'default_model': test_record._name,
                    'default_composition_mode': 'comment',
                    'default_res_id': test_record.id,
=======
                # ensure initial data
                self.assertEqual(len(test_records.customer_id), len(test_records))
                self.assertEqual(test_records.user_id, self.user_employee_2)
                self.assertEqual(test_records.message_partner_ids, self.partner_employee_2)

                ctx = {
                    'default_model': test_records._name,
                    'default_composition_mode': 'comment',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    'default_template_id': self.template.id,
                    # avoid successive tests issues with followers
                    'mail_create_nosubscribe': True,
                }
<<<<<<< HEAD
                if email_layout_xmlid:
                    ctx['default_email_layout_xmlid'] = email_layout_xmlid
=======
                if batch_mode == 'domain':
                    ctx['default_res_domain'] = [('id', 'in', test_records.ids)]
                else:
                    ctx['default_res_ids'] = test_records.ids
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # open a composer and run it in comment mode
                composer_form = Form(self.env['mail.compose.message'].with_context(ctx))
                composer = composer_form.save()
<<<<<<< HEAD

                # ensure some parameters used afterwards
                author = self.partner_employee
                self.assertEqual(composer.author_id, author,
                                 'Author is synchronized with rendered email_from')
                self.assertEqual(composer.email_from, self.partner_employee_2.email_formatted)
                self.assertFalse(composer.reply_to_force_new, 'Mail: thread-enabled models should use auto thread by default')

                with self.mock_mail_gateway(mail_unlink_sent=False), \
                     self.mock_mail_app():
                    composer._action_send_mail()

                    # monorecord: force_send notifications
                    self.assertEqual(self._new_mails.mapped('state'), ['sent'] * len(self._new_mails))
                    self.assertEqual(len(self._mails), 5, 'Should have sent 5 emails, one per recipient per record')
=======
                self.assertEqual(composer.email_layout_xmlid, email_layout_xmlid)

                # ensure some parameters used afterwards
                if batch:
                    author = self.env.user.partner_id
                    self.assertEqual(composer.author_id, author,
                                     'Author cannot be synchronized with a raw email_from')
                    self.assertEqual(composer.email_from, self.template.email_from)
                else:
                    author = self.partner_employee_2
                    self.assertEqual(composer.author_id, author,
                                     'Author is synchronized with rendered email_from')
                    self.assertEqual(composer.email_from, self.partner_employee_2.email_formatted)
                self.assertFalse(composer.reply_to_force_new, 'Mail: thread-enabled models should use auto thread by default')

                # due to scheduled_date, cron for sending notification will be used
                schedule_cron_id = self.env.ref('mail.ir_cron_send_scheduled_message').id
                with self.mock_mail_gateway(mail_unlink_sent=False), \
                     self.mock_mail_app(), \
                     freeze_time(self.reference_now), \
                     self.capture_triggers(schedule_cron_id) as capt:
                    composer._action_send_mail()

                    # notification process should not have been sent
                    if scheduled_date:
                        self.assertFalse(self._new_mails)
                        self.assertFalse(self._mails)
                    # monorecord: force_send notifications
                    elif not batch:
                        # as there are recipients with different langs: we have
                        # 3 outgoing mails: partner_employee2 (user) then customers
                        # in two langs
                        if use_lang:
                            self.assertEqual(
                                len(self._new_mails), 3,
                                'Should have created 1 mail for user, then 2 for customers that belong to 2 langs')
                        # without lang, recipients are grouped by main usage aka user and customer
                        else:
                            self.assertEqual(
                                len(self._new_mails), 2,
                                'Should have created 1 mail for user, then 1 for customers')
                        self.assertEqual(self._new_mails.mapped('state'), ['sent'] * len(self._new_mails))
                        self.assertEqual(len(self._mails), 5, 'Should have sent 5 emails, one per recipient per record')
                    # multirecord: use email queue
                    else:
                        # see not-batch comment, then add 2 mails for the second
                        # record as all customers have same language
                        if use_lang:
                            self.assertEqual(
                                len(self._new_mails), 5,
                                'Should have created 3 mails for first record, then 2 for second')
                        else:
                            self.assertEqual(
                                len(self._new_mails), 4,
                                'Should have created 2 mails / record (one for user, one for customers)')
                        self.assertEqual(self._new_mails.mapped('state'), ['outgoing'] * len(self._new_mails))
                        self.assertEqual(len(self._mails), 0, 'Should have put emails in queue and not sent any emails')
                        # simulate cron sending emails
                        self.env['mail.mail'].sudo().process_email_queue()

                # notification process should not have been sent
                if scheduled_date:
                    self.assertEqual(
                        capt.records.mapped('call_at'), [self.reference_now + timedelta(days=2)] * len(test_records),
                        msg='Should have created a cron trigger for the scheduled sending'
                    )
                else:
                    self.assertFalse(capt.records)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

                # check new partners have been created based on emails given
                new_partners = self.env['res.partner'].search([
                    ('email', 'in', [email_to_1, email_to_2, email_to_3, email_cc_1])
                ])
                self.assertEqual(len(new_partners), 3)
                self.assertEqual(
                    set(new_partners.mapped('email')),
                    {'test.to.1@test.example.com', 'test.to.2@test.example.com', 'test.cc.1@test.example.com'},
                )
                self.assertEqual(
                    set(new_partners.mapped('lang')),
                    {'en_US'},
                )

<<<<<<< HEAD
                message = test_record.message_ids[0]

                # check created mail.mail and outgoing emails. In comment
                # 2 mails are generated (due to group-based layouting):
                # - one for recipient that is a user
                # - one for recipients that are customers
                # Then each recipient receives its own outging email. See
                # 'assertMailMail' for more details.
                if exp_lang == 'es_ES':
                    exp_body = f'SpanishBody for {test_record.name}'
                    exp_subject = f'SpanishSubject for {test_record.name}'
                else:
                    exp_body = f'TemplateBody {test_record.name}'
                    exp_subject = f'TemplateSubject {test_record.name}'
                self.assertMailMail(self.partner_employee_2, 'sent',
                                    mail_message=message,
                                    author=author,  # author is different in batch and monorecord mode (raw or rendered email_from)
                                    email_values={
                                        'body_content': exp_body,
                                        'email_from': test_record.user_id.email_formatted,  # set by template
                                        'subject': exp_subject,
                                        'attachments_info': [
                                            {'name': 'AttFileName_00.txt', 'raw': b'AttContent_00', 'type': 'text/plain'},
                                            {'name': 'AttFileName_01.txt', 'raw': b'AttContent_01', 'type': 'text/plain'},
                                            {'name': f'TestReport for {test_record.name}.html', 'type': 'text/plain'},
                                        ]
                                    },
                                    fields_values={
                                        'mail_server_id': self.mail_server_domain,
                                    },
                                   )
                self.assertMailMail(test_record.customer_id + new_partners, 'sent',
                                    mail_message=message,
                                    author=author,  # author is different in batch and monorecord mode (raw or rendered email_from)
                                    email_values={
                                        'body_content': exp_body,
                                        'email_from': test_record.user_id.email_formatted,  # set by template
                                        'subject': exp_subject,
                                        'attachments_info': [
                                            {'name': 'AttFileName_00.txt', 'raw': b'AttContent_00', 'type': 'text/plain'},
                                            {'name': 'AttFileName_01.txt', 'raw': b'AttContent_01', 'type': 'text/plain'},
                                            {'name': f'TestReport for {test_record.name}.html', 'type': 'text/plain'},
                                        ]
                                    },
                                    fields_values={
                                        'mail_server_id': self.mail_server_domain,
                                    },
                                   )

                # Low-level checks on outgoing email for the recipient to
                # check layouting and language. Note that standard layout
                # is not tested against translations, only the custom one
                # to ease translations checks.
                email = self._find_sent_email(test_record.user_id.email_formatted, [test_record.customer_id.email_formatted])
                self.assertTrue(bool(email), 'Email not found, check recipients')

                # TDE FIXME: as it currently depends on a context-based hack
                # translation is not supported when scheduling notifications
                # or when a domain is given. Moreover access buttons are not
                # translated
                exp_layout_content_en = 'English Layout for Ticket-like model'
                exp_layout_content_es = 'Spanish Layout para Spanish Model Description'
                exp_button_en = 'View Ticket-like model'
                # exp_button_es = 'SpanishView Spanish Model Description'
                if email_layout_xmlid:
                    if exp_lang == 'es_ES':
                        self.assertIn(exp_layout_content_es, email['body'])
                        self.assertIn(exp_button_en, email['body'],
                                      'TODO: buttons should be translated')
                    else:
                        self.assertIn(exp_layout_content_en, email['body'])
                        self.assertIn(exp_button_en, email['body'])
                else:
                    # check default layouting applies
                    if exp_lang == 'es_ES':
                        self.assertIn('html lang="es_ES"', email['body'])
                    else:
                        self.assertIn('html lang="en_US"', email['body'])

                # message is posted and notified admin
                self.assertEqual(message.subtype_id, self.env.ref('mail.mt_comment'))
                self.assertNotified(message, [{'partner': self.partner_admin, 'is_read': False, 'type': 'inbox'}])
                # attachments are copied on message and linked to document
                self.assertEqual(
                    set(message.attachment_ids.mapped('name')),
                    set(['AttFileName_00.txt', 'AttFileName_01.txt',
                         f'TestReport for {test_record.name}.html'])
                )
                self.assertEqual(set(message.attachment_ids.mapped('res_model')), set([test_record._name]))
                self.assertEqual(set(message.attachment_ids.mapped('res_id')), set(test_record.ids))
                self.assertTrue(all(attach not in message.attachment_ids for attach in attachs), 'Should have copied attachments')
=======
                # if scheduled_date is set: simulate cron for sending notifications
                if scheduled_date:
                    # Send the scheduled message from the CRON
                    with self.mock_mail_gateway(mail_unlink_sent=False), \
                         self.mock_mail_app(), \
                         freeze_time(self.reference_now + timedelta(days=3)):
                        self.env['mail.message.schedule'].sudo()._send_notifications_cron()

                        # monorecord: force_send notifications
                        if not batch:
                            # as there are recipients with different langs: we have
                            # 3 outgoing mails: partner_employee2 (user) then customers
                            # in two langs
                            if use_lang:
                                self.assertEqual(
                                    len(self._new_mails), 3,
                                    'Should have created 1 mail for user, then 2 for customers that belong to 2 langs')
                            # without lang, recipients are grouped by main usage aka user and customer
                            else:
                                self.assertEqual(
                                    len(self._new_mails), 2,
                                    'Should have created 1 mail for user, then 1 for customers')
                            self.assertEqual(self._new_mails.mapped('state'), ['sent'] * len(self._new_mails))
                            self.assertEqual(len(self._mails), 5, 'Should have sent 5 emails, one per recipient per record')
                        # multirecord: use email queue
                        else:
                            # see not-batch comment, then add 2 mails for the second
                            # record as all customers have same language
                            if use_lang:
                                self.assertEqual(
                                    len(self._new_mails), 5,
                                    'Should have created 3 mails for first record, then 2 for second')
                            else:
                                self.assertEqual(
                                    len(self._new_mails), 4,
                                    'Should have created 2 mails / record (one for user, one for customers)')
                            self.assertEqual(self._new_mails.mapped('state'), ['outgoing'] * len(self._new_mails))
                            self.assertEqual(len(self._mails), 0, 'Should have put emails in queue and not sent any emails')
                            # simulate cron sending emails
                            self.env['mail.mail'].sudo().process_email_queue()

                # template is sent only to partners (email_to are transformed)
                for test_record, exp_lang in zip(test_records, langs):
                    message = test_record.message_ids[0]

                    # check created mail.mail and outgoing emails. In comment
                    # 2 or 3 mails are generated (due to group-based layouting):
                    # - one for recipient that is a user
                    # - one / two for recipients that are customers, one / lang
                    # Then each recipient receives its own outgoing email. See
                    # 'assertMailMail' for more details.

                    # user email (one user, one email)
                    if exp_lang == 'es_ES':
                        exp_body = f'SpanishBody for {test_record.name}'
                        exp_subject = f'SpanishSubject for {test_record.name}'
                    else:
                        exp_body = f'TemplateBody {test_record.name}'
                        exp_subject = f'TemplateSubject {test_record.name}'
                    self.assertMailMail(self.partner_employee_2, 'sent',
                                        mail_message=message,
                                        author=author,  # author is different in batch and monorecord mode (raw or rendered email_from)
                                        email_values={
                                            'body_content': exp_body,
                                            'email_from': test_record.user_id.email_formatted,  # set by template
                                            'subject': exp_subject,
                                            'attachments_info': [
                                                {'name': 'AttFileName_00.txt', 'raw': b'AttContent_00', 'type': 'text/plain'},
                                                {'name': 'AttFileName_01.txt', 'raw': b'AttContent_01', 'type': 'text/plain'},
                                                {'name': f'TestReport for {test_record.name}.html', 'type': 'text/plain'},
                                                {'name': f'TestReport2 for {test_record.name}.html', 'type': 'text/plain'},
                                            ]
                                        },
                                        fields_values={
                                            'mail_server_id': self.mail_server_domain,
                                        },
                                       )

                    # customers emails (several customers, one or two emails depending
                    # on multi-lang testing environment)
                    if use_lang and test_record == test_records[0]:
                        # in this case, we are in a multi-lang customers testing
                        emails_recipients = [
                            test_record.customer_id,  # es_ES
                            new_partners  # en_US (default lang of new customers)
                        ]
                    else:
                        # all recipients have same language, one email
                        emails_recipients = [test_record.customer_id + new_partners]

                    for recipients in emails_recipients:
                        self.assertMailMail(recipients, 'sent',
                                            mail_message=message,
                                            author=author,  # author is different in batch and monorecord mode (raw or rendered email_from)
                                            email_values={
                                                'body_content': exp_body,
                                                'email_from': test_record.user_id.email_formatted,  # set by template
                                                'subject': exp_subject,
                                                'attachments_info': [
                                                    {'name': 'AttFileName_00.txt', 'raw': b'AttContent_00', 'type': 'text/plain'},
                                                    {'name': 'AttFileName_01.txt', 'raw': b'AttContent_01', 'type': 'text/plain'},
                                                    {'name': f'TestReport for {test_record.name}.html', 'type': 'text/plain'},
                                                    {'name': f'TestReport2 for {test_record.name}.html', 'type': 'text/plain'},
                                                ]
                                            },
                                            fields_values={
                                                'mail_server_id': self.mail_server_domain,
                                            },
                                           )

                    # Specifically for the language-specific recipient, perform
                    # low-level checks on outgoing email for the recipient to
                    # check layouting and language. Note that standard layout
                    # is not tested against translations, only the custom one
                    # to ease translations checks.
                    # We could do the check for other layouts but it would be
                    # mainly noisy / duplicated check
                    email = self._find_sent_email(test_record.user_id.email_formatted, [test_record.customer_id.email_formatted])
                    self.assertTrue(bool(email), 'Email not found, check recipients')

                    exp_layout_content_en = 'English Layout for Ticket-like model'
                    exp_layout_content_es = 'Spanish Layout para Spanish Model Description'
                    exp_button_en = 'View Ticket-like model'
                    exp_button_es = 'SpanishView Spanish Model Description'
                    if email_layout_xmlid:
                        if exp_lang == 'es_ES':
                            self.assertIn(exp_layout_content_es, email['body'])
                            self.assertIn(exp_button_es, email['body'])
                        else:
                            self.assertIn(exp_layout_content_en, email['body'])
                            self.assertIn(exp_button_en, email['body'])
                    else:
                        # check default layouting applies
                        if exp_lang == 'es_ES':
                            self.assertIn('html lang="es_ES"', email['body'])
                        else:
                            self.assertIn('html lang="en_US"', email['body'])

                    # message is posted and notified admin
                    self.assertEqual(message.subtype_id, self.env.ref('mail.mt_comment'))
                    self.assertNotified(message, [{'partner': self.partner_admin, 'is_read': False, 'type': 'inbox'}])
                    # attachments are copied on message and linked to document
                    self.assertEqual(
                        set(message.attachment_ids.mapped('name')),
                        set(['AttFileName_00.txt', 'AttFileName_01.txt',
                             f'TestReport for {test_record.name}.html',
                             f'TestReport2 for {test_record.name}.html'])
                    )
                    self.assertEqual(set(message.attachment_ids.mapped('res_model')), set([test_record._name]))
                    self.assertEqual(set(message.attachment_ids.mapped('res_id')), set(test_record.ids))
                    self.assertTrue(all(attach not in message.attachment_ids for attach in attachs), 'Should have copied attachments')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6


@tagged('mail_composer', 'mail_blacklist')
class TestComposerResultsCommentStatus(TestMailComposer):
    """ Test cases involving blacklist, opt-out, state management, ... specific
    class to avoid bloating the base comment-based composer tests. """

    @classmethod
    def setUpClass(cls):
        """ Test data: 4 records with a customer set, then some additional
        records based on emails, duplicates, ...

        Record0: partner is blacklisted
        Record1: Record4 has the same email (but no customer set)
        Record5 and Record6 have same email (notlinked to any customer)
        """
        super(TestComposerResultsCommentStatus, cls).setUpClass()

        # ensure employee can create partners, necessary for templates
        cls.user_employee.write({
            'groups_id': [(4, cls.env.ref('base.group_partner_manager').id)],
        })

        # add 2 new records with customers
        cls.test_records, cls.test_partners = cls._create_records_for_batch(
            'mail.test.ticket.el', 4,
            additional_values={'user_id': cls.user_employee_2.id},
            prefix='el_'
        )
        # create bl / optout / duplicates, see docstring
        cls.env['mail.blacklist']._add(
            cls.test_partners[0].email_formatted
        )
        cls.test_records += cls.env[cls.test_records._name].create([
            {
                'email_from': cls.test_records[1].email_from,
                'name': 'Email of Record2',
                'user_id': cls.user_employee_2.id,
            },
            {
                'email_from': 'test.duplicate@test.example.com',
                'name': 'Dupe email (first)',
                'user_id': cls.user_employee_2.id,
            },
            {
                'email_from': 'test.duplicate@test.example.com',
                'name': 'Dupe email (second)',
                'user_id': cls.user_employee_2.id,
            },
        ])
        cls.template.write({
            'auto_delete': False,
            'model_id': cls.env['ir.model']._get_id(cls.test_records._name),
        })

    def test_assert_initial_data(self):
        """ Ensure class initial data to ease understanding """
        self.assertFalse(self.template.auto_delete)

        self.assertEqual(len(self.test_records), 7)
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)
        self.assertEqual(self.test_records[1].email_from, self.test_records[4].email_from)
        self.assertEqual(self.test_records[5].email_from, self.test_records[6].email_from)

        self.assertEqual(len(self.test_partners), 4)
        self.assertTrue(self.test_partners[0].is_blacklisted)

    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_comment_blacklist(self):
        """ Tests a document-based comment with the excluded emails. It is
        currently bypassed, as we consider posting bypasses the exclusion list.
        """
        test_record = self.test_records[0].with_env(self.env)
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(test_record, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=False), self.mock_mail_app():
            composer._action_send_mail()

        # one mail to the customer, one mail to the follower
        message = test_record.message_ids[0]
        for recipient in test_record.customer_id + self.partner_employee_2:
            with self.subTest(recipient=recipient):
                self.assertMailMail(
                    recipient, 'sent',
                    mail_message=message,
<<<<<<< HEAD
                    author=self.partner_employee,  # author != email_from (template sets only email_from)
=======
                    author=self.partner_employee_2,  # author synchronized with email_from
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    email_values={
                        'email_from': self.user_employee_2.email_formatted,  # set by template
                    },
                )
        self.assertEqual(len(self._mails), 2, 'Should have sent 2 emails, skipping the exclusion list')


@tagged('mail_composer', 'multi_lang')
class TestComposerResultsMass(TestMailComposer):

    @classmethod
    def setUpClass(cls):
        super(TestComposerResultsMass, cls).setUpClass()
        # ensure employee can create partners, necessary for templates
        cls.user_employee.write({
            'groups_id': [(4, cls.env.ref('base.group_partner_manager').id)],
        })

    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mail_composer_delete(self):
        """ Check mail / msg delete support """
        # ensure initial data
        self.assertTrue(self.template.auto_delete)
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)

        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
<<<<<<< HEAD
        self.assertFalse(composer.auto_delete, 'Fixme: should take composer value')
        self.assertFalse(composer.auto_delete_message)
=======
        self.assertTrue(composer.auto_delete, 'Should take composer value')
        self.assertTrue(composer.auto_delete_keep_log)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        with self.mock_mail_gateway(mail_unlink_sent=True), self.mock_mail_app():
            composer._action_send_mail()

        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record')
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
        self.assertFalse(self._new_mails.exists(), 'Should have deleted mail.mail records')
        self.assertEqual(len(self._new_msgs), 2, 'Should have created 1 mail.mail per record')
        self.assertEqual(self._new_msgs.exists(), self._new_msgs, 'Should not have deleted mail.message records')

        # force composer auto_delete field
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        composer.auto_delete = False
        with self.mock_mail_gateway(mail_unlink_sent=True), self.mock_mail_app():
            composer._action_send_mail()

        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record')
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
<<<<<<< HEAD
        # self.assertEqual(self._new_mails.exists(), self._new_mails, 'Should not have deleted mail.mail records')
        self.assertFalse(self._new_mails.exists(), 'TODO: Template is forced over composer value, which is not correct')
=======
        self.assertEqual(self._new_mails.exists(), self._new_mails, 'Should not have deleted mail.mail records')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        self.assertEqual(len(self._new_msgs), 2, 'Should have created 1 mail.mail per record')
        self.assertEqual(self._new_msgs.exists(), self._new_msgs, 'Should not have deleted mail.message records')

        # check composer auto_delete_keep_log
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        composer.auto_delete_keep_log = False
        with self.mock_mail_gateway(mail_unlink_sent=True), self.mock_mail_app():
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record')
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
        self.assertFalse(self._new_mails.exists(), 'Should have deleted mail.mail records')
        self.assertEqual(len(self._new_msgs), 2, 'Should have created 1 mail.mail per record')
        self.assertFalse(self._new_msgs.exists(), 'Should have deleted mail.message records')

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl(self):
        self.template.auto_delete = False  # keep sent emails to check content

        # ensure initial data
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)

        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        self.assertFalse(composer.reply_to_force_new, 'Mail: thread-enabled models should use auto thread by default')
        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record')

        for record in self.test_records:
            # message copy is kept
            message = record.message_ids[0]

            # template is sent directly using customer field, meaning we have recipients
            self.assertMailMail(record.customer_id, 'sent',
                                mail_message=message,
                                author=self.partner_employee,
                                email_values={
                                    'email_from': self.partner_employee_2.email_formatted,
                                })

            # message content
            self.assertEqual(message.subject, 'TemplateSubject %s' % record.name)
            self.assertEqual(message.body, '<p>TemplateBody %s</p>' % record.name)
            self.assertEqual(message.author_id, self.user_employee.partner_id)
            # post-related fields are void
            self.assertFalse(message.subtype_id)
            self.assertFalse(message.partner_ids)

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl_complete(self):
        """ Test a composer in mass mode with a quite complete template, containing
        notably email-based recipients and attachments.

        Translations and email layout supported are also tested.
        """
        # as we use the email queue, don't have failing tests due to other outgoing emails
        self.env['mail.mail'].sudo().search([]).unlink()

        attachment_data = self._generate_attachments_data(2, self.template._name, self.template.id)
        email_to_1 = 'test.to.1@test.example.com'
        email_to_2 = 'test.to.2@test.example.com'
        email_to_3 = 'test.to.1@test.example.com'  # duplicate: should not sent twice the email
        email_cc_1 = 'test.cc.1@test.example.com'
        self.template.write({
            'auto_delete': False,  # keep sent emails to check content
            'attachment_ids': [(0, 0, a) for a in attachment_data],
            'email_to': '%s, %s, %s' % (email_to_1, email_to_2, email_to_3),
            'email_cc': email_cc_1,
            'partner_to': '%s, {{ object.customer_id.id if object.customer_id else "" }}' % self.partner_admin.id,
            'report_template_ids': [(6, 0, self.test_report.ids)],
        })
        attachs = self.env['ir.attachment'].search([('name', 'in', [a['name'] for a in attachment_data])])
        self.assertEqual(len(attachs), 2)

        # ensure initial data
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)

<<<<<<< HEAD
        for email_layout_xmlid, use_lang in product(
            (False, 'mail.test_layout'),
            (False, True),
        ):
            with self.subTest(email_layout_xmlid=email_layout_xmlid,
                              use_lang=use_lang):
                # update test configuration
=======
        for use_domain, scheduled_date, email_layout_xmlid, use_lang in product(
            (False, True),
            (False, '{{ (object.create_date or datetime.datetime(2022, 12, 26, 18, 0, 0)) + datetime.timedelta(days=2) }}'),
            (False, 'mail.test_layout'),
            (False, True),
        ):
            with self.subTest(use_domain=use_domain,
                              scheduled_date=scheduled_date,
                              email_layout_xmlid=email_layout_xmlid,
                              use_lang=use_lang):
                # update test configuration
                self.template.write({
                    'scheduled_date': scheduled_date,
                })
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                if use_lang:
                    langs = ('es_ES', 'en_US')
                    self.test_partners[0].lang = langs[0]
                    self.test_partners[1].lang = langs[1]
                else:
                    langs = (False, False)
                    self.test_partners.lang = False
<<<<<<< HEAD

                ctx = {
                    'active_ids': self.test_records.ids,
                    'default_model': self.test_records._name,
                    'default_composition_mode': 'mass_mail',
                    'default_template_id': self.template.id,
                }
                if email_layout_xmlid:
                    ctx['default_email_layout_xmlid'] = email_layout_xmlid

                # launch composer in mass mode
                composer_form = Form(self.env['mail.compose.message'].with_context(ctx))
                composer = composer_form.save()

                # ensure some parameters used afterwards
                author = self.env.user.partner_id
                self.assertEqual(composer.author_id, author,
                                 'Author cannot be synchronized with a raw email_from')
                self.assertEqual(composer.email_from, self.template.email_from)

                with self.mock_mail_gateway(mail_unlink_sent=False):
                    composer._action_send_mail()

                    new_partners = self.env['res.partner'].search([
                        ('email', 'in', [email_to_1, email_to_2, email_to_3, email_cc_1])
                    ])
                    self.assertEqual(len(new_partners), 3)

                    # global outgoing: emails sent
                    self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
                    self.assertEqual(len(self._mails), 10, 'Should have sent emails')
                    self.assertEqual(self._new_mails.mapped('scheduled_date'),
                                     [False] * 2)
                self.assertEqual(len(self._mails), 10, 'Should have sent 5 emails per record')

                for record, exp_lang in zip(self.test_records, langs):
                    # message copy is kept
                    message = record.message_ids[0]

                    # translation are currently not supported at all as they
                    # are fetched composer side, which is most probably not
                    # translated (only template is)
                    if False and exp_lang == 'es_ES':
                        exp_body = f'SpanishBody for {record.name}'
                        exp_subject = f'SpanishSubject for {record.name}'
                    else:
                        exp_body = f'TemplateBody {record.name}'
                        exp_subject = f'TemplateSubject {record.name}'

                    # template is sent only to partners (email_to are transformed)
                    self.assertMailMail(record.customer_id + new_partners + self.partner_admin,
                                        'sent',
                                        mail_message=message,
                                        author=author,
                                        email_values={
                                            'attachments_info': [
                                                {'name': 'AttFileName_00.txt', 'raw': b'AttContent_00', 'type': 'text/plain'},
                                                {'name': 'AttFileName_01.txt', 'raw': b'AttContent_01', 'type': 'text/plain'},
                                                {'name': 'TestReport for %s.html' % record.name, 'type': 'text/plain'},
                                            ],
                                            'body_content': exp_body,
                                            'email_from': self.partner_employee_2.email_formatted,
                                            'subject': exp_subject,
                                        },
                                        fields_values={
                                            'email_from': self.partner_employee_2.email_formatted,
                                            'mail_server_id': self.mail_server_domain,
                                            'reply_to': formataddr((
                                                f'{self.env.user.company_id.name} {record.name}',
                                                f'{self.alias_catchall}@{self.alias_domain}'
                                            )),
                                            'subject': exp_subject,
                                        },
                                       )

                    # Low-level checks on outgoing email for the recipient to
                    # check layouting and language. Note that standard layout
                    # is not tested against translations, only the custom one
                    # to ease translations checks.
                    email = self._find_sent_email(self.partner_employee_2.email_formatted, [record.customer_id.email_formatted])
                    self.assertTrue(bool(email), 'Email not found, check recipients')

                    # Currently layouting in mailing mode is not supported.
                    # Hence no translations.
                    self.assertEqual(
                        email['body'],
                        f'<p>TemplateBody {record.name}</p>'
                    )

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl_recipients(self):
        """ Test various combinations of recipients: active_domain, active_id,
        active_ids, ... to ensure fallback behavior are working. """
        # 1: active_domain
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id,
                                  active_ids=[],
                                  default_use_active_domain=True,
                                  default_active_domain=[('id', 'in', self.test_records.ids)])
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record')

        for record in self.test_records:
            # template is sent directly using customer field, even if author is partner_employee
            self.assertSentEmail(self.partner_employee_2.email_formatted,
                                 record.customer_id)

        # 2: active_domain not taken into account if use_active_domain is False
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id,
                                  default_use_active_domain=False,
                                  default_active_domain=[('id', 'in', -1)])
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record')

        # 3: fallback on active_id if not active_ids
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id,
                                  active_ids=[])
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=False):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 1, 'Should have created 1 mail.mail per record')
        self.assertEqual(len(self._mails), 1, 'Should have sent 1 email per record')

        # 3: void is void: raise in comment mode, just don't send anything in mass mail mode
        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_model='mail.test.ticket',
            default_template_id=self.template.id
        ))
        composer = composer_form.save()
        self.assertEqual(composer.composition_mode, 'comment')
        with self.mock_mail_gateway(mail_unlink_sent=False), self.assertRaises(ValueError):
            composer._action_send_mail()
        self.assertNotSentEmail()

        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='mass_mail',
            default_model='mail.test.ticket',
            default_template_id=self.template.id
        ))
        composer = composer_form.save()
        self.assertEqual(composer.composition_mode, 'mass_mail')
        with self.mock_mail_gateway(mail_unlink_sent=False):
            composer._action_send_mail()
        self.assertNotSentEmail()

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl_reply_to(self):
        # test without catchall filling reply-to
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=False):
            # remove alias so that _notify_get_reply_to will return the default value instead of alias
            self.env['ir.config_parameter'].sudo().set_param("mail.catchall.domain", None)
            composer.action_send_mail()

        for record in self.test_records:
            # template is sent only to partners (email_to are transformed)
            self.assertMailMail(record.customer_id,
                                'sent',
                                mail_message=record.message_ids[0],
                                author=self.partner_employee,
                                email_values={
                                    'email_from': self.partner_employee_2.email_formatted,
                                    'reply_to': self.partner_employee_2.email_formatted,
                                },
                                fields_values={
                                    'email_from': self.partner_employee_2.email_formatted,
                                    'reply_to': self.partner_employee_2.email_formatted,
                                },
                               )

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
=======

                ctx = {
                    'default_model': self.test_records._name,
                    'default_composition_mode': 'mass_mail',
                    'default_template_id': self.template.id,
                }
                if use_domain:
                    ctx['default_res_domain'] = [('id', 'in', self.test_records.ids)]
                else:
                    ctx['default_res_ids'] = self.test_records.ids
                if email_layout_xmlid:
                    ctx['default_email_layout_xmlid'] = email_layout_xmlid

                # launch composer in mass mode
                composer_form = Form(self.env['mail.compose.message'].with_context(ctx))
                composer = composer_form.save()

                # ensure some parameters used afterwards
                author = self.env.user.partner_id
                self.assertEqual(composer.author_id, author,
                                 'Author is not synchronized, as template email_from does not match existing partner')
                self.assertEqual(composer.email_from, self.template.email_from)

                with self.mock_mail_gateway(mail_unlink_sent=False), \
                     freeze_time(self.reference_now):
                    composer._action_send_mail()

                    # partners created from raw emails
                    new_partners = self.env['res.partner'].search([
                        ('email', 'in', [email_to_1, email_to_2, email_to_3, email_cc_1])
                    ])
                    self.assertEqual(len(new_partners), 3)
                    self.assertEqual(new_partners.mapped('lang'), ['en_US'] * 3,
                                     'New partners lang is always the default DB one, whatever the context')

                    # check global outgoing
                    self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record')
                    if not scheduled_date:
                        # emails sent directly
                        self.assertEqual(len(self._mails), 10, 'Should have sent emails')
                        self.assertEqual(self._new_mails.mapped('scheduled_date'),
                                         [False] * 2)
                    else:
                        # emails not sent due to scheduled_date
                        self.assertEqual(len(self._mails), 0, 'Should not send emails, scheduled in the future')
                        self.assertEqual(self._new_mails.mapped('scheduled_date'),
                                         [self.reference_now + timedelta(days=2)] * 2)

                        # simulate cron queue at right time for sending
                        with freeze_time(self.reference_now + timedelta(days=2)):
                            self.env['mail.mail'].sudo().process_email_queue()

                        # everything should be sent now
                        self.assertEqual(len(self._mails), 10, 'Should have sent 5 emails per record')

                # check email content
                for record, exp_lang in zip(self.test_records, langs):
                    # message copy is kept
                    message = record.message_ids[0]

                    if exp_lang == 'es_ES':
                        exp_body = f'SpanishBody for {record.name}'
                        exp_subject = f'SpanishSubject for {record.name}'
                    else:
                        exp_body = f'TemplateBody {record.name}'
                        exp_subject = f'TemplateSubject {record.name}'

                    # template is sent only to partners (email_to are transformed)
                    self.assertMailMail(record.customer_id + new_partners + self.partner_admin,
                                        'sent',
                                        mail_message=message,
                                        author=author,
                                        email_values={
                                            'attachments_info': [
                                                {'name': 'AttFileName_00.txt', 'raw': b'AttContent_00', 'type': 'text/plain'},
                                                {'name': 'AttFileName_01.txt', 'raw': b'AttContent_01', 'type': 'text/plain'},
                                                {'name': 'TestReport for %s.html' % record.name, 'type': 'text/plain'},
                                            ],
                                            'body_content': exp_body,
                                            'email_from': self.partner_employee_2.email_formatted,
                                            'subject': exp_subject,
                                        },
                                        fields_values={
                                            'email_from': self.partner_employee_2.email_formatted,
                                            'mail_server_id': self.mail_server_domain,
                                            'reply_to': formataddr((
                                                f'{self.env.user.company_id.name} {record.name}',
                                                f'{self.alias_catchall}@{self.alias_domain}'
                                            )),
                                            'subject': exp_subject,
                                        },
                                       )

                    # Low-level checks on outgoing email for the recipient to
                    # check layouting and language. Note that standard layout
                    # is not tested against translations, only the custom one
                    # to ease translations checks.
                    email = self._find_sent_email(self.partner_employee_2.email_formatted, [record.customer_id.email_formatted])
                    self.assertTrue(bool(email), 'Email not found, check recipients')

                    if not email_layout_xmlid:
                        self.assertEqual(
                            email['body'],
                            f'<p>{exp_body}</p>'
                        )
                    else:
                        exp_layout_content_en = 'English Layout for Ticket-like model'
                        exp_layout_content_es = 'Spanish Layout para Spanish Model Description'
                        exp_button_en = 'View Ticket-like model'
                        exp_button_es = 'Spanish Layout para Spanish Model Description'
                        if exp_lang == 'es_ES':
                            self.assertIn(exp_layout_content_es, email['body'])
                            self.assertIn(exp_button_es, email['body'])
                        else:
                            self.assertIn(exp_layout_content_en, email['body'])
                            # self.assertIn(exp_button_es, email['body'])
                            self.assertIn(exp_button_en, email['body'])

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl_recipients(self):
        """ Test various combinations of recipients: res_domain, active_id,
        active_ids, ... to ensure fallback behavior are working. """
        # 1: active ids
        composer_form = Form(self.env['mail.compose.message'].with_context(
            active_ids=self.test_records.ids,
            default_composition_mode='mass_mail',
            default_model=self.test_records._name,
            default_template_id=self.template.id,
        ))
        composer = composer_form.save()
        self.assertEqual(sorted(literal_eval(composer.res_ids)), sorted(self.test_records.ids))

        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # should create emails in a single batch
        self.assertEqual(self.build_email_mocked.call_count, 2, 'One build email per outgoing email')
        self.assertEqual(self.mail_mail_create_mocked.call_count, 2, 'Emails are anyway created in a singleton loop')
        # global outgoing
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record based on active_ids')
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record based on  on active_ids')

        for record in self.test_records:
            # template is sent directly using customer field, even if author is partner_employee
            self.assertSentEmail(self.partner_employee_2.email_formatted,
                                 record.customer_id)

        # 2: default_res_ids + active_ids -> res_ids takes lead
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_record, add_web=False,
                                  default_composition_mode='mass_mail',
                                  default_res_ids=self.test_record.ids,
                                  default_template_id=self.template.id,
                                  active_ids=self.test_records.ids,
                                 )
        ))
        composer = composer_form.save()
        self.assertEqual(literal_eval(composer.res_ids), self.test_record.ids)

        with self.mock_mail_gateway(mail_unlink_sent=True):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 1, 'Should have taken default_res_ids (1 record)')
        self.assertEqual(len(self._mails), 1, 'Should have taken default_res_ids (1 record)')

        # template is sent directly using customer field, even if author is partner_employee
        self.assertSentEmail(self.partner_employee_2.email_formatted,
                             self.test_record.customer_id)

        # 3: fallback on active_id if not active_ids
        composer_form = Form(self.env['mail.compose.message'].with_context(
            active_id=self.test_record.id,
            default_composition_mode='mass_mail',
            default_model=self.test_records._name,
            default_template_id=self.template.id,
        ))
        composer = composer_form.save()
        self.assertEqual(literal_eval(composer.res_ids), self.test_record.ids)

        with self.mock_mail_gateway(mail_unlink_sent=False):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 1, 'Should have created 1 mail.mail per record')
        self.assertEqual(len(self._mails), 1, 'Should have sent 1 email per record')

        # 4: _batch_size limit for active_ids
        with patch.object(MailComposer, '_batch_size', new=1):
            composer_form = Form(self.env['mail.compose.message'].with_context(
                active_ids=self.test_records.ids,
                default_composition_mode='mass_mail',
                default_model=self.test_records._name,
                default_template_id=self.template.id,
            ))
            composer = composer_form.save()
            self.assertTrue(composer.composition_batch)
            self.assertEqual(composer.composition_mode, 'mass_mail')
            self.assertFalse(composer.res_ids)

            with self.mock_mail_gateway(mail_unlink_sent=True):
                composer._action_send_mail()

        # should create emails in 2 batches of 1
        self.assertEqual(self.build_email_mocked.call_count, 2)
        self.assertEqual(self.mail_mail_create_mocked.call_count, 2)
        # global outgoing
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record based on active_ids')
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record based on  on active_ids')

        # 5: mail.batch_size config parameter support, for sending only
        self.env['ir.config_parameter'].sudo().set_param('mail.batch_size', 1)
        with patch.object(MailComposer, '_batch_size', new=50):
            composer_form = Form(self.env['mail.compose.message'].with_context(
                active_ids=self.test_records.ids,
                default_composition_mode='mass_mail',
                default_model=self.test_records._name,
                default_template_id=self.template.id,
            ))
            composer = composer_form.save()
            self.assertTrue(composer.composition_batch)
            self.assertEqual(composer.composition_mode, 'mass_mail')
            self.assertEqual(sorted(literal_eval(composer.res_ids)), sorted(self.test_records.ids))

            with self.mock_mail_gateway(mail_unlink_sent=True):
                composer._action_send_mail()

        # should create emails in 2 batches of 1
        self.assertEqual(self.build_email_mocked.call_count, 2)
        self.assertEqual(self.mail_mail_create_mocked.call_count, 2)
        # global outgoing
        self.assertEqual(len(self._new_mails), 2, 'Should have created 1 mail.mail per record based on active_ids')
        self.assertEqual(len(self._mails), 2, 'Should have sent 1 email per record based on  on active_ids')

        # 6: void is void: raise in comment mode, just don't send anything in mass mail mode
        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_model='mail.test.ticket',
            default_template_id=self.template.id
        ))
        composer = composer_form.save()
        self.assertEqual(composer.composition_mode, 'comment')
        with self.mock_mail_gateway(mail_unlink_sent=False), self.assertRaises(ValueError):
            composer._action_send_mail()
        self.assertNotSentEmail()

        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='mass_mail',
            default_model='mail.test.ticket',
            default_template_id=self.template.id
        ))
        composer = composer_form.save()
        self.assertEqual(composer.composition_mode, 'mass_mail')
        with self.mock_mail_gateway(mail_unlink_sent=False):
            composer._action_send_mail()
        self.assertNotSentEmail()

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl_recipients_res_domain(self):
        """ Test specific use case of res_domain usage, in combination with
        res_domain_user_id allowing to set the evaluation environment for
        the domain. """
        def _search_as_employee_2(recordset, *args, **kwargs):
            """ Mock to return only one record, simulating a specific ir.rule """
            if recordset.env.uid == self.user_employee_2.id:
                return self.test_records[0]
            return DEFAULT

        composer_form = Form(self.env['mail.compose.message'].with_context(
            default_composition_mode='mass_mail',
            default_model=self.test_records._name,
            default_res_domain=[('id', 'in', self.test_records.ids)],
            default_res_domain_user_id=self.user_employee_2.id,
            default_template_id=self.template.id,
        ))
        composer = composer_form.save()
        self.assertEqual(literal_eval(composer.res_domain), [('id', 'in', self.test_records.ids)])
        self.assertEqual(composer.res_domain_user_id, self.user_employee_2)

        with self.mock_mail_gateway(mail_unlink_sent=True), \
            patch.object(MailTestTicket, 'search', autospec=True, side_effect=_search_as_employee_2):
            composer._action_send_mail()

        # global outgoing
        self.assertEqual(len(self._new_mails), 1, 'Should have created 1 mail.mail, search done by employee 2')
        self.assertEqual(len(self._mails), 1, 'Should have sent 1 email, search done by employee 2')

        # template is sent directly using customer field, whatever the author
        self.assertSentEmail(self.partner_employee_2.email_formatted,
                             self.test_records[0].customer_id)

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
    def test_mail_composer_wtpl_reply_to(self):
        # test without catchall filling reply-to
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=False):
            # remove alias so that _notify_get_reply_to will return the default value instead of alias
            self.env['ir.config_parameter'].sudo().set_param("mail.catchall.domain", None)
            composer.action_send_mail()

        for record in self.test_records:
            # template is sent only to partners (email_to are transformed)
            self.assertMailMail(record.customer_id,
                                'sent',
                                mail_message=record.message_ids[0],
                                author=self.partner_employee,
                                email_values={
                                    'email_from': self.partner_employee_2.email_formatted,
                                    'reply_to': self.partner_employee_2.email_formatted,
                                },
                                fields_values={
                                    'email_from': self.partner_employee_2.email_formatted,
                                    'reply_to': self.partner_employee_2.email_formatted,
                                },
                               )

    @users('employee')
    @mute_logger('odoo.models.unlink', 'odoo.addons.mail.models.mail_mail')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    def test_mail_composer_wtpl_reply_to_force_new(self):
        """ Test no auto thread behavior, notably with reply-to. """
        # launch composer in mass mode
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(self.test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer_form.reply_to_mode = 'new'
        composer_form.reply_to = "{{ '\"' + object.name + '\" <%s>' % 'dynamic.reply.to@test.com' }}"
        composer = composer_form.save()
        self.assertTrue(composer.reply_to_force_new)
        with self.mock_mail_gateway(mail_unlink_sent=False):
            composer.action_send_mail()

        for record in self.test_records:
            self.assertMailMail(record.customer_id,
                                'sent',
                                mail_message=record.message_ids[0],
                                author=self.partner_employee,
                                email_values={
                                    'body_content': 'TemplateBody %s' % record.name,
                                    'email_from': self.partner_employee_2.email_formatted,
                                    'reply_to': formataddr((
                                        f'{record.name}',
                                        'dynamic.reply.to@test.com'
                                    )),
                                    'subject': 'TemplateSubject %s' % record.name,
                                },
                                fields_values={
                                    'email_from': self.partner_employee_2.email_formatted,
                                    'reply_to': formataddr((
                                        f'{record.name}',
                                        'dynamic.reply.to@test.com'
                                    )),
                                },
                               )

@tagged('mail_composer', 'mail_blacklist')
class TestComposerResultsMassStatus(TestMailComposer):
    """ Test cases involving blacklist, opt-out, state management, ... specific
    class to avoid bloating the base mailing-based composer tests. """

    @classmethod
    def setUpClass(cls):
        """ Test data: 4 records with a customer set, then some additional
        records based on emails, duplicates, ...

        Record0: partner is blacklisted
        Record1: Record4 has the same email (but no customer set)
        Record5 and Record6 have same email (notlinked to any customer)
        """
        super(TestComposerResultsMassStatus, cls).setUpClass()

        # ensure employee can create partners, necessary for templates
        cls.user_employee.write({
            'groups_id': [(4, cls.env.ref('base.group_partner_manager').id)],
        })

        # add 2 new records with customers
        cls.test_records, cls.test_partners = cls._create_records_for_batch(
            'mail.test.ticket.el', 4,
            additional_values={'user_id': cls.user_employee_2.id},
            prefix='el_'
        )
        # create bl / optout / duplicates, see docstring
        cls.env['mail.blacklist']._add(
            cls.test_partners[0].email_formatted
        )
        cls.test_records += cls.env[cls.test_records._name].create([
            {
                'email_from': cls.test_records[1].email_from,
                'name': 'Email of Record2',
                'user_id': cls.user_employee_2.id,
            },
            {
                'email_from': 'test.duplicate@test.example.com',
                'name': 'Dupe email (first)',
                'user_id': cls.user_employee_2.id,
            },
            {
                'email_from': 'test.duplicate@test.example.com',
                'name': 'Dupe email (second)',
                'user_id': cls.user_employee_2.id,
            },
        ])
        cls.template.write({
            'model_id': cls.env['ir.model']._get_id(cls.test_records._name),
        })

    def test_assert_initial_data(self):
        """ Ensure class initial data to ease understanding """
        self.assertTrue(self.template.auto_delete)

        self.assertEqual(len(self.test_records), 7)
        self.assertEqual(self.test_records.user_id, self.user_employee_2)
        self.assertEqual(self.test_records.message_partner_ids, self.partner_employee_2)
        self.assertEqual(self.test_records[1].email_from, self.test_records[4].email_from)
        self.assertEqual(self.test_records[5].email_from, self.test_records[6].email_from)

        self.assertEqual(len(self.test_partners), 4)
        self.assertTrue(self.test_partners[0].is_blacklisted)

    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mailing_blacklist_mixin(self):
        """ Tests a document-based mass mailing with excluded emails. Their emails
        are canceled if the model inherits from the blacklist mixin. """
        test_records = self.test_records[:2].with_env(self.env)
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=False), self.mock_mail_app():
            composer._action_send_mail()

        for record, expected_state, expected_ft in zip(
            test_records,
            ['cancel', 'sent'],
            ['mail_bl', False]
        ):
            with self.subTest(record=record, expected_state=expected_state, expected_ft=expected_ft):
                self.assertMailMail(
                    record.customer_id, expected_state,
                    # author is current user, email_from is coming from template (user_id of record)
                    author=self.user_employee.partner_id,
                    fields_values={
                        'email_from': self.user_employee_2.email_formatted,
                        'failure_reason': False,
                        'failure_type': expected_ft,
                    },
                    email_values={
                        'email_from': self.user_employee_2.email_formatted,
                    }
                )
        self.assertEqual(len(self._mails), 1, 'Should have sent 1 email, and skipped an excluded email.')

<<<<<<< HEAD
=======
        # test exclusion list bypass
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(test_records, add_web=True,
                                  default_template_id=self.template.id,
                                  default_use_exclusion_list=False)
        ))
        composer = composer_form.save()
        with self.mock_mail_gateway(mail_unlink_sent=False), self.mock_mail_app():
            composer._action_send_mail()

        for record, expected_state, expected_ft in zip(
            test_records,
            ['sent', 'sent'],
            [False, False]
        ):
            with self.subTest(record=record, expected_state=expected_state, expected_ft=expected_ft):
                self.assertMailMail(
                    record.customer_id, expected_state,
                    # author is current user, email_from is coming from template (user_id of record)
                    author=self.user_employee.partner_id,
                    fields_values={
                        'email_from': self.user_employee_2.email_formatted,
                        'failure_reason': False,
                        'failure_type': expected_ft,
                    },
                    email_values={
                        'email_from': self.user_employee_2.email_formatted,
                    }
                )
        self.assertEqual(len(self._mails), 2, 'Should have sent 2 emails, even to excluded email.')

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    @users('employee')
    @mute_logger('odoo.tests', 'odoo.addons.mail.models.mail_mail', 'odoo.models.unlink')
    def test_mailing_duplicates_document_based(self):
        """ Tests a document-based mass mailing with the same address mails
        This should be allowed and not considered as duplicate in this context
        """
        test_records = self.test_records.with_env(self.env)
        composer_form = Form(self.env['mail.compose.message'].with_context(
            self._get_web_context(test_records, add_web=True,
                                  default_template_id=self.template.id)
        ))
        composer = composer_form.save()

        # by default duplicates are canceled
        with self.mock_mail_gateway(mail_unlink_sent=False), self.mock_mail_app():
            composer._action_send_mail()

        for record, expected_state, expected_ft in zip(
            test_records,
            ['cancel', 'sent', 'sent', 'sent', 'cancel', 'sent', 'cancel'],
            ['mail_bl', False, False, False, 'mail_dup', False, 'mail_dup']
        ):
            with self.subTest(record=record, expected_state=expected_state, expected_ft=expected_ft):
                self.assertMailMailWRecord(
                    record, record.customer_id, expected_state,
                    # author is current user, email_from is coming from template (user_id of record)
                    author=self.user_employee.partner_id,
                    fields_values={
                        'email_from': self.user_employee_2.email_formatted,
                        'failure_reason': False,
                        'failure_type': expected_ft,
                    },
                    email_values={
                        'email_from': self.user_employee_2.email_formatted,
                    }
                )
        self.assertEqual(len(self._mails), 4, 'Should have sent 4 emails, and skipped an excluded and 2 duplicate emails.')

        # magic context key allowing to send duplicates when necessary
        with self.mock_mail_gateway(mail_unlink_sent=False), self.mock_mail_app():
            composer.with_context(mailing_document_based=True)._action_send_mail()

        for record, expected_state, expected_ft in zip(
            test_records,
            ['cancel', 'sent', 'sent', 'sent', 'sent', 'sent', 'sent'],
            ['mail_bl', False, False, False, False, False, False]
        ):
            with self.subTest(record=record, expected_state=expected_state, expected_ft=expected_ft):
                self.assertMailMailWRecord(
                    record, record.customer_id, expected_state,
                    # author is current user, email_from is coming from template (user_id of record)
                    author=self.user_employee.partner_id,
                    fields_values={
                        'email_from': self.user_employee_2.email_formatted,
                        'failure_reason': False,
                        'failure_type': expected_ft,
                    },
                    email_values={
                        'email_from': self.user_employee_2.email_formatted,
                    }
                )
        self.assertEqual(len(self._mails), 6, 'Should have sent 6 emails, and skipped an excluded email')
