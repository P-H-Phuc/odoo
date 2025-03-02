odoo.define('website.s_popup', function (require) {
'use strict';

const config = require('web.config');
const publicWidget = require('web.public.widget');
const {getCookie, setCookie} = require('web.utils.cookies');

// TODO In master, export this class too or merge it with PopupWidget
const SharedPopupWidget = publicWidget.Widget.extend({
    selector: '.s_popup',
    disabledInEditableMode: false,
    events: {
        // A popup element is composed of a `.s_popup` parent containing the
        // actual `.modal` BS modal. Our internal logic and events are hiding
        // and showing this inner `.modal` modal element without considering its
        // `.s_popup` parent. It means that when the `.modal` is hidden, its
        // `.s_popup` parent is not touched and kept visible.
        // It might look like it's not an issue as it would just be an empty
        // element (its only child is hidden) but it leads to some issues as for
        // instance on chrome this div will have a forced `height` due to its
        // `contenteditable=true` attribute in edit mode. It will result in a
        // ugly white bar.
        // tl;dr: this is keeping those 2 elements visibility synchronized.
        'show.bs.modal': '_onModalShow',
        'hidden.bs.modal': '_onModalHidden',
    },

    /**
     * @override
     */
    destroy() {
        this._super(...arguments);

<<<<<<< HEAD
        if (!this._isNormalCase()) {
            return;
        }

=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        // Popup are always closed when entering edit mode (see PopupWidget),
        // this allows to make sure the class is sync on the .s_popup parent
        // after that moment too.
        if (!this.editableMode) {
            this.el.classList.add('d-none');
        }
    },

    //--------------------------------------------------------------------------
<<<<<<< HEAD
    // Private
    //--------------------------------------------------------------------------

    /**
     * This whole widget was added as a stable fix, this function allows to
     * be a bit more stable friendly. TODO remove in master.
     */
    _isNormalCase() {
        return this.el.children.length === 1
            && this.el.firstElementChild.classList.contains('modal');
    },

    //--------------------------------------------------------------------------
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     */
    _onModalShow() {
<<<<<<< HEAD
        if (!this._isNormalCase()) {
            return;
        }
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.el.classList.remove('d-none');
    },
    /**
     * @private
     */
    _onModalHidden() {
<<<<<<< HEAD
        if (!this._isNormalCase()) {
            return;
        }
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        this.el.classList.add('d-none');
    },
});

publicWidget.registry.SharedPopup = SharedPopupWidget;

const PopupWidget = publicWidget.Widget.extend({
    selector: '.s_popup',
    events: {
        'click .js_close_popup': '_onCloseClick',
        'hide.bs.modal': '_onHideModal',
        'show.bs.modal': '_onShowModal',
    },
    cookieValue: true,

    /**
     * @override
     */
    start: function () {
        this._popupAlreadyShown = !!getCookie(this.$el.attr('id'));
        if (!this._popupAlreadyShown) {
            this._bindPopup();
        }
        return this._super(...arguments);
    },
    /**
     * @override
     */
    destroy: function () {
        this._super.apply(this, arguments);
        $(document).off('mouseleave.open_popup');
        this.$el.find('.modal').modal('hide');
        clearTimeout(this.timeout);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * @private
     */
    _bindPopup: function () {
        const $main = this.$el.find('.modal');

        let display = $main.data('display');
        let delay = $main.data('showAfter');

        if (config.device.isMobile) {
            if (display === 'mouseExit') {
                display = 'afterDelay';
                delay = 5000;
            }
        }

        if (display === 'afterDelay') {
            this.timeout = setTimeout(() => this._showPopup(), delay);
        } else {
            $(document).on('mouseleave.open_popup', () => this._showPopup());
        }
    },
    /**
     * @private
     */
    _canShowPopup() {
        return true;
    },
    /**
     * @private
     */
    _hidePopup: function () {
        this.$el.find('.modal').modal('hide');
    },
    /**
     * @private
     */
    _showPopup: function () {
        if (this._popupAlreadyShown || !this._canShowPopup()) {
            return;
        }
        this.$el.find('.modal').modal('show');
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     */
    _onCloseClick: function () {
        this._hidePopup();
    },
    /**
     * @private
     */
    _onHideModal: function () {
        const nbDays = this.$el.find('.modal').data('consentsDuration');
        setCookie(this.el.id, this.cookieValue, nbDays * 24 * 60 * 60, 'required');
        this._popupAlreadyShown = true;

        this.$el.find('.media_iframe_video iframe').each((i, iframe) => {
            iframe.src = '';
        });
    },
    /**
     * @private
     */
    _onShowModal() {
        this.el.querySelectorAll('.media_iframe_video').forEach(media => {
            const iframe = media.querySelector('iframe');
            iframe.src = media.dataset.oeExpression || media.dataset.src; // TODO still oeExpression to remove someday
        });
    },
});

publicWidget.registry.popup = PopupWidget;

// Extending the popup widget with cookiebar functionality.
// This allows for refusing optional cookies for now and can be
// extended to picking which cookies categories are accepted.
publicWidget.registry.cookies_bar = PopupWidget.extend({
    selector: '#website_cookies_bar',
    events: Object.assign({}, PopupWidget.prototype.events, {
        'click #cookies-consent-essential, #cookies-consent-all': '_onAcceptClick',
    }),

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param ev
     */
    _onAcceptClick(ev) {
        this.cookieValue = `{"required": true, "optional": ${ev.target.id === 'cookies-consent-all'}}`;
        this._onHideModal();
    },
});

return PopupWidget;
});
