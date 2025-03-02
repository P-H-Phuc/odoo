/** @odoo-module */

import { loadCSS } from "@web/core/assets";
import { useService } from "@web/core/utils/hooks";
import { batched } from "@point_of_sale/js/utils";
import { debounce } from "@web/core/utils/timing";
import { Transition } from "@web/core/transition";
import { MainComponentsContainer } from "@web/core/main_components_container";
import { WithEnv, ErrorHandler } from "@web/core/utils/components";
import { Navbar } from "@point_of_sale/app/navbar/navbar";

// ChromeAdapter imports
import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { registry } from "@web/core/registry";
import { pos_env as env } from "@point_of_sale/js/pos_env";

import { ErrorTracebackPopup } from "./Popups/ErrorTracebackPopup";

import {
    onMounted,
    onWillDestroy,
    useExternalListener,
    useSubEnv,
    reactive,
    onWillUnmount,
    Component,
} from "@odoo/owl";
import { usePos } from "@point_of_sale/app/pos_hook";

/**
 * Chrome is the root component of the PoS App.
 */
export class Chrome extends Component {
    static template = "Chrome"; // FIXME POSREF namespace templates
    static components = { Transition, MainComponentsContainer, WithEnv, ErrorHandler, Navbar };
    setup() {
        this.pos = usePos();
        this.popup = useService("popup");
        // BEGIN ChromeAdapter
        ProductScreen.sortControlButtons();
        const legacyActionManager = useService("legacy_action_manager");

        this.batchedCustomerDisplayRender = batched(() => {
            reactivePos.send_current_order_to_customer_facing_display();
        });
        const reactivePos = reactive(this.pos.globalState, this.batchedCustomerDisplayRender);
        env.pos = reactivePos;
        env.legacyActionManager = legacyActionManager;

        // The proxy requires the instance of PosGlobalState to function properly.
        env.proxy.set_pos(reactivePos);

        // TODO: Should we continue on exposing posmodel as global variable?
        // Expose only the reactive version of `pos` when in debug mode.
        window.posmodel = this.pos.globalState.debug ? reactivePos : this.pos.globalState;

        this.wowlEnv = this.env;
        // FIXME POSREF: make wowl services available in legacy env
        Object.setPrototypeOf(env.services, this.wowlEnv.services);
        this.env = env;
        this.__owl__.childEnv = env;
        useSubEnv({
            get isMobile() {
                return window.innerWidth <= 768;
            },
        });
        let currentIsMobile = this.env.isMobile;
        const updateUI = debounce(() => {
            if (this.env.isMobile !== currentIsMobile) {
                currentIsMobile = this.env.isMobile;
                this.render(true);
            }
        }, 15); // FIXME POSREF use throttleForAnimation?
        useExternalListener(window, "resize", updateUI);
        onWillUnmount(updateUI.cancel);
        // END ChromeAdapter

        super.setup();
        useExternalListener(window, "beforeunload", this._onBeforeUnload);
        useService("number_buffer").activate();

        useSubEnv({
            pos: reactive(
                this.env.pos,
                batched(() => this.render(true)) // FIXME POSREF remove render(true)
            ),
        });

        onMounted(() => {
            // remove default webclient handlers that induce click delay
            // FIXME POSREF if these handlers shouldn't be there we should not load the files that add them.
            $(document).off();
            $(window).off();
            $("html").off();
            $("body").off();
        });

        onWillDestroy(() => {
            try {
                // FIXME POSREF is this needed?
                this.env.pos.destroy();
            } catch {
                // throwing here causes loop
            }
        });

        this.start();
    }

    // GETTERS //

    /**
     * Startup screen can be based on pos config so the startup screen
     * is only determined after pos data is completely loaded.
     *
     * NOTE: Wait for pos data to be completed before calling this getter.
     */
<<<<<<< HEAD
    class Chrome extends PosComponent {
        setup() {
            super.setup();
            useExternalListener(window, 'beforeunload', this._onBeforeUnload);
            useListener('show-main-screen', this.__showScreen);
            useListener('toggle-debug-widget', debounce(this._toggleDebugWidget, 100));
            useListener('toggle-mobile-searchbar', this._toggleMobileSearchBar);
            useListener('show-temp-screen', this.__showTempScreen);
            useListener('close-temp-screen', this.__closeTempScreen);
            useListener('close-pos', this._closePos);
            useListener('loading-skip-callback', () => this.env.proxy.stop_searching());
            useListener('play-sound', this._onPlaySound);
            useListener('set-sync-status', this._onSetSyncStatus);
            useListener('show-notification', this._onShowNotification);
            useListener('close-notification', this._onCloseNotification);
            useListener('connect-to-proxy', this.connect_to_proxy);
            useBus(this.env.posbus, 'start-cash-control', this.openCashControl);
            NumberBuffer.activate();

            this.state = useState({
                uiState: 'LOADING', // 'LOADING' | 'READY' | 'CLOSING'
                debugWidgetIsShown: true,
                mobileSearchBarIsShown: false,
                hasBigScrollBars: false,
                sound: { src: null },
                notification: {
                    isShown: false,
                    message: '',
                    duration: 2000,
                },
                loadingSkipButtonIsShown: false,
            });

            this.mainScreen = useState({ name: null, component: null });
            this.mainScreenProps = {};

            this.tempScreen = useState({ isShown: false, name: null, component: null });
            this.tempScreenProps = {};

            this.progressbar = useRef('progressbar');

            this.previous_touch_y_coordinate = -1;

            const pos = reactive(this.env.pos, batched(() => this.render(true)))
            useSubEnv({ pos });

            onMounted(() => {
                // remove default webclient handlers that induce click delay
                $(document).off();
                $(window).off();
                $('html').off();
                $('body').off();
            });

            onWillDestroy(() => {
                this.env.pos.destroy();
            });

            onError((error) => {
                // error is an OwlError object.
                console.error(error.cause);
            });

            this.props.setupIsDone(this);
        }

        // GETTERS //

        get customerFacingDisplayButtonIsShown() {
            return this.env.pos.config.iface_customer_facing_display;
        }

        /**
         * Used to give the `state.mobileSearchBarIsShown` value to main screen props
         */
        get mainScreenPropsFielded() {
            return Object.assign({}, this.mainScreenProps, {
                mobileSearchBarIsShown: this.state.mobileSearchBarIsShown,
            });
        }

        /**
         * Startup screen can be based on pos config so the startup screen
         * is only determined after pos data is completely loaded.
         *
         * NOTE: Wait for pos data to be completed before calling this getter.
         */
        get startScreen() {
            if (this.state.uiState !== 'READY') {
                console.warn(
                    `Accessing startScreen of Chrome component before 'state.uiState' to be 'READY' is not recommended.`
                );
            }
            return { name: 'ProductScreen' };
        }

        // CONTROL METHODS //

        /**
         * Call this function after the Chrome component is mounted.
         * This will load pos and assign it to the environment.
         */
        async start() {
            try {
                await this.env.pos.load_server_data();
                await this.setupBarcodeParser();
                if(this.env.pos.config.use_proxy){
                    await this.connect_to_proxy();
                }
                // Load the saved `env.pos.toRefundLines` from localStorage when
                // the PosGlobalState is ready.
                Object.assign(this.env.pos.toRefundLines, this.env.pos.db.load('TO_REFUND_LINES') || {});
                this._buildChrome();
                this._closeOtherTabs();
                this.env.pos.selectedCategoryId = this.env.pos.config.start_category && this.env.pos.config.iface_start_categ_id
                    ? this.env.pos.config.iface_start_categ_id[0]
                    : 0;
                this.state.uiState = 'READY';
                this._showStartScreen();
                setTimeout(() => this._runBackgroundTasks());
            } catch (error) {
                let title = 'Unknown Error',
                    body;

                if (error.message && [100, 200, 404, -32098].includes(error.message.code)) {
                    // this is the signature of rpc error
                    if (error.message.code === -32098) {
                        title = 'Network Failure (XmlHttpRequestError)';
                        body =
                            'The Point of Sale could not be loaded due to a network problem.\n' +
                            'Please check your internet connection.';
                    } else if (error.message.code === 200) {
                        title = error.message.data.message || this.env._t('Server Error');
                        body =
                            error.message.data.debug ||
                            this.env._t(
                                'The server encountered an error while receiving your order.'
                            );
                    }
                } else if (error instanceof Error) {
                    title = error.message;
                    if (error.cause) {
                        body = error.cause.message;
                    } else {
                        body = error.stack;
                    }
                }

                await this.showPopup('ErrorTracebackPopup', {
                    title,
                    body,
                    exitButtonIsShown: true,
                });
            }
        }

        _runBackgroundTasks() {
            // push order in the background, no need to await
            this.env.pos.push_orders();
            // Allow using the app even if not all the images are loaded.
            // Basically, preload the images in the background.
            this._preloadImages();
            if (this.env.pos.config.limited_partners_loading && this.env.pos.config.partner_load_background) {
                // Wrap in fresh reactive: none of the reads during loading should subscribe to anything
                reactive(this.env.pos).loadPartnersBackground();
            }
            if (this.env.pos.config.limited_products_loading && this.env.pos.config.product_load_background) {
                // Wrap in fresh reactive: none of the reads during loading should subscribe to anything
                reactive(this.env.pos).loadProductsBackground().then(() => {
                    this.render(true);
                });
            }
        }

        setupBarcodeParser() {
            if (!this.env.pos.company.nomenclature_id) {
                const errorMessage = this.env._t("The barcode nomenclature setting is not configured. " +
                    "Make sure to configure it on your Point of Sale configuration settings");
                throw new Error(this.env._t("Missing barcode nomenclature"), { cause: { message: errorMessage } });

            }
            const barcode_parser = new BarcodeParser({ nomenclature_id: this.env.pos.company.nomenclature_id });
            this.env.barcode_reader.set_barcode_parser(barcode_parser);
            return barcode_parser.is_loaded();
        }

        connect_to_proxy() {
            return new Promise((resolve, reject) => {
                this.env.barcode_reader.disconnect_from_proxy();
                this.state.loadingSkipButtonIsShown = true;
                this.env.proxy.autoconnect({
                    force_ip: this.env.pos.config.proxy_ip || undefined,
                    progress: function(prog){},
                }).then(
                    () => {
                        if (this.env.pos.config.iface_scan_via_proxy) {
                            this.env.barcode_reader.connect_to_proxy();
                        }
                        resolve();
                    },
                    (statusText, url) => {
                        // this should reject so that it can be captured when we wait for pos.ready
                        // in the chrome component.
                        // then, if it got really rejected, we can show the error.
                        if (statusText == 'error' && window.location.protocol == 'https:') {
                            reject({
                                title: this.env._t('HTTPS connection to IoT Box failed'),
                                body: _.str.sprintf(
                                    this.env._t('Make sure you are using IoT Box v18.12 or higher. Navigate to %s to accept the certificate of your IoT Box.'),
                                    url
                                ),
                                popup: 'alert',
                            });
                        } else {
                            resolve();
                        }
                    }
                );
            });
        }

        openCashControl() {
            if (this.shouldShowCashControl()) {
                this.showPopup('CashOpeningPopup');
            }
        }

        shouldShowCashControl() {
            return this.env.pos.config.cash_control && this.env.pos.pos_session.state == 'opening_control';
        }

        // EVENT HANDLERS //

        _showStartScreen() {
            const { name, props } = this.startScreen;
            this.showScreen(name, props);
        }
        _getSavedScreen(order) {
            return order.get_screen_data();
        }
        __showTempScreen(event) {
            const { name, props, resolve } = event.detail;
            this.tempScreen.isShown = true;
            this.tempScreen.name = name;
            this.tempScreen.component = this.constructor.components[name];
            this.tempScreenProps = Object.assign({}, props, { resolve });
        }
        __closeTempScreen() {
            this.tempScreen.isShown = false;
            this.tempScreen.name = null;
        }
        __showScreen({ detail: { name, props = {} } }) {
            const component = this.constructor.components[name];
            // 1. Set the information of the screen to display.
            this.mainScreen.name = name;
            this.mainScreen.component = component;
            this.mainScreenProps = props;

            // 2. Save the screen to the order.
            //  - This screen is shown when the order is selected.
            if (!(component.prototype instanceof IndependentToOrderScreen) && name !== "ReprintReceiptScreen") {
                this._setScreenData(name, props);
            }
        }
        /**
         * Set the latest screen to the current order. This is done so that
         * when the order is selected again, the ui returns to the latest screen
         * saved in the order.
         *
         * @param {string} name Screen name
         * @param {Object} props props for the Screen component
         */
        _setScreenData(name, props) {
            const order = this.env.pos.get_order();
            if (order) {
                order.set_screen_data({ name, props });
            }
        }
        async _closePos() {
            // If pos is not properly loaded, we just go back to /web without
            // doing anything in the order data.
            if (!this.env.pos || this.env.pos.db.get_orders().length === 0) {
                window.location = '/web#action=point_of_sale.action_client_pos_menu';
            }

            if (this.env.pos.db.get_orders().length) {
                // If there are orders in the db left unsynced, we try to sync.
                // If sync successful, close without asking.
                // Otherwise, ask again saying that some orders are not yet synced.
                try {
                    await this.env.pos.push_orders();
                    window.location = '/web#action=point_of_sale.action_client_pos_menu';
                } catch (error) {
                    console.warn(error);
                    const reason = this.env.pos.failed
                        ? this.env._t(
                              'Some orders could not be submitted to ' +
                                  'the server due to configuration errors. ' +
                                  'You can exit the Point of Sale, but do ' +
                                  'not close the session before the issue ' +
                                  'has been resolved.'
                          )
                        : this.env._t(
                              'Some orders could not be submitted to ' +
                                  'the server due to internet connection issues. ' +
                                  'You can exit the Point of Sale, but do ' +
                                  'not close the session before the issue ' +
                                  'has been resolved.'
                          );
                    const { confirmed } = await this.showPopup('ConfirmPopup', {
                        title: this.env._t('Offline Orders'),
                        body: reason,
                    });
                    if (confirmed) {
                        this.state.uiState = 'CLOSING';
                        this.state.loadingSkipButtonIsShown = false;
                        window.location = '/web#action=point_of_sale.action_client_pos_menu';
                    }
                }
            }
        }
        _toggleDebugWidget() {
            this.state.debugWidgetIsShown = !this.state.debugWidgetIsShown;
        }
        _toggleMobileSearchBar({ detail: isSearchBarEnabled }) {
            if (isSearchBarEnabled !== null) {
                this.state.mobileSearchBarIsShown = isSearchBarEnabled;
            } else {
                this.state.mobileSearchBarIsShown = !this.state.mobileSearchBarIsShown;
            }
        }
        _onPlaySound({ detail: name }) {
            let src;
            if (name === 'error') {
                src = "/point_of_sale/static/src/sounds/error.wav";
            } else if (name === 'bell') {
                src = "/point_of_sale/static/src/sounds/bell.wav";
            }
            this.state.sound.src = src;
        }
        _onSetSyncStatus({ detail: { status, pending }}) {
            this.env.pos.synch.status = status;
            this.env.pos.synch.pending = pending;
        }
        _onShowNotification({ detail: { message, duration } }) {
            this.state.notification.isShown = true;
            this.state.notification.message = message;
            this.state.notification.duration = duration;
        }
        _onCloseNotification() {
            this.state.notification.isShown = false;
        }
        /**
         * Save `env.pos.toRefundLines` in localStorage on beforeunload - closing the
         * browser, reloading or going to other page.
         */
        _onBeforeUnload() {
            this.env.pos.db.save('TO_REFUND_LINES', this.env.pos.toRefundLines);
        }

        get isTicketScreenShown() {
            return this.mainScreen.name === 'TicketScreen';
        }

        // MISC METHODS //
        _preloadImages() {
            for (let product of this.env.pos.db.get_product_by_category(0)) {
                const image = new Image();
                image.src = `/web/image?model=product.product&field=image_128&id=${product.id}&unique=${product.__last_update}`;
            }
            for (let category of Object.values(this.env.pos.db.category_by_id)) {
                if (category.id == 0) continue;
                const image = new Image();
                image.src = `/web/image?model=pos.category&field=image_128&id=${category.id}&unique=${category.write_date}`;
            }
            const staticImages = ['backspace.png', 'bc-arrow-big.png'];
            for (let imageName of staticImages) {
                const image = new Image();
                image.src = `/point_of_sale/static/src/img/${imageName}`;
            }
        }

        _buildChrome() {
            if ($.browser.chrome) {
                var chrome_version = $.browser.version.split('.')[0];
                if (parseInt(chrome_version, 10) >= 50) {
                    loadCSS('/point_of_sale/static/src/css/chrome50.css');
                }
            }

            if (this.env.pos.config.iface_big_scrollbars) {
                this.state.hasBigScrollBars = true;
            }

            this._disableBackspaceBack();
        }
        // prevent backspace from performing a 'back' navigation
        _disableBackspaceBack() {
            $(document).on('keydown', function (e) {
                if (e.which === 8 && !$(e.target).is('input, textarea')) {
                    e.preventDefault();
                }
            });
        }
        _closeOtherTabs() {
            localStorage['message'] = '';
            localStorage['message'] = JSON.stringify({
                message: 'close_tabs',
                session: this.env.pos.pos_session.id,
            });

            window.addEventListener(
                'storage',
                (event) => {
                    if (event.key === 'message' && event.newValue) {
                        const msg = JSON.parse(event.newValue);
                        if (
                            msg.message === 'close_tabs' &&
                            msg.session == this.env.pos.pos_session.id
                        ) {
                            console.info(
                                'POS / Session opened in another window. EXITING POS'
                            );
                            this._closePos();
                        }
                    }
                },
                false
=======
    get startScreen() {
        if (this.pos.uiState !== "READY") {
            console.warn(
                `Accessing startScreen of Chrome component before 'pos.uiState' to be 'READY' is not recommended.`
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            );
        }
        return { name: "ProductScreen" };
    }

    // CONTROL METHODS //

    /**
     * Call this function after the Chrome component is mounted.
     * This will load pos and assign it to the environment.
     */
    async start() {
        // Little trick to avoid displaying the block ui during the POS models loading
        // FIXME POSREF: use a silent RPC instead
        const BlockUiFromRegistry = registry.category("main_components").get("BlockUI");
        registry.category("main_components").remove("BlockUI");

        try {
            await this.env.pos.load_server_data();
            if (this.env.pos.config.use_proxy) {
                await this.pos.connectToProxy();
            }
            // Load the saved `env.pos.toRefundLines` from localStorage when
            // the PosGlobalState is ready.
            Object.assign(
                this.env.pos.toRefundLines,
                this.env.pos.db.load("TO_REFUND_LINES") || {}
            );
            this._buildChrome();
            this._closeOtherTabs();
            this.env.pos.selectedCategoryId =
                this.env.pos.config.start_category && this.env.pos.config.iface_start_categ_id
                    ? this.env.pos.config.iface_start_categ_id[0]
                    : 0;
            this.pos.uiState = "READY";
            const { name, props } = this.startScreen;
            this.pos.showScreen(name, props);
            setTimeout(() => this._runBackgroundTasks());
        } catch (error) {
            let title = "Unknown Error";
            let body;

            if (error.message && [100, 200, 404, -32098].includes(error.message.code)) {
                // this is the signature of rpc error
                if (error.message.code === -32098) {
                    title = "Network Failure (XmlHttpRequestError)";
                    body =
                        "The Point of Sale could not be loaded due to a network problem.\n" +
                        "Please check your internet connection.";
                } else if (error.message.code === 200) {
                    title = error.message.data.message || this.env._t("Server Error");
                    body =
                        error.message.data.debug ||
                        this.env._t("The server encountered an error while receiving your order.");
                }
            } else if (error instanceof Error) {
                title = error.message;
                if (error.cause) {
                    body = error.cause.message;
                } else {
                    body = error.stack;
                }
            }

            return this.popup.add(ErrorTracebackPopup, { title, body, exitButtonIsShown: true });
        }
        registry.category("main_components").add("BlockUI", BlockUiFromRegistry);

        // Subscribe to the changes in the models.
        this.batchedCustomerDisplayRender();
    }

    _runBackgroundTasks() {
        // push order in the background, no need to await
        this.env.pos.push_orders();
        // Allow using the app even if not all the images are loaded.
        // Basically, preload the images in the background.
        this._preloadImages();
        if (
            this.env.pos.config.limited_partners_loading &&
            this.env.pos.config.partner_load_background
        ) {
            // Wrap in fresh reactive: none of the reads during loading should subscribe to anything
            reactive(this.env.pos).loadPartnersBackground();
        }
        if (
            this.env.pos.config.limited_products_loading &&
            this.env.pos.config.product_load_background
        ) {
            // Wrap in fresh reactive: none of the reads during loading should subscribe to anything
            reactive(this.env.pos)
                .loadProductsBackground()
                .then(() => {
                    this.render(true);
                });
        }
    }

    /**
     * Save `env.pos.toRefundLines` in localStorage on beforeunload - closing the
     * browser, reloading or going to other page.
     */
    _onBeforeUnload() {
        this.env.pos.db.save("TO_REFUND_LINES", this.env.pos.toRefundLines);
    }
    _onSetSyncStatus({ detail: { status, pending } }) {
        this.env.pos.synch.status = status;
        this.env.pos.synch.pending = pending;
    }

    // MISC METHODS //
    _preloadImages() {
        for (const product of this.env.pos.db.get_product_by_category(0)) {
            const image = new Image();
            image.src = `/web/image?model=product.product&field=image_128&id=${product.id}&unique=${product.write_date}`;
        }
        for (const category of Object.values(this.env.pos.db.category_by_id)) {
            if (category.id == 0) {
                continue;
            }
            const image = new Image();
            image.src = `/web/image?model=pos.category&field=image_128&id=${category.id}&unique=${category.write_date}`;
        }
        const staticImages = ["backspace.png", "bc-arrow-big.png"];
        for (const imageName of staticImages) {
            const image = new Image();
            image.src = `/point_of_sale/static/src/img/${imageName}`;
        }
    }

    _buildChrome() {
        if ($.browser.chrome) {
            var chrome_version = $.browser.version.split(".")[0];
            if (parseInt(chrome_version, 10) >= 50) {
                loadCSS("/point_of_sale/static/src/css/chrome50.css");
            }
        }

        if (this.env.pos.config.iface_big_scrollbars) {
            this.pos.hasBigScrollBars = true;
        }

        this._disableBackspaceBack();
    }
    // prevent backspace from performing a 'back' navigation
    _disableBackspaceBack() {
        $(document).on("keydown", function (e) {
            if (e.which === 8 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
            }
        });
    }
    _closeOtherTabs() {
        localStorage["message"] = "";
        localStorage["message"] = JSON.stringify({
            message: "close_tabs",
            session: this.env.pos.pos_session.id,
        });

        window.addEventListener(
            "storage",
            (event) => {
                if (event.key === "message" && event.newValue) {
                    const msg = JSON.parse(event.newValue);
                    if (
                        msg.message === "close_tabs" &&
                        msg.session == this.env.pos.pos_session.id
                    ) {
                        console.info("POS / Session opened in another window. EXITING POS");
                        this.pos.closePos();
                    }
                }
            },
            false
        );
    }
    get showCashMoveButton() {
        return this.env.pos && this.env.pos.config && this.env.pos.config.cash_control;
    }
    /**
     * Unmounts the tempScreen on error and dispatches the error in a separate
     * stack so that it can be handled by the error service and display an error
     * popup.
     *
     * @param {any} err the error that was thrown in the temp screen.
     */
    onTempScreenError(err) {
        this.pos.tempScreen = null;
        Promise.reject(err);
    }
}
