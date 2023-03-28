/** @odoo-module **/

import { CalendarController } from "@web/views/calendar/calendar_controller";
import { useService } from "@web/core/utils/hooks";
import { onWillStart } from "@odoo/owl";

export class AttendeeCalendarController extends CalendarController {
    setup() {
        super.setup();
        this.actionService = useService("action");
        this.user = useService("user");
        this.orm = useService("orm");
        onWillStart(async () => {
            this.isSystemUser = await this.user.hasGroup('base.group_system');
        });
    }

    onClickAddButton() {
        this.actionService.doAction({
            type: 'ir.actions.act_window',
            res_model: 'calendar.event',
            views: [[false, 'form']],
        }, {
            additionalContext: this.props.context,
        });
    }

    /**
     * @override
     *
     * If the event is deleted by the organizer, the event is deleted, otherwise it is declined.
     */
    deleteRecord(record) {
        if (this.user.partnerId === record.attendeeId && this.user.partnerId === record.rawRecord.partner_id[0]) {
<<<<<<< HEAD
            super.deleteRecord(...arguments);
=======
            if (record.rawRecord.recurrency) {
                this.openRecurringDeletionWizard(record);
            } else {
                super.deleteRecord(...arguments);
            }
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        } else {
            // Decline event
            this.orm.call(
                "calendar.attendee",
                "do_decline",
                [record.attendeeId],
            ).then(this.model.load.bind(this.model));
        }
    }

<<<<<<< HEAD
=======
    openRecurringDeletionWizard(record) {
        this.actionService.doAction({
            type: 'ir.actions.act_window',
            res_model: 'calendar.popover.delete.wizard',
            views: [[false, 'form']],
            view_mode: "form",
            name: 'Delete Recurring Event',
            context: {'default_record': record.id},
            target: 'new'
        }, {
            onClose: () => {
                location.reload();
            },
        });
    }

>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
    configureCalendarProviderSync(providerName) {
        this.actionService.doAction({
            name: this.env._t('Connect your Calendar'),
            type: 'ir.actions.act_window',
            res_model: 'calendar.provider.config',
            views: [[false, "form"]],
            view_mode: "form",
            target: 'new',
            context: {
                'default_external_calendar_provider': providerName,
                'dialog_size': 'medium',
            }
        });
    }
}
AttendeeCalendarController.template = "calendar.AttendeeCalendarController";
