# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import contextlib

from odoo import models
from odoo.exceptions import AccessError
from odoo.http import request


class IrAttachment(models.Model):
    _inherit = 'ir.attachment'

    def _post_add_create(self):
        """ Overrides behaviour when the attachment is created through the controller
        """
        super(IrAttachment, self)._post_add_create()
        for record in self:
            record.register_as_main_attachment(force=False)

    def register_as_main_attachment(self, force=True):
        """ Registers this attachment as the main one of the model it is
        attached to.

        :param bool force: if set, the method always updates the existing main attachment
            otherwise it only sets the main attachment if there is none.
        """
        self.ensure_one()
        if not self.res_model or not self.res_id:
            return
        related_record = self.env[self.res_model].browse(self.res_id)
        if not related_record or \
                not related_record.check_access_rights('write', raise_exception=False) or \
                not hasattr(related_record, 'message_main_attachment_id'):
            return

        if force or not related_record.message_main_attachment_id:
            with contextlib.suppress(AccessError):
                related_record.message_main_attachment_id = self

    def _delete_and_notify(self):
        for attachment in self:
            if attachment.res_model == 'mail.channel' and attachment.res_id:
                target = self.env['mail.channel'].browse(attachment.res_id)
            else:
                target = self.env.user.partner_id
            self.env['bus.bus']._sendone(target, 'ir.attachment/delete', {
                'id': attachment.id,
            })
        self.unlink()

    def _attachment_format(self, legacy=False):
        safari = request and request.httprequest.user_agent and request.httprequest.user_agent.browser == 'safari'
        res_list = []
        for attachment in self:
            res = {
                'checksum': attachment.checksum,
                'id': attachment.id,
                'filename': attachment.name,
                'name': attachment.name,
                'mimetype': 'application/octet-stream' if safari and attachment.mimetype and 'video' in attachment.mimetype else attachment.mimetype,
            }
            if not legacy:
                res['originThread'] = [('insert', {
                    'id': attachment.res_id,
                    'model': attachment.res_model,
                })]
            else:
                res.update({
                    'res_id': attachment.res_id,
                    'res_model': attachment.res_model,
                })
            res_list.append(res)
        return res_list
