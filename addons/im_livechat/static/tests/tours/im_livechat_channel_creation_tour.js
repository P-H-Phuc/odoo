/** @odoo-module */

<<<<<<< HEAD
import tour from "web_tour.tour";
=======
import { registry } from "@web/core/registry";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const requestChatSteps = [
    {
        trigger: ".o_livechat_button",
        run: "click",
    },
    {
        trigger: ".o_thread_window",
    },
];

<<<<<<< HEAD
tour.register("im_livechat_request_chat", { test: true }, requestChatSteps);

tour.register("im_livechat_request_chat_and_send_message", { test: true }, [
    ...requestChatSteps,
    {
        trigger: ".o_composer_text_field",
        run: "text Hello, I need help please !",
    },
    {
        trigger: '.o_composer_text_field',
        run() {
            $(".o_composer_text_field").trigger($.Event("keydown", { which: 13 }));
        },
    },
    {
        trigger: ".o_thread_message:contains('Hello, I need help')",
    },
]);
=======
registry
    .category("web_tour.tours")
    .add("im_livechat_request_chat", { test: true, steps: requestChatSteps });

registry.category("web_tour.tours").add("im_livechat_request_chat_and_send_message", {
    test: true,
    steps: [
        ...requestChatSteps,
        {
            trigger: ".o_composer_text_field",
            run: "text Hello, I need help please !",
        },
        {
            trigger: ".o_composer_text_field",
            run() {
                $(".o_composer_text_field").trigger($.Event("keydown", { which: 13 }));
            },
        },
        {
            trigger: ".o_thread_message:contains('Hello, I need help')",
        },
    ],
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
