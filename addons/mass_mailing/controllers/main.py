# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import base64
import werkzeug

from odoo import _, exceptions, http, tools
from odoo.http import request, Response
from odoo.tools import consteq
<<<<<<< HEAD
=======

from markupsafe import Markup, escape
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
from werkzeug.exceptions import BadRequest, NotFound


class MassMailController(http.Controller):

    def _check_mailing_email_token(self, mailing_id, res_id, email, token):
        if not (mailing_id and res_id and email and token):
            return False
        mailing = request.env['mailing.mailing'].sudo().browse(mailing_id)
        return consteq(mailing._generate_mailing_recipient_token(res_id, email), token)

    # ------------------------------------------------------------
    # SUBSCRIPTION MANAGEMENT
    # ------------------------------------------------------------

    @http.route(['/mailing/<int:mailing_id>/unsubscribe'], type='http', website=True, auth='public')
    def mailing_unsubscribe(self, mailing_id, email=None, res_id=None, token="", **post):
        mailing = request.env['mailing.mailing'].sudo().browse(mailing_id)
        if mailing.exists():
            res_id = res_id and int(res_id)
            if not self._check_mailing_email_token(mailing_id, res_id, email, str(token)):
                raise exceptions.AccessDenied()

            if mailing.mailing_model_real == 'mailing.contact':
                # Unsubscribe directly + Let the user choose their subscriptions
                mailing.update_opt_out(email, mailing.contact_list_ids.ids, True)

                contacts = request.env['mailing.contact'].sudo().search([('email_normalized', '=', tools.email_normalize(email))])
                subscription_list_ids = contacts.mapped('subscription_list_ids')
                # In many user are found : if user is opt_out on the list with contact_id 1 but not with contact_id 2,
                # assume that the user is not opt_out on both
                # TODO DBE Fixme : Optimise the following to get real opt_out and opt_in
                opt_out_list_ids = subscription_list_ids.filtered(lambda rel: rel.opt_out).mapped('list_id')
                opt_in_list_ids = subscription_list_ids.filtered(lambda rel: not rel.opt_out).mapped('list_id')
                opt_out_list_ids = set([list.id for list in opt_out_list_ids if list not in opt_in_list_ids])

                unique_list_ids = set([list.list_id.id for list in subscription_list_ids])
                list_ids = request.env['mailing.list'].sudo().browse(unique_list_ids)
                unsubscribed_list = ', '.join(str(list.name) for list in mailing.contact_list_ids if list.is_public)
                return request.render('mass_mailing.page_mailing_unsubscribe', {
                    'contacts': contacts,
                    'list_ids': list_ids,
                    'opt_out_list_ids': opt_out_list_ids,
                    'unsubscribed_list': unsubscribed_list,
                    'email': email,
                    'mailing_id': mailing_id,
                    'res_id': res_id,
                    'show_blacklist_button': request.env['ir.config_parameter'].sudo().get_param('mass_mailing.show_blacklist_buttons'),
                })
            else:
                opt_in_lists = request.env['mailing.contact.subscription'].sudo().search([
                    ('contact_id.email_normalized', '=', email),
                    ('opt_out', '=', False)
                ]).mapped('list_id')

                message = Markup('<p>%s</p>') % Markup(
                    _(
                        'Blocklist request from unsubscribe link of mailing %(mailing_link)s (document %(record_link)s)',
                        **self._format_bl_request(mailing, res_id)
                    )
                )
                _blacklist_rec = request.env['mail.blacklist'].sudo()._add(email, message=message)

                return request.render('mass_mailing.page_mailing_unsubscribe_done', {
                    'email': email,
                    'mailing_id': mailing_id,
                    'res_id': res_id,
                    'list_ids': opt_in_lists,
                    'show_blacklist_button': request.env['ir.config_parameter'].sudo().get_param(
                        'mass_mailing.show_blacklist_buttons'),
                })
        return request.redirect('/web')

    @http.route('/mailing/list/update', type='json', auth='public')
    def mailing_update_list_subscription(self, mailing_id, opt_in_ids, opt_out_ids, email, res_id, token):
        mailing = request.env['mailing.mailing'].sudo().browse(mailing_id)
        if mailing.exists():
            if not self._check_mailing_email_token(mailing_id, res_id, email, token):
                return 'unauthorized'
            mailing.update_opt_out(email, opt_in_ids, False)
            mailing.update_opt_out(email, opt_out_ids, True)
            return True
        return 'error'

    @http.route('/mailing/feedback', type='json', auth='public')
    def mailing_send_feedback(self, mailing_id, res_id, email, feedback, token):
        mailing = request.env['mailing.mailing'].sudo().browse(mailing_id)
        if mailing.exists() and email:
            if not self._check_mailing_email_token(mailing_id, res_id, email, token):
                return 'unauthorized'
            model = request.env[mailing.mailing_model_real]
            records = model.sudo().search([('email_normalized', '=', tools.email_normalize(email))])
            for record in records:
                record.sudo().message_post(body=_("Feedback from %(email)s: %(feedback)s", email=email, feedback=feedback))
            return bool(records)
        return 'error'

    @http.route(['/unsubscribe_from_list'], type='http', website=True, multilang=False, auth='public', sitemap=False)
    def mailing_unsubscribe_placeholder_link(self, **post):
        """Dummy route so placeholder is not prefixed by language, MUST have multilang=False"""
        raise werkzeug.exceptions.NotFound()

    # ------------------------------------------------------------
    # TRACKING
    # ------------------------------------------------------------

    @http.route('/mail/track/<int:mail_id>/<string:token>/blank.gif', type='http', auth='public')
    def track_mail_open(self, mail_id, token, **post):
        """ Email tracking. """
        expected_token = request.env['mail.mail']._generate_mail_recipient_token(mail_id)
        if not consteq(token, expected_token):
            raise BadRequest()

        request.env['mailing.trace'].sudo().set_opened(domain=[('mail_mail_id_int', 'in', [mail_id])])
        response = Response()
        response.mimetype = 'image/gif'
        response.data = base64.b64decode(b'R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')

        return response

    @http.route('/r/<string:code>/m/<int:mailing_trace_id>', type='http', auth="public")
    def full_url_redirect(self, code, mailing_trace_id, **post):
        request.env['link.tracker.click'].sudo().add_click(
            code,
            ip=request.httprequest.remote_addr,
            country_code=request.geoip.country_code,
            mailing_trace_id=mailing_trace_id
        )
        return request.redirect(request.env['link.tracker'].get_url_from_code(code), code=301, local=False)

    # ------------------------------------------------------------
    # MAILING MANAGEMENT
    # ------------------------------------------------------------

    @http.route('/mailing/report/unsubscribe', type='http', website=True, auth='public')
    def mailing_report_deactivate(self, token, user_id):
        if not token or not user_id:
            raise werkzeug.exceptions.NotFound()
        user_id = int(user_id)
        correct_token = consteq(token, request.env['mailing.mailing']._generate_mailing_report_token(user_id))
        user = request.env['res.users'].sudo().browse(user_id)
        if correct_token and user.has_group('mass_mailing.group_mass_mailing_user'):
            request.env['ir.config_parameter'].sudo().set_param('mass_mailing.mass_mailing_reports', False)
            if user.has_group('base.group_system'):
                menu_id = request.env.ref('mass_mailing.menu_mass_mailing_global_settings').id
                return request.render('mass_mailing.mailing_report_deactivated', {'menu_id': menu_id})
            return request.render('mass_mailing.mailing_report_deactivated')
        raise werkzeug.exceptions.NotFound()

    @http.route(['/mailing/<int:mailing_id>/view'], type='http', website=True, auth='public')
    def mailing_view_in_browser(self, mailing_id, email=None, res_id=None, token=""):
        mailing = request.env['mailing.mailing'].sudo().browse(mailing_id)
        if mailing.exists():
            res_id = int(res_id) if res_id else False
            if not self._check_mailing_email_token(mailing_id, res_id, email, str(token)) and not request.env.user.has_group('mass_mailing.group_mass_mailing_user'):
                raise exceptions.AccessDenied()

<<<<<<< HEAD
            html_markupsafe = mailing._render_field('body_html', [res_id])[res_id]
=======
            # do not force lang, will simply use user context
            html_markupsafe = mailing._render_field(
                'body_html',
                [res_id],
                compute_lang=False,
                options={'post_process': False}
            )[res_id]
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            # Update generic URLs (without parameters) to final ones
            html_markupsafe = html_markupsafe.replace('/unsubscribe_from_list',
                                                      mailing._get_unsubscribe_url(email, res_id))

<<<<<<< HEAD
            return request.render('mass_mailing.view', {
=======
            return request.render('mass_mailing.mailing_view', {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                    'body': html_markupsafe,
                })

        return request.redirect('/web')

    # ------------------------------------------------------------
    # BLACKLIST
    # ------------------------------------------------------------

    @http.route('/mailing/blacklist/check', type='json', auth='public')
    def mail_blacklist_check(self, mailing_id, res_id, email, token):
        if not self._check_mailing_email_token(mailing_id, res_id, email, token):
            return 'unauthorized'
        if email:
            record = request.env['mail.blacklist'].sudo().with_context(active_test=False).search([('email', '=', tools.email_normalize(email))])
            if record['active']:
                return True
            return False
        return 'error'

    @http.route('/mailing/blacklist/add', type='json', auth='public')
    def mail_blacklist_add(self, mailing_id, res_id, email, token):
        if not self._check_mailing_email_token(mailing_id, res_id, email, token):
            return 'unauthorized'
        if email:
            if mailing_id and res_id:
                mailing_sudo = request.env['mailing.mailing'].sudo().browse(mailing_id)
                message = Markup('<p>%s</p>') % Markup(
                    _(
                        'Blocklist request from portal of mailing %(mailing_link)s (document %(record_link)s)',
                        **self._format_bl_request(mailing_sudo, res_id)
                    )
                )
            else:
                message = Markup('<p>%s</p>') % _('Blocklist request from portal')

            _blacklist_rec = request.env['mail.blacklist'].sudo()._add(email, message=message)
            return True
        return 'error'

    @http.route('/mailing/blacklist/remove', type='json', auth='public')
    def mail_blacklist_remove(self, mailing_id, res_id, email, token):
        if not self._check_mailing_email_token(mailing_id, res_id, email, token):
            return 'unauthorized'
        if email:
            if mailing_id and res_id:
                mailing_sudo = request.env['mailing.mailing'].sudo().browse(mailing_id)
                message = Markup('<p>%s</p>') % Markup(
                    _(
                        'Blocklist removal request from portal of mailing %(mailing_link)s (document %(record_link)s)',
                        **self._format_bl_request(mailing_sudo, res_id)
                    )
                )
            else:
                message = Markup('<p>%s</p>') % _('Blocklist removal request from portal')

            _blacklist_rec = request.env['mail.blacklist'].sudo()._remove(email, message=message)
            return True
        return 'error'

<<<<<<< HEAD
=======
    def _format_bl_request(self, mailing, document_id):
        mailing_model_name = request.env['ir.model']._get(mailing.mailing_model_real).display_name
        return {
            'mailing_link': Markup(f'<a href="#" data-oe-model="mailing.mailing" data-oe-id="{mailing.id}">{escape(mailing.subject)}</a>'),
            'record_link': Markup(f'<a href="#" data-oe-model="{escape(mailing.mailing_model_real)}" data-oe-id="{int(document_id)}">{escape(mailing_model_name)}</a>'),
        }

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    # ------------------------------------------------------------
    # MISCELLANEOUS
    # ------------------------------------------------------------

    @http.route('/mailing/get_preview_assets', type='json', auth='user')
    def get_mobile_preview_styling(self):
        """ This route allows a rpc call to get the styling needed for email template conversion.
        We do this to avoid duplicating the template."""
        if not request.env.user.has_group('mass_mailing.group_mass_mailing_user'):
            raise NotFound
        return request.env['ir.qweb']._render('mass_mailing.iframe_css_assets_edit')
