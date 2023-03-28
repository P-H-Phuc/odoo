/** @odoo-module **/

export function getTooltipInfo(params) {
    let widgetDescription = undefined;
    if (params.fieldInfo.widget) {
<<<<<<< HEAD
        widgetDescription = params.fieldInfo.FieldComponent.displayName;
=======
        widgetDescription = params.fieldInfo.field.displayName;
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    }

    const info = {
        viewMode: params.viewMode,
        resModel: params.resModel,
        debug: Boolean(odoo.debug),
        field: {
            name: params.field.name,
            help: params.fieldInfo.help ?? params.field.help,
            type: params.field.type,
            widget: params.fieldInfo.widget,
            widgetDescription,
            context: params.fieldInfo.context,
            domain: params.field.domain,
            modifiers: JSON.stringify(params.fieldInfo.modifiers),
            changeDefault: params.field.change_default,
            relation: params.field.relation,
            selection: params.field.selection,
            default: params.field.default,
        },
    };
    return JSON.stringify(info);
}
