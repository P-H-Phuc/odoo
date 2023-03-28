/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { parseFloatTime } from "@web/views/fields/parsers";
import { useInputField } from "@web/views/fields/input_field_hook";
<<<<<<< HEAD
=======
import { standardFieldProps } from "@web/views/fields/standard_field_props";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

const { Component, useState, onWillUpdateProps, onWillStart, onWillDestroy } = owl;

function formatMinutes(value) {
    if (value === false) {
        return "";
    }
    const isNegative = value < 0;
    if (isNegative) {
        value = Math.abs(value);
    }
    let min = Math.floor(value);
    let sec = Math.floor((value % 1) * 60);
    sec = `${sec}`.padStart(2, "0");
    min = `${min}`.padStart(2, "0");
    return `${isNegative ? "-" : ""}${min}:${sec}`;
}

export class MrpTimer extends Component {
<<<<<<< HEAD
    setup() {
        this.orm = useService('orm');
        this.state = useState({
            // duration is expected to be given in minutes
            duration:
                this.props.value !== undefined ? this.props.value : this.props.record.data.duration,
        });
        useInputField({
            getValue: () => this.durationFormatted,
            refName: "numpadDecimal",
            parse: (v) => parseFloatTime(v),
        });

        this.ongoing =
            this.props.ongoing !== undefined
                ? this.props.ongoing
                : this.props.record.data.is_user_working;

        onWillStart(async () => {
            if(this.props.ongoing === undefined && !this.props.record.model.useSampleModel && this.props.record.data.state == "progress") {
                const additionalDuration = await this.orm.call('mrp.workorder', 'get_working_duration', [this.props.record.resId]);
                this.state.duration += additionalDuration;
            }
            if (this.ongoing) {
                this._runTimer();
            }
        });
        onWillUpdateProps((nextProps) => {
            const newOngoing =
                "ongoing" in nextProps
                    ? nextProps.ongoing
                    : "record" in nextProps && nextProps.record.data.is_user_working;
            const rerun = !this.ongoing && newOngoing;
            this.ongoing = newOngoing;
            if (rerun) {
                this.state.duration = nextProps.value;
                this._runTimer();
=======
    static template = "mrp.MrpTimer";
    static props = {
        value: { type: Number },
        ongoing: { type: Boolean, optional: true },
    };
    static defaultProps = { ongoing: false };

    setup() {
        this.state = useState({
            // duration is expected to be given in minutes
            duration: this.props.value,
        });
        this.lastDateTime = Date.now();
        this.ongoing = this.props.ongoing;
        onWillStart(() => {
            if (this.ongoing) {
                this._runTimer();
                this._runSleepTimer();
            }
        });
        onWillUpdateProps((nextProps) => {
            const rerun = !this.ongoing && nextProps.ongoing;
            this.ongoing = nextProps.ongoing;
            if (rerun) {
                this.state.duration = nextProps.value;
                this._runTimer();
                this._runSleepTimer();
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            }
        });
        onWillDestroy(() => clearTimeout(this.timer));
    }

    get durationFormatted() {
<<<<<<< HEAD
        if(this.props.value!=this.state.duration && this.props.record && this.props.record.isDirty){
            if (typeof this.props.setDirty==='function')this.props.setDirty(false);
            this.state.duration=this.props.value
        }
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        return formatMinutes(this.state.duration);
    }

    _runTimer() {
        this.timer = setTimeout(() => {
            if (this.ongoing) {
                this.state.duration += 1 / 60;
                this._runTimer();
            }
        }, 1000);
    }
<<<<<<< HEAD
}

MrpTimer.supportedTypes = ["float"];
MrpTimer.template = "mrp.MrpTimer";

registry.category("fields").add("mrp_timer", MrpTimer);
registry.category("formatters").add("mrp_timer", formatMinutes);
=======

    //updates the time when the computer wakes from sleep mode
    _runSleepTimer() {
        this.timer = setTimeout(async () => {
            const diff = Date.now() - this.lastDateTime - 10000;
            if (diff > 1000) {
                this.state.duration += diff / (1000 * 60);
            }
            this.lastDateTime = Date.now();
            this._runSleepTimer();
        }, 10000);
    }
}

class MrpTimerField extends Component {
    static template = "mrp.MrpTimerField";
    static components = { MrpTimer };
    static props = standardFieldProps;

    setup() {
        this.orm = useService("orm");
        useInputField({
            getValue: () => this.durationFormatted,
            refName: "numpadDecimal",
            parse: (v) => parseFloatTime(v),
        });

        // duration is expected to be given in minutes
        this.duration = this.props.record.data[this.props.name];
        this.ongoing = this.props.record.data.is_user_working;

        onWillStart(async () => {
            if (
                !this.props.record.model.useSampleModel &&
                this.props.record.data.state == "progress"
            ) {
                this.duration = await this.orm.call(
                    "mrp.workorder",
                    "get_duration",
                    [this.props.record.resId]
                );
            }
        });
        onWillUpdateProps((nextProps) => {
            const rerun = !this.ongoing && nextProps.record.data.is_user_working;
            this.ongoing = nextProps.record.data.is_user_working;
            if (rerun) {
                this.duration = nextProps.record.data[nextProps.name];
            }
        });
        onWillDestroy(() => clearTimeout(this.timer));
    }

    get durationFormatted() {
        if (this.props.record.data[this.props.name] != this.duration && this.props.record.isDirty) {
            this.duration = this.props.record.data[this.props.name];
        }
        return formatMinutes(this.duration);
    }
}

export const mrpTimerField = {
    component: MrpTimerField,
    supportedTypes: ["float"],
};

registry.category("fields").add("mrp_timer", mrpTimerField);
registry.category("formatters").add("mrp_timer", formatMinutes);
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
