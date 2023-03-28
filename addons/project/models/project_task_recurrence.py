# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

<<<<<<< HEAD
from odoo import _, api, fields, models
=======
from odoo import _, api, fields, models, Command
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
from odoo.exceptions import ValidationError

from dateutil.relativedelta import relativedelta

class ProjectTaskRecurrence(models.Model):
    _name = 'project.task.recurrence'
    _description = 'Task Recurrence'

    task_ids = fields.One2many('project.task', 'recurrence_id', copy=False)

    repeat_interval = fields.Integer(string='Repeat Every', default=1)
    repeat_unit = fields.Selection([
        ('day', 'Days'),
        ('week', 'Weeks'),
        ('month', 'Months'),
        ('year', 'Years'),
    ], default='week')
    repeat_type = fields.Selection([
        ('forever', 'Forever'),
        ('until', 'Until'),
    ], default="forever", string="Until")
    repeat_until = fields.Date(string="End Date")
<<<<<<< HEAD
    repeat_number = fields.Integer(string="Repetitions")

    repeat_on_month = fields.Selection([
        ('date', 'Date of the Month'),
        ('day', 'Day of the Month'),
    ])

    repeat_on_year = fields.Selection([
        ('date', 'Date of the Year'),
        ('day', 'Day of the Year'),
    ])

    mon = fields.Boolean(string="Mon")
    tue = fields.Boolean(string="Tue")
    wed = fields.Boolean(string="Wed")
    thu = fields.Boolean(string="Thu")
    fri = fields.Boolean(string="Fri")
    sat = fields.Boolean(string="Sat")
    sun = fields.Boolean(string="Sun")

    repeat_day = fields.Selection([
        (str(i), str(i)) for i in range(1, 32)
    ])
    repeat_week = fields.Selection([
        ('first', 'First'),
        ('second', 'Second'),
        ('third', 'Third'),
        ('last', 'Last'),
    ])
    repeat_weekday = fields.Selection([
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
        ('sun', 'Sunday'),
    ], string='Day Of The Week', readonly=False)
    repeat_month = fields.Selection([
        ('january', 'January'),
        ('february', 'February'),
        ('march', 'March'),
        ('april', 'April'),
        ('may', 'May'),
        ('june', 'June'),
        ('july', 'July'),
        ('august', 'August'),
        ('september', 'September'),
        ('october', 'October'),
        ('november', 'November'),
        ('december', 'December'),
    ])

    @api.constrains('repeat_unit', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')
    def _check_recurrence_days(self):
        for project in self.filtered(lambda p: p.repeat_unit == 'week'):
            if not any([project.mon, project.tue, project.wed, project.thu, project.fri, project.sat, project.sun]):
                raise ValidationError(_('You should select a least one day'))
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @api.constrains('repeat_interval')
    def _check_repeat_interval(self):
        if self.filtered(lambda t: t.repeat_interval <= 0):
            raise ValidationError(_('The interval should be greater than 0'))
<<<<<<< HEAD

    @api.constrains('repeat_number', 'repeat_type')
    def _check_repeat_number(self):
        if self.filtered(lambda t: t.repeat_type == 'after' and t.repeat_number <= 0):
            raise ValidationError(_('Should repeat at least once'))
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @api.constrains('repeat_type', 'repeat_until')
    def _check_repeat_until_date(self):
        today = fields.Date.today()
        if self.filtered(lambda t: t.repeat_type == 'until' and t.repeat_until < today):
            raise ValidationError(_('The end date should be in the future'))
<<<<<<< HEAD

    @api.constrains('repeat_unit', 'repeat_on_month', 'repeat_day', 'repeat_type', 'repeat_until')
    def _check_repeat_until_month(self):
        if self.filtered(lambda r: r.repeat_type == 'until' and r.repeat_unit == 'month' and r.repeat_until and r.repeat_on_month == 'date'
           and int(r.repeat_day) > r.repeat_until.day and monthrange(r.repeat_until.year, r.repeat_until.month)[1] != r.repeat_until.day):
            raise ValidationError(_('The end date should be after the day of the month or the last day of the month'))
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

    @api.model
    def _get_recurring_fields_to_copy(self):
        return [
            'analytic_account_id',
            'company_id',
            'description',
            'displayed_image_id',
            'email_cc',
            'message_partner_ids',
            'name',
            'parent_id',
            'partner_id',
            'partner_phone',
            'planned_hours',
            'project_id',
            'project_privacy_visibility',
            'recurrence_id',
            'recurring_task',
            'sequence',
            'tag_ids',
            'user_ids',
        ]

    @api.model
    def _get_recurring_fields_to_postpone(self):
        return [
            'date_deadline',
        ]

<<<<<<< HEAD
        if repeat_unit == 'week'\
            or (repeat_unit == 'month' and repeat_on_month == 'day')\
            or (repeat_unit == 'year' and repeat_on_year == 'day'):
            rrule_kwargs['byweekday'] = weekdays

        if repeat_unit == 'day':
            rrule_kwargs['freq'] = DAILY
        elif repeat_unit == 'month':
            rrule_kwargs['freq'] = MONTHLY
            if repeat_on_month == 'date':
                start = date_start - relativedelta(days=1)
                start = start.replace(day=min(repeat_day, monthrange(start.year, start.month)[1]))
                if start < date_start:
                    # Ensure the next recurrence is in the future
                    start += relativedelta(months=repeat_interval)
                    start = start.replace(day=min(repeat_day, monthrange(start.year, start.month)[1]))
                can_generate_date = (lambda: start <= repeat_until) if repeat_type == 'until' else (lambda: len(dates) < count)
                while can_generate_date():
                    dates.append(start)
                    start += relativedelta(months=repeat_interval)
                    start = start.replace(day=min(repeat_day, monthrange(start.year, start.month)[1]))
                return dates
        elif repeat_unit == 'year':
            rrule_kwargs['freq'] = YEARLY
            month = list(MONTHS.keys()).index(repeat_month) + 1 if repeat_month else date_start.month
            repeat_month = repeat_month or list(MONTHS.keys())[month - 1]
            rrule_kwargs['bymonth'] = month
            if repeat_on_year == 'date':
                rrule_kwargs['bymonthday'] = min(repeat_day, MONTHS.get(repeat_month))
                rrule_kwargs['bymonth'] = month
        else:
            rrule_kwargs['freq'] = WEEKLY

        rules = rrule(**rrule_kwargs)
        return list(rules) if rules else []

    def _new_task_values(self, task):
        self.ensure_one()
        fields_to_copy = self._get_recurring_fields()
        task_values = task.read(fields_to_copy).pop()
        create_values = {
            field: value[0] if isinstance(value, tuple) else value for field, value in task_values.items()
=======
    def _get_last_task_id_per_recurrence_id(self):
        return {} if not self else {
            record['recurrence_id'][0]: record['max_id']
            for record in self.env['project.task'].sudo()._read_group(
                [('recurrence_id', 'in', self.ids)],
                ['max_id:max(id)'],
                ['recurrence_id'],
            )
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
        }

    def _get_recurrence_delta(self):
        return relativedelta(**{
            f"{self.repeat_unit}s": self.repeat_interval
        })

    def _create_next_occurrence(self, occurrence_from):
        self.ensure_one()
        if occurrence_from.allow_recurring_tasks:
            self.env['project.task'].sudo().create(
                self._create_next_occurrence_values(occurrence_from)
            )

    def _create_next_occurrence_values(self, occurrence_from):
        self.ensure_one()
        fields_to_copy = occurrence_from.read(self._get_recurring_fields_to_copy()).pop()
        create_values = {
            field: value[0] if isinstance(value, tuple) else value
            for field, value in fields_to_copy.items()
        }

        fields_to_postpone = occurrence_from.read(self._get_recurring_fields_to_postpone()).pop()
        fields_to_postpone.pop('id', None)
        create_values.update({
            field: value and value + self._get_recurrence_delta()
            for field, value in fields_to_postpone.items()
        })

        create_values['stage_id'] = occurrence_from.project_id.type_ids[0].id if occurrence_from.project_id.type_ids else occurrence_from.stage_id.id
        if occurrence_from.allow_subtasks:
            create_values['child_ids'] = [
                Command.create(self._create_next_occurrence_values(child)) for child in occurrence_from.with_context(active_test=False).child_ids
            ]
        return create_values
