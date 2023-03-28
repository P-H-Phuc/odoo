odoo.define('web.field_registry', function (require) {
    "use strict";

    const Registry = require('web.Registry');

    const { Component } = owl;

    return new Registry(
        null,
        (value) => !(value.prototype instanceof Component)
    );
});

odoo.define('web._field_registry', function (require) {
"use strict";

var AbstractField = require('web.AbstractField');
var basic_fields = require('web.basic_fields');
var relational_fields = require('web.relational_fields');
var registry = require('web.field_registry');

// Basic fields
registry
    .add('abstract', AbstractField)
    .add('input', basic_fields.InputField)
    .add('integer', basic_fields.FieldInteger)
    .add('boolean', basic_fields.FieldBoolean)
    .add('date', basic_fields.FieldDate)
    .add('datetime', basic_fields.FieldDateTime)
    .add('float', basic_fields.FieldFloat)
    .add('char', basic_fields.FieldChar)
<<<<<<< HEAD
    .add('handle', basic_fields.HandleWidget)
    .add('email', basic_fields.FieldEmail)
    .add('phone', basic_fields.FieldPhone)
=======
    .add('text', basic_fields.FieldText)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    .add('url', basic_fields.UrlWidget)
    .add('binary', basic_fields.FieldBinaryFile)
    .add('monetary', basic_fields.FieldMonetary)
    .add('percentage', basic_fields.FieldPercentage)
<<<<<<< HEAD
    .add('priority', basic_fields.PriorityWidget)
    .add('attachment_image', basic_fields.AttachmentImage)
    .add('label_selection', basic_fields.LabelSelection)
    .add('state_selection', basic_fields.StateSelectionWidget)
    .add('list.state_selection', basic_fields.ListStateSelectionWidget)
    .add('boolean_favorite', basic_fields.FavoriteWidget)
    .add('boolean_toggle', basic_fields.BooleanToggle)
    .add('statinfo', basic_fields.StatInfo)
    .add('percentpie', basic_fields.FieldPercentPie)
    .add('float_time', basic_fields.FieldFloatTime)
    .add('float_factor', basic_fields.FieldFloatFactor)
    .add('float_toggle', basic_fields.FieldFloatToggle)
    .add('progressbar', basic_fields.FieldProgressBar)
    .add('dashboard_graph', basic_fields.JournalDashboardGraph)
    .add('ace', basic_fields.AceEditor)
    .add('color', basic_fields.FieldColor)
=======
    .add('float_time', basic_fields.FieldFloatTime)
    .add('float_factor', basic_fields.FieldFloatFactor)
    .add('float_toggle', basic_fields.FieldFloatToggle)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    .add('many2one_reference', basic_fields.FieldInteger)

// Relational fields
registry
    .add('many2one', relational_fields.FieldMany2One)
    .add('many2one_avatar', relational_fields.Many2OneAvatar)
    .add('many2many_tags', relational_fields.FieldMany2ManyTags)
    .add('many2many_tags_avatar', relational_fields.FieldMany2ManyTagsAvatar)
    .add('kanban.many2many_tags_avatar', relational_fields.KanbanMany2ManyTagsAvatar)
    .add('list.many2many_tags_avatar', relational_fields.ListMany2ManyTagsAvatar)
    .add('form.many2many_tags', relational_fields.FormFieldMany2ManyTags)
<<<<<<< HEAD
    .add('kanban.many2many_tags', relational_fields.KanbanFieldMany2ManyTags)
    .add('many2many_checkboxes', relational_fields.FieldMany2ManyCheckBoxes)
    .add('one2many', relational_fields.FieldOne2Many)
    .add('statusbar', relational_fields.FieldStatus)
    .add('reference', relational_fields.FieldReference)
    .add('font', relational_fields.FieldSelectionFont);

// Special fields
registry
    .add('timezone_mismatch', special_fields.FieldTimezoneMismatch)
    .add('iframe_wrapper', special_fields.IframeWrapper)
});
=======
    .add('radio', relational_fields.FieldRadio)
    .add('selection', relational_fields.FieldSelection);
});
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
