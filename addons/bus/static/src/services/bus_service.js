/** @odoo-module **/

import { browser } from "@web/core/browser/browser";
import { Deferred } from "@web/core/utils/concurrency";
import { registry } from '@web/core/registry';
import { session } from '@web/session';
import { isIosApp } from '@web/core/browser/feature_detection';
import { WORKER_VERSION } from "@bus/workers/websocket_worker";
<<<<<<< HEAD
import legacySession from "web.session";
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const { EventBus } = owl;

/**
 * Communicate with a SharedWorker in order to provide a single websocket
 * connection shared across multiple tabs.
 *
 *  @emits connect
 *  @emits disconnect
 *  @emits reconnect
 *  @emits reconnecting
 *  @emits notification
 */
export const busService = {
<<<<<<< HEAD
    dependencies: ['localization', 'multi_tab'],

    async start(env, { multi_tab: multiTab }) {
=======
    dependencies: ['bus.parameters', 'localization', 'multi_tab'],
    async: true,

    async start(env, { multi_tab: multiTab, "bus.parameters": params }) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        const bus = new EventBus();
        let worker;
        let isActive = false;
        let isInitialized = false;
        let isUsingSharedWorker = browser.SharedWorker && !isIosApp();
        const connectionInitializedDeferred = new Deferred();

        /**
        * Send a message to the worker.
        *
        * @param {WorkerAction} action Action to be
        * executed by the worker.
        * @param {Object|undefined} data Data required for the action to be
        * executed.
        */
        function send(action, data) {
            const message = { action, data };
            if (isUsingSharedWorker) {
                worker.port.postMessage(message);
            } else {
                worker.postMessage(message);
            }
        }

        /**
         * Handle messages received from the shared worker and fires an
         * event according to the message type.
         *
         * @param {MessageEvent} messageEv
         * @param {{type: WorkerEvent, data: any}[]}  messageEv.data
         */
        function handleMessage(messageEv) {
            const { type } = messageEv.data;
            let { data } = messageEv.data;
            if (type === 'notification') {
                multiTab.setSharedValue('last_notification_id', data[data.length - 1].id);
                data = data.map(notification => notification.message);
            } else if (type === 'initialized') {
                isInitialized = true;
                connectionInitializedDeferred.resolve();
                return;
            }
            bus.trigger(type, data);
        }

        /**
         * Initialize the connection to the worker by sending it usefull
         * initial informations (last notification id, debug mode,
         * ...).
         */
        function initializeWorkerConnection() {
            // User_id has different values according to its origin:
            //     - frontend: number or false,
            //     - backend: array with only one number
            //     - guest page: array containing null or number
            //     - public pages: undefined
            // Let's format it in order to ease its usage:
            //     - number if user is logged, false otherwise, keep
            //       undefined to indicate session_info is not available.
            let uid = Array.isArray(session.user_id) ? session.user_id[0] : session.user_id;
            if (!uid && uid !== undefined) {
                uid = false;
            }
            send('initialize_connection', {
<<<<<<< HEAD
                websocketURL: `${legacySession.prefix.replace("http", "ws")}/websocket`,
=======
                websocketURL: `${params.serverURL.replace("http", "ws")}/websocket`,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                debug: odoo.debug,
                lastNotificationId: multiTab.getSharedValue('last_notification_id', 0),
                uid,
            });
        }

        /**
         * Start the "bus_service" worker.
         */
        function startWorker() {
<<<<<<< HEAD
            let workerURL = `${legacySession.prefix}/bus/websocket_worker_bundle?v=${WORKER_VERSION}`;
            if (legacySession.prefix !== window.origin) {
=======
            let workerURL = `${params.serverURL}/bus/websocket_worker_bundle?v=${WORKER_VERSION}`;
            if (params.serverURL !== window.origin) {
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
                // Bus service is loaded from a different origin than the bundle
                // URL. The Worker expects an URL from this origin, give it a base64
                // URL that will then load the bundle via "importScripts" which
                // allows cross origin.
                const source = `importScripts("${workerURL}");`;
                workerURL = 'data:application/javascript;base64,' + window.btoa(source);
            }
            const workerClass = isUsingSharedWorker ? browser.SharedWorker : browser.Worker;
            worker = new workerClass(workerURL, {
                name: isUsingSharedWorker
                    ? 'odoo:websocket_shared_worker'
                    : 'odoo:websocket_worker',
            });
            worker.addEventListener("error", (e) => {
                if (!isInitialized && workerClass === browser.SharedWorker) {
                    console.warn(
                        'Error while loading "bus_service" SharedWorker, fallback on Worker.'
                    );
                    isUsingSharedWorker = false;
                    startWorker();
                } else if (!isInitialized) {
                    isInitialized = true;
                    connectionInitializedDeferred.resolve();
                    console.warn('Bus service failed to initialized.');
                }
            });
            if (isUsingSharedWorker) {
                worker.port.start();
                worker.port.addEventListener('message', handleMessage);
            } else {
                worker.addEventListener('message', handleMessage);
            }
            initializeWorkerConnection();
        }
        browser.addEventListener('pagehide', ({ persisted }) => {
            if (!persisted) {
                // Page is gonna be unloaded, disconnect this client
                // from the worker.
                send('leave');
            }
        });
        browser.addEventListener('online', () => {
            if (isActive) {
                send('start');
            }
        });
        browser.addEventListener('offline', () => send('stop'));
        startWorker();
        await connectionInitializedDeferred;

        return {
            addEventListener: bus.addEventListener.bind(bus),
            addChannel: channel => {
                send('add_channel', channel);
                send('start');
                isActive = true;
            },
            deleteChannel: channel => send('delete_channel', channel),
            forceUpdateChannels: () => send('force_update_channels'),
            trigger: bus.trigger.bind(bus),
            removeEventListener: bus.removeEventListener.bind(bus),
            send: (eventName, data) => send('send', { event_name: eventName, data }),
            start: () => {
                send('start');
                isActive = true;
            },
            stop: () => {
                send('leave');
                isActive = false;
            },
        };
    },
};
registry.category('services').add('bus_service', busService);
