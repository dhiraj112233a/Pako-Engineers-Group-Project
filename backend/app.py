from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running"})

@app.route("/api/test-db")
def test_db():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM connection_test")

        return jsonify({
            "success": True,
            "data": cursor.fetchall()
        })
    except Exception:
        app.logger.exception("Database query failed")
        return jsonify({
            "success": False,
            "message": "Database connection or query failed"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    app.run(debug=True, port=5000)