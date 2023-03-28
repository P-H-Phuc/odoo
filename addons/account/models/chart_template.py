# -*- coding: utf-8 -*-

<<<<<<< HEAD
from odoo.exceptions import AccessError
from odoo import api, fields, models, Command, _, osv
from odoo import SUPERUSER_ID
from odoo.exceptions import UserError, ValidationError
from odoo.http import request
from odoo.addons.account.models.account_tax import TYPE_TAX_USE
from odoo.addons.account.models.account_account import ACCOUNT_CODE_REGEX
from odoo.tools import html_escape

=======
import ast
from collections import defaultdict
import csv
from functools import wraps
from inspect import getmembers
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import logging
import re

from psycopg2.extras import Json

from odoo import Command, _, models, api
from odoo.addons.base.models.ir_model import MODULE_UNINSTALL_FLAG
from odoo.addons.account import SYSCOHADA_LIST
from odoo.exceptions import AccessError
from odoo.tools import file_open, groupby
from odoo.tools.translate import TranslationImporter

_logger = logging.getLogger(__name__)

TEMPLATE_MODELS = (
    'account.group',
    'account.account',
    'account.tax.group',
    'account.tax',
    'account.journal',
    'account.reconcile.model',
    'account.fiscal.position',
)

TAX_TAG_DELIMITER = '||'


def preserve_existing_tags_on_taxes(env, module):
    ''' This is a utility function used to preserve existing previous tags during upgrade of the module.'''
    xml_records = env['ir.model.data'].search([('model', '=', 'account.account.tag'), ('module', 'like', module)])
    if xml_records:
<<<<<<< HEAD
        cr.execute("update ir_model_data set noupdate = 't' where id in %s", [tuple(xml_records.ids)])

def update_taxes_from_templates(cr, chart_template_xmlid):
    def _create_tax_from_template(company, template, old_tax=None):
        """
        Create a new tax from template with template xmlid, if there was already an old tax with that xmlid we
        remove the xmlid from it but don't modify anything else.
        """
        def _remove_xml_id(xml_id):
            module, name = xml_id.split(".", 1)
            env['ir.model.data'].search([('module', '=', module), ('name', '=', name)]).unlink()

        def _avoid_name_conflict():
            conflict_tax = env['account.tax'].search([('name', '=', template.name), ('company_id', '=', company.id),
                                                      ('type_tax_use', '=', template.type_tax_use), ('tax_scope', '=', template.tax_scope)])
            if conflict_tax:
                conflict_tax.name = "[old] " + conflict_tax.name

        template_vals = template._get_tax_vals_complete(company)
        chart_template = env["account.chart.template"].with_context(default_company_id=company.id)
        if old_tax:
            xml_id = old_tax.get_external_id().get(old_tax.id)
            if xml_id:
                _remove_xml_id(xml_id)
        _avoid_name_conflict()
        chart_template.create_record_with_xmlid(company, template, "account.tax", template_vals)

    def _update_tax_from_template(template, tax):
        # -> update the tax : we only updates tax tags
        tax_rep_lines = tax.invoice_repartition_line_ids + tax.refund_repartition_line_ids
        template_rep_lines = template.invoice_repartition_line_ids + template.refund_repartition_line_ids
        for tax_line, template_line in zip(tax_rep_lines, template_rep_lines):
            tags_to_add = template_line._get_tags_to_add()
            tags_to_unlink = tax_line.tag_ids
            if tags_to_add != tags_to_unlink:
                tax_line.write({"tag_ids": [(6, 0, tags_to_add.ids)]})
                _cleanup_tags(tags_to_unlink)

    def _get_template_to_real_xmlid_mapping(company, model):
        """
        This function uses ir_model_data to return a mapping between the templates and the data, using their xmlid
        :returns: {
            account.tax.template.id: account.tax.id
            }
        """
        env['ir.model.data'].flush_model()
        env.cr.execute(
            """
            SELECT template.res_id AS template_res_id,
                   data.res_id AS data_res_id
            FROM ir_model_data data
            JOIN ir_model_data template
            ON template.name = substr(data.name, strpos(data.name, '_') + 1)
            WHERE data.model = %s
            AND data.name LIKE %s
            -- tax.name is of the form: {company_id}_{account.tax.template.name}
            """,
            [model, r"%s\_%%" % company.id],
        )
        tuples = env.cr.fetchall()
        return dict(tuples)

    def _is_tax_and_template_same(template, tax):
        """
        This function compares account.tax and account.tax.template repartition lines.
        A tax is considered the same as the template if they have the same:
            - amount_type
            - amount
            - repartition lines percentages in the same order
        """
        tax_rep_lines = tax.invoice_repartition_line_ids + tax.refund_repartition_line_ids
        template_rep_lines = template.invoice_repartition_line_ids + template.refund_repartition_line_ids
        return (
                tax.amount_type == template.amount_type
                and tax.amount == template.amount
                and len(tax_rep_lines) == len(template_rep_lines)
                and all(
                    rep_line_tax.factor_percent == rep_line_template.factor_percent
                    for rep_line_tax, rep_line_template in zip(tax_rep_lines, template_rep_lines)
                )
        )

    def _cleanup_tags(tags):
        """
        Checks if the tags are still used in taxes or move lines. If not we delete it.
        """
        for tag in tags:
            tax_using_tag = env['account.tax.repartition.line'].sudo().search([('tag_ids', 'in', tag.id)], limit=1)
            aml_using_tag = env['account.move.line'].sudo().search([('tax_tag_ids', 'in', tag.id)], limit=1)
            report_expr_using_tag = tag._get_related_tax_report_expressions()
            if not (aml_using_tag or tax_using_tag or report_expr_using_tag):
                tag.unlink()

    def _update_fiscal_positions_from_templates(company, chart_template_id, new_taxes_template):
        chart_template = env["account.chart.template"].browse(chart_template_id)
        positions = env['account.fiscal.position.template'].search([('chart_template_id', '=', chart_template_id)])
        tax_template_ref = _get_template_to_real_xmlid_mapping(company, 'account.tax')
        fp_template_ref = _get_template_to_real_xmlid_mapping(company, 'account.fiscal.position')

        tax_template_vals = []
        for position_template in positions:
            fp = env["account.fiscal.position"].browse(fp_template_ref.get(position_template.id))
            if not fp:
                continue
            for position_tax in position_template.tax_ids:
                src_id = tax_template_ref[position_tax.tax_src_id.id]
                dest_id = position_tax.tax_dest_id and tax_template_ref[position_tax.tax_dest_id.id] or False
                position_tax_template_exist = fp.tax_ids.filtered_domain([
                    ('tax_src_id', '=', src_id),
                    ('tax_dest_id', '=', dest_id)
                ])
                if not position_tax_template_exist and (position_tax.tax_src_id in new_taxes_template or position_tax.tax_dest_id in new_taxes_template):
                    tax_template_vals.append((position_tax, {
                        'tax_src_id': src_id,
                        'tax_dest_id': dest_id,
                        'position_id': fp.id,
                    }))
        chart_template._create_records_with_xmlid('account.fiscal.position.tax', tax_template_vals, company)

    def _notify_accountant_managers(taxes_to_check):
        accountant_manager_group = env.ref("account.group_account_manager")
        partner_managers_ids = accountant_manager_group.users.mapped('partner_id')
        odoobot = env.ref('base.partner_root')
        message_body = _(
            "Please check these taxes. They might be outdated. We did not update them. "
            "Indeed, they do not exactly match the taxes of the original version of the localization module.<br/>"
            "You might want to archive or adapt them.<br/><ul>"
        )
        for account_tax in taxes_to_check:
            message_body += f"<li>{html_escape(account_tax.name)}</li>"
        message_body += "</ul>"
        env['mail.thread'].message_notify(
            subject=_('Your taxes have been updated !'),
            author_id=odoobot.id,
            body=message_body,
            partner_ids=[partner.id for partner in partner_managers_ids],
        )

    env = api.Environment(cr, SUPERUSER_ID, {})
    chart_template_id = env.ref(chart_template_xmlid).id
    companies = env['res.company'].search([('chart_template_id', 'child_of', chart_template_id)])
    outdated_taxes = []
    new_taxes_template = []
    for company in companies:
        template_to_tax = _get_template_to_real_xmlid_mapping(company, 'account.tax')
        templates = env['account.tax.template'].with_context(active_test=False).search([("chart_template_id", "=", chart_template_id)])
        for template in templates:
            tax = env["account.tax"].browse(template_to_tax.get(template.id))
            if not tax or not _is_tax_and_template_same(template, tax):
                _create_tax_from_template(company, template, old_tax=tax)
                if tax:
                    outdated_taxes.append(tax)
                else:
                    new_taxes_template.append(template)
            else:
                _update_tax_from_template(template, tax)
        _update_fiscal_positions_from_templates(company, chart_template_id, new_taxes_template)
    if outdated_taxes:
        _notify_accountant_managers(outdated_taxes)

#  ---------------------------------------------------------------
#   Account Templates: Account, Tax, Tax Code and chart. + Wizard
#  ---------------------------------------------------------------
=======
        env.cr.execute("update ir_model_data set noupdate = 't' where id in %s", [tuple(xml_records.ids)])
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6


def template(template=None, model='template_data'):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if template is not None:
                # remove the template code argument as we already know it from the decorator
                args, kwargs = args[:1], {}
            return func(*args, **kwargs)
        return api.attrsetter('_l10n_template', (template, model))(wrapper)
    return decorator


class AccountChartTemplate(models.AbstractModel):
    _name = "account.chart.template"
    _description = "Account Chart Template"

    @property
    def _template_register(self):
        def is_template(func):
            return callable(func) and hasattr(func, '_l10n_template')
        template_register = defaultdict(lambda: defaultdict(list))
        cls = type(self)
        for _attr, func in getmembers(cls, is_template):
            template, model = func._l10n_template
            template_register[template][model].append(func)
        cls._template_register = template_register
        return template_register

    def _setup_complete(self):
        super()._setup_complete()
        type(self)._template_register = AccountChartTemplate._template_register


    # --------------------------------------------------------------------------------
    # Template selection
    # --------------------------------------------------------------------------------

    def _get_chart_template_mapping(self, get_all=False):
        """Get basic information about available CoA and their modules.

        :return: a mapping between the template code and a dictionnary constaining the
                 name, country id, country name, module dependencies and parent template
        :rtype: dict[str, dict]
        """
        # This function is called many times. Avoid doing a search every time by using the ORM's cache.
        # We assume that the field is always computed for all the modules at once (by this function)
        field = self.env['ir.module.module']._fields['account_templates']
        modules = (
            self.env.cache.get_records(self.env['ir.module.module'], field)
            or self.env['ir.module.module'].search([])
        )

        return {
            name: template
            for mapping in modules.mapped('account_templates')
            for name, template in mapping.items()
            if get_all or template['visible']
        }

    def _select_chart_template(self, country=None):
        """Get the available templates in a format suited for Selection fields."""
        country = country if country is not None else self.env.company.country_id
        chart_template_mapping = self._get_chart_template_mapping()
        return [
            (template_code, template['name'])
            for template_code, template in sorted(chart_template_mapping.items(), key=(lambda t: (
                t[1]['name'] != 'generic_coa' if not country
                else t[1]['name'] != 'syscohada' if country.code in SYSCOHADA_LIST
                else t[1]['country_id'] != country.id
            )))
        ]

<<<<<<< HEAD
    @api.model
    def _create_cash_discount_loss_account(self, company, code_digits):
        return self.env['account.account'].create({
            'name': _("Cash Discount Loss"),
            'code': 999998,
            'account_type': 'expense',
            'company_id': company.id,
        })

    @api.model
    def _create_cash_discount_gain_account(self, company, code_digits):
        return self.env['account.account'].create({
            'name': _("Cash Discount Gain"),
            'code': 999997,
            'account_type': 'income_other',
            'company_id': company.id,
        })
=======
    def _guess_chart_template(self, country):
        """Guess the most appropriate template based on the country."""
        return self._select_chart_template(country)[0][0]

    # --------------------------------------------------------------------------------
    # Loading
    # --------------------------------------------------------------------------------
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    def try_loading(self, template_code, company, install_demo=True):
        """Check if the chart template can be loaded then proceeds installing it.

        :param template_code: code of the chart template to be loaded.
        :type template_code: str
        :param company: the company we try to load the chart template on.
            If not provided, it is retrieved from the context.
        :type company: int, Model<res.company>
        :param install_demo: whether or not we should load demo data right after loading the
            chart template.
        :type install_demo: bool
        """
        if not company:
            company = self.env.company
        if isinstance(company, int):
            company = self.env['res.company'].browse([company])

        template_code = template_code or company and self._guess_chart_template(company.country_id)

        return self._load(template_code, company, install_demo)

    def _load(self, template_code, company, install_demo):
        """Install this chart of accounts for the current company.

        :param template_code: code of the chart template to be loaded.
        :param company: the company we try to load the chart template on.
            If not provided, it is retrieved from the context.
        :param install_demo: whether or not we should load demo data right after loading the
            chart template.
        """
        # Ensure that the context is the correct one, even if not called by try_loading
        if not self.env.is_system():
            raise AccessError(_("Only administrators can install chart templates"))

        module_name = self._get_chart_template_mapping()[template_code].get('module')
        module = self.env['ir.module.module'].search([('name', '=', module_name), ('state', '=', 'uninstalled')])
        if module:
            module.button_immediate_install()
            self.env.reset()  # clear the envs with an old registry
            self = self.env()['account.chart.template']  # create a new env with the new registry

        self = self.with_context(
            default_company_id=company.id,
            allowed_company_ids=[company.id],
            tracking_disable=True,
            delay_account_group_sync=True,
        )
        company = company.with_env(self.env)

        reload_template = template_code == company.chart_template
        company.chart_template = template_code

        if not reload_template:
            for model in ('account.move',) + TEMPLATE_MODELS[::-1]:
                self.env[model].search([('company_id', '=', company.id)]).with_context({MODULE_UNINSTALL_FLAG: True}).unlink()

        data = self._get_chart_template_data(template_code)
        template_data = data.pop('template_data')

        if reload_template:
            self._pre_reload_data(company, template_data, data)
            install_demo = False
        data = self._pre_load_data(template_code, company, template_data, data)
        self._load_data(data)
        self._load_translations(companies=company)
        self._post_load_data(template_code, company, template_data)

        # Manual sync because disable above (delay_account_group_sync)
        AccountGroup = self.env['account.group'].with_context(delay_account_group_sync=False)
        AccountGroup._adapt_accounts_for_account_groups(self.env['account.account'].search([]))
        AccountGroup.search([])._adapt_parent_account_group()

        # Install the demo data when the first localization is instanciated on the company
        if install_demo and self.ref('base.module_account').demo and not reload_template:
            try:
                with self.env.cr.savepoint():
                    self._load_data(self._get_demo_data(company))
                    self._post_load_demo_data(company)
            except Exception:
                # Do not rollback installation of CoA if demo data failed
                _logger.exception('Error while loading accounting demo data')

    def _pre_reload_data(self, company, template_data, data):
        """Pre-process the data in case of reloading the chart of accounts.

        When we reload the chart of accounts, we only want to update fields that are main
        configuration, like:
        - tax tags
        - fiscal position mappings linked to new records
        """
        for prop in list(template_data):
            if prop.startswith('property_'):
                template_data.pop(prop)
        data.pop('account.reconcile.model', None)

        for xmlid, journal_data in list(data.get('account.journal', {}).items()):
            if self.ref(xmlid, raise_if_not_found=False):
                del data['account.journal'][xmlid]
            elif 'code' in journal_data:
                journal = self.env['account.journal'].search([
                    ('code', '=', journal_data['code']),
                    ('company_id', '=', company.id),
                ])
                if journal:
                    del data['account.journal'][xmlid]
                    self.env['ir.model.data']._update_xmlids([{
                        'xml_id': f"account.{company.id}_{xmlid}",
                        'record': journal,
                        'noupdate': True,
                    }])

        current_taxes = self.env['account.tax'].search([('company_id', '=', company.id)])
        unique_tax_name_key = lambda t: (t.name, t.type_tax_use, t.tax_scope, t.company_id)
        unique_tax_name_keys = set(current_taxes.mapped(unique_tax_name_key))
        xmlid2tax = {
            xml_id.split('.')[1].split('_', maxsplit=1)[1]: self.env['account.tax'].browse(record)
            for record, xml_id in current_taxes.get_external_id().items()
        }
        def tax_template_changed(tax, template):
            return (
                tax.amount_type != template.get('amount_type', 'percent')
                or tax.amount != template.get('amount', 0)
            )

        obsolete_xmlid = set()
        for model_name, records in data.items():
            _fields = self.env[model_name]._fields
            for xmlid, values in records.items():
                x2manyfields = [
                    fname
                    for fname in values
                    if fname in _fields
                    and _fields[fname].type in ('one2many', 'many2many')
                    and isinstance(values[fname], (list, tuple))
                ]
                if x2manyfields:
                    rec = self.ref(xmlid, raise_if_not_found=False)
                    if rec:
                        for fname in x2manyfields:
                            for i, (line, vals) in enumerate(zip(rec[fname], values[fname])):
                                values[fname][i] = Command.update(line.id, vals[2])

                if model_name == 'account.fiscal.position':
                    # Only add tax mappings containing new taxes
                    values['tax_ids'] = [
                        (command, id, vals)
                        for command, id, vals in values.get('tax_ids', [])
                        if (
                            command not in (Command.UPDATE, Command.CREATE)
                            or not self.ref(vals['tax_src_id'], raise_if_not_found=False)
                            or not self.ref(vals['tax_dest_id'], raise_if_not_found=False)
                        )
                    ]
                elif model_name == 'account.tax':
                    # Only update the tags of existing taxes
                    if xmlid not in xmlid2tax or tax_template_changed(xmlid2tax[xmlid], values):
                        if xmlid in xmlid2tax:
                            obsolete_xmlid.add(xmlid)
                            oldtax = xmlid2tax[xmlid]
                            if unique_tax_name_key(oldtax) in unique_tax_name_keys:
                                oldtax.name = f"[old] {oldtax.name}"
                    else:
                        repartition_lines = values.get('repartition_line_ids')
                        values.clear()
                        if repartition_lines:
                            values['repartition_line_ids'] = repartition_lines
                            for _c, _id, repartition_line in values.get('repartition_line_ids', []):
                                tags = repartition_line.get('tag_ids')
                                repartition_line.clear()
                                if tags:
                                    repartition_line['tag_ids'] = tags

        if obsolete_xmlid:
            self.env['ir.model.data'].search([
                ('name', 'in', [f"{company.id}_{xmlid}" for xmlid in obsolete_xmlid]),
                ('module', '=', 'account'),
            ]).unlink()

    def _pre_load_data(self, template_code, company, template_data, data):
        """Pre-process the data and preload some values.

        Some of the data needs special pre_process before being fed to the database.
        e.g. the account codes' width must be standardized to the code_digits applied.
        The fiscal country code must be put in place before taxes are generated.
        """
        if 'account_fiscal_country_id' in data['res.company'][company.id]:
            fiscal_country = self.ref(data['res.company'][company.id]['account_fiscal_country_id'])
        else:
            fiscal_country = company.account_fiscal_country_id

        # Apply template data to the company
        filter_properties = lambda key: (
            (not key.startswith("property_") or key.startswith("property_stock_") or key == "additional_properties")
            and key != 'name'
            and key in company._fields
        )

        # Set the currency to the fiscal country's currency
        vals = {key: val for key, val in template_data.items() if filter_properties(key)}
        vals['currency_id'] = fiscal_country.currency_id.id
        if not company.country_id:
            vals['country_id'] = fiscal_country.id

        # This write method is important because it's overridden and has additional triggers
        # e.g it activates the currency
        company.write(vals)

        # Normalize the code_digits of the accounts
        code_digits = int(template_data.get('code_digits', 6))
        for key, account_data in data.get('account.account', {}).items():
            data['account.account'][key]['code'] = f'{account_data["code"]:<0{code_digits}}'

        for model in ('account.fiscal.position', 'account.reconcile.model'):
            if model in data:
                data[model] = data.pop(model)

        return data

    def _load_data(self, data):
        """Load all the data linked to the template into the database.

        The data can contain translation values (i.e. `name@fr_FR` to translate the name in French)
        An xml_id tht doesn't contain a `.` will be treated as being linked to `account` and prefixed
        with the company's id (i.e. `cash` is interpreted as `account.1_cash` if the company's id is 1)

        :param data: Basically all the final data of records to create/update for the chart
                     of accounts. It is a mapping {model: {xml_id: values}}.
        :type data: dict[str, dict[(str, int), dict]]
        """
        def deref(values, model):
            """Replace xml_id references by database ids.

            This allows to define all the data before the records even exist in the database.
            """
            fields = ((model._fields[k], k, v) for k, v in values.items() if k in model._fields)
            for field, fname, value in fields:
                if not value:
                    values[fname] = False
                elif isinstance(value, str) and (
                    field.type == 'many2one'
                    or (field.type in ('integer', 'many2one_reference') and not value.isdigit())
                ):
                    values[fname] = self.ref(value).id if value not in ('', 'False', 'None') else False
                elif field.type in ('one2many', 'many2many') and isinstance(value[0], (list, tuple)):
                    for i, (command, _id, *last_part) in enumerate(value):
                        if last_part:
                            last_part = last_part[0]
                        # (0, 0, {'test': 'account.ref_name'}) -> Command.Create({'test': 13})
                        if command in (Command.CREATE, Command.UPDATE):
                            deref(last_part, self.env[field.comodel_name])
                        # (6, 0, ['account.ref_name']) -> Command.Set([13])
                        elif command == Command.SET:
                            for subvalue_idx, subvalue in enumerate(last_part):
                                if isinstance(subvalue, str):
                                    last_part[subvalue_idx] = self.ref(subvalue).id
                        elif command == Command.LINK and isinstance(_id, str):
                            value[i] = Command.link(self.ref(_id).id)
                elif field.type in ('one2many', 'many2many') and isinstance(value, str):
                    values[fname] = [Command.set([
                        self.ref(v).id
                        for v in value.split(',')
                        if v
                    ])]
            return values

        def defer(all_data):
            """Defer writing some relations if the related records don't exist yet."""
            created_models = set()
            while all_data:
                (model, data), *all_data = all_data
                to_delay = defaultdict(dict)
                for xml_id, vals in data.items():
                    to_be_removed = []
                    for field_name in vals:
                        field = self.env[model]._fields.get(field_name, None)
                        if (field and
                            field.relational and
                            field.comodel_name not in created_models and
                            (field.comodel_name in dict(all_data) or field.comodel_name == model)
                        ):
                            to_be_removed.append(field_name)
                            to_delay[xml_id][field_name] = vals.get(field_name)
                    for field_name in to_be_removed:
                        del vals[field_name]
                if any(to_delay.values()):
                    all_data.append((model, to_delay))
                yield model, data
                created_models.add(model)

        created_vals = {}
        for model, data in defer(list(data.items())):
            create_vals = []
            for xml_id, record in data.items():
                # Extract the translations from the values
                for key in list(record):
                    if '@' in key:
                        del record[key]

                # Manage ids given as database id or xml_id
                if isinstance(xml_id, int):
                    record['id'] = xml_id
                    xml_id = False
                else:
                    xml_id = f"{('account.' + str(self.env.company.id) + '_') if '.' not in xml_id else ''}{xml_id}"

                create_vals.append({
                    'xml_id': xml_id,
                    'values': deref(record, self.env[model]),
                    'noupdate': True,
                })
            created_vals[model] = self.env[model]._load_records(create_vals)
        return created_vals

    def _post_load_data(self, template_code, company, template_data):
        company = (company or self.env.company)
        additional_properties = template_data.pop('additional_properties', {})

        self._setup_utility_bank_accounts(template_code, company, template_data)

        # Unaffected earnings account on the company (if not present yet)
        company.get_unaffected_earnings_account()

        # Set newly created Cash difference and Suspense accounts to the Cash and Bank journals
        for journal in [self.ref(kind, raise_if_not_found=False) for kind in ('bank', 'cash')]:
            if journal:
                journal.suspense_account_id = journal.suspense_account_id or company.account_journal_suspense_account_id
                journal.profit_account_id = journal.profit_account_id or company.default_cash_difference_income_account_id
                journal.loss_account_id = journal.loss_account_id or company.default_cash_difference_expense_account_id

        # Set newly created journals as defaults for the company
        if not company.tax_cash_basis_journal_id:
            company.tax_cash_basis_journal_id = self.ref('caba')
        if not company.currency_exchange_journal_id:
            company.currency_exchange_journal_id = self.ref('exch')

        # Setup default Income/Expense Accounts on Sale/Purchase journals
        sale_journal = self.ref("sale", raise_if_not_found=False)
        if sale_journal and template_data.get('property_account_income_categ_id'):
            sale_journal.default_account_id = self.ref(template_data.get('property_account_income_categ_id'))
        purchase_journal = self.ref("purchase", raise_if_not_found=False)
        if purchase_journal and template_data.get('property_account_expense_categ_id'):
            purchase_journal.default_account_id = self.ref(template_data.get('property_account_expense_categ_id'))

        # Set default Purchase and Sale taxes on the company
        if not company.account_sale_tax_id:
            company.account_sale_tax_id = self.env['account.tax'].search([
                ('type_tax_use', 'in', ('sale', 'all')), ('company_id', '=', company.id)], limit=1).id
        if not company.account_purchase_tax_id:
            company.account_purchase_tax_id = self.env['account.tax'].search([
                ('type_tax_use', 'in', ('purchase', 'all')), ('company_id', '=', company.id)], limit=1).id
        # Display caba fields if there are caba taxes
        if self.env['account.tax'].search([('tax_exigibility', '=', 'on_payment')]):
            company.tax_exigibility = True

        for field, model in {
            **additional_properties,
            'property_account_receivable_id': 'res.partner',
            'property_account_payable_id': 'res.partner',
            'property_account_expense_categ_id': 'product.category',
            'property_account_income_categ_id': 'product.category',
            'property_account_expense_id': 'product.template',
            'property_account_income_id': 'product.template',
            'property_stock_journal': 'product.category',
            'property_stock_account_input_categ_id': 'product.category',
            'property_stock_account_output_categ_id': 'product.category',
            'property_stock_valuation_account_id': 'product.category',
        }.items():
            value = template_data.get(field)
            if value and field in self.env[model]._fields:
                self.env['ir.property']._set_default(field, model, self.ref(value).id, company=company)

    def _get_chart_template_data(self, template_code):
        template_data = defaultdict(lambda: defaultdict(dict))
        template_data['res.company']
        for code in [None] + self._get_parent_template(template_code):
            for model, funcs in sorted(
                self._template_register[code].items(),
                key=lambda i: TEMPLATE_MODELS.index(i[0]) if i[0] in TEMPLATE_MODELS else 1000
            ):
                for func in funcs:
                    data = func(self, template_code)
                    if data is not None:
                        if model == 'template_data':
                            template_data[model].update(data)
                        else:
                            for xmlid, record in data.items():
                                template_data[model][xmlid].update(record)
        return template_data

    def _setup_utility_bank_accounts(self, template_code, company, template_data):
        """Define basic bank accounts for the company.

        - Suspense Account
        - Outstanding Receipts/Payments Accounts
        - Cash Difference Gain/Loss Accounts
        - Liquidity Transfer Account
        """
<<<<<<< HEAD
        model_to_check = ['account.payment', 'account.bank.statement.line']
        for model in model_to_check:
            if self.env[model].sudo().search([('company_id', '=', company_id.id)], order="id DESC", limit=1):
                return True
        if self.env['account.move'].sudo().search([('company_id', '=', company_id.id), ('state', '!=', 'draft')], order="id DESC", limit=1):
            return True
        return False

    def _get_chart_parent_ids(self):
        """ Returns the IDs of all ancestor charts, including the chart itself.
            (inverse of child_of operator)

            :return: the IDS of all ancestor charts, including the chart itself.
        """
        chart_template = self
        result = [chart_template.id]
        while chart_template.parent_id:
            chart_template = chart_template.parent_id
            result.append(chart_template.id)
        return result

    def _create_bank_journals(self, company, acc_template_ref):
        '''
        This function creates bank journals and their account for each line
        data returned by the function _get_default_bank_journals_data.

        :param company: the company for which the wizard is running.
        :param acc_template_ref: the dictionary containing the mapping between the ids of account templates and the ids
            of the accounts that have been generated from them.
        '''
        self.ensure_one()
        bank_journals = self.env['account.journal']
        # Create the journals that will trigger the account.account creation
        for acc in self._get_default_bank_journals_data():
            bank_journals += self.env['account.journal'].create({
                'name': acc['acc_name'],
                'type': acc['account_type'],
                'company_id': company.id,
                'currency_id': acc.get('currency_id', self.env['res.currency']).id,
                'sequence': 10,
            })

        return bank_journals

    @api.model
    def _get_default_bank_journals_data(self):
        """ Returns the data needed to create the default bank journals when
        installing this chart of accounts, in the form of a list of dictionaries.
        The allowed keys in these dictionaries are:
            - acc_name: string (mandatory)
            - account_type: 'cash' or 'bank' (mandatory)
            - currency_id (optional, only to be specified if != company.currency_id)
        """
        return [{'acc_name': _('Cash'), 'account_type': 'cash'}, {'acc_name': _('Bank'), 'account_type': 'bank'}]

    @api.model
    def generate_journals(self, acc_template_ref, company, journals_dict=None):
        """
        This method is used for creating journals.

        :param acc_template_ref: Account templates reference.
        :param company_id: company to generate journals for.
        :returns: True
        """
        JournalObj = self.env['account.journal']
        for vals_journal in self._prepare_all_journals(acc_template_ref, company, journals_dict=journals_dict):
            journal = JournalObj.create(vals_journal)
            if vals_journal['type'] == 'general' and vals_journal['code'] == _('EXCH'):
                company.write({'currency_exchange_journal_id': journal.id})
            if vals_journal['type'] == 'general' and vals_journal['code'] == _('CABA'):
                company.write({'tax_cash_basis_journal_id': journal.id})
        return True

    def _prepare_all_journals(self, acc_template_ref, company, journals_dict=None):
        def _get_default_account(journal_vals, type='debit'):
            # Get the default accounts
            default_account = False
            if journal['type'] == 'sale':
                default_account = acc_template_ref.get(self.property_account_income_categ_id).id
            elif journal['type'] == 'purchase':
                default_account = acc_template_ref.get(self.property_account_expense_categ_id).id

            return default_account

        journals = [{'name': _('Customer Invoices'), 'type': 'sale', 'code': _('INV'), 'favorite': True, 'color': 11, 'sequence': 5},
                    {'name': _('Vendor Bills'), 'type': 'purchase', 'code': _('BILL'), 'favorite': True, 'color': 11, 'sequence': 6},
                    {'name': _('Miscellaneous Operations'), 'type': 'general', 'code': _('MISC'), 'favorite': True, 'sequence': 7},
                    {'name': _('Exchange Difference'), 'type': 'general', 'code': _('EXCH'), 'favorite': False, 'sequence': 9},
                    {'name': _('Cash Basis Taxes'), 'type': 'general', 'code': _('CABA'), 'favorite': False, 'sequence': 10}]
        if journals_dict != None:
            journals.extend(journals_dict)

        self.ensure_one()
        journal_data = []
        for journal in journals:
            vals = {
                'type': journal['type'],
                'name': journal['name'],
                'code': journal['code'],
                'company_id': company.id,
                'default_account_id': _get_default_account(journal),
                'show_on_dashboard': journal['favorite'],
                'color': journal.get('color', False),
                'sequence': journal['sequence']
            }
            journal_data.append(vals)
        return journal_data

    def generate_properties(self, acc_template_ref, company):
        """
        This method used for creating properties.

        :param acc_template_ref: Mapping between ids of account templates and real accounts created from them
        :param company_id: company to generate properties for.
        :returns: True
        """
        self.ensure_one()
        PropertyObj = self.env['ir.property']
        todo_list = [
            ('property_account_receivable_id', 'res.partner'),
            ('property_account_payable_id', 'res.partner'),
            ('property_account_expense_categ_id', 'product.category'),
            ('property_account_income_categ_id', 'product.category'),
            ('property_account_expense_id', 'product.template'),
            ('property_account_income_id', 'product.template'),
            ('property_tax_payable_account_id', 'account.tax.group'),
            ('property_tax_receivable_account_id', 'account.tax.group'),
            ('property_advance_tax_payment_account_id', 'account.tax.group'),
        ]
        for field, model in todo_list:
            account = self[field]
            value = acc_template_ref[account].id if account else False
            if value:
                PropertyObj._set_default(field, model, value, company=company)

        stock_properties = [
            'property_stock_account_input_categ_id',
            'property_stock_account_output_categ_id',
            'property_stock_valuation_account_id',
        ]
        for stock_property in stock_properties:
            account = getattr(self, stock_property)
            value = account and acc_template_ref[account].id or False
            if value:
                company.write({stock_property: value})
        return True

    def _install_template(self, company, code_digits=None, obj_wizard=None, acc_ref=None, taxes_ref=None):
        """ Recursively load the template objects and create the real objects from them.

            :param company: company the wizard is running for
            :param code_digits: number of digits the accounts code should have in the COA
            :param obj_wizard: the current wizard for generating the COA from the templates
            :param acc_ref: Mapping between ids of account templates and real accounts created from them
            :param taxes_ref: Mapping between ids of tax templates and real taxes created from them
            :returns: tuple with a dictionary containing
                * the mapping between the account template ids and the ids of the real accounts that have been generated
                  from them, as first item,
                * a similar dictionary for mapping the tax templates and taxes, as second item,
            :rtype: tuple(dict, dict, dict)
        """
        self.ensure_one()
        if acc_ref is None:
            acc_ref = {}
        if taxes_ref is None:
            taxes_ref = {}
        if self.parent_id:
            tmp1, tmp2 = self.parent_id._install_template(company, code_digits=code_digits, acc_ref=acc_ref, taxes_ref=taxes_ref)
            acc_ref.update(tmp1)
            taxes_ref.update(tmp2)
        # Ensure, even if individually, that everything is translated according to the company's language.
        tmp1, tmp2 = self.with_context(lang=company.partner_id.lang)._load_template(company, code_digits=code_digits, account_ref=acc_ref, taxes_ref=taxes_ref)
        acc_ref.update(tmp1)
        taxes_ref.update(tmp2)
        return acc_ref, taxes_ref

    def _load_template(self, company, code_digits=None, account_ref=None, taxes_ref=None):
        """ Generate all the objects from the templates

            :param company: company the wizard is running for
            :param code_digits: number of digits the accounts code should have in the COA
            :param acc_ref: Mapping between ids of account templates and real accounts created from them
            :param taxes_ref: Mapping between ids of tax templates and real taxes created from them
            :returns: tuple with a dictionary containing
                * the mapping between the account template ids and the ids of the real accounts that have been generated
                  from them, as first item,
                * a similar dictionary for mapping the tax templates and taxes, as second item,
            :rtype: tuple(dict, dict, dict)
        """
        self.ensure_one()
        if account_ref is None:
            account_ref = {}
        if taxes_ref is None:
            taxes_ref = {}
        if not code_digits:
            code_digits = self.code_digits
        AccountTaxObj = self.env['account.tax']

        # Generate taxes from templates.
        generated_tax_res = self.with_context(active_test=False).tax_template_ids._generate_tax(company)
        taxes_ref.update(generated_tax_res['tax_template_to_tax'])

        # Generating Accounts from templates.
        account_template_ref = self.generate_account(taxes_ref, account_ref, code_digits, company)
        account_ref.update(account_template_ref)

        # Generate account groups, from template
        self.generate_account_groups(company)

        # writing account values after creation of accounts
        for tax, value in generated_tax_res['account_dict']['account.tax'].items():
            if value['cash_basis_transition_account_id']:
                tax.cash_basis_transition_account_id = account_ref.get(value['cash_basis_transition_account_id'])

        for repartition_line, value in generated_tax_res['account_dict']['account.tax.repartition.line'].items():
            if value['account_id']:
                repartition_line.account_id = account_ref.get(value['account_id'])

        # Set the company accounts
        self._load_company_accounts(account_ref, company)

        # Create Journals - Only done for root chart template
        if not self.parent_id:
            self.generate_journals(account_ref, company)

        # generate properties function
        self.generate_properties(account_ref, company)

        # Generate Fiscal Position , Fiscal Position Accounts and Fiscal Position Taxes from templates
        self.generate_fiscal_position(taxes_ref, account_ref, company)

        # Generate account operation template templates
        self.generate_account_reconcile_model(taxes_ref, account_ref, company)

        return account_ref, taxes_ref

    def _load_company_accounts(self, account_ref, company):
        # Set the default accounts on the company
        accounts = {
            'default_cash_difference_income_account_id': self.default_cash_difference_income_account_id,
            'default_cash_difference_expense_account_id': self.default_cash_difference_expense_account_id,
            'account_journal_early_pay_discount_loss_account_id': self.account_journal_early_pay_discount_loss_account_id,
            'account_journal_early_pay_discount_gain_account_id': self.account_journal_early_pay_discount_gain_account_id,
            'account_journal_suspense_account_id': self.account_journal_suspense_account_id,
            'account_journal_payment_debit_account_id': self.account_journal_payment_debit_account_id,
            'account_journal_payment_credit_account_id': self.account_journal_payment_credit_account_id,
            'account_cash_basis_base_account_id': self.property_cash_basis_base_account_id,
            'account_default_pos_receivable_account_id': self.default_pos_receivable_account_id,
            'income_currency_exchange_account_id': self.income_currency_exchange_account_id,
            'expense_currency_exchange_account_id': self.expense_currency_exchange_account_id,
=======
        # Create utility bank_accounts
        bank_prefix = company.bank_account_code_prefix
        code_digits = int(template_data.get('code_digits', 6))
        accounts_data = {
            'account_journal_suspense_account_id': {
                'name': _("Bank Suspense Account"),
                'prefix': bank_prefix,
                'code_digits': code_digits,
                'account_type': 'asset_current',
            },
            'account_journal_payment_debit_account_id': {
                'name': _("Outstanding Receipts"),
                'prefix': bank_prefix,
                'code_digits': code_digits,
                'account_type': 'asset_current',
                'reconcile': True,
            },
            'account_journal_payment_credit_account_id': {
                'name': _("Outstanding Payments"),
                'prefix': bank_prefix,
                'code_digits': code_digits,
                'account_type': 'asset_current',
                'reconcile': True,
            },
            'account_journal_early_pay_discount_loss_account_id': {
                'name': _("Cash Discount Loss"),
                'code': '999998',
                'account_type': 'expense',
            },
            'account_journal_early_pay_discount_gain_account_id': {
                'name': _("Cash Discount Gain"),
                'code': '999997',
                'account_type': 'income_other',
            },
            'default_cash_difference_income_account_id': {
                'name': _("Cash Difference Gain"),
                'prefix': '999',
                'code_digits': code_digits,
                'account_type': 'expense',
                'tag_ids': [(6, 0, self.ref('account.account_tag_investing').ids)],
            },
            'default_cash_difference_expense_account_id': {
                'name': _("Cash Difference Loss"),
                'prefix': '999',
                'code_digits': code_digits,
                'account_type': 'expense',
                'tag_ids': [(6, 0, self.ref('account.account_tag_investing').ids)],
            },
            'transfer_account_id': {
                'name': _("Liquidity Transfer"),
                'prefix': company.transfer_account_code_prefix,
                'code_digits': code_digits,
                'account_type': 'asset_current',
                'reconcile': True,
            },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }

        for fname in list(accounts_data):
            if company[fname]:
                del accounts_data[fname]

        accounts = self.env['account.account'].create(accounts_data.values())
        for company_attr_name, account in zip(accounts_data.keys(), accounts):
            company[company_attr_name] = account

    # --------------------------------------------------------------------------------
    # Root template functions
    # --------------------------------------------------------------------------------

    @template(model='account.account')
    def _get_account_account(self, template_code):
        return self._parse_csv(template_code, 'account.account')

    @template(model='account.group')
    def _get_account_group(self, template_code):
        return self._parse_csv(template_code, 'account.group')

    @template(model='account.tax.group')
    def _get_account_tax_group(self, template_code):
        return self._parse_csv(template_code, 'account.tax.group')

    @template(model='account.tax')
    def _get_account_tax(self, template_code):
        tax_data = self._parse_csv(template_code, 'account.tax')
        self._deref_account_tags(template_code, tax_data)
        return tax_data

    @template(model='account.fiscal.position')
    def _get_account_fiscal_position(self, template_code):
        return self._parse_csv(template_code, 'account.fiscal.position')

    @template(model='account.journal')
    def _get_account_journal(self, template_code):
        return {
            "sale": {
                'name': _('Customer Invoices'),
                'type': 'sale',
                'code': _('INV'),
                'show_on_dashboard': True,
                'color': 11,
                'sequence': 5,
            },
            "purchase": {
                'name': _('Vendor Bills'),
                'type': 'purchase',
                'code': _('BILL'),
                'show_on_dashboard': True,
                'color': 11,
                'sequence': 6,
            },
            "general": {
                'name': _('Miscellaneous Operations'),
                'type': 'general',
                'code': _('MISC'),
                'show_on_dashboard': True,
                'sequence': 7,
            },
            "exch": {
                'name': _('Exchange Difference'),
                'type': 'general',
                'code': _('EXCH'),
                'show_on_dashboard': False,
                'sequence': 9,
            },
            "caba": {
                'name': _('Cash Basis Taxes'),
                'type': 'general',
                'code': _('CABA'),
                'show_on_dashboard': False,
                'sequence': 10,
            },
            "bank": {
                'name': _('Bank'),
                'type': 'bank',
                'show_on_dashboard': True,
            },
            "cash": {
                'name': _('Cash'),
                'type': 'cash',
                'show_on_dashboard': True,
            },
        }

    @template(model='account.reconcile.model')
    def _get_account_reconcile_model(self, template_code):
        return {
            "reconcile_perfect_match": {
                "name": _('Invoices/Bills Perfect Match'),
                "sequence": 1,
                "rule_type": 'invoice_matching',
                "auto_reconcile": True,
                "match_nature": 'both',
                "match_same_currency": True,
                "allow_payment_tolerance": True,
                "payment_tolerance_type": 'percentage',
                "payment_tolerance_param": 0,
                "match_partner": True,
            },
            "reconcile_partial_underpaid": {
                "name": _('Invoices/Bills Partial Match if Underpaid'),
                "sequence": 2,
                "rule_type": 'invoice_matching',
                "auto_reconcile": False,
                "match_nature": 'both',
                "match_same_currency": True,
                "allow_payment_tolerance": False,
                "match_partner": True,
            }
        }

    # --------------------------------------------------------------------------------
    # Tooling
    # --------------------------------------------------------------------------------

    def ref(self, xmlid, raise_if_not_found=True):
        return self.env.ref(f"account.{self.env.company.id}_{xmlid}" if xmlid and '.' not in xmlid else xmlid, raise_if_not_found)

    def _get_parent_template(self, code):
        parents = []
        template_mapping = self._get_chart_template_mapping(get_all=True)
        while template_mapping.get(code):
            parents.append(code)
            code = template_mapping.get(code).get('parent')
        return parents

    def _get_tag_mapper(self, template_code):
        tags = {x.name: x.id for x in self.env['account.account.tag'].search([
            ('applicability', '=', 'taxes'),
            ('country_id', '=', self._get_chart_template_mapping()[template_code]['country_id']),
        ])}
        return lambda *args: [tags[re.sub(r'\s+', ' ', x.strip())] for x in args]

    def _deref_account_tags(self, template_code, tax_data):
        mapper = self._get_tag_mapper(template_code)
        for tax in tax_data.values():
            for fname in ('invoice_repartition_line_ids', 'refund_repartition_line_ids', 'repartition_line_ids'):
                if tax.get(fname):
                    for _command, _id, repartition in tax[fname]:
                        tags = repartition.get('tag_ids')
                        if isinstance(tags, str) and not re.match(r"^(\w+\.\w+,)*\w+\.\w+$", tags):
                            repartition['tag_ids'] = [Command.set(mapper(*tags.split(TAX_TAG_DELIMITER)))]

    def _parse_csv(self, template_code, model, module=None):
        Model = self.env[model]
        model_fields = Model._fields

        if module is None:
            module = self._get_chart_template_mapping().get(template_code)['module']
        assert re.fullmatch(r"[a-z0-9_]+", module)

        res = {}
        for template in self._get_parent_template(template_code)[::-1] or ['']:
            try:
                with file_open(f"{module}/data/template/{model}{f'-{template}' if template else ''}.csv", 'r') as csv_file:
                    for row in csv.DictReader(csv_file):
                        if row['id']:
                            last_id = row['id']
                            res[row['id']] = {
                                key.split('/')[0]: (
                                    value if '@' in key
                                    else [] if '/' in key
                                    else (value and ast.literal_eval(value) or False) if model_fields[key].type in ('boolean', 'int', 'float')
                                    else value
                                )
                                for key, value in row.items()
                                if key != 'id' and value != ""
                            }
                        create_added = set()
                        for key, value in row.items():
                            if '/' in key and value:
                                sub = [Command.create(res[last_id])]
                                path = key.split('/')
                                for p in path[:-1]:
                                    if p not in create_added:
                                        create_added.add(p)
                                        sub[-1][2].setdefault(p, [])
                                        sub[-1][2][p].append(Command.create({}))
                                    sub = sub[-1][2][p]
                                sub[-1][2][path[-1]] = value
            except FileNotFoundError:
                _logger.debug("No file %s found for template '%s'", model, module)
        return res

    def _load_translations(self, langs=None, companies=None):
        """Load the translations of the chart template.

        :param langs: the lang code to load the translations for. If one of the codes is not present,
                      we are looking for it more generic locale (i.e. `en` instead of `en_US`)
        :type langs: list[str]
        :param companies: the companies to load the translations for
        :type companies: Model<res.company>
        """
<<<<<<< HEAD
        def create_foreign_tax_account(existing_account, additional_label):
            new_code = self.env['account.account']._search_new_account_code(existing_account.company_id, len(existing_account.code), existing_account.code[:-2])
            return self.env['account.account'].create({
                'name': f"{existing_account.name} - {additional_label}",
                'code': new_code,
                'account_type': existing_account.account_type,
                'company_id': existing_account.company_id.id,
            })

        def get_existing_tax_account(foreign_tax_rep_line, force_tax=None):
            company = foreign_tax_rep_line.company_id
            sign_comparator = '<' if foreign_tax_rep_line.factor_percent < 0 else '>'

            search_domain = [
                ('account_id', '!=', False),
                ('factor_percent', sign_comparator, 0),
                ('company_id', '=', company.id),
                '|',
                '&', ('invoice_tax_id.type_tax_use', '=', tax_rep_line.invoice_tax_id.type_tax_use),
                     ('invoice_tax_id.country_id', '=', company.account_fiscal_country_id.id),
                '&', ('refund_tax_id.type_tax_use', '=', tax_rep_line.refund_tax_id.type_tax_use),
                     ('refund_tax_id.country_id', '=', company.account_fiscal_country_id.id),
            ]

            if force_tax:
                search_domain += [
                    '|', ('invoice_tax_id', 'in', force_tax.ids),
                    ('refund_tax_id', 'in', force_tax.ids),
                ]

            return self.env['account.tax.repartition.line'].search(search_domain, limit=1).account_id


        taxes_in_country = self.env['account.tax'].search([
            ('country_id', '=', country.id),
            ('company_id', '=', company.id)
        ])

        if taxes_in_country:
            return

        templates_to_instantiate = self.env['account.tax.template'].with_context(active_test=False).search([('chart_template_id.country_id', '=', country.id)])
        default_company_taxes = company.account_sale_tax_id + company.account_purchase_tax_id
        rep_lines_accounts = templates_to_instantiate._generate_tax(company)['account_dict']

        new_accounts_map = {}

        # Handle tax repartition line accounts
        tax_rep_lines_accounts_dict = rep_lines_accounts['account.tax.repartition.line']
        for tax_rep_line, account_dict in tax_rep_lines_accounts_dict.items():
            account_template = account_dict['account_id']
            rep_account = new_accounts_map.get(account_template)

            if not rep_account:

                existing_account = get_existing_tax_account(tax_rep_line, force_tax=default_company_taxes)

                if not existing_account:
                    # If the default taxes were not enough to provide the account
                    # we need, search on all other taxes.
                    existing_account = get_existing_tax_account(tax_rep_line)

                if existing_account:
                    rep_account = create_foreign_tax_account(existing_account, _("Foreign tax account (%s)", country.code))
                    new_accounts_map[account_template] = rep_account

            tax_rep_line.account_id = rep_account

        # Handle cash basis taxes transtion account
        caba_transition_dict = rep_lines_accounts['account.tax']
        for tax, account_dict in caba_transition_dict.items():
            transition_account_template = account_dict['cash_basis_transition_account_id']

            if transition_account_template:
                transition_account = new_accounts_map.get(transition_account_template)

                if not transition_account:
                    rep_lines = tax.invoice_repartition_line_ids + tax.refund_repartition_line_ids
                    tax_accounts = rep_lines.account_id

                    if tax_accounts:
                        transition_account = create_foreign_tax_account(tax_accounts[0], _("Cash basis transition account"))

                tax.cash_basis_transition_account_id = transition_account

        # Setup tax closing accounts on foreign tax groups ; we don't want to use the domestic accounts
        groups = self.env['account.tax.group'].search([('country_id', '=', country.id)])
        group_property_fields = [
            'property_tax_payable_account_id',
            'property_tax_receivable_account_id',
            'property_advance_tax_payment_account_id'
        ]

        property_company = self.env['ir.property'].with_company(company)
        groups_company = groups.with_company(company)
        for property_field in group_property_fields:
            default_acc = property_company._get(property_field, 'account.tax.group')
            if default_acc:
                groups_company.write({
                    property_field: create_foreign_tax_account(default_acc, _("Foreign account (%s)", country.code))
                })

    def _get_tax_vals(self, company, tax_template_to_tax):
        """ This method generates a dictionary of all the values for the tax that will be created.
        """
        # Compute children tax ids
        children_ids = []
        for child_tax in self.children_tax_ids:
            if tax_template_to_tax.get(child_tax):
                children_ids.append(tax_template_to_tax[child_tax].id)
        self.ensure_one()
        val = {
            'name': self.name,
            'type_tax_use': self.type_tax_use,
            'tax_scope': self.tax_scope,
            'amount_type': self.amount_type,
            'active': self.active,
            'company_id': company.id,
            'sequence': self.sequence,
            'amount': self.amount,
            'description': self.description,
            'price_include': self.price_include,
            'include_base_amount': self.include_base_amount,
            'is_base_affected': self.is_base_affected,
            'analytic': self.analytic,
            'children_tax_ids': [(6, 0, children_ids)],
            'tax_exigibility': self.tax_exigibility,
        }

        # We add repartition lines if there are some, so that if there are none,
        # default_get is called and creates the default ones properly.
        if self.invoice_repartition_line_ids:
            val['invoice_repartition_line_ids'] = self.invoice_repartition_line_ids.get_repartition_line_create_vals(company)
        if self.refund_repartition_line_ids:
            val['refund_repartition_line_ids'] = self.refund_repartition_line_ids.get_repartition_line_create_vals(company)

        if self.tax_group_id:
            val['tax_group_id'] = self.tax_group_id.id
        return val

    def _get_tax_vals_complete(self, company):
        """
        Returns a dict of values to be used to create the tax corresponding to the template, assuming the
        account.account objects were already created.
        It differs from function _get_tax_vals because here, we replace the references to account.template by their
        corresponding account.account ids ('cash_basis_transition_account_id' and 'account_id' in the invoice and
        refund repartition lines)
        (Used by upgrade/migrations/util/accounting)
        """
        vals = self._get_tax_vals(company, {})
        vals.pop("children_tax_ids", None)

        if self.cash_basis_transition_account_id.code:
            cash_basis_account_id = self.env['account.account'].search([
                ('code', '=like', self.cash_basis_transition_account_id.code + '%'),
                ('company_id', '=', company.id)
            ], limit=1)
            if cash_basis_account_id:
                vals.update({"cash_basis_transition_account_id": cash_basis_account_id.id})

        vals.update({
            "invoice_repartition_line_ids": self.invoice_repartition_line_ids._get_repartition_line_create_vals_complete(company),
            "refund_repartition_line_ids": self.refund_repartition_line_ids._get_repartition_line_create_vals_complete(company),
        })
        return vals

    def _generate_tax(self, company):
        """ This method generate taxes from templates.

            :param company: the company for which the taxes should be created from templates in self
            :returns: {
                'tax_template_to_tax': mapping between tax template and the newly generated taxes corresponding,
                'account_dict': dictionary containing a to-do list with all the accounts to assign on new taxes
            }
        """
        # default_company_id is needed in context to allow creation of default
        # repartition lines on taxes
        ChartTemplate = self.env['account.chart.template'].with_context(default_company_id=company.id)
        todo_dict = {'account.tax': {}, 'account.tax.repartition.line': {}}
        tax_template_to_tax = {}

        templates_todo = list(self)
        while templates_todo:
            templates = templates_todo
            templates_todo = []

            # create taxes in batch
            tax_template_vals = []
            for template in templates:
                if all(child in tax_template_to_tax for child in template.children_tax_ids):
                    vals = template._get_tax_vals(company, tax_template_to_tax)

                    if self.chart_template_id.country_id:
                        vals['country_id'] = self.chart_template_id.country_id.id
                    elif company.account_fiscal_country_id:
                        vals['country_id'] = company.account_fiscal_country_id.id
                    else:
                        # Will happen for generic CoAs such as syscohada (they are available for multiple countries, and don't have any country_id)
                        raise UserError(_("Please first define a fiscal country for company %s.", company.name))

                    tax_template_vals.append((template, vals))
                else:
                    # defer the creation of this tax to the next batch
                    templates_todo.append(template)
            taxes = ChartTemplate._create_records_with_xmlid('account.tax', tax_template_vals, company)

            # fill in tax_template_to_tax and todo_dict
            for tax, (template, vals) in zip(taxes, tax_template_vals):
                tax_template_to_tax[template] = tax
                # Since the accounts have not been created yet, we have to wait before filling these fields
                todo_dict['account.tax'][tax] = {
                    'cash_basis_transition_account_id': template.cash_basis_transition_account_id,
                }

                # We also have to delay the assignation of accounts to repartition lines
                # The below code assigns the account_id to the repartition lines according
                # to the corresponding repartition line in the template, based on the order.
                # As we just created the repartition lines, tax.invoice_repartition_line_ids is not well sorted.
                # But we can force the sort by calling sort()
                all_tax_rep_lines = tax.invoice_repartition_line_ids.sorted() + tax.refund_repartition_line_ids.sorted()
                all_template_rep_lines = template.invoice_repartition_line_ids + template.refund_repartition_line_ids
                for i in range(0, len(all_template_rep_lines)):
                    # We assume template and tax repartition lines are in the same order
                    template_account = all_template_rep_lines[i].account_id
                    if template_account:
                        todo_dict['account.tax.repartition.line'][all_tax_rep_lines[i]] = {
                            'account_id': template_account,
                        }

        if any(template.tax_exigibility == 'on_payment' for template in self):
            # When a CoA is being installed automatically and if it is creating account tax(es) whose field `Use Cash Basis`(tax_exigibility) is set to True by default
            # (example of such CoA's are l10n_fr and l10n_mx) then in the `Accounting Settings` the option `Cash Basis` should be checked by default.
            company.tax_exigibility = True

        return {
            'tax_template_to_tax': tax_template_to_tax,
            'account_dict': todo_dict
        }

# Tax Repartition Line Template


class AccountTaxRepartitionLineTemplate(models.Model):
    _name = "account.tax.repartition.line.template"
    _description = "Tax Repartition Line Template"

    factor_percent = fields.Float(
        string="%",
        required=True,
        default=100,
        help="Factor to apply on the account move lines generated from this distribution line, in percents",
    )
    repartition_type = fields.Selection(string="Based On", selection=[('base', 'Base'), ('tax', 'of tax')], required=True, default='tax', help="Base on which the factor will be applied.")
    account_id = fields.Many2one(string="Account", comodel_name='account.account.template', help="Account on which to post the tax amount")
    invoice_tax_id = fields.Many2one(comodel_name='account.tax.template', help="The tax set to apply this distribution on invoices. Mutually exclusive with refund_tax_id")
    refund_tax_id = fields.Many2one(comodel_name='account.tax.template', help="The tax set to apply this distribution on refund invoices. Mutually exclusive with invoice_tax_id")
    tag_ids = fields.Many2many(string="Financial Tags", relation='account_tax_repartition_financial_tags', comodel_name='account.account.tag', copy=True, help="Additional tags that will be assigned by this repartition line for use in domains")
    use_in_tax_closing = fields.Boolean(string="Tax Closing Entry")


    # These last two fields are helpers used to ease the declaration of account.account.tag objects in XML.
    # They are directly linked to account.tax.report.expression objects, which create corresponding + and - tags
    # at creation. This way, we avoid declaring + and - separately every time.
    plus_report_expression_ids = fields.Many2many(string="Plus Tax Report Expressions", relation='account_tax_rep_template_plus', comodel_name='account.report.expression', copy=True, help="Tax report expressions whose '+' tag will be assigned to move lines by this repartition line")
    minus_report_expression_ids = fields.Many2many(string="Minus Report Expressions", relation='account_tax_rep_template_minus', comodel_name='account.report.expression', copy=True, help="Tax report expressions whose '-' tag will be assigned to move lines by this repartition line")

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('use_in_tax_closing') is None:
                vals['use_in_tax_closing'] = False
                if vals.get('account_id'):
                    account_type = self.env['account.account.template'].browse(vals.get('account_id')).account_type
                    if account_type:
                        vals['use_in_tax_closing'] = not (account_type.startswith('income') or account_type.startswith('expense'))

        return super().create(vals_list)

    @api.constrains('invoice_tax_id', 'refund_tax_id')
    def validate_tax_template_link(self):
        for record in self:
            if record.invoice_tax_id and record.refund_tax_id:
                raise ValidationError(_("Tax distribution line templates should apply to either invoices or refunds, not both at the same time. invoice_tax_id and refund_tax_id should not be set together."))

    @api.constrains('plus_report_expression_ids', 'minus_report_expression_ids')
    def _validate_report_expressions(self):
        for record in self:
            all_engines = set((record.plus_report_expression_ids + record.minus_report_expression_ids).mapped('engine'))
            if all_engines and all_engines != {'tax_tags'}:
                raise ValidationError(_("Only 'tax_tags' expressions can be linked to a tax repartition line template."))

    def get_repartition_line_create_vals(self, company):
        rslt = [Command.clear()]
        for record in self:
            rslt.append(Command.create({
                'factor_percent': record.factor_percent,
                'repartition_type': record.repartition_type,
                'tag_ids': [Command.set(record._get_tags_to_add().ids)],
                'company_id': company.id,
                'use_in_tax_closing': record.use_in_tax_closing
            }))
        return rslt

    def _get_repartition_line_create_vals_complete(self, company):
        """
        This function returns a list of values to create the repartition lines of a tax based on
        one or several account.tax.repartition.line.template. It mimicks the function get_repartition_line_create_vals
        but adds the missing field account_id (account.account)

        Returns a list of (0,0, x) ORM commands to create the repartition lines starting with a (5,0,0)
        command to clear the repartition.
        """
        rslt = self.get_repartition_line_create_vals(company)
        for idx, template_line in zip(range(1, len(rslt)), self):  # ignore first ORM command ( (5, 0, 0) )
            account_id = False
            if template_line.account_id:
                # take the first account.account which code begins with the correct code
                account_id = self.env['account.account'].search([
                    ('code', '=like', template_line.account_id.code + '%'),
                    ('company_id', '=', company.id)
                ], limit=1).id
                if not account_id:
                    _logger.warning("The account with code '%s' was not found but is supposed to be linked to a tax",
                                    template_line.account_id.code)
            rslt[idx][2].update({
                "account_id": account_id,
            })
        return rslt

    def _get_tags_to_add(self):
        self.ensure_one()
        tags_to_add = self.tag_ids

        domains = []
        for sign, report_expressions in (('+', self.plus_report_expression_ids), ('-', self.minus_report_expression_ids)):
            for report_expression in report_expressions:
                country = report_expression.report_line_id.report_id.country_id
                domains.append(self.env['account.account.tag']._get_tax_tags_domain(report_expression.formula, country.id, sign=sign))

        if domains:
            tags_to_add |= self.env['account.account.tag'].with_context(active_test=False).search(osv.expression.OR(domains))

        return tags_to_add

class AccountFiscalPositionTemplate(models.Model):
    _name = 'account.fiscal.position.template'
    _description = 'Template for Fiscal Position'

    sequence = fields.Integer()
    name = fields.Char(string='Fiscal Position Template', required=True)
    chart_template_id = fields.Many2one('account.chart.template', string='Chart Template', required=True)
    account_ids = fields.One2many('account.fiscal.position.account.template', 'position_id', string='Account Mapping')
    tax_ids = fields.One2many('account.fiscal.position.tax.template', 'position_id', string='Tax Mapping')
    note = fields.Text(string='Notes')
    auto_apply = fields.Boolean(string='Detect Automatically', help="Apply automatically this fiscal position.")
    vat_required = fields.Boolean(string='VAT required', help="Apply only if partner has a VAT number.")
    country_id = fields.Many2one('res.country', string='Country',
        help="Apply only if delivery country matches.")
    country_group_id = fields.Many2one('res.country.group', string='Country Group',
        help="Apply only if delivery country matches the group.")
    state_ids = fields.Many2many('res.country.state', string='Federal States')
    zip_from = fields.Char(string='Zip Range From')
    zip_to = fields.Char(string='Zip Range To')


class AccountFiscalPositionTaxTemplate(models.Model):
    _name = 'account.fiscal.position.tax.template'
    _description = 'Tax Mapping Template of Fiscal Position'
    _rec_name = 'position_id'

    position_id = fields.Many2one('account.fiscal.position.template', string='Fiscal Position', required=True, ondelete='cascade')
    tax_src_id = fields.Many2one('account.tax.template', string='Tax Source', required=True)
    tax_dest_id = fields.Many2one('account.tax.template', string='Replacement Tax')


class AccountFiscalPositionAccountTemplate(models.Model):
    _name = 'account.fiscal.position.account.template'
    _description = 'Accounts Mapping Template of Fiscal Position'
    _rec_name = 'position_id'

    position_id = fields.Many2one('account.fiscal.position.template', string='Fiscal Mapping', required=True, ondelete='cascade')
    account_src_id = fields.Many2one('account.account.template', string='Account Source', required=True)
    account_dest_id = fields.Many2one('account.account.template', string='Account Destination', required=True)


class AccountReconcileModelTemplate(models.Model):
    _name = "account.reconcile.model.template"
    _description = 'Reconcile Model Template'

    # Base fields.
    chart_template_id = fields.Many2one('account.chart.template', string='Chart Template', required=True)
    name = fields.Char(string='Button Label', required=True)
    sequence = fields.Integer(required=True, default=10)

    rule_type = fields.Selection(selection=[
        ('writeoff_button', 'Button to generate counterpart entry'),
        ('writeoff_suggestion', 'Rule to suggest counterpart entry'),
        ('invoice_matching', 'Rule to match invoices/bills'),
    ], string='Type', default='writeoff_button', required=True)
    auto_reconcile = fields.Boolean(string='Auto-validate',
        help='Validate the statement line automatically (reconciliation based on your rule).')
    to_check = fields.Boolean(string='To Check', default=False, help='This matching rule is used when the user is not certain of all the information of the counterpart.')
    matching_order = fields.Selection(
        selection=[
            ('old_first', 'Oldest first'),
            ('new_first', 'Newest first'),
        ]
    )

    # ===== Conditions =====
    match_text_location_label = fields.Boolean(
        default=True,
        help="Search in the Statement's Label to find the Invoice/Payment's reference",
    )
    match_text_location_note = fields.Boolean(
        default=False,
        help="Search in the Statement's Note to find the Invoice/Payment's reference",
    )
    match_text_location_reference = fields.Boolean(
        default=False,
        help="Search in the Statement's Reference to find the Invoice/Payment's reference",
    )
    match_journal_ids = fields.Many2many('account.journal', string='Journals Availability',
        domain="[('type', 'in', ('bank', 'cash'))]",
        help='The reconciliation model will only be available from the selected journals.')
    match_nature = fields.Selection(selection=[
        ('amount_received', 'Amount Received'),
        ('amount_paid', 'Amount Paid'),
        ('both', 'Amount Paid/Received')
    ], string='Amount Type', required=True, default='both',
        help='''The reconciliation model will only be applied to the selected transaction type:
        * Amount Received: Only applied when receiving an amount.
        * Amount Paid: Only applied when paying an amount.
        * Amount Paid/Received: Applied in both cases.''')
    match_amount = fields.Selection(selection=[
        ('lower', 'Is Lower Than'),
        ('greater', 'Is Greater Than'),
        ('between', 'Is Between'),
    ], string='Amount Condition',
        help='The reconciliation model will only be applied when the amount being lower than, greater than or between specified amount(s).')
    match_amount_min = fields.Float(string='Amount Min Parameter')
    match_amount_max = fields.Float(string='Amount Max Parameter')
    match_label = fields.Selection(selection=[
        ('contains', 'Contains'),
        ('not_contains', 'Not Contains'),
        ('match_regex', 'Match Regex'),
    ], string='Label', help='''The reconciliation model will only be applied when the label:
        * Contains: The proposition label must contains this string (case insensitive).
        * Not Contains: Negation of "Contains".
        * Match Regex: Define your own regular expression.''')
    match_label_param = fields.Char(string='Label Parameter')
    match_note = fields.Selection(selection=[
        ('contains', 'Contains'),
        ('not_contains', 'Not Contains'),
        ('match_regex', 'Match Regex'),
    ], string='Note', help='''The reconciliation model will only be applied when the note:
        * Contains: The proposition note must contains this string (case insensitive).
        * Not Contains: Negation of "Contains".
        * Match Regex: Define your own regular expression.''')
    match_note_param = fields.Char(string='Note Parameter')
    match_transaction_type = fields.Selection(selection=[
        ('contains', 'Contains'),
        ('not_contains', 'Not Contains'),
        ('match_regex', 'Match Regex'),
    ], string='Transaction Type', help='''The reconciliation model will only be applied when the transaction type:
        * Contains: The proposition transaction type must contains this string (case insensitive).
        * Not Contains: Negation of "Contains".
        * Match Regex: Define your own regular expression.''')
    match_transaction_type_param = fields.Char(string='Transaction Type Parameter')
    match_same_currency = fields.Boolean(string='Same Currency', default=True,
        help='Restrict to propositions having the same currency as the statement line.')
    allow_payment_tolerance = fields.Boolean(
        string="Allow Payment Gap",
        default=True,
        help="Difference accepted in case of underpayment.",
    )
    payment_tolerance_param = fields.Float(
        string="Gap",
        default=0.0,
        help="The sum of total residual amount propositions matches the statement line amount under this amount/percentage.",
    )
    payment_tolerance_type = fields.Selection(
        selection=[('percentage', "in percentage"), ('fixed_amount', "in amount")],
        required=True,
        default='percentage',
        help="The sum of total residual amount propositions and the statement line amount allowed gap type.",
    )
    match_partner = fields.Boolean(string='Partner Is Set',
        help='The reconciliation model will only be applied when a customer/vendor is set.')
    match_partner_ids = fields.Many2many('res.partner', string='Restrict Partners to',
        help='The reconciliation model will only be applied to the selected customers/vendors.')
    match_partner_category_ids = fields.Many2many('res.partner.category', string='Restrict Partner Categories to',
        help='The reconciliation model will only be applied to the selected customer/vendor categories.')

    line_ids = fields.One2many('account.reconcile.model.line.template', 'model_id')
    decimal_separator = fields.Char(help="Every character that is nor a digit nor this separator will be removed from the matching string")


class AccountReconcileModelLineTemplate(models.Model):
    _name = "account.reconcile.model.line.template"
    _description = 'Reconcile Model Line Template'

    model_id = fields.Many2one('account.reconcile.model.template')
    sequence = fields.Integer(required=True, default=10)
    account_id = fields.Many2one('account.account.template', string='Account', ondelete='cascade', domain=[('deprecated', '=', False)])
    label = fields.Char(string='Journal Item Label')
    amount_type = fields.Selection([
        ('fixed', 'Fixed'),
        ('percentage', 'Percentage of balance'),
        ('regex', 'From label'),
    ], required=True, default='percentage')
    amount_string = fields.Char(string="Amount")
    force_tax_included = fields.Boolean(string='Tax Included in Price', help='Force the tax to be managed as a price included tax.')
    tax_ids = fields.Many2many('account.tax.template', string='Taxes', ondelete='restrict')
=======
        langs = langs or [code for code, _name in self.env['res.lang'].get_installed()]
        companies = companies or self.env['res.company'].search([('chart_template', '!=', False)])

        translation_importer = TranslationImporter(self.env.cr, verbose=False)
        for chart_template, chart_companies in groupby(companies, lambda c: c.chart_template):
            template_data = self.env['account.chart.template']._get_chart_template_data(chart_template)
            template_data.pop('template_data', None)
            for mname, data in template_data.items():
                for _xml_id, record in data.items():
                    fnames = {fname.split('@')[0] for fname in record}
                    for lang in langs:
                        for fname in fnames:
                            value = record.get(f"{fname}@{lang}")
                            if not value:  # manage generic locale (i.e. `fr` instead of `fr_BE`)
                                value = record.get(f"{fname}@{lang.split('_')[0]}")
                            if value:
                                for company in chart_companies:
                                    xml_id = f"account.{company.id}_{_xml_id}"
                                    translation_importer.model_translations[mname][fname][xml_id][lang] = value
        translation_importer.save(overwrite=False)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
