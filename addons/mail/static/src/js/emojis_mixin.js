/** @odoo-module **/

import { escape } from "@web/core/utils/strings";

/**
 * This mixin gathers a few methods that are used to handle emojis.
 *
 * It's currently used to format text and wrap the emojis around <span class="o_mail_emoji"> to make them look nicer
 *
 */
export default {
    //--------------------------------------------------------------------------
<<<<<<< HEAD
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * This method should be bound to a click event on an emoji.
     * (used in text element's emojis dropdown list)
     *
     * It assumes that a ``_getTargetTextElement`` method is defined that will return the related
     * textarea/input element in which the emoji will be inserted.
     *
     * @param {MouseEvent} ev
     */
    onEmojiClick(ev) {
        const unicode = ev.currentTarget.textContent.trim();
        const textInput = this._getTargetTextElement($(ev.currentTarget));
        const selectionStart = textInput.selectionStart;

        textInput.value = textInput.value.slice(0, selectionStart) + unicode + textInput.value.slice(selectionStart);
        textInput.focus();
        textInput.setSelectionRange(selectionStart + unicode.length, selectionStart + unicode.length);
    },

    //--------------------------------------------------------------------------
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    // Private
    //--------------------------------------------------------------------------

    /**
     * Adds a span with a CSS class around chains of emojis in the message for styling purposes.
     * The input is first passed through 'escape' to prevent unwanted injections into the HTML
     *
     * Sequences of emojis are wrapped instead of individual ones to prevent compound emojis
     * such as 👩🏿 = 👩 + 🏿 [dark skin tone character] from being separated.
     *
     * This will only match characters that have a different presentation from normal text, unlike ®
     * For alternatives, see: https://www.unicode.org/reports/tr51/#Emoji_Properties_and_Data_Files
     *
     * @param {String} message a text message to format
     */
    _formatText(message) {
        message = escape(message);
        message = message.replaceAll(/(\p{Emoji_Presentation}+)/ug, "<span class='o_mail_emoji'>$1</span>");
        message = message.replace(/(?:\r\n|\r|\n)/g, "<br>");

        return message;
    },
<<<<<<< HEAD

    /**
     * Will use the mail.emojis library to wrap emojis unicode around a span with a special font
     * that will make them look nicer (colored, ...).
     *
     * @param {String} message
     */
    _wrapEmojis(message) {
        emojis.forEach(function (emoji) {
            message = message.replace(
                new RegExp(emoji.unicode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                '<span class="o_mail_emoji">' + emoji.unicode + '</span>'
            );
        });

        return message;
    }
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
};
