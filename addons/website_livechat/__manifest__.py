# -*- coding: utf-8 -*-
{
    'name': 'Website Live Chat',
    'category': 'Hidden',
    'summary': 'Chat with your website visitors',
    'version': '1.0',
    'description': """
Allow website visitors to chat with the collaborators. This module also brings a feedback tool for the livechat and web pages to display your channel with its ratings on the website.
    """,
    'depends': ['website', 'im_livechat'],
    'installable': True,
    'auto_install': True,
    'data': [
        'views/website_livechat.xml',
        'views/res_config_settings_views.xml',
        'views/im_livechat_chatbot_script_view.xml',
        'views/website_livechat_view.xml',
        'views/website_visitor_views.xml',
        'views/im_livechat_channel_add.xml',
        'security/ir.model.access.csv',
        'security/website_livechat.xml',
        'data/website_livechat_data.xml',
    ],
    'demo': [
        'data/website_livechat_chatbot_demo.xml',
    ],
    'assets': {
        'im_livechat.assets_public_livechat': [
<<<<<<< HEAD
            'website_livechat/static/src/public_models/*.js',
            'website_livechat/static/src/legacy/widgets/*/*',
        ],
        'mail.assets_messaging': [
            'website_livechat/static/src/models/*.js',
        ],
        'mail.assets_discuss_public': [
            'website_livechat/static/src/components/*/*',
=======
            'website_livechat/static/src/legacy/public_models/**/*',
            'website_livechat/static/src/legacy/widgets/**/*',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
        'web.assets_frontend': [
            'website_livechat/static/src/legacy/public_livechat.js',
            'website_livechat/static/src/legacy/public_livechat.scss',
        ],
        'website.assets_wysiwyg': [
            'website_livechat/static/src/scss/**/*',
        ],
        'website.assets_editor': [
            'website_livechat/static/src/js/**/*',
        ],
        'web.assets_backend': [
            'website_livechat/static/src/**/*',
            ('remove', 'website_livechat/static/src/external_lib/**/*'),
            ('remove', 'website_livechat/static/src/legacy/**/*'),
            ('remove', 'website_livechat/static/src/scss/**/*'),
        ],
        'web.assets_tests': [
            'website_livechat/static/tests/tours/**/*',
        ],
        'web.tests_assets': [
            'website_livechat/static/tests/helpers/**/*.js',
        ],
        'web.qunit_suite_tests': [
            'website_livechat/static/tests/**/*',
            ('remove', 'website_livechat/static/tests/tours/**/*'),
            ('remove', 'website_livechat/static/tests/helpers/**/*.js'),
        ],
        'im_livechat.external_lib': [
            'website_livechat/static/src/external_lib/**/*',
            'website_livechat/static/src/legacy/public_livechat.scss',
        ],
        'im_livechat.external_lib': [
            'website_livechat/static/src/external_lib/livechat_button.js',
            'website_livechat/static/src/legacy/public_livechat.scss',
        ],
    },
    'license': 'LGPL-3',
}
