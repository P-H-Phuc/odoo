# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from . import models
from . import report
from . import wizard


def _configure_journals(env):
    # if we already have a coa installed, create journal and set property field
<<<<<<< HEAD
    company_ids = env['res.company'].search([('chart_template_id', '!=', False)])
    todo_list = [
        'property_stock_account_input_categ_id',
        'property_stock_account_output_categ_id',
        'property_stock_valuation_account_id',
    ]
    # Property Stock Accounts
    for company_id in company_ids:
        # Check if property exists for stock account journal exists
        field = env['ir.model.fields']._get("product.category", "property_stock_journal")
        properties = env['ir.property'].sudo().search([
            ('fields_id', '=', field.id),
            ('company_id', '=', company_id.id)])

        # If not, check if you can find a journal that is already there with the same code, otherwise create one
        if not properties:
            journal_id = env['account.journal'].search([
                ('code', '=', 'STJ'),
                ('company_id', '=', company_id.id),
                ('type', '=', 'general')], limit=1).id
            if not journal_id:
                journal_id = env['account.journal'].create({
                    'name': _('Inventory Valuation'),
                    'type': 'general',
                    'code': 'STJ',
                    'company_id': company_id.id,
                    'show_on_dashboard': False
                }).id
            env['ir.property']._set_default(
                'property_stock_journal',
                'product.category',
                journal_id,
                company_id,
            )

        for name in todo_list:
            account = getattr(company_id, name)
            if account:
                env['ir.property']._set_default(
                    name,
                    'product.category',
                    account,
                    company_id,
                )
    for name in todo_list:
        env['ir.property']._set_multi(
            name,
            'product.category',
            {category.id: False for category in env['product.category'].search([])},
            True
        )
=======
    for company in env['res.company'].search([('chart_template', '!=', False)]):
        ChartTemplate = env['account.chart.template'].with_company(company)
        template_code = company.chart_template
        full_data = ChartTemplate._get_chart_template_data(template_code)
        data = {
            'account.journal': ChartTemplate._get_stock_account_journal(template_code),
            'template_data': {
                fname: value
                for fname, value in full_data['template_data'].items()
                if fname in [
                    'property_stock_journal',
                    'property_stock_account_input_categ_id',
                    'property_stock_account_output_categ_id',
                    'property_stock_valuation_account_id',
                ]
            }
        }
        template_data = data.pop('template_data')
        ChartTemplate._load_data(data)
        ChartTemplate._post_load_data(template_code, company, template_data)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
