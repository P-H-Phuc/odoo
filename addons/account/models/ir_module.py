from importlib import import_module
from inspect import getmembers, ismodule, isclass, isfunction

from odoo import models, fields


def get_flag(country_code):
    # get the sequence of 2 regional indicator emoji forming the flag linked to the country code
    return "".join(chr(int(f"1f1{ord(c)+165:02x}", base=16)) for c in country_code)


def templ(env, code, name=None, country='', **kwargs):
    country_code = country or code.split('_')[0] if country is not None else None
    country = country_code and env.ref(f"base.{country_code}", raise_if_not_found=False)
    country_name = f"{get_flag(country.code)} {country.name}" if country else ''
    return {
        'name': country_name and (f"{country_name} - {name}" if name else country_name) or name,
        'country_id': country and country.id,
        'country_code': country and country.code,
        **kwargs,
    }

template_module = lambda m: ismodule(m) and m.__name__.split('.')[-1].startswith('template_')
template_class = isclass
template_function = lambda f: isfunction(f) and hasattr(f, '_l10n_template') and f._l10n_template[1] == 'template_data'

class IrModule(models.Model):
    _inherit = "ir.module.module"

    account_templates = fields.Binary(compute='_compute_account_templates', exportable=False)

    def _compute_account_templates(self):
        chart_category = self.env.ref('base.module_category_accounting_localizations_account_charts')
        ChartTemplate = self.env['account.chart.template']
        for module in self:
            templates = {}
            if module.category_id == chart_category or module.name == 'account':
                try:
                    python_module = import_module(f"odoo.addons.{module.name}.models")
                except ModuleNotFoundError:
                    templates = {}
                else:
                    templates = {
                        fct._l10n_template[0]: {
                            'name': fct(ChartTemplate).get('name'),
                            'parent': fct(ChartTemplate).get('parent'),
                            'country': fct(ChartTemplate).get('country', ''),
                            'visible': fct(ChartTemplate).get('visible', True),
                            'module': module.name,
                        }
                        for _name, mdl in getmembers(python_module, template_module)
                        for _name, cls in getmembers(mdl, template_class)
                        for _name, fct in getmembers(cls, template_function)
                    }

            module.account_templates = {
                code: templ(self.env, code, **vals)
                for code, vals in templates.items()
            }

    def write(self, vals):
        # Instanciate the first template of the module on the current company upon installing the module
        was_installed = len(self) == 1 and self.state == 'installed'
        super().write(vals)
        is_installed = len(self) == 1 and self.state == 'installed'
        if not was_installed and is_installed and not self.env.company.chart_template and self.account_templates:
            self.env['account.chart.template'].try_loading(
                next(iter(self.account_templates)),
                self.env.company,
            )

    def _load_module_terms(self, modules, langs, overwrite=False):
        super()._load_module_terms(modules, langs, overwrite)
        if 'account' in modules:
            self.env['account.chart.template']._load_translations(langs=langs)
