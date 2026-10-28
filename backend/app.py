import json
import os
from contextlib import contextmanager
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, current_app, jsonify, request
from flask_cors import CORS
load_dotenv()
app = Flask(__name__)
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
CORS(app, origins=allowed_origins)
@contextmanager
def database_cursor(dictionary=False):
    required_settings = ("MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE")
    missing_settings = [name for name in required_settings if not os.getenv(name)]
    if missing_settings:
        raise RuntimeError(
            "Missing MySQL settings: " + ", ".join(missing_settings)
        )
    try:
        port = int(os.getenv("MYSQL_PORT", "3306"))
    except ValueError as error:
        raise RuntimeError("MYSQL_PORT must be an integer") from error
    if not 1 <= port <= 65535:
        raise RuntimeError("MYSQL_PORT must be between 1 and 65535")
    connection = mysql.connector.connect(
        host=os.environ["MYSQL_HOST"],
        port=port,
        user=os.environ["MYSQL_USER"],
        password=os.getenv("MYSQL_PASSWORD", ""),
        database=os.environ["MYSQL_DATABASE"],
        connection_timeout=5,
    )
    cursor = None
    try:
        cursor = connection.cursor(dictionary=dictionary)
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS erp_store (
                store_key VARCHAR(255) NOT NULL PRIMARY KEY,
                store_value JSON NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            )
            """
        )
        yield connection, cursor
    finally:
        if cursor is not None:
            cursor.close()
        connection.close()
def database_error_response(message, error=None):
    if error is not None:
        current_app.logger.error("%s", error)
    return jsonify({"success": False, "error": message}), 503
@app.errorhandler(400)
@app.errorhandler(415)
def handle_request_error(error):
    return jsonify({"success": False, "error": error.description}), error.code
@app.get("/")
def health():
    return jsonify({"success": True, "message": "Pako ERP API is running"})
@app.get("/api/test-db")
def test_database():
    try:
        with database_cursor() as (connection, cursor):
            cursor.execute("SELECT 1")
            cursor.fetchone()
        return jsonify({"success": True, "data": {"database": "MySQL"}})
    except RuntimeError as error:
        return database_error_response(str(error), error)
    except mysql.connector.Error:
        current_app.logger.exception("MySQL connection test failed")
        return database_error_response("Could not connect to MySQL")
@app.get("/api/store")
def fetch_store():
    try:
        with database_cursor(dictionary=True) as (_, cursor):
            cursor.execute("SELECT store_key, store_value FROM erp_store")
            rows = cursor.fetchall()
        data = {
            row["store_key"]: (
                json.loads(row["store_value"])
                if isinstance(row["store_value"], str)
                else row["store_value"]
            )
            for row in rows
        }
        return jsonify({"success": True, "data": data})
    except RuntimeError as error:
        return database_error_response(str(error), error)
    except mysql.connector.Error:
        current_app.logger.exception("Could not load ERP data from MySQL")
        return database_error_response("Could not load data from MySQL")
@app.put("/api/store/<key>")
def save_store(key):
    if not key:
        return jsonify({"success": False, "error": "A store key is required"}), 400
    payload = request.get_json()
    if not isinstance(payload, dict) or "value" not in payload:
        return jsonify(
            {"success": False, "error": "Request JSON must contain a value"}
        ), 400
    try:
        serialized_value = json.dumps(payload["value"])
    except (TypeError, ValueError):
        return jsonify({"success": False, "error": "Value must be JSON serializable"}), 400
    try:
        with database_cursor() as (connection, cursor):
            cursor.execute(
                """
                INSERT INTO erp_store (store_key, store_value)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE store_value = VALUES(store_value)
                """,
                (key, serialized_value),
            )
            connection.commit()
        return jsonify({"success": True, "key": key})
    except RuntimeError as error:
        return database_error_response(str(error), error)
    except mysql.connector.Error:
        current_app.logger.exception("Could not save ERP data to MySQL")
        return database_error_response("Could not save data to MySQL")
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "5000")), debug=False)