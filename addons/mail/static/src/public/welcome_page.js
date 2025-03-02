/* @odoo-module */

import { Component, useRef, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { useMessaging, useStore } from "../core/messaging_hook";
import { browser } from "@web/core/browser/browser";

export class WelcomePage extends Component {
    static props = ["data?", "proceed?"];
    static template = "mail.WelcomePage";

    setup() {
        this.messaging = useMessaging();
        this.store = useStore();
        this.rpc = useService("rpc");
        /** @type {import('@mail/core/persona_service').PersonaService} */
        this.personaService = useService("mail.persona");
        this.state = useState({
            userName: "Guest",
            audioStream: null,
            videoStream: null,
        });
        this.audioRef = useRef("audio");
        this.videoRef = useRef("video");
    }

    onKeydownInput(ev) {
        if (ev.key === "Enter") {
            this.joinChannel();
        }
    }

    async joinChannel() {
        if (this.store.guest) {
            await this.personaService.updateGuestName(this.store.self, this.state.userName.trim());
        }
        if (this.props.data?.discussPublicViewData.addGuestAsMemberOnJoin) {
            await this.rpc("/mail/channel/add_guest_as_member", {
                channel_id: this.props.data.channelData.id,
                channel_uuid: this.props.data.channelData.uuid,
            });
        }
        this.props.proceed?.();
    }

    get hasRtcSupport() {
        return Boolean(
            navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaStream
        );
    }

    async enableMicrophone() {
        if (!this.hasRtcSupport) {
            return;
        }
        try {
            this.state.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioRef.el.srcObject = this.audioStream;
        } catch {
            // TODO: display popup asking the user to re-enable their mic
        }
    }

    disableMicrophone() {
        this.audioRef.el.srcObject = null;
        if (!this.state.audioStream) {
            return;
        }
        this.stopTracksOnMediaStream(this.state.audioStream);
        this.state.audioStream = null;
    }

    async enableVideo() {
        if (!this.hasRtcSupport) {
            return;
        }
        try {
            this.state.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoRef.el.srcObject = this.state.videoStream;
        } catch {
            // TODO: display popup asking the user to re-enable their camera
        }
    }

    disableVideo() {
        this.videoRef.el.srcObject = null;
        if (!this.state.videoStream) {
            return;
        }
        this.stopTracksOnMediaStream(this.state.videoStream);
        this.state.videoStream = null;
    }

    /**
     * @param {MediaStream} mediaStream
     */
    stopTracksOnMediaStream(mediaStream) {
        for (const track of mediaStream.getTracks()) {
            track.stop();
        }
    }

    async onClickMic() {
        if (!this.state.audioStream) {
            await this.enableMicrophone();
        } else {
            this.disableMicrophone();
        }
        browser.localStorage.setItem(
            "mail_call_preview_join_mute",
            Boolean(!this.state.audioStream)
        );
    }

    async onClickVideo() {
        if (!this.state.videoStream) {
            await this.enableVideo();
        } else {
            this.disableVideo();
        }
        browser.localStorage.setItem(
            "mail_call_preview_join_video",
            Boolean(this.state.videoStream)
        );
    }
}
