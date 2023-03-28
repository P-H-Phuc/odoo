from odoo.addons.spreadsheet.tests.validate_spreadsheet_data import (
    ValidateSpreadsheetData,
)
from odoo.tests.common import tagged


@tagged("-at_install", "post_install")
class TestSpreadsheetDashboardData(ValidateSpreadsheetData):
    def test_validate_dashboard_data(self):
        """validate fields and models used in dashboards"""
        dashboards = self.env["spreadsheet.dashboard"].search([])
        for dashboard in dashboards:
            with self.subTest(dashboard.name):
<<<<<<< HEAD
                self.validate_spreadsheet_data(dashboard.raw, dashboard.name)
=======
                self.validate_spreadsheet_data(dashboard.spreadsheet_data, dashboard.name)
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
