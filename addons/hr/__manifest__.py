# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Employees',
    'version': '1.1',
    'category': 'Human Resources/Employees',
    'sequence': 95,
    'summary': 'Centralize employee information',
    'website': 'https://www.odoo.com/app/employees',
    'images': [
        'static/src/img/default_image.png',
    ],
    'depends': [
        'base_setup',
        'mail',
        'resource',
        'web',
    ],
    'data': [
        'security/hr_security.xml',
        'security/ir.model.access.csv',
        'wizard/hr_plan_wizard_views.xml',
        'wizard/hr_departure_wizard_views.xml',
        'views/hr_departure_reason_views.xml',
        'views/hr_contract_type_views.xml',
        'views/hr_job_views.xml',
        'views/hr_plan_views.xml',
        'views/hr_employee_category_views.xml',
        'views/hr_employee_public_views.xml',
        'report/hr_employee_badge.xml',
        'views/hr_employee_views.xml',
        'views/hr_department_views.xml',
        'views/hr_work_location_views.xml',
        'views/hr_views.xml',
        'views/res_config_settings_views.xml',
        'views/mail_channel_views.xml',
        'views/res_users.xml',
        'views/res_partner_views.xml',
        'views/hr_templates.xml',
        'data/hr_data.xml',
    ],
    'demo': [
        'data/hr_demo.xml'
    ],
    'installable': True,
    'application': True,
    'post_init_hook': '_install_hr_localization',
    'assets': {
        'web.assets_backend': [
<<<<<<< HEAD
            'hr/static/src/views/**/*.js',
            'hr/static/src/components/**/*',
            'hr/static/src/user_menu/*.js',
            'hr/static/src/scss/*.scss',
            'hr/static/src/js/m2x_avatar_employee.js',
            'hr/static/src/js/standalone_m2o_avatar_employee.js',
            'hr/static/src/js/work_permit_upload.js',
            'hr/static/src/xml/*.xml',
        ],
        'web.qunit_suite_tests': [
            'hr/static/tests/helpers/*.js',
            'hr/static/tests/m2x_avatar_employee_tests.js',
            'hr/static/tests/m2x_avatar_employee_legacy_tests.js',
            'hr/static/tests/standalone_m2o_avatar_employee_tests.js',
        ],
        'web.assets_tests': [
            'hr/static/tests/tours/hr_employee_flow.js',
            'hr/static/tests/tours/user_modify_own_profile_tour.js',
=======
            'hr/static/src/**/*',
        ],
        'web.qunit_suite_tests': [
            'hr/static/tests/**/*',
            ('remove', 'hr/static/tests/tours/**/*'),
        ],
        'web.assets_tests': [
            'hr/static/tests/tours/**/*',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
    },
    'license': 'LGPL-3',
}
