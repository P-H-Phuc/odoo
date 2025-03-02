# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Calendar',
    'version': '1.1',
    'sequence': 165,
    'depends': ['base', 'mail'],
    'summary': "Schedule employees' meetings",
    'description': """
This is a full-featured calendar system.
========================================

It supports:
------------
    - Calendar of events
    - Recurring events

If you need to manage your meetings, you should install the CRM module.
    """,
    'category': 'Productivity/Calendar',
    'demo': [
        'data/calendar_demo.xml'
    ],
    'data': [
        'security/ir.model.access.csv',
        'security/calendar_security.xml',
        'data/calendar_cron.xml',
        'data/mail_template_data.xml',
        'data/calendar_data.xml',
        'data/mail_activity_type_data.xml',
        'data/mail_message_subtype_data.xml',
        'views/mail_activity_views.xml',
        'views/calendar_templates.xml',
        'views/calendar_views.xml',
        'views/res_partner_views.xml',
        'wizard/calendar_provider_config.xml',
        'wizard/calendar_popover_delete_wizard.xml',
    ],
    'installable': True,
    'application': True,
    'assets': {
        'web.assets_backend': [
<<<<<<< HEAD
            'calendar/static/src/scss/calendar.scss',
            'calendar/static/src/js/base_calendar.js',
            'calendar/static/src/js/services/calendar_notification_service.js',
            'calendar/static/src/views/**/*',
            'calendar/static/src/components/*/*.xml',
=======
            'calendar/static/src/**/*',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
        'web.qunit_suite_tests': [
            'calendar/static/tests/**/*',
        ],
        'web.assets_tests': [
<<<<<<< HEAD
            'calendar/static/tests/tours/calendar_tour.js',
=======
            'calendar/static/tests/tours/**/*',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
    },
    'license': 'LGPL-3',
}
