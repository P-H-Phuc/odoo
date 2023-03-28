odoo.define('website.s_dynamic_snippet_carousel', function (require) {
'use strict';

const publicWidget = require('web.public.widget');
const DynamicSnippet = require('website.s_dynamic_snippet');
const config = require('web.config');

const DynamicSnippetCarousel = DynamicSnippet.extend({
    selector: '.s_dynamic_snippet_carousel',
    /**
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.template_key = 'website.s_dynamic_snippet.carousel';
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * @override
     */
    _getQWebRenderOptions: function () {
        return Object.assign(
            this._super.apply(this, arguments),
            {
<<<<<<< HEAD
                interval: parseInt(this.$target[0].dataset.carouselInterval),
                rowPerSlide: parseInt(config.device.isMobile ? 1 : this.$target[0].dataset.rowPerSlide || 1),
                arrowPosition: this.$target[0].dataset.arrowPosition || '',
=======
                interval: parseInt(this.el.dataset.carouselInterval),
                rowPerSlide: parseInt(config.device.isMobile ? 1 : this.el.dataset.rowPerSlide || 1),
                arrowPosition: this.el.dataset.arrowPosition || '',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            },
        );
    },
});
publicWidget.registry.dynamic_snippet_carousel = DynamicSnippetCarousel;

return DynamicSnippetCarousel;
});
