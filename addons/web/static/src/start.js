/** @odoo-module **/

import { makeEnv, startServices } from "./env";
import { legacySetupProm } from "./legacy/legacy_setup";
import { mapLegacyEnvToWowlEnv } from "./legacy/utils";
import { localization } from "@web/core/l10n/localization";
import { session } from "@web/session";
import { renderToString } from "./core/utils/render";
import { setLoadXmlDefaultApp, templates } from "@web/core/assets";
import { hasTouch } from "@web/core/browser/feature_detection";

import { App, whenReady } from "@odoo/owl";

/**
 * Function to start a webclient.
 * It is used both in community and enterprise in main.js.
 * It's meant to be webclient flexible so we can have a subclass of
 * webclient in enterprise with added features.
 *
 * @param {Component} Webclient
 */
export async function startWebClient(Webclient) {
    odoo.info = {
        db: session.db,
        server_version: session.server_version,
        server_version_info: session.server_version_info,
        isEnterprise: session.server_version_info.slice(-1)[0] === "e",
    };
    odoo.isReady = false;

    // setup environment
    const env = makeEnv();
    await startServices(env);

    // start web client
    await whenReady();
    const legacyEnv = await legacySetupProm;
    mapLegacyEnvToWowlEnv(legacyEnv, env);
    const app = new App(Webclient, {
        env,
        templates,
        dev: env.debug,
        warnIfNoStaticProps: true,
        translatableAttributes: ["data-tooltip"],
        translateFn: env._t,
    });
    renderToString.app = app;
    setLoadXmlDefaultApp(app);
    const root = await app.mount(document.body);
    const classList = document.body.classList;
    if (localization.direction === "rtl") {
        classList.add("o_rtl");
    }
    if (env.services.user.userId === 1) {
        classList.add("o_is_superuser");
    }
    if (env.debug) {
        classList.add("o_debug");
    }
    if (hasTouch()) {
        classList.add("o_touch_device");
    }
    // delete odoo.debug; // FIXME: some legacy code rely on this
    odoo.__WOWL_DEBUG__ = { root };
    odoo.isReady = true;

    // Update Favicons
    const favicon = `/web/image/res.company/${env.services.company.currentCompany.id}/favicon`;
    const icons = document.querySelectorAll("link[rel*='icon']");
    for (const icon of icons) {
        icon.href = favicon;
    }
}
