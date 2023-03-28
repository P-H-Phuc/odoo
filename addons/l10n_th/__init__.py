# Part of Odoo. See LICENSE file for full copyright and licensing details.
from . import models

<<<<<<< HEAD
def _preserve_tag_on_taxes(cr, registry):
=======
def _preserve_tag_on_taxes(env):
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    from odoo.addons.account.models.chart_template import preserve_existing_tags_on_taxes
    preserve_existing_tags_on_taxes(env, 'l10n_th')
