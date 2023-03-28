# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from . import models
from . import wizard

from odoo import tools


<<<<<<< HEAD
def _auto_install_apps(cr, registry):
=======
def _auto_install_apps(env):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    if not tools.config.get('default_productivity_apps', False):
        return
    env['ir.module.module'].sudo().search([
        ('name', 'in', [
            # Community
            'hr', 'mass_mailing', 'project', 'survey',
            # Enterprise
            'appointment', 'knowledge', 'planning', 'sign',
        ]),
        ('state', '=', 'uninstalled')
    ]).button_install()
