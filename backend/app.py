
import os
import mysql.connector
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

conn = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running"})

@app.route("/api/test-db")
def test_db():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({
            "success": True,
            "message": "MySQL connected successfully"
        })
    except mysql.connector.Error as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)