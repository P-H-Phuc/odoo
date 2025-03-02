/** @odoo-module */
import { TicketScreen } from "@point_of_sale/js/Screens/TicketScreen/TicketScreen";
import { useAutofocus } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { parse } from "web.field_utils";
import { ConfirmPopup } from "@point_of_sale/js/Popups/ConfirmPopup";
import { Component, useState } from "@odoo/owl";

<<<<<<< HEAD
    const PosComponent = require('point_of_sale.PosComponent');
    const TicketScreen = require('point_of_sale.TicketScreen');
    const Registries = require('point_of_sale.Registries');
    const { useAutofocus } = require("@web/core/utils/hooks");
    const { parse } = require('web.field_utils');

    const { useState } = owl;

    const PosResTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
            close() {
                if (!this.env.pos.config.iface_floorplan) {
                    super.close();
                } else {
                    const order = this.env.pos.get_order();
                    if (order) {
                        const { name: screenName } = order.get_screen_data();
                        this.showScreen(screenName);
                    } else {
                        this.showScreen('FloorScreen');
                    }
                }
            }
            _getScreenToStatusMap() {
                return Object.assign(super._getScreenToStatusMap(), {
                    PaymentScreen: this.env.pos.config.set_tip_after_payment ? 'OPEN' : super._getScreenToStatusMap().PaymentScreen,
                    TipScreen: 'TIPPING',
                });
            }
            getTable(order) {
                return `${order.getTable().floor.name} (${order.getTable().name})`;
            }
            //@override
            _getSearchFields() {
                if (!this.env.pos.config.iface_floorplan) {
                    return super._getSearchFields();
                }
                return Object.assign({}, super._getSearchFields(), {
                    TABLE: {
                        repr: this.getTable.bind(this),
                        displayName: this.env._t('Table'),
                        modelField: 'table_id.name',
                    }
                });
            }
            async _setOrder(order) {
                if (!this.env.pos.config.iface_floorplan || this.env.pos.table) {
                    super._setOrder(order);
                } else {
                    // we came from the FloorScreen
                    const orderTable = order.getTable();
                    await this.env.pos.setTable(orderTable, order.uid);
                    this.close();
                }
            }
            shouldShowNewOrderButton() {
                return this.env.pos.config.iface_floorplan ? Boolean(this.env.pos.table) : super.shouldShowNewOrderButton();
            }
            _getOrderList() {
                if (this.env.pos.table) {
                    return this.env.pos.getTableOrders(this.env.pos.table.id);
                }
                return super._getOrderList();
            }
            async settleTips() {
                // set tip in each order
                for (const order of this.getFilteredOrderList()) {
                    const tipAmount = parse.float(order.uiState.TipScreen.inputTipAmount || '0');
                    const serverId = this.env.pos.validated_orders_name_server_id_map[order.name];
                    if (!serverId) {
                        console.warn(`${order.name} is not yet sync. Sync it to server before setting a tip.`);
                    } else {
                        const result = await this.setTip(order, serverId, tipAmount);
                        if (!result) break;
                    }
                }
            }
            //@override
            _selectNextOrder(currentOrder) {
                if (this.env.pos.config.iface_floorplan && this.env.pos.table) {
                    return super._selectNextOrder(...arguments);
                }
            }
            //@override
            async _onDeleteOrder() {
                await super._onDeleteOrder(...arguments);
                if (this.env.pos.config.iface_floorplan) {
                    if (!this.env.pos.table) {
                        this.env.pos._removeOrdersFromServer();
                    }
                    const orderList = this.env.pos.table ? this.env.pos.getTableOrders(this.env.pos.table.id) : this.env.pos.orders;
                    if (orderList.length == 0) {
                        this.showScreen('FloorScreen');
                    }
                }
            }
            async setTip(order, serverId, amount) {
                try {
                    const paymentline = order.get_paymentlines()[0];
                    if (paymentline.payment_method.payment_terminal) {
                        paymentline.amount += amount;
                        this.env.pos.set_order(order, {silent: true});
                        await paymentline.payment_method.payment_terminal.send_payment_adjust(paymentline.cid);
                    }

                    if (!amount) {
                        await this.setNoTip(serverId);
                    } else {
                        order.finalized = false;
                        order.set_tip(amount);
                        order.finalized = true;
                        const tip_line = order.selected_orderline;
                        await this.rpc({
                            method: 'set_tip',
                            model: 'pos.order',
                            args: [serverId, tip_line.export_as_JSON()],
                        });
                    }
                    if (order === this.env.pos.get_order()) {
                        this._selectNextOrder(order);
                    }
                    this.env.pos.removeOrder(order);
                    return true;
                } catch (_error) {
                    const { confirmed } = await this.showPopup('ConfirmPopup', {
                        title: 'Failed to set tip',
                        body: `Failed to set tip to ${order.name}. Do you want to proceed on setting the tips of the remaining?`,
                    });
                    return confirmed;
                }
            }
            async setNoTip(serverId) {
                await this.rpc({
                    method: 'set_no_tip',
                    model: 'pos.order',
                    args: [serverId],
                });
            }
            _getOrderStates() {
                const result = super._getOrderStates();
                if (this.env.pos.config.set_tip_after_payment) {
                    result.delete('PAYMENT');
                    result.set('OPEN', { text: this.env._t('Open'), indented: true });
                    result.set('TIPPING', { text: this.env._t('Tipping'), indented: true });
                }
                return result;
            }
            async _onDoRefund() {
                if(this.env.pos.config.iface_floorplan) {
                    this.env.pos.setTable(this.getSelectedSyncedOrder().table ? this.getSelectedSyncedOrder().table : Object.values(this.env.pos.tables_by_id)[0]);
                }
                super._onDoRefund();
            }
            isDefaultOrderEmpty(order) {
                if (this.env.pos.config.iface_floorplan) {
                    return false;
                }
                return super.isDefaultOrderEmpty(...arguments);
            }
        };

    Registries.Component.extend(TicketScreen, PosResTicketScreen);

    class TipCell extends PosComponent {
        setup() {
            super.setup();
            this.state = useState({ isEditing: false });
            this.orderUiState = this.props.order.uiState.TipScreen;
            useAutofocus();
=======
patch(TicketScreen.prototype, "pos_restaurant.TicketScreen", {
    _getScreenToStatusMap() {
        return Object.assign(this._super(...arguments), {
            PaymentScreen: this.env.pos.config.set_tip_after_payment
                ? "OPEN"
                : this._super(...arguments).PaymentScreen,
            TipScreen: "TIPPING",
        });
    },
    getTable(order) {
        if (order.getTable()) {
            return `${order.getTable().floor.name} (${order.getTable().name})`;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }
    },
    //@override
    _getSearchFields() {
        if (!this.env.pos.config.iface_floorplan) {
            return this._super(...arguments);
        }
        return Object.assign({}, this._super(...arguments), {
            TABLE: {
                repr: this.getTable.bind(this),
                displayName: this.env._t("Table"),
                modelField: "table_id.name",
            },
        });
    },
    async _setOrder(order) {
        if (!this.env.pos.config.iface_floorplan || this.env.pos.table) {
            this._super(order);
        } else {
            // we came from the FloorScreen
            const orderTable = order.getTable();
            await this.env.pos.setTable(orderTable, order.uid);
            this.close();
        }
    },
    get allowNewOrders() {
        return this.env.pos.config.iface_floorplan
            ? Boolean(this.env.pos.table)
            : this._super(...arguments);
    },
    _getOrderList() {
        if (this.env.pos.table) {
            return this.env.pos.getTableOrders(this.env.pos.table.id);
        }
        return this._super(...arguments);
    },
    async settleTips() {
        // set tip in each order
        for (const order of this.getFilteredOrderList()) {
            const tipAmount = parse.float(order.uiState.TipScreen.inputTipAmount || "0");
            const serverId = this.env.pos.validated_orders_name_server_id_map[order.name];
            if (!serverId) {
                console.warn(
                    `${order.name} is not yet sync. Sync it to server before setting a tip.`
                );
            } else {
                const result = await this.setTip(order, serverId, tipAmount);
                if (!result) {
                    break;
                }
            }
        }
    },
    //@override
    _selectNextOrder(currentOrder) {
        if (this.env.pos.config.iface_floorplan && this.env.pos.table) {
            return this._super(...arguments);
        }
    },
    //@override
    async onDeleteOrder() {
        await this._super(...arguments);
        if (this.env.pos.config.iface_floorplan) {
            if (!this.env.pos.table) {
                this.env.pos._removeOrdersFromServer();
            }
            const orderList = this.env.pos.table
                ? this.env.pos.getTableOrders(this.env.pos.table.id)
                : this.env.pos.orders;
            if (orderList.length == 0) {
                this.pos.showScreen("FloorScreen");
            }
        }
    },
    async setTip(order, serverId, amount) {
        try {
            const paymentline = order.get_paymentlines()[0];
            if (paymentline.payment_method.payment_terminal) {
                paymentline.amount += amount;
                this.env.pos.set_order(order, { silent: true });
                await paymentline.payment_method.payment_terminal.send_payment_adjust(
                    paymentline.cid
                );
            }

            if (!amount) {
                await this.setNoTip(serverId);
            } else {
                order.finalized = false;
                order.set_tip(amount);
                order.finalized = true;
                const tip_line = order.selected_orderline;
                await this.orm.call("pos.order", "set_tip", [serverId, tip_line.export_as_JSON()]);
            }
            if (order === this.env.pos.get_order()) {
                this._selectNextOrder(order);
            }
            this.env.pos.removeOrder(order);
            return true;
        } catch {
            const { confirmed } = await this.popup.add(ConfirmPopup, {
                title: "Failed to set tip",
                body: `Failed to set tip to ${order.name}. Do you want to proceed on setting the tips of the remaining?`,
            });
            return confirmed;
        }
    },
    async setNoTip(serverId) {
        await this.orm.call("set_no_tip", "pos.order", [serverId]);
    },
    _getOrderStates() {
        const result = this._super(...arguments);
        if (this.env.pos.config.set_tip_after_payment) {
            result.delete("PAYMENT");
            result.set("OPEN", { text: this.env._t("Open"), indented: true });
            result.set("TIPPING", { text: this.env._t("Tipping"), indented: true });
        }
        return result;
    },
    async onDoRefund() {
        const order = this.getSelectedSyncedOrder();
        if (this.env.pos.config.iface_floorplan && order) {
            this.env.pos.setTable(
                order.table ? order.table : Object.values(this.env.pos.tables_by_id)[0]
            );
        }
        this._super(...arguments);
    },
    isDefaultOrderEmpty(order) {
        if (this.env.pos.config.iface_floorplan) {
            return false;
        }
        return this._super(...arguments);
    },
});

export class TipCell extends Component {
    static template = "TipCell";

    setup() {
        super.setup();
        this.state = useState({ isEditing: false });
        this.orderUiState = this.props.order.uiState.TipScreen;
        useAutofocus();
    }
    get tipAmountStr() {
        return this.env.pos.format_currency(parse.float(this.orderUiState.inputTipAmount || "0"));
    }
    onBlur() {
        this.state.isEditing = false;
    }
    onKeydown(event) {
        if (event.key === "Enter") {
            this.state.isEditing = false;
        }
    }
    editTip() {
        this.state.isEditing = true;
    }
}

patch(TicketScreen, "pos_restaurant.TicketScreen.components", {
    components: { ...TicketScreen.components, TipCell },
});
