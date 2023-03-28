# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.


from odoo.addons.base.tests.common import HttpCase
from odoo.tests.common import tagged
from odoo.tests.common import users

from odoo.addons.hr_holidays.tests.common import TestHrHolidaysCommon

<<<<<<< HEAD
@tagged('post_install', '-at_install')
=======
@tagged('post_install', '-at_install', 'holiday_calendar')
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
class TestHolidaysCalendar(HttpCase, TestHrHolidaysCommon):

    @users('admin')
    def test_hours_time_off_request_calendar_view(self):
        """
        Testing the flow of clicking on a day, save the leave request directly
        and verify that the start/end time are correctly set
        """
        self.env.user.tz = 'UTC'
        calendar = self.env.user.employee_id.resource_calendar_id.attendance_ids
<<<<<<< HEAD
        expected_start_thursday = calendar[6].hour_from
        expected_end_thursday = calendar[7].hour_to
=======
        expected_start_thursday = calendar[9].hour_from
        expected_end_thursday = calendar[11].hour_to
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6

        self.start_tour('/', 'time_off_request_calendar_view', login='admin')

        last_leave = self.env['hr.leave'].search([('employee_id.id', '=', self.env.user.employee_id.id)]).sorted(lambda leave: leave.create_date)[-1]
        self.assertEqual(last_leave.date_from.weekday(), 3, "It should be Thursday")
        self.assertEqual(last_leave.date_from.hour, expected_start_thursday, "Wrong start of the day")
        self.assertEqual(last_leave.date_to.hour, expected_end_thursday, "Wrong end of the day")
