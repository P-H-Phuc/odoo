/** @odoo-module */

import { registry } from "@web/core/registry";
import { EventBus } from "@odoo/owl";

<<<<<<< HEAD
    const { EventBus } = owl;

    class SaleOrderFetcher extends EventBus {
        constructor() {
            super();
            this.currentPage = 1;
            this.ordersToShow = [];
            this.totalCount = 0;
        }


        /**
         * for nPerPage = 10
         * +--------+----------+
         * | nItems | lastPage |
         * +--------+----------+
         * |     2  |       1  |
         * |    10  |       1  |
         * |    11  |       2  |
         * |    30  |       3  |
         * |    35  |       4  |
         * +--------+----------+
         */
        get lastPage() {
            const nItems = this.totalCount;
            return Math.trunc(nItems / (this.nPerPage + 1)) + 1;
        }
        /**
         * Calling this methods populates the `ordersToShow` then trigger `update` event.
         * @related get
         *
         * NOTE: This is tightly-coupled with pagination. So if the current page contains all
         * active orders, it will not fetch anything from the server but only sets `ordersToShow`
         * to the active orders that fits the current page.
         */
        async fetch() {
            try {
                let limit, offset;
                // Show orders from the backend.
                offset =
                    this.nPerPage +
                    (this.currentPage - 1 - 1) *
                        this.nPerPage;
                limit = this.nPerPage;
                this.ordersToShow = await this._fetch(limit, offset);

                this.trigger('update');
            } catch (error) {
                if (isConnectionError(error)) {
                    Gui.showPopup('ErrorPopup', {
                        title: this.comp.env._t('Network Error'),
                        body: this.comp.env._t('Unable to fetch orders if offline.'),
                    });
                    Gui.setSyncStatus('error');
                } else {
                    throw error;
                }
            }
        }
        /**
         * This returns the orders from the backend that needs to be shown.
         * If the order is already in cache, the full information about that
         * order is not fetched anymore, instead, we use info from cache.
         *
         * @param {number} limit
         * @param {number} offset
         */
        async _fetch(limit, offset) {
            const sale_orders = await this._getOrderIdsForCurrentPage(limit, offset);

            this.totalCount = sale_orders.length;
            return sale_orders;
        }
        async _getOrderIdsForCurrentPage(limit, offset) {
            let domain = [['currency_id', '=', this.comp.env.pos.currency.id]].concat(this.searchDomain || []);
            const saleOrders = await this.rpc({
                model: 'sale.order',
                method: 'search_read',
                args: [domain, ['name', 'partner_id', 'amount_total', 'date_order', 'state', 'user_id', 'amount_unpaid'], offset, limit],
                context: this.comp.env.session.user_context,
            });

            return saleOrders;
        }

        nextPage() {
            if (this.currentPage < this.lastPage) {
                this.currentPage += 1;
                this.fetch();
            }
        }
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                this.fetch();
            }
        }
        /**
         * @param {integer|undefined} id id of the cached order
         * @returns {Array<models.Order>}
         */
        get(id) {
            return this.ordersToShow;
        }
        setSearchDomain(searchDomain) {
            this.searchDomain = searchDomain;
        }
        setComponent(comp) {
            this.comp = comp;
            return this;
        }
        setNPerPage(val) {
            this.nPerPage = val;
        }
        setPage(page) {
            this.currentPage = page;
        }

        async rpc() {
            Gui.setSyncStatus('connecting');
            const result = await this.comp.rpc(...arguments);
            Gui.setSyncStatus('connected');
            return result;
        }
=======
class SaleOrderFetcher extends EventBus {
    static serviceDependencies = ["orm", "pos"];
    constructor({ orm, pos }) {
        super();
        this.currentPage = 1;
        this.ordersToShow = [];
        this.totalCount = 0;
        this.orm = orm;
        this.pos = pos;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    /**
     * for nPerPage = 10
     * +--------+----------+
     * | nItems | lastPage |
     * +--------+----------+
     * |     2  |       1  |
     * |    10  |       1  |
     * |    11  |       2  |
     * |    30  |       3  |
     * |    35  |       4  |
     * +--------+----------+
     */
    get lastPage() {
        const nItems = this.totalCount;
        return Math.trunc(nItems / (this.nPerPage + 1)) + 1;
    }
    /**
     * Calling this methods populates the `ordersToShow` then trigger `update` event.
     * @related get
     *
     * NOTE: This is tightly-coupled with pagination. So if the current page contains all
     * active orders, it will not fetch anything from the server but only sets `ordersToShow`
     * to the active orders that fits the current page.
     */
    async fetch() {
        // Show orders from the backend.
        const offset = this.nPerPage + (this.currentPage - 1 - 1) * this.nPerPage;
        const limit = this.nPerPage;
        this.ordersToShow = await this._fetch(limit, offset);

        this.trigger("update");
    }
    /**
     * This returns the orders from the backend that needs to be shown.
     * If the order is already in cache, the full information about that
     * order is not fetched anymore, instead, we use info from cache.
     *
     * @param {number} limit
     * @param {number} offset
     */
    async _fetch(limit, offset) {
        const sale_orders = await this._getOrderIdsForCurrentPage(limit, offset);

        this.totalCount = sale_orders.length;
        return sale_orders;
    }
    async _getOrderIdsForCurrentPage(limit, offset) {
        const domain = [["currency_id", "=", this.pos.globalState.currency.id]].concat(
            this.searchDomain || []
        );

        this.pos.globalState.set_synch("connecting");
        const saleOrders = await this.orm.searchRead(
            "sale.order",
            domain,
            [
                "name",
                "partner_id",
                "amount_total",
                "date_order",
                "state",
                "user_id",
                "amount_unpaid",
            ],
            { offset, limit }
        );

        this.pos.globalState.set_synch("connected");
        return saleOrders;
    }

    nextPage() {
        if (this.currentPage < this.lastPage) {
            this.currentPage += 1;
            this.fetch();
        }
    }
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.fetch();
        }
    }
    /**
     * @param {integer|undefined} id id of the cached order
     * @returns {Array<models.Order>}
     */
    get(id) {
        return this.ordersToShow;
    }
    setSearchDomain(searchDomain) {
        this.searchDomain = searchDomain;
    }
    setNPerPage(val) {
        this.nPerPage = val;
    }
    setPage(page) {
        this.currentPage = page;
    }
}

export const saleOrderFetcherService = {
    dependencies: SaleOrderFetcher.serviceDependencies,
    start(env, deps) {
        return new SaleOrderFetcher(deps);
    },
};

registry.category("services").add("sale_order_fetcher", saleOrderFetcherService);
