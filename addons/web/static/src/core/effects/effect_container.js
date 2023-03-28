/** @odoo-module **/

<<<<<<< HEAD
import { Component, xml, onWillDestroy } from "@odoo/owl";
=======
import { EventBus, Component, xml, onWillDestroy } from "@odoo/owl";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class EffectContainer extends Component {
    setup() {
        this.effect = null;
        const listenerRef = this.props.bus.addEventListener("UPDATE", (ev) => {
            this.effect = ev.detail;
            this.render();
        });
        onWillDestroy(() => {
            this.props.bus.removeEventListener("UPDATE", listenerRef);
        });
    }
    removeEffect() {
        this.effect = null;
        this.render();
    }
}
EffectContainer.props = {
    bus: EventBus,
};

EffectContainer.template = xml`
  <div class="o_effects_manager">
    <t t-if="effect">
        <t t-component="effect.Component" t-props="effect.props" t-key="effect.id" close="() => this.removeEffect()"/>
    </t>
  </div>`;
