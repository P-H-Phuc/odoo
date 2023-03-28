# Part of Odoo. See LICENSE file for full copyright and licensing details.
<<<<<<< HEAD
from odoo.addons.account.models.chart_template import update_taxes_from_templates


def migrate(cr, version):
    update_taxes_from_templates(cr, 'l10n_lu.lu_2011_chart_1')
=======
from odoo import api, SUPERUSER_ID

def migrate(cr, version):
    env = api.Environment(cr, SUPERUSER_ID, {})
    for company in env['res.company'].search([('chart_template', '=', 'lu')]):
        env['account.chart.template'].try_loading('lu', company)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
