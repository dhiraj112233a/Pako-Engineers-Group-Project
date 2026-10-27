
import { useCallback, useEffect, useState } from "react";
import { testDatabase } from "../services/api";
import "../styles/Erp.css";
import "../styles/ErpExtras.css";

export default function BackendConnectionTest() {
  const [status, setStatus] = useState("Checking connection...");
  const [data, setData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const loadConnection = useCallback(async () => {
    try {
      const result = await testDatabase();
      if (!result.success) throw new Error(result.error || "Database test failed.");
      return { status: "React, Flask, and MySQL are connected.", data: result.data };
    } catch (error) {
      console.error("Connection error:", error);
      return {
        status: error instanceof Error ? error.message : "Could not connect to the backend.",
        data: null,
      };
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadConnection().then((result) => {
      if (!active) return;
      setStatus(result.status);
      setData(result.data);
      setIsChecking(false);
    });
    return () => { active = false; };
  }, [loadConnection]);

  const checkConnection = async () => {
    setIsChecking(true);
    setStatus("Checking connection...");
    setData(null);
    const result = await loadConnection();
    setStatus(result.status);
    setData(result.data);
    setIsChecking(false);
  };

  return (
    <section className="erp-page">
      <header className="erp-head">
        <div>
          <h1>Backend Connection</h1>
          <p>Check that the application API can reach its MySQL database.</p>
        </div>
        <button
          type="button"
          className="erp-btn"
          onClick={checkConnection}
          disabled={isChecking}
        >
          {isChecking ? "Checking..." : "Try again"}
        </button>
      </header>
      <div className="erp-card backend-test-result" role="status" aria-live="polite">
        <span className={`backend-test-indicator ${data ? "connected" : isChecking ? "checking" : "disconnected"}`} />
        <div>
          <h2>{data ? "Database connected" : isChecking ? "Connection in progress" : "Connection unavailable"}</h2>
          <p>{status}</p>
          {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
      </div>
      {!data && !isChecking && (
        <p className="backend-test-help">
          Check that the Flask server is running and that <code>backend/.env</code> contains the correct MySQL connection settings.
        </p>
      )}
    </section>
  );
}
