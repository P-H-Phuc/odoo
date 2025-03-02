/** @odoo-module **/

import { _t } from "web.core";
import { Markup } from "web.utils";
import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add("mail_tour", {
    url: "/web#action=mail.action_discuss",
    sequence: 80,
    steps: [
        {
            trigger: ".o-mail-DiscussCategory-channel .o-mail-DiscussCategory-add",
            content: Markup(
                _t(
                    "<p>Channels make it easy to organize information across different topics and groups.</p> <p>Try to <b>create your first channel</b> (e.g. sales, marketing, product XYZ, after work party, etc).</p>"
                )
            ),
            position: "bottom",
        },
        {
            trigger: ".o-mail-ChannelSelector input",
            content: Markup(_t("<p>Create a channel here.</p>")),
            position: "bottom",
            auto: true,
            run: function (actions) {
                var t = new Date().getTime();
                actions.text("SomeChannel_" + t, this.$anchor);
            },
        },
        {
            trigger: ".o-mail-ChannelSelector-list",
            extra_trigger: ".o-mail-ChannelSelector-suggestion",
            content: Markup(_t("<p>Create a public or private channel.</p>")),
            position: "right",
            run() {
                document.querySelector(".o-mail-ChannelSelector-suggestion").click();
            },
        },
        {
            trigger: ".o-mail-Composer-input",
            content: Markup(
                _t(
                    "<p><b>Write a message</b> to the members of the channel here.</p> <p>You can notify someone with <i>'@'</i> or link another channel with <i>'#'</i>. Start your message with <i>'/'</i> to get the list of possible commands.</p>"
                )
            ),
            position: "top",
            width: 350,
            run: function (actions) {
                var t = new Date().getTime();
                actions.text("SomeText_" + t, this.$anchor);
            },
        },
        {
            trigger: ".o-mail-Composer-send:not(:disabled)",
            content: _t("Post your message on the thread"),
            position: "top",
        },
        {
            trigger: ".o-mail-Message",
            content: _t("Click on your message"),
            position: "top",
        },
        {
            trigger: ".o-mail-Message i[aria-label='Mark as Todo']",
            content: Markup(
                _t("Messages can be <b>starred</b> to remind you to check back later.")
            ),
            position: "bottom",
        },
        {
            trigger: "button:contains(Starred)",
            content: _t(
                "Once a message has been starred, you can come back and review it at any time here."
            ),
            position: "bottom",
        },
        {
            trigger: ".o-mail-DiscussCategory-chat .o-mail-DiscussCategory-add",
            content: Markup(
                _t(
                    "<p><b>Chat with coworkers</b> in real-time using direct messages.</p><p><i>You might need to invite users from the Settings app first.</i></p>"
                )
            ),
            position: "bottom",
        },
    ],
});
