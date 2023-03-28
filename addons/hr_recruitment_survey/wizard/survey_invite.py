# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
from odoo.tools.misc import clean_context


class SurveyInvite(models.TransientModel):
    _inherit = "survey.invite"

    applicant_id = fields.Many2one('hr.applicant', string='Applicant')

    def _get_done_partners_emails(self, existing_answers):
        partners_done, emails_done, answers = super()._get_done_partners_emails(existing_answers)
        if self.applicant_id.response_ids.filtered(lambda res: res.survey_id.id == self.survey_id.id):
            if existing_answers and self.existing_mode == 'resend':
                partners_done |= self.applicant_id.partner_id
        return partners_done, emails_done, answers

    def _send_mail(self, answer):
        mail = super()._send_mail(answer)
        if answer.applicant_id:
            answer.applicant_id.message_post(body=mail.body_html)
        return mail

    def action_invite(self):
        self.ensure_one()
        if self.applicant_id:
            survey = self.survey_id.with_context(clean_context(self.env.context))

            if not self.applicant_id.response_ids.filtered(lambda res: res.survey_id.id == self.survey_id.id):
                self.applicant_id.write({
                    'response_ids': (self.applicant_id.response_ids | survey._create_answer(partner=self.applicant_id.partner_id,
                        **self._get_answers_values())).ids
                })

            partner = self.applicant_id.partner_id
            survey_link = survey._get_html_link(title=survey.title)
            partner_link = partner._get_html_link()
            content = _('The survey %(survey_link)s has been sent to %(partner_link)s', survey_link=survey_link, partner_link=partner_link)
            body = '<p>%s</p>' % content
            self.applicant_id.message_post(body=body)
        return super().action_invite()
<<<<<<< HEAD:addons/hr_recruitment_survey/models/survey_invite.py


class SurveyUserInput(models.Model):
    _inherit = "survey.user_input"

    applicant_id = fields.One2many('hr.applicant', 'response_id', string='Applicant')

    def _mark_done(self):
        odoobot = self.env.ref('base.partner_root')
        for user_input in self:
            if user_input.applicant_id:
                body = _('The applicant "%s" has finished the survey.', user_input.applicant_id.partner_name)
                user_input.applicant_id.message_post(body=body, author_id=odoobot.id)
        return super()._mark_done()

    @api.model_create_multi
    def create(self, values_list):
        if 'default_applicant_id' in self.env.context:
            self = self.with_context(default_applicant_id=False)
        return super().create(values_list)
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6:addons/hr_recruitment_survey/wizard/survey_invite.py
