/** @odoo-module **/

import legacyEnv from 'web.commonEnv';
import { ComponentAdapter } from 'web.OwlCompatibility';
import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { getWysiwygClass } from 'web_editor.loader';
import { QWebPlugin } from '@web_editor/js/backend/QWebPlugin';
import { TranslationButton } from "@web/views/fields/translation_button";
<<<<<<< HEAD
import { useDynamicPlaceholder } from "@web/views/fields/dynamicplaceholder_hook";
=======
import { useDynamicPlaceholder } from "@web/views/fields/dynamic_placeholder_hook";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
import { QWeb } from 'web.core';
import ajax from 'web.ajax';
import {
    useBus,
    useService,
    useSpellCheck,
} from "@web/core/utils/hooks";
import {
    getAdjacentPreviousSiblings,
    getAdjacentNextSiblings,
    getRangePosition
} from '@web_editor/js/editor/odoo-editor/src/utils/utils';
import { toInline } from 'web_editor.convertInline';
import { loadJS } from '@web/core/assets';
import {
<<<<<<< HEAD
    markup,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    Component,
    useRef,
    useSubEnv,
    useState,
    onWillStart,
    onMounted,
    onWillUpdateProps,
    useEffect,
    onWillUnmount,
} from "@odoo/owl";

export class HtmlFieldWysiwygAdapterComponent extends ComponentAdapter {
    setup() {
        super.setup();
        useSubEnv(legacyEnv);

        let started = false;
        onMounted(() => {
            if (!started) {
                this.props.startWysiwyg(this.widget);
                started = true;
            }
        });
    }

    updateWidget(newProps) {
        const lastValue = String(this.props.widgetArgs[0].value || '');
        const lastRecordInfo = this.props.widgetArgs[0].recordInfo;
        const lastCollaborationChannel = this.props.widgetArgs[0].collaborationChannel;
        const newValue = String(newProps.widgetArgs[0].value || '');
        const newRecordInfo = newProps.widgetArgs[0].recordInfo;
        const newCollaborationChannel = newProps.widgetArgs[0].collaborationChannel;

        if (
            (
                stripHistoryIds(newValue) !== stripHistoryIds(newProps.editingValue) &&
                stripHistoryIds(lastValue) !== stripHistoryIds(newValue)
            ) ||
            !_.isEqual(lastRecordInfo, newRecordInfo) ||
            !_.isEqual(lastCollaborationChannel, newCollaborationChannel))
        {
            this.widget.resetEditor(newValue, newProps.widgetArgs[0]);
            this.env.onWysiwygReset && this.env.onWysiwygReset();
        }
    }
    renderWidget() {}
}

export class HtmlField extends Component {
    setup() {
        this.readonlyElementRef = useRef("readonlyElement");
        this.codeViewRef = useRef("codeView");
        this.iframeRef = useRef("iframe");
        this.codeViewButtonRef = useRef("codeViewButton");

        if (this.props.dynamicPlaceholder) {
            this.dynamicPlaceholder = useDynamicPlaceholder();
        }
        this.rpc = useService("rpc");

        this.onIframeUpdated = this.env.onIframeUpdated || (() => {});

        this.state = useState({
            showCodeView: false,
            iframeVisible: false,
        });

        const { model } = this.props.record;
        useBus(model.bus, "WILL_SAVE_URGENTLY", () =>
            this.commitChanges({ urgent: true })
        );
        useBus(model.bus, "NEED_LOCAL_CHANGES", ({ detail }) =>
            detail.proms.push(this.commitChanges())
        );

        useSpellCheck();

        this._onUpdateIframeId = 'onLoad_' + _.uniqueId('FieldHtml');

        onWillStart(async () => {
            this.Wysiwyg = await this._getWysiwygClass();
            if (this.props.cssReadonlyAssetId) {
                this.cssReadonlyAsset = await ajax.loadAsset(this.props.cssReadonlyAssetId);
            }
            if (this.props.cssEditAssetId || this.props.isInlineStyle) {
                await loadJS('/web_editor/static/lib/html2canvas.js');
                this.cssEditAsset = await ajax.loadAsset(this.props.cssEditAssetId || 'web_editor.assets_edit_html_field');
            }
        });
        this._lastRecordInfo = {
            res_model: this.props.record.resModel,
            res_id: this.props.record.resId,
        };
        onWillUpdateProps((newProps) => {
            if (!newProps.readonly && this.state.iframeVisible) {
                this.state.iframeVisible = false;
            }

            const newRecordInfo = {
                res_model: newProps.record.resModel,
                res_id: newProps.record.resId,
            };
            if (!_.isEqual(this._lastRecordInfo, newRecordInfo)) {
                this.currentEditingValue = undefined;
            }
            this._lastRecordInfo = newRecordInfo;
        });
        useEffect(() => {
            (async () => {
                if (this._qwebPlugin) {
                    this._qwebPlugin.destroy();
                }
                if (this.props.readonly) {
                    if (this.showIframe) {
                        await this._setupReadonlyIframe();
                    } else if (this.readonlyElementRef.el) {
                        this._qwebPlugin = new QWebPlugin();
                        this._qwebPlugin.sanitizeElement(this.readonlyElementRef.el);
                        // Ensure all external links are opened in a new tab.
                        retargetLinks(this.readonlyElementRef.el);

<<<<<<< HEAD
                        const hasReadonlyModifiers = Boolean(this.props.record.isReadonly(this.props.fieldName));
=======
                        const hasReadonlyModifiers = this.props.hasReadonlyModifiers;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                        if (!hasReadonlyModifiers) {
                            const $el = $(this.readonlyElementRef.el);
                            $el.off('.checklistBinding');
                            $el.on('click.checklistBinding', 'ul.o_checklist > li', this._onReadonlyClickChecklist.bind(this));
                            $el.on('click.checklistBinding', '.o_stars .fa-star, .o_stars .fa-star-o', this._onReadonlyClickStar.bind(this));
                        }
                    }
                } else {
                    const codeViewEl = this._getCodeViewEl();
                    if (codeViewEl) {
                        codeViewEl.value = this.props.record.data[this.props.name];
                    }
                }
            })();
        });
        onMounted(() => {
            this.dynamicPlaceholder?.setElementRef(this.wysiwyg);
        });
        onWillUnmount(() => {
            if (this._qwebPlugin) {
                this._qwebPlugin.destroy();
            }
            if (this.resizerHandleObserver) {
                this.resizerHandleObserver.disconnect();
            }
        });
    }

    get isTranslatable() {
        return this.props.record.fields[this.props.name].translate;
    }
    get markupValue () {
        return this.props.record.data[this.props.name];
    }
    get showIframe () {
        return this.props.readonly && this.props.cssReadonlyAssetId;
    }
    get wysiwygOptions() {
        let dynamicPlaceholderOptions = {};
        if (this.props.dynamicPlaceholder) {
            dynamicPlaceholderOptions = {
                // Add the powerbox option to open the Dynamic Placeholder
                // generator.
                powerboxCommands: [
                    {
                        category: this.env._t('Marketing Tools'),
                        name: this.env._t('Dynamic Placeholder'),
                        priority: 10,
                        description: this.env._t('Insert personalized content'),
                        fontawesome: 'fa-magic',
                        callback: () => {
                            this.wysiwygRangePosition = getRangePosition(document.createElement('x'), this.wysiwyg.options.document || document);
<<<<<<< HEAD
                            const baseModel = this.props.record.data.mailing_model_real || this.props.record.data.model;
                            if (baseModel) {
                                // The method openDynamicPlaceholder need to be triggered
                                // after the focus from powerBox prevalidate.
                                setTimeout(async () => {
                                    await this.dynamicPlaceholder.open(
                                        this.wysiwyg.$editable[0],
                                        baseModel,
                                        {
                                            validateCallback: this.onDynamicPlaceholderValidate.bind(this),
                                            closeCallback: this.onDynamicPlaceholderClose.bind(this),
                                            positionCallback: this.positionDynamicPlaceholder.bind(this),
                                        }
                                    );
                                });
                            }
=======
                            this.dynamicPlaceholder.updateModel(this.props.dynamicPlaceholderModelReferenceField);
                            // The method openDynamicPlaceholder need to be triggered
                            // after the focus from powerBox prevalidate.
                            setTimeout(async () => {
                                await this.dynamicPlaceholder.open(
                                    {
                                        validateCallback: this.onDynamicPlaceholderValidate.bind(this),
                                        closeCallback: this.onDynamicPlaceholderClose.bind(this),
                                        positionCallback: this.positionDynamicPlaceholder.bind(this),
                                    }
                                );
                            });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                        },
                    }
                ],
                powerboxFilters: [this._filterPowerBoxCommands.bind(this)],
            }
        }

<<<<<<< HEAD
=======
        const wysiwygOptions = { ...this.props.wysiwygOptions };
        const { sanitize_tags, sanitize } = this.props.record.fields[this.props.name];
        if (sanitize_tags || (sanitize_tags === undefined && sanitize)) {
            wysiwygOptions.allowCommandVideo = false; // Tag-sanitized fields remove videos.
        }

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return {
            value: this.props.record.data[this.props.name],
            autostart: false,
            onAttachmentChange: this._onAttachmentChange.bind(this),
            onWysiwygBlur: this._onWysiwygBlur.bind(this),
<<<<<<< HEAD
            ...this.props.wysiwygOptions,
=======
            ...wysiwygOptions,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            ...dynamicPlaceholderOptions,
            recordInfo: {
                res_model: this.props.record.resModel,
                res_id: this.props.record.resId,
            },
            collaborationChannel: this.props.isCollaborative && {
                collaborationModelName: this.props.record.resModel,
                collaborationFieldName: this.props.name,
                collaborationResId: parseInt(this.props.record.resId),
            },
            mediaModalParams: {
                ...this.props.wysiwygOptions.mediaModalParams,
                res_model: this.props.record.resModel,
                res_id: this.props.record.resId,
            },
            fieldId: this.props.id,
        };
    }
    /**
     * Prevent usage of the dynamic placeholder command inside widgets
     * containing background images ( cover & masonry ).
     *
     * We cannot use dynamic placeholder in block containing background images
     * because the email processing will flatten the text into the background
     * image and this case the dynamic placeholder cannot be dynamic anymore.
     *
     * @param {Array} commands commands available in this wysiwyg
     * @returns {Array} commands which can be used after the filter was applied
     */
    _filterPowerBoxCommands(commands) {
        let selectionIsInForbidenSnippet = false;
        if (this.wysiwyg && this.wysiwyg.odooEditor) {
            const selection = this.wysiwyg.odooEditor.document.getSelection();
            selectionIsInForbidenSnippet = this.wysiwyg.closestElement(
                selection.anchorNode,
                'div[data-snippet="s_cover"], div[data-snippet="s_masonry_block"]'
            );
        }
        return selectionIsInForbidenSnippet ? commands.filter((o) => o.title !== "Dynamic Placeholder") : commands;
    }
    get translationButtonWrapperStyle() {
        return `
            font-size: 15px;
            position: absolute;
            right: ${this.props.codeview ? '40px' : '5px'};
            top: 5px;
        `;
    }

    getEditingValue () {
        const codeViewEl = this._getCodeViewEl();
        if (codeViewEl) {
            return codeViewEl.value;
        } else {
            if (this.wysiwyg) {
                return this.wysiwyg.getValue();
            } else {
                return null;
            }
        }
    }
    async updateValue() {
        const value = this.getEditingValue();
<<<<<<< HEAD
        const lastValue = (this.props.value || "").toString();
=======
        const lastValue = (this.props.record.data[this.props.name] || "").toString();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (
            value !== null &&
            !(!lastValue && stripHistoryIds(value) === "<p><br></p>") &&
            stripHistoryIds(value) !== stripHistoryIds(lastValue)
        ) {
<<<<<<< HEAD
            this.props.setDirty(false);
            this.currentEditingValue = value;
            await this.props.update(value);
=======
            this.props.record.model.bus.trigger("FIELD_IS_DIRTY", false);
            this.currentEditingValue = value;
            await this.props.record.update({ [this.props.name]: value });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    }
    async startWysiwyg(wysiwyg) {
        this.wysiwyg = wysiwyg;
        await this.wysiwyg.startEdition();

        if (this.props.codeview) {
            const $codeviewButtonToolbar = $(`
                <div id="codeview-btn-group" class="btn-group">
                    <button class="o_codeview_btn btn btn-primary">
                        <i class="fa fa-code"></i>
                    </button>
                </div>
            `);
            this.wysiwyg.toolbar.$el.append($codeviewButtonToolbar);
            $codeviewButtonToolbar.click(this.toggleCodeView.bind(this));
        }
        this.wysiwyg.odooEditor.editable.addEventListener("input", () =>
<<<<<<< HEAD
            this.props.setDirty(this._isDirty())
=======
            this.props.record.model.bus.trigger("FIELD_IS_DIRTY", this._isDirty())
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        );

        this.isRendered = true;
    }
    /**
     * Toggle the code view and update the UI.
     *
     * @param {JQuery} $codeview
     */
    toggleCodeView() {
        this.state.showCodeView = !this.state.showCodeView;

        this.wysiwyg.odooEditor.observerUnactive('toggleCodeView');
        if (this.state.showCodeView) {
            this.wysiwyg.odooEditor.toolbarHide();
            const value = this.wysiwyg.getValue();
            this.props.record.update({ [this.props.name]: value });
        } else {
            this.wysiwyg.odooEditor.observerActive('toggleCodeView');
            const $codeview = $(this.codeViewRef.el);
            const value = $codeview.val();
            this.props.record.update({ [this.props.name]: value });

        }
    }
    onDynamicPlaceholderValidate(chain, defaultValue) {
        if (chain) {
            let dynamicPlaceholder = "object." + chain.join('.');
            dynamicPlaceholder += defaultValue && defaultValue !== '' ? ` or '''${defaultValue}'''` : '';
            const t = document.createElement('T');
            t.setAttribute('t-out', dynamicPlaceholder);
            this.wysiwyg.odooEditor.execCommand('insert', t);
        }
    }
    onDynamicPlaceholderClose() {
        this.wysiwyg.focus();
    }

    /**
     * @param {HTMLElement} popover
     * @param {Object} position
     */
    positionDynamicPlaceholder(popover, position) {
        let topPosition = this.wysiwygRangePosition.top;
        // Offset the popover to ensure the arrow is pointing at
        // the precise range location.
        let leftPosition = this.wysiwygRangePosition.left - 14;

        // Apply the position back to the element.
        popover.style.top = topPosition + 'px';
        popover.style.left = leftPosition + 'px';
    }
    async commitChanges({ urgent } = {}) {
        if (this._isDirty() || urgent) {
            if (urgent) {
                await this.updateValue();
            }
            if (this.wysiwyg) {
                // Avoid listening to changes made during the _toInline process.
                this.wysiwyg.odooEditor.observerUnactive('commitChanges');
<<<<<<< HEAD
                await this.wysiwyg.saveModifiedImages();
=======
                await this.wysiwyg.savePendingImages();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                if (this.props.isInlineStyle) {
                    await this._toInline();
                }
                this.wysiwyg.odooEditor.observerActive('commitChanges');
            }
            if (owl.status(this) !== 'destroyed') {
                await this.updateValue();
            }
        }
    }
    _isDirty() {
<<<<<<< HEAD
        const strippedPropValue = stripHistoryIds(String(this.props.value));
=======
        const strippedPropValue = stripHistoryIds(String(this.props.record.data[this.props.name]));
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        const strippedEditingValue = stripHistoryIds(this.getEditingValue());
        return !this.props.readonly && strippedPropValue !== strippedEditingValue;
    }
    _getCodeViewEl() {
        return this.state.showCodeView && this.codeViewRef.el;
    }
    async _setupReadonlyIframe() {
        const iframeTarget = this.iframeRef.el.contentDocument.querySelector('#iframe_target');
        if (this.iframePromise && iframeTarget) {
            if (iframeTarget.innerHTML !== this.props.record.data[this.props.name]) {
                iframeTarget.innerHTML = this.props.record.data[this.props.name];
            }
            return this.iframePromise;
        }
        this.iframePromise = new Promise((resolve) => {
            let value = this.props.record.data[this.props.name];
            if (this.props.wrapper) {
                value = this._wrap(value);
            }

            // this bug only appears on some computers with some chrome version.
            let avoidDoubleLoad = 0;

            // inject content in iframe
            window.top[this._onUpdateIframeId] = (_avoidDoubleLoad) => {
                if (_avoidDoubleLoad !== avoidDoubleLoad) {
                    console.warn('Wysiwyg iframe double load detected');
                    return;
                }
                resolve();
                this.state.iframeVisible = true;
                this.onIframeUpdated();
            };

            this.iframeRef.el.addEventListener('load', async () => {
                const _avoidDoubleLoad = ++avoidDoubleLoad;
                const asset = await ajax.loadAsset(this.props.cssReadonlyAssetId);

                if (_avoidDoubleLoad !== avoidDoubleLoad) {
                    console.warn('Wysiwyg immediate iframe double load detected');
                    return;
                }
                const cwindow = this.iframeRef.el.contentWindow;
                try {
                    cwindow.document;
                } catch {
                    return;
                }
                cwindow.document
                    .open("text/html", "replace")
                    .write(
                        '<!DOCTYPE html><html>' +
                        '<head>' +
                            '<meta charset="utf-8"/>' +
                            '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>\n' +
                            '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>\n' +
                        '</head>\n' +
                        '<body class="o_in_iframe o_readonly" style="overflow: hidden;">\n' +
                            '<div id="iframe_target"></div>\n' +
                        '</body>' +
                        '</html>');

                for (const cssLib of asset.cssLibs) {
                    const link = cwindow.document.createElement('link');
                    link.setAttribute('type', 'text/css');
                    link.setAttribute('rel', 'stylesheet');
                    link.setAttribute('href', cssLib);
                    cwindow.document.head.append(link);
                }
                for (const cssContent of asset.cssContents) {
                    const style = cwindow.document.createElement('style');
                    style.setAttribute('type', 'text/css');
                    const textNode = cwindow.document.createTextNode(cssContent);
                    style.append(textNode);
                    cwindow.document.head.append(style);
                }

                const iframeTarget = cwindow.document.querySelector('#iframe_target');
                iframeTarget.innerHTML = value;

                const script = cwindow.document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                const scriptTextNode = document.createTextNode(
                    `if (window.top.${this._onUpdateIframeId}) {` +
                        `window.top.${this._onUpdateIframeId}(${_avoidDoubleLoad})` +
                    `}`
                );
                script.append(scriptTextNode);
                cwindow.document.body.append(script);

                const height = cwindow.document.body.scrollHeight;
                this.iframeRef.el.style.height = Math.max(30, Math.min(height, 500)) + 'px';

                retargetLinks(cwindow.document.body);
            });
            // Force the iframe to call the `load` event. Without this line, the
            // event 'load' might never trigger.
            this.iframeRef.el.after(this.iframeRef.el);

        });
        return this.iframePromise;
    }
    /**
     * Wrap HTML in order to create a custom display.
     *
     * The wrapper (this.props.wrapper) must be a static
     * XML template with content id="wrapper".
     *
     * @private
     * @param {string} html content
     * @returns {string} html content
     */
    _wrap(html) {
        return $(QWeb.render(this.props.wrapper))
            .find('#wrapper').html(html)
            .end().prop('outerHTML');
    }
    /**
     * Move HTML contents out of their wrapper.
     *
     * @private
     * @param {string} html content
     * @returns {string} html content
     */
    _unWrap(html) {
        const $wrapper = $(html).find('#wrapper');
        return $wrapper.length ? $wrapper.html() : html;
    }
    /**
     * Converts CSS dependencies to CSS-independent HTML.
     * - CSS display for attachment link -> real image
     * - Font icons -> images
     * - CSS styles -> inline styles
     *
     * @private
     */
    async _toInline() {
        const $editable = this.wysiwyg.getEditable();
        const html = this.wysiwyg.getValue();
        const $odooEditor = $editable.closest('.odoo-editor-editable');
        // Save correct nodes references.
        const originalContents = document.createDocumentFragment();
        originalContents.append(...$editable[0].childNodes);
        // Remove temporarily the class so that css editing will not be converted.
        $odooEditor.removeClass('odoo-editor-editable');
        $editable.html(html);

        await toInline($editable, this.cssRules, this.wysiwyg.$iframe);
        $odooEditor.addClass('odoo-editor-editable');

        $editable[0].replaceChildren(...originalContents.childNodes);
    }
    async _getWysiwygClass() {
        return getWysiwygClass();
    }
    _onAttachmentChange(attachment) {
        // This only needs to happen for the composer for now
        if (!(this.props.record.fieldNames.includes('attachment_ids') && this.props.record.resModel === 'mail.compose.message')) {
            return;
        }
        this.props.record.update(_.object(['attachment_ids'], [{
            operation: 'ADD_M2M',
            ids: attachment
        }]));
    }
    _onWysiwygBlur() {
        this.commitChanges();
    }
    async _onReadonlyClickChecklist(ev) {
        if (ev.offsetX > 0) {
            return;
        }
        ev.stopPropagation();
        ev.preventDefault();
        const checked = $(ev.target).hasClass('o_checked');
        let checklistId = $(ev.target).attr('id');
        checklistId = checklistId && checklistId.replace('checkId-', '');
        checklistId = parseInt(checklistId || '0');

        const value = await this.rpc('/web_editor/checklist', {
            res_model: this.props.record.resModel,
            res_id: this.props.record.resId,
            filename: this.props.name,
            checklistId: checklistId,
            checked: !checked,
        });
        if (value) {
            this.props.record.update({ [this.props.name]: value });
        }
    }
    async _onReadonlyClickStar(ev) {
        ev.stopPropagation();
        ev.preventDefault();

        const node = ev.target;
        const previousStars = getAdjacentPreviousSiblings(node, sib => (
            sib.nodeType === Node.ELEMENT_NODE && sib.className.includes('fa-star')
        ));
        const nextStars = getAdjacentNextSiblings(node, sib => (
            sib.nodeType === Node.ELEMENT_NODE && sib.classList.contains('fa-star')
        ));
        const shouldToggleOff = node.classList.contains('fa-star') && !nextStars.length;
        const rating = shouldToggleOff ? 0 : previousStars.length + 1;

        let starsId = $(node).parent().attr('id');
        starsId = starsId && starsId.replace('checkId-', '');
        starsId = parseInt(starsId || '0');
        const value = await this.rpc('/web_editor/stars', {
            res_model: this.props.record.resModel,
            res_id: this.props.record.resId,
            filename: this.props.name,
            starsId,
            rating,
        });
        if (value) {
            this.props.record.update({ [this.props.name]: value });
        }
    }
}

HtmlField.template = "web_editor.HtmlField";
HtmlField.components = {
    TranslationButton,
    HtmlFieldWysiwygAdapterComponent,
};
<<<<<<< HEAD
HtmlField.defaultProps = {
    dynamicPlaceholder: false,
    setDirty: () => {},
};
=======
HtmlField.defaultProps = { dynamicPlaceholder: false };
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
HtmlField.props = {
    ...standardFieldProps,
    placeholder: { type: String, optional: true },
    codeview: { type: Boolean, optional: true },
    isCollaborative: { type: Boolean, optional: true },
    dynamicPlaceholder: { type: Boolean, optional: true, default: false },
<<<<<<< HEAD
=======
    dynamicPlaceholderModelReferenceField: { type: String, optional: true },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    cssReadonlyAssetId: { type: String, optional: true },
    cssEditAssetId: { type: String, optional: true },
    isInlineStyle: { type: Boolean, optional: true },
    wrapper: { type: String, optional: true },
    wysiwygOptions: { type: Object },
    hasReadonlyModifiers: { type: Boolean, optional: true },
};

<<<<<<< HEAD
HtmlField.displayName = _lt("Html");
HtmlField.supportedTypes = ["html"];

HtmlField.extractProps = ({ attrs, field }) => {
    const wysiwygOptions = {
        placeholder: attrs.placeholder,
        noAttachment: attrs.options['no-attachment'],
        inIframe: Boolean(attrs.options.cssEdit),
        iframeCssAssets: attrs.options.cssEdit,
        iframeHtmlClass: attrs.iframeHtmlClass,
        snippets: attrs.options.snippets,
        mediaModalParams: {
            noVideos: 'noVideos' in attrs.options ? attrs.options.noVideos : true,
            useMediaLibrary: true,
        },
        linkForceNewWindow: true,
        tabsize: 0,
        height: attrs.options.height,
        minHeight: attrs.options.minHeight,
        maxHeight: attrs.options.maxHeight,
        resizable: 'resizable' in attrs.options ? attrs.options.resizable : false,
        editorPlugins: [QWebPlugin],
    };
    if ('collaborative' in attrs.options) {
        wysiwygOptions.collaborative = attrs.options.collaborative;
    }
    if ('allowCommandImage' in attrs.options) {
        // Set the option only if it is explicitly set in the view so a default
        // can be set elsewhere otherwise.
        wysiwygOptions.allowCommandImage = Boolean(attrs.options.allowCommandImage);
    }
    if (field.sanitize_tags || (field.sanitize_tags === undefined && field.sanitize)) {
        wysiwygOptions.allowCommandVideo = false; // Tag-sanitized fields remove videos.
    } else if ('allowCommandVideo' in attrs.options) {
        // Set the option only if it is explicitly set in the view so a default
        // can be set elsewhere otherwise.
        wysiwygOptions.allowCommandVideo = Boolean(attrs.options.allowCommandVideo);
    }
    return {
        isTranslatable: field.translate,
        fieldName: field.name,
        codeview: Boolean(odoo.debug && attrs.options.codeview),
        placeholder: attrs.placeholder,

        isCollaborative: attrs.options.collaborative,
        cssReadonlyAssetId: attrs.options.cssReadonly,
        dynamicPlaceholder: attrs.options.dynamic_placeholder,
        cssEditAssetId: attrs.options.cssEdit,
        isInlineStyle: attrs.options['style-inline'],
        wrapper: attrs.options.wrapper,

        wysiwygOptions,
    };
=======
export const htmlField = {
    component: HtmlField,
    displayName: _lt("Html"),
    supportedTypes: ["html"],
    extractProps({ attrs, options }, dynamicInfo) {
        const wysiwygOptions = {
            placeholder: attrs.placeholder,
            noAttachment: options['no-attachment'],
            inIframe: Boolean(options.cssEdit),
            iframeCssAssets: options.cssEdit,
            iframeHtmlClass: attrs.iframeHtmlClass,
            snippets: options.snippets,
            mediaModalParams: {
                noVideos: 'noVideos' in options ? options.noVideos : true,
                useMediaLibrary: true,
            },
            linkForceNewWindow: true,
            tabsize: 0,
            height: options.height,
            minHeight: options.minHeight,
            maxHeight: options.maxHeight,
            resizable: 'resizable' in options ? options.resizable : false,
            editorPlugins: [QWebPlugin],
        };
        if ('collaborative' in options) {
            wysiwygOptions.collaborative = options.collaborative;
        }
        if ('allowCommandImage' in options) {
            // Set the option only if it is explicitly set in the view so a default
            // can be set elsewhere otherwise.
            wysiwygOptions.allowCommandImage = Boolean(options.allowCommandImage);
        }
        if ('allowCommandVideo' in options) {
            // Set the option only if it is explicitly set in the view so a default
            // can be set elsewhere otherwise.
            wysiwygOptions.allowCommandVideo = Boolean(options.allowCommandVideo);
        }
        return {
            codeview: Boolean(odoo.debug && options.codeview),
            placeholder: attrs.placeholder,

            isCollaborative: options.collaborative,
            cssReadonlyAssetId: options.cssReadonly,
            dynamicPlaceholder: options?.dynamic_placeholder || false,
            dynamicPlaceholderModelReferenceField: options?.dynamic_placeholder_model_reference_field || "",
            cssEditAssetId: options.cssEdit,
            isInlineStyle: options['style-inline'],
            wrapper: options.wrapper,

            wysiwygOptions,
            hasReadonlyModifiers: dynamicInfo.readonly,
        };
    },
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
};

registry.category("fields").add("html", htmlField, { force: true });

function stripHistoryIds(value) {
    return value && value.replace(/\sdata-last-history-steps="[^"]*?"/, '') || value;
}

function stripHistoryIds(value) {
    return value && value.replace(/\sdata-last-history-steps="[^"]*?"/, '') || value;
}

// Ensure all external links are opened in a new tab.
const retargetLinks = (container) => {
    for (const externalLink of container.querySelectorAll(`a:not([href^="${location.origin}"]):not([href^="/"])`)) {
        externalLink.setAttribute('target', '_blank');
        externalLink.setAttribute('rel', 'noreferrer');
    }
}
