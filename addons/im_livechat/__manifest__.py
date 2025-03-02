# -*- coding: utf-8 -*-
{
    'name': 'Live Chat',
    'version': '1.0',
    'sequence': 210,
    'summary': 'Chat with your website visitors',
    'category': 'Website/Live Chat',
    'website': 'https://www.odoo.com/app/live-chat',
    'description':
        """
Live Chat Support
==========================

Allow to drop instant messaging widgets on any web page that will communicate
with the current server and dispatch visitors request amongst several live
chat operators.
Help your customers with this chat, and analyse their feedback.

        """,
    'data': [
        "security/im_livechat_channel_security.xml",
        "security/ir.model.access.csv",
        "data/mail_shortcode_data.xml",
        "data/mail_templates.xml",
        "data/im_livechat_channel_data.xml",
        "data/im_livechat_chatbot_data.xml",
        'data/digest_data.xml',
        'views/chatbot_script_answer_views.xml',
        'views/chatbot_script_step_views.xml',
        'views/chatbot_script_views.xml',
        "views/rating_rating_views.xml",
        "views/mail_channel_views.xml",
        "views/im_livechat_channel_views.xml",
        "views/im_livechat_channel_templates.xml",
        "views/im_livechat_chatbot_templates.xml",
        "views/res_users_views.xml",
        "views/digest_views.xml",
        "report/im_livechat_report_channel_views.xml",
        "report/im_livechat_report_operator_views.xml"
    ],
    'demo': [
        "data/im_livechat_channel_demo.xml",
        'data/mail_shortcode_demo.xml',
    ],
    'depends': ["mail", "rating", "digest", "utm"],
    'installable': True,
    'application': True,
    'assets': {
        'web._assets_primary_variables': [
            'im_livechat/static/src/primary_variables.scss',
        ],
        'web.assets_frontend': [
            ('include', 'im_livechat.assets_public_livechat'),
            'im_livechat/static/src/public/main.js',
            'im_livechat/static/src/services/*.js',
            'im_livechat/static/src/legacy/public_livechat_chatbot.js',
            'im_livechat/static/src/legacy/public_livechat.scss',
            'im_livechat/static/src/legacy/public_livechat_chatbot.scss',
<<<<<<< HEAD
            'mail/static/src/utils/*.js',
            'mail/static/src/js/utils.js',
            'mail/static/src/component_hooks/*.js',
            'mail/static/src/services/messaging_service.js',
=======
            'im_livechat/static/src/legacy/utils/*.js',
            'mail/static/src/js/utils.js',
            'im_livechat/static/src/legacy/component_hooks/*.js',
            'im_livechat/static/src/legacy/services/messaging_service.js',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
        'web.assets_backend': [
            'im_livechat/static/src/js/colors_reset_button/*',
            'im_livechat/static/src/js/im_livechat_chatbot_steps_one2many.js',
            'im_livechat/static/src/js/im_livechat_chatbot_script_answers_m2m.js',
<<<<<<< HEAD
            'im_livechat/static/src/components/*/*.js',
=======
            'im_livechat/static/src/chat_window/**/*',
            'im_livechat/static/src/composer/**/*',
            'im_livechat/static/src/core/**/*',
            'im_livechat/static/src/discuss/**/*',
            'im_livechat/static/src/messaging_menu/**/*',
            'im_livechat/static/src/web/**/*',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            'im_livechat/static/src/scss/im_livechat_history.scss',
            'im_livechat/static/src/scss/im_livechat_form.scss',
        ],
        'web.tests_assets': [
            'im_livechat/static/tests/helpers/**/*.js',
        ],
        'web.qunit_suite_tests': [
<<<<<<< HEAD
            'im_livechat/static/tests/qunit_suite_tests/components/**/*.js',
=======
            'im_livechat/static/tests/**/*',
            ('remove', 'im_livechat/static/tests/tours/**/*'),
            ('remove', 'im_livechat/static/tests/helpers/**/*.js'),
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
        'web.assets_tests': [
            'im_livechat/static/tests/tours/**/*',
        ],
<<<<<<< HEAD
        'mail.assets_messaging': [
            'im_livechat/static/src/models/*.js',
        ],
        'im_livechat.assets_public_livechat': [
            ('include', 'mail.assets_core_messaging'),
            'im_livechat/static/src/legacy/models/*',
            'im_livechat/static/src/legacy/widgets/*',
            'im_livechat/static/src/legacy/widgets/*/*',
            'im_livechat/static/src/public_models/*.js',
=======
        'im_livechat.assets_public_livechat': [
            'im_livechat/static/src/legacy/model.js',
            'im_livechat/static/src/legacy/model/*',
            'im_livechat/static/src/legacy/core_models/*',
            'im_livechat/static/src/livechat_data.js',
            'im_livechat/static/src/legacy/legacy_models/*',
            'im_livechat/static/src/legacy/widgets/*',
            'im_livechat/static/src/legacy/widgets/*/*',
            'im_livechat/static/src/legacy/public_models/*.js',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        ],
        # Bundle of External Librairies of the Livechat (Odoo + required modules)
        'im_livechat.external_lib': [
            # Momentjs
            'web/static/lib/moment/moment.js',
            'web/static/lib/luxon/luxon.js',
            # Odoo minimal lib
            'web/static/lib/underscore/underscore.js',
            'web/static/lib/underscore.string/lib/underscore.string.js',
            # jQuery
            'web/static/lib/jquery/jquery.js',
            'web/static/lib/jquery.ui/jquery-ui.js',
            'web/static/lib/jquery/jquery.browser.js',
            'web/static/lib/jquery.ba-bbq/jquery.ba-bbq.js',
            # Qweb2 lib
            'web/static/lib/qweb/qweb2.js',
            # Odoo JS Framework
            'web/static/src/legacy/js/promise_extension.js',
            'web/static/src/boot.js',
            'web/static/lib/owl/owl.js',
            'web/static/lib/owl/odoo_module.js',
            'web/static/src/owl2_compatibility/*.js',
            'web/static/src/legacy/legacy_component.js',
            'web/static/src/core/browser/browser.js',
            'web/static/src/core/browser/feature_detection.js',
            'web/static/src/core/dialog/dialog.js',
            'web/static/src/core/errors/error_dialogs.js',
            'web/static/src/core/effects/**/*.js',
            'web/static/src/core/hotkeys/hotkey_service.js',
            'web/static/src/core/hotkeys/hotkey_hook.js',
            'web/static/src/core/l10n/dates.js',
            'web/static/src/core/l10n/localization.js',
            'web/static/src/core/l10n/localization_service.js',
            'web/static/src/core/l10n/translation.js',
            'web/static/src/core/main_components_container.js',
            'web/static/src/core/network/rpc_service.js',
            'web/static/src/core/assets.js',
            'web/static/src/core/notifications/notification.js',
            'web/static/src/core/notifications/notification_container.js',
            'web/static/src/core/notifications/notification_service.js',
            'web/static/src/core/registry.js',
            'web/static/src/core/transition.js',
            'web/static/src/core/ui/block_ui.js',
            'web/static/src/core/ui/ui_service.js',
            'web/static/src/core/user_service.js',
            'web/static/src/core/utils/components.js',
            'web/static/src/core/utils/functions.js',
            'web/static/src/core/utils/hooks.js',
            'web/static/src/core/utils/numbers.js',
            'web/static/src/core/utils/strings.js',
            'web/static/src/core/utils/timing.js',
            'web/static/src/core/utils/ui.js',
            'web/static/src/env.js',
            'web/static/src/legacy/utils.js',
            'web/static/src/legacy/js/owl_compatibility.js',
            'web/static/src/legacy/js/libs/download.js',
            'web/static/src/legacy/js/libs/content-disposition.js',
            'web/static/src/legacy/js/libs/pdfjs.js',
            'web/static/src/legacy/js/services/config.js',
            'web/static/src/legacy/js/core/abstract_service.js',
            'web/static/src/legacy/js/core/class.js',
            'web/static/src/legacy/js/core/collections.js',
            'web/static/src/legacy/js/core/translation.js',
            'web/static/src/legacy/js/core/ajax.js',
            'im_livechat/static/src/js/ajax_external.js',
            'web/static/src/legacy/js/core/time.js',
            'web/static/src/legacy/js/core/mixins.js',
            'web/static/src/legacy/js/core/service_mixins.js',
            'web/static/src/legacy/js/core/rpc.js',
            'web/static/src/legacy/js/core/widget.js',
            'web/static/src/legacy/js/core/registry.js',
            'web/static/src/session.js',
            'web/static/src/legacy/js/core/session.js',
            'web/static/src/legacy/js/core/concurrency.js',
            'web/static/src/legacy/js/core/cookie_utils.js',
            'web/static/src/legacy/js/core/utils.js',
            'web/static/src/legacy/js/core/dom.js',
            'web/static/src/legacy/js/core/qweb.js',
            'web/static/src/legacy/js/core/bus.js',
            'web/static/src/legacy/js/services/core.js',
            'web/static/src/legacy/js/core/local_storage.js',
            'web/static/src/legacy/js/core/ram_storage.js',
            'web/static/src/legacy/js/core/abstract_storage_service.js',
            'web/static/src/legacy/js/common_env.js',
            'web/static/src/legacy/js/public/lazyloader.js',
            'web/static/src/legacy/js/public/public_env.js',
            'web/static/src/legacy/js/public/public_root.js',
            'web/static/src/legacy/js/public/public_root_instance.js',
            'web/static/src/legacy/js/public/public_widget.js',
            'web/static/src/legacy/js/services/ajax_service.js',
            'web/static/src/legacy/js/services/local_storage_service.js',
            # Bus, Mail, Livechat
            'bus/static/src/bus_parameters_service.js',
            'bus/static/src/im_status_service.js',
            'bus/static/src/multi_tab_service.js',
            'bus/static/src/services/bus_service.js',
            'bus/static/src/workers/websocket_worker.js',
            'bus/static/src/workers/websocket_worker_utils.js',
            'mail/static/src/js/utils.js',
            'im_livechat/static/src/legacy/public_livechat_chatbot.js',

            ('include', 'web._assets_helpers'),

            'web/static/src/scss/pre_variables.scss',
            'web/static/lib/bootstrap/scss/_variables.scss',
            'im_livechat/static/src/scss/im_livechat_bootstrap.scss',
            'im_livechat/static/src/legacy/public_livechat.scss',
            'im_livechat/static/src/legacy/public_livechat_chatbot.scss',


            'web/static/src/core/utils/transitions.scss',

<<<<<<< HEAD
            'mail/static/src/utils/*.js',
            'mail/static/src/js/emojis.js',
            'mail/static/src/component_hooks/*.js',
            ('include', 'im_livechat.assets_public_livechat'),
            'mail/static/src/services/messaging_service.js',
=======
            'im_livechat/static/src/legacy/utils/*.js',
            'im_livechat/static/src/legacy/component_hooks/*.js',
            ('include', 'im_livechat.assets_public_livechat'),
            'im_livechat/static/src/legacy/services/messaging_service.js',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            # Framework JS
            'bus/static/src/*.js',
            'bus/static/src/services/presence_service.js',
            'web/static/lib/luxon/luxon.js',
            'web/static/src/core/**/*',
            # FIXME: debug menu currently depends on webclient, once it doesn't we don't need to remove the contents of the debug folder
            ('remove', 'web/static/src/core/debug/**/*'),
            'web/static/src/env.js',
            'web/static/src/legacy/js/core/dialog.js',
            'web/static/src/legacy/js/core/owl_dialog.js',
            'web/static/src/legacy/js/core/misc.js',
            'web/static/src/legacy/js/fields/field_utils.js',

            'im_livechat/static/src/public/*.js',
            'im_livechat/static/src/services/*.js',
        ]
    },
    'license': 'LGPL-3',
}
