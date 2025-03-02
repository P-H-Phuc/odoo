/** @odoo-module **/

import { Popover } from "./popover";

<<<<<<< HEAD
import { Component, onWillDestroy, useExternalListener, useState, xml } from "@odoo/owl";
=======
import { EventBus, Component, onWillDestroy, useExternalListener, useState, xml } from "@odoo/owl";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

class PopoverController extends Component {
    setup() {
        this.state = useState({ displayed: false });

        if (this.target.isConnected) {
            useExternalListener(window, "click", this.onClickAway, { capture: true });
            const targetObserver = new MutationObserver(this.onTargetMutate.bind(this));
            targetObserver.observe(this.target.parentElement, { childList: true });
            onWillDestroy(() => {
                targetObserver.disconnect();
            });
        } else {
            this.onTargetMutate();
        }
    }

    get popoverProps() {
        return {
            id: this.props.id,
            target: this.target,
            position: this.props.position,
            popoverClass: this.props.popoverClass,
            onPositioned: this.props.onPositioned,
        };
    }

    get popoverComponentProps() {
        return {
            close: this.props.close,
            ...this.props.props,
        };
    }

    get target() {
        if (typeof this.props.target === "string") {
            return document.querySelector(this.props.target);
        } else {
            return this.props.target;
        }
    }
    onClickAway(ev) {
        if (
            this.target.contains(ev.target) ||
            ev.target.closest(`.o_popover[popover-id="${this.props.id}"]`)
        ) {
            return;
        }
        if (this.props.preventClose && this.props.preventClose(ev)) {
            return;
        }

        if (this.props.closeOnClickAway) {
            this.props.close();
        }
    }
    onTargetMutate() {
        const target = this.target;
        if (!target || !target.parentElement) {
            this.props.close();
        }
    }
}
PopoverController.components = { Popover };
PopoverController.defaultProps = {
    alwaysDisplayed: false,
    closeOnClickAway: true,
};
PopoverController.template = xml/*xml*/ `
    <Popover t-props="popoverProps">
        <t t-component="props.Component" t-props="popoverComponentProps"/>
    </Popover>
`;

export class PopoverContainer extends Component {
    setup() {
        this.props.bus.addEventListener("UPDATE", this.render.bind(this));
    }
}
PopoverContainer.components = { PopoverController };
PopoverContainer.props = {
    popovers: Object,
    bus: EventBus,
};
PopoverContainer.template = xml`
    <div class="o_popover_container">
        <t t-foreach="Object.values(props.popovers)" t-as="popover" t-key="popover.id">
            <PopoverController t-props="popover" />
        </t>
    </div>
`;
