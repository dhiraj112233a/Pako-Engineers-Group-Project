import logging
import os
import unittest
from unittest.mock import patch

import mysql.connector

from app import app


class FakeCursor:
    def __init__(self, rows, dictionary):
        self.rows = rows
        self.dictionary = dictionary
        self.result = []

    def execute(self, query, params=None):
        query = query.strip()
        if query.startswith("SELECT 1"):
            self.result = [(1,)]
        elif query.startswith("SELECT store_key"):
            self.result = [
                {"store_key": key, "store_value": value}
                if self.dictionary
                else (key, value)
                for key, value in self.rows.items()
            ]
        elif query.startswith("INSERT INTO erp_store"):
            self.rows[params[0]] = params[1]

    def fetchone(self):
        return self.result[0] if self.result else None

    def fetchall(self):
        return self.result

    def close(self):
        pass


class FakeConnection:
    def __init__(self, rows):
        self.rows = rows

    def cursor(self, dictionary=False):
        return FakeCursor(self.rows, dictionary)

    def commit(self):
        pass

    def close(self):
        pass


class BackendApiTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        previous_log_level = app.logger.level
        app.logger.setLevel(logging.CRITICAL)
        self.addCleanup(app.logger.setLevel, previous_log_level)
        self.environment = patch.dict(
            os.environ,
            {
                "MYSQL_HOST": "localhost",
                "MYSQL_USER": "test",
                "MYSQL_PASSWORD": "test",
                "MYSQL_DATABASE": "pako_test",
                "MYSQL_PORT": "3306",
            },
            clear=True,
        )
        self.environment.start()
        self.rows = {}
        self.connection = patch(
            "app.mysql.connector.connect",
            side_effect=lambda **_: FakeConnection(self.rows),
        )
        self.connection.start()
        self.addCleanup(self.connection.stop)
        self.addCleanup(self.environment.stop)

    def test_health_route_and_frontend_cors(self):
        response = self.client.get("/", headers={"Origin": "http://localhost:5173"})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["success"])
        self.assertEqual(
            response.headers["Access-Control-Allow-Origin"],
            "http://localhost:5173",
        )

    def test_database_test_route(self):
        response = self.client.get("/api/test-db")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["data"]["database"], "MySQL")

    def test_store_round_trip_preserves_json(self):
        value = {"orders": [{"id": 1, "active": True}], "empty": None}
        saved = self.client.put("/api/store/pako.workOrders", json={"value": value})
        updated_value = {"orders": [], "updated": True}
        updated = self.client.put(
            "/api/store/pako.workOrders",
            json={"value": updated_value},
        )
        loaded = self.client.get("/api/store")

        self.assertEqual(saved.status_code, 200)
        self.assertTrue(saved.get_json()["success"])
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(loaded.status_code, 200)
        self.assertEqual(
            loaded.get_json()["data"]["pako.workOrders"],
            updated_value,
        )

    def test_rejects_missing_store_value(self):
        response = self.client.put("/api/store/pako.test", json={})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.get_json()["success"])

    def test_reports_missing_database_configuration(self):
        with patch.dict(os.environ, {}, clear=True):
            response = self.client.get("/api/test-db")

        self.assertEqual(response.status_code, 503)
        self.assertIn("MYSQL_HOST", response.get_json()["error"])

    def test_reports_database_connection_failure(self):
        with patch(
            "app.mysql.connector.connect",
            side_effect=mysql.connector.Error("test connection failure"),
        ):
            response = self.client.get("/api/test-db")

        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.get_json()["success"])


if __name__ == "__main__":
    unittest.main()
