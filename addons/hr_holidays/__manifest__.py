# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Time Off',
    'version': '1.5',
    'category': 'Human Resources/Time Off',
    'sequence': 85,
    'summary': 'Allocate PTOs and follow leaves requests',
    'website': 'https://www.odoo.com/app/time-off',
    'description': """
Manage time off requests and allocations
=====================================

This application controls the time off schedule of your company. It allows employees to request time off. Then, managers can review requests for time off and approve or reject them. This way you can control the overall time off planning for the company or department.

You can configure several kinds of time off (sickness, paid days, ...) and allocate time off to an employee or department quickly using time off allocation. An employee can also make a request for more days off by making a new time off allocation. It will increase the total of available days for that time off type (if the request is accepted).

You can keep track of time off in different ways by following reports:

* Time Off Summary
* Time Off by Department
* Time Off Analysis

A synchronization with an internal agenda (Meetings of the CRM module) is also possible in order to automatically create a meeting when a time off request is accepted by setting up a type of meeting in time off Type.
""",
    'depends': ['hr', 'calendar', 'resource'],
    'data': [
        'data/report_paperformat.xml',
        'data/mail_activity_type_data.xml',
        'data/mail_message_subtype_data.xml',
        'data/hr_holidays_data.xml',
        'data/ir_cron_data.xml',

        'security/hr_holidays_security.xml',
        'security/ir.model.access.csv',

        'views/resource_views.xml',
        'views/hr_leave_views.xml',
        'views/hr_leave_type_views.xml',
        'views/hr_leave_allocation_views.xml',
        'views/hr_leave_accrual_views.xml',
        'views/hr_leave_stress_day_views.xml',
        'views/mail_activity_views.xml',

        'wizard/hr_holidays_cancel_leave_views.xml',
        'wizard/hr_holidays_summary_employees_views.xml',
        'wizard/hr_departure_wizard_views.xml',

        'report/hr_holidays_templates.xml',
        'report/hr_holidays_reports.xml',
        'report/hr_leave_reports.xml',
        'report/hr_leave_report_calendar.xml',
        'report/hr_leave_employee_type_report.xml',

        'views/hr_views.xml',
        'views/hr_holidays_views.xml',
    ],
    'demo': [
        'data/hr_holidays_demo.xml',
    ],
    'installable': True,
    'application': True,
    'assets': {
        'web.assets_backend': [
<<<<<<< HEAD
            'hr_holidays/static/src/views/**/*.js',
            'hr_holidays/static/src/views/**/*.scss',
            'hr_holidays/static/src/views/**/*.xml',
            'hr_holidays/static/src/components/*/*.scss',
            'hr_holidays/static/src/components/*/*.xml',
            'hr_holidays/static/src/dashboard/**/*.js',
            'hr_holidays/static/src/dashboard/**/*.scss',
            'hr_holidays/static/src/dashboard/**/*.xml',
            'hr_holidays/static/src/leave_stats/**/*.js',
            'hr_holidays/static/src/leave_stats/**/*.xml',
            'hr_holidays/static/src/scss/*.scss',
            'hr_holidays/static/src/tours/*.js',
            'hr_holidays/static/src/radio_image_field/*.js',
            'hr_holidays/static/src/radio_image_field/*.xml',

            # Don't include dark mode files in light mode
            ('remove', 'hr_holidays/static/src/views/**/*.dark.scss'),
            ('remove', 'hr_holidays/static/src/dashboard/**/*.dark.scss'),
        ],
        "web.dark_mode_assets_backend": [
            'hr_holidays/static/src/views/**/*.dark.scss',
            'hr_holidays/static/src/dashboard/**/*.dark.scss',
=======
            'hr_holidays/static/src/**/*',
            # Don't include dark mode files in light mode
            ('remove', 'hr_holidays/static/src/**/*.dark.scss'),
        ],
        "web.dark_mode_assets_backend": [
            'hr_holidays/static/src/**/*.dark.scss',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
        'web.tests_assets': [
            'hr_holidays/static/tests/helpers/**/*',
        ],
        'web.qunit_suite_tests': [
            'hr_holidays/static/tests/**/*.js',
            ('remove', 'hr_holidays/static/tests/tours/**/*'),
            ('remove', 'hr_holidays/static/tests/helpers/**/*'),
        ],
        'web.assets_tests': [
            '/hr_holidays/static/tests/tours/**/*'
        ],
        'web.assets_tests': [
            '/hr_holidays/static/tests/tours/**/**.js'
        ],
    },
    'license': 'LGPL-3',
}
