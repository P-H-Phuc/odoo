/** @odoo-module **/

import { append, createElement } from "@web/core/utils/xml";
import { FormCompiler } from "@web/views/form/form_compiler";
<<<<<<< HEAD
import { getModifier } from "@web/views/view_compiler";

function compileSettingsPage(el, params) {
    const settingsPage = createElement("SettingsPage");
    settingsPage.setAttribute("slots", "{NoContentHelper:props.slots.NoContentHelper}");
    settingsPage.setAttribute("initialTab", "props.initialApp");
    settingsPage.setAttribute("t-slot-scope", "settings");

    //props
    const modules = [];

    for (const child of el.children) {
        if (child.nodeName === "div" && child.classList.value.includes("app_settings_block")) {
            params.module = {
                key: child.getAttribute("data-key"),
                string: child.getAttribute("string"),
                imgurl: getAppIconUrl(child.getAttribute("data-key")),
                isVisible: getModifier(child, "invisible"),
            };
            if (!child.classList.value.includes("o_not_app")) {
                modules.push(params.module);
                append(settingsPage, this.compileNode(child, params));
            }
        }
    }

    settingsPage.setAttribute("modules", JSON.stringify(modules));
    return settingsPage;
}

function getAppIconUrl(module) {
    return module === "general_settings"
        ? "/base/static/description/settings.png"
        : "/" + module + "/static/description/icon.png";
}

function compileSettingsApp(el, params) {
    const settingsApp = createElement("SettingsApp");
    settingsApp.setAttribute("t-props", JSON.stringify(params.module));
    settingsApp.setAttribute("selectedTab", "settings.selectedTab");

    for (const child of el.children) {
        append(settingsApp, this.compileNode(child, params));
    }

    return settingsApp;
}

function compileSettingsHeader(el, params) {
    const header = el.cloneNode();
    for (const child of el.children) {
        append(header, this.compileNode(child, { ...params, settingType: "header" }));
    }
    return header;
}

let settingsContainer = null;

function compileSettingsGroupTitle(el, params) {
    if (!settingsContainer) {
        settingsContainer = createElement("SettingsContainer");
    }

    settingsContainer.setAttribute("title", `\`${el.textContent}\``);
}

function compileSettingsGroupTip(el, params) {
    if (!settingsContainer) {
        settingsContainer = createElement("SettingsContainer");
    }

    settingsContainer.setAttribute("tip", `\`${el.textContent}\``);
}

function compileSettingsContainer(el, params) {
    if (!settingsContainer) {
        settingsContainer = createElement("SettingsContainer");
    }

    for (const child of el.children) {
        append(settingsContainer, this.compileNode(child, params));
    }
    const res = settingsContainer;
    settingsContainer = null;
    return res;
}

function compileSettingBox(el, params) {
    const setting = createElement("Setting");
    params.labels = [];

    if (params.settingType) {
        setting.setAttribute("type", `\`${params.settingType}\``);
    }
    if (el.getAttribute("title")) {
        setting.setAttribute("title", `\`${el.getAttribute("title")}\``);
    }
    for (const child of el.children) {
        append(setting, this.compileNode(child, params));
    }
    setting.setAttribute("labels", JSON.stringify(params.labels));
    return setting;
}

function compileField(el, params) {
    const res = this.compileField(el, params);
    let widgetName;
    if (el.hasAttribute("widget")) {
        widgetName = el.getAttribute("widget");
        const label = params.getFieldExpr(el.getAttribute("name"), widgetName);
        if (label) {
            params.labels.push(label);
        }
    }
    return res;
}

const labelsWeak = new WeakMap();
function compileLabel(el, params) {
    const res = this.compileLabel(el, params);
    // It the node is a FormLabel component node, the label is
    // localized *after* the field.
    // We don't know yet if the label refers to a field or not.
    if (res.textContent && res.tagName !== "FormLabel") {
        params.labels.push(res.textContent.trim());
        labelsWeak.set(res, { textContent: res.textContent });
        highlightElement(res);
    }
    return res;
}

function compileGenericLabel(el, params) {
    const res = this.compileGenericNode(el, params);
    if (res.textContent) {
        params.labels.push(res.textContent.trim());
        highlightElement(res);
    }
    return res;
}

function highlightElement(el) {
    for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            if (child.textContent.trim()) {
                const highlight = createElement("HighlightText");
                highlight.setAttribute("originalText", `\`${child.textContent}\``);
                el.replaceChild(highlight, child);
            }
        } else if (child.childNodes.length) {
            highlightElement(child);
        }
    }
}

function compileForm() {
    const res = this.compileForm(...arguments);
    res.classList.remove("o_form_nosheet");
    res.classList.remove("p-2");
    res.classList.remove("px-lg-5");
    return res;
}
=======
import { toStringExpression } from "@web/views/utils";
import { isTextNode } from "@web/views/view_compiler";
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

export class SettingsFormCompiler extends FormCompiler {
    setup() {
        super.setup();
<<<<<<< HEAD
        this.compilers.unshift(
            { selector: "form", fn: compileForm },
            { selector: "div.settings", fn: compileSettingsPage },
            { selector: "div.app_settings_block", fn: compileSettingsApp },
            { selector: "div.app_settings_header", fn: compileSettingsHeader },
            // objects to show/hide in the search
            { selector: "div.o_setting_box", fn: compileSettingBox },
            { selector: "div.o_settings_container", fn: compileSettingsContainer },
            // h2
            { selector: "h2", fn: compileSettingsGroupTitle },
            { selector: "h3.o_setting_tip", fn: compileSettingsGroupTip },
            // search terms and highlight :
            { selector: "label", fn: compileLabel, doNotCopyAttributes: true },
            { selector: "span.o_form_label", fn: compileGenericLabel },
            { selector: "div.text-muted", fn: compileGenericLabel },
            { selector: "field", fn: compileField }
=======
        this.compilers.push(
            { selector: "app", fn: this.compileApp },
            { selector: "block", fn: this.compileBlock }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        );
    }

    compileForm(el, params) {
        const settingsPage = createElement("SettingsPage");
        settingsPage.setAttribute(
            "slots",
            "{NoContentHelper:__comp__.props.slots.NoContentHelper}"
        );
        settingsPage.setAttribute("initialTab", "__comp__.props.initialApp");
        settingsPage.setAttribute("t-slot-scope", "settings");

        //props
        params.modules = [];

        const res = super.compileForm(...arguments);
        res.classList.remove("o_form_nosheet");

        settingsPage.setAttribute("modules", JSON.stringify(params.modules));

        // Move the compiled content of the form inside the settingsPage
        while (res.firstChild) {
            append(settingsPage, res.firstChild);
        }
        append(res, settingsPage);

        return res;
    }

    compileApp(el, params) {
        if (el.getAttribute("notApp") === "1") {
            //An app noted with notApp="1" is not rendered.

            //This hack is used when a technical module defines settings, and we don't want to render
            //the settings until the corresponding app is not installed.

            // For example, when installing the module website_sale, the module sale is also installed,
            // but we don't want to render its settings (notApp="1").
            // On the contrary, when sale_management is installed, the module sale is also installed
            // but in this case we want to see its settings (notApp="0").
            return;
        }
        const module = {
            key: el.getAttribute("name"),
            string: el.getAttribute("string"),
            imgurl:
                el.getAttribute("logo") ||
                "/" + el.getAttribute("name") + "/static/description/icon.png",
        };
        params.modules.push(module);
        const settingsApp = createElement("SettingsApp", {
            key: toStringExpression(module.key),
            string: toStringExpression(module.string || ""),
            imgurl: toStringExpression(module.imgurl),
            selectedTab: "settings.selectedTab",
        });

        for (const child of el.children) {
            append(settingsApp, this.compileNode(child, params));
        }

        return settingsApp;
    }

    compileBlock(el, params) {
        const settingsContainer = createElement("SettingsBlock", {
            title: toStringExpression(el.getAttribute("title") || ""),
            tip: toStringExpression(el.getAttribute("help") || ""),
        });
        for (const child of el.children) {
            append(settingsContainer, this.compileNode(child, params));
        }
        return settingsContainer;
    }

    compileSetting(el, params) {
        params.componentName =
            el.getAttribute("type") === "header" ? "SettingHeader" : "SearchableSetting";
        params.labels = [];
        const res = super.compileSetting(el, params);
        if (params.componentName === "SearchableSetting") {
            res.setAttribute("labels", JSON.stringify(params.labels));
        }
        delete params.labels;
        return res;
    }

    compileField(el, params) {
        const res = super.compileField(el, params);
        if (params.labels && el.hasAttribute("widget")) {
            const label = params.getFieldExpr(el.getAttribute("name"), el.getAttribute("widget"));
            if (label) {
                params.labels.push(label);
            }
        }
        return res;
    }

    compileNode(node, params, evalInvisible) {
        if (isTextNode(node)) {
            if (params.labels && node.textContent.trim()) {
                params.labels.push(node.textContent.trim());
                return createElement("HighlightText", {
                    originalText: toStringExpression(node.textContent),
                });
            }
        }
        return super.compileNode(node, params, evalInvisible);
    }

    createLabelFromField(fieldId, fieldName, fieldString, label, params) {
        const res = super.createLabelFromField(fieldId, fieldName, fieldString, label, params);
        if (res.hasAttribute("string") && params.labels) {
            params.labels.push(res.getAttribute("string"));
        }
        return res;
    }

    compileButton(el, params) {
        const res = super.compileButton(el, params);
        if (res.hasAttribute("string") && params.labels && res.children.length === 0) {
            params.labels.push(res.getAttribute("string"));
            const contentSlot = createElement("t");
            contentSlot.setAttribute("t-set-slot", "contents");
            const content = createElement("HighlightText", {
                originalText: res.getAttribute("string"),
            });
            append(contentSlot, content);
            append(res, contentSlot);
        }
        return res;
    }
}
