/** @odoo-module **/

import { browser } from "../browser/browser";
import { registry } from "../registry";

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------
export class RPCError extends Error {
    constructor() {
        super(...arguments);
        this.name = "RPC_ERROR";
        this.type = "server";
        this.code = null;
        this.data = null;
        this.exceptionName = null;
        this.subType = null;
    }
}

export class ConnectionLostError extends Error {
    constructor(url, ...args) {
        super(`Connection to "${url}" couldn't be established or was interrupted`, ...args);
        this.url = url;
    }
}

export class ConnectionAbortedError extends Error {}

// -----------------------------------------------------------------------------
// Main RPC method
// -----------------------------------------------------------------------------
export function makeErrorFromResponse(reponse) {
    // Odoo returns error like this, in a error field instead of properly
    // using http error codes...
    const { code, data: errorData, message, type: subType } = reponse;
    const error = new RPCError();
    error.exceptionName = errorData.name;
    error.subType = subType;
    error.data = errorData;
    error.message = message;
    error.code = code;
    return error;
}

export function jsonrpc(env, rpcId, url, params, settings = {}) {
    const bus = env.bus;
    const XHR = browser.XMLHttpRequest;
    const data = {
        id: rpcId,
        jsonrpc: "2.0",
        method: "call",
        params: params,
    };
    const request = settings.xhr || new XHR();
    let rejectFn;
    const promise = new Promise((resolve, reject) => {
        rejectFn = reject;
        bus.trigger("RPC:REQUEST", { data, settings });
        // handle success
        request.addEventListener("load", () => {
            if (request.status === 502) {
                // If Odoo is behind another server (eg.: nginx)
                bus.trigger("RPC:RESPONSE", { data, settings });
                reject(new ConnectionLostError(url));
                return;
            }
            let params;
            try {
                params = JSON.parse(request.response);
<<<<<<< HEAD
            } catch (_) {
                // the response isn't json parsable, which probably means that the rpc request could
                // not be handled by the server, e.g. PoolError('The Connection Pool Is Full')
                if (!settings.silent) {
                    bus.trigger("RPC:RESPONSE", data.id);
                }
                return reject(new ConnectionLostError());
=======
            } catch {
                // the response isn't json parsable, which probably means that the rpc request could
                // not be handled by the server, e.g. PoolError('The Connection Pool Is Full')
                bus.trigger("RPC:RESPONSE", { data, settings });
                return reject(new ConnectionLostError(url));
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            }
            const { error: responseError, result: responseResult } = params;
            bus.trigger("RPC:RESPONSE", { data, settings });
            if (!responseError) {
                return resolve(responseResult);
            }
            const error = makeErrorFromResponse(responseError);
            reject(error);
        });
        // handle failure
        request.addEventListener("error", () => {
            bus.trigger("RPC:RESPONSE", { data, settings });
            reject(new ConnectionLostError(url));
        });
        // configure and send request
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(data));
    });
    /**
     * @param {Boolean} rejectError Returns an error if true. Allows you to cancel
     *                  ignored rpc's in order to unblock the ui and not display an error.
     */
    promise.abort = function (rejectError = true) {
        if (request.abort) {
            request.abort();
        }
<<<<<<< HEAD
        if (!settings.silent) {
            bus.trigger("RPC:RESPONSE", data.id);
        }
=======
        bus.trigger("RPC:RESPONSE", { data, settings });
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (rejectError) {
            rejectFn(new ConnectionAbortedError("XmlHttpRequestError abort"));
        }
    };
    return promise;
}

// -----------------------------------------------------------------------------
// RPC service
// -----------------------------------------------------------------------------
export const rpcService = {
    async: true,
    start(env) {
        let rpcId = 0;
        /**
         * @param {string} route
         * @param {Object} params
         * @param {Object} settings
         * @param {boolean} settings.silent
         * @param {XmlHttpRequest} settings.xhr
         */
        return function rpc(route, params = {}, settings) {
            return jsonrpc(env, rpcId++, route, params, settings);
        };
    },
};

registry.category("services").add("rpc", rpcService);
