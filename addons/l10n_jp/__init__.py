# Part of Odoo. See LICENSE file for full copyright and licensing details.
<<<<<<< HEAD

# Copyright (C) Quartile Limited

from odoo import api, SUPERUSER_ID


def load_translations(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    env.ref('l10n_jp.l10n_jp_chart_template').process_coa_translations()
=======
from . import models
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
