/** @odoo-module */

import { append, createElement, setAttributes } from "@web/core/utils/xml";
import { registry } from "@web/core/registry";
import { SIZES } from "@web/core/ui/ui_service";
import { getModifier, ViewCompiler } from "@web/views/view_compiler";
import { patch } from "@web/core/utils/patch";
import { FormCompiler } from "@web/views/form/form_compiler";

/**
 * Compiler the portal chatter in project sharing.
 *
 * @param {HTMLElement} node
 * @param {Object} params
 * @returns
 */
function compileChatter(node, params) {
    const chatterContainerXml = createElement('ChatterContainer');
    const parentURLQuery = new URLSearchParams(window.parent.location.search);
    setAttributes(chatterContainerXml, {
        token: `'${parentURLQuery.get('access_token')}'` || '',
        resModel: params.resModel,
        resId: params.resId,
        projectSharingId: params.projectSharingId,
    });
    const chatterContainerHookXml = createElement('div');
<<<<<<< HEAD
    chatterContainerHookXml.classList.add('o_FormRenderer_chatterContainer');
=======
    chatterContainerHookXml.classList.add('o-mail-Form-chatter');
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    append(chatterContainerHookXml, chatterContainerXml);
    return chatterContainerHookXml;
}

export class ProjectSharingChatterCompiler extends ViewCompiler {
    setup() {
        this.compilers.push({ selector: "t", fn: this.compileT });
        this.compilers.push({ selector: 'div.oe_chatter', fn: this.compileChatter });
    }

    compile(node, params) {
        const res = super.compile(node, params).children[0];
<<<<<<< HEAD
        const chatterContainerHookXml = res.querySelector(".o_FormRenderer_chatterContainer");
        if (chatterContainerHookXml) {
            setAttributes(chatterContainerHookXml, {
                "t-if": `uiService.size >= ${SIZES.XXL}`,
=======
        const chatterContainerHookXml = res.querySelector(".o-mail-Form-chatter");
        if (chatterContainerHookXml) {
            setAttributes(chatterContainerHookXml, {
                "t-if": `__comp__.uiService.size >= ${SIZES.XXL}`,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            });
            chatterContainerHookXml.classList.add('overflow-x-hidden', 'overflow-y-auto', 'o-aside', 'h-100');
        }
        return res;
    }

    compileT(node, params) {
        const compiledRoot = createElement("t");
        for (const child of node.childNodes) {
            const invisible = getModifier(child, "invisible");
            let compiledChild = this.compileNode(child, params, false);
            compiledChild = this.applyInvisible(invisible, compiledChild, {
                ...params,
<<<<<<< HEAD
                recordExpr: "model.root",
=======
                recordExpr: "__comp__.model.root",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
            });
            append(compiledRoot, compiledChild);
        }
        return compiledRoot;
    }

    compileChatter(node) {
        return compileChatter(node, {
<<<<<<< HEAD
            resId: 'model.root.resId or undefined',
            resModel: 'model.root.resModel',
            projectSharingId: 'model.root.context.active_id',
=======
            resId: '__comp__.model.root.resId or undefined',
            resModel: '__comp__.model.root.resModel',
            projectSharingId: '__comp__.model.root.context.active_id',
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        });
    }
}

registry.category("form_compilers").add("portal_chatter_compiler", {
    selector: "div.oe_chatter",
    fn: (node) =>
        compileChatter(node, {
<<<<<<< HEAD
            resId: "props.record.resId or undefined",
            resModel: "props.record.resModel",
            projectSharingId: "props.record.context.active_id",
=======
            resId: "__comp__.props.record.resId or undefined",
            resModel: "__comp__.props.record.resModel",
            projectSharingId: "__comp__.props.record.context.active_id",
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }),
});

patch(FormCompiler.prototype, 'project_sharing_chatter', {
    compile(node, params) {
        const res = this._super(node, params);
<<<<<<< HEAD
        const chatterContainerHookXml = res.querySelector('.o_FormRenderer_chatterContainer');
=======
        const chatterContainerHookXml = res.querySelector('.o-mail-Form-chatter');
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        if (!chatterContainerHookXml) {
            return res; // no chatter, keep the result as it is
        }
        if (chatterContainerHookXml.parentNode.classList.contains('o_form_sheet')) {
            return res; // if chatter is inside sheet, keep it there
        }
        const formSheetBgXml = res.querySelector('.o_form_sheet_bg');
        const parentXml = formSheetBgXml && formSheetBgXml.parentNode;
        if (!parentXml) {
            return res; // miss-config: a sheet-bg is required for the rest
        }
        // after sheet bg (standard position, below form)
        setAttributes(chatterContainerHookXml, {
<<<<<<< HEAD
            't-if': `uiService.size < ${SIZES.XXL}`,
=======
            't-if': `__comp__.uiService.size < ${SIZES.XXL}`,
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        });
        append(parentXml, chatterContainerHookXml);
        return res;
    }
});
