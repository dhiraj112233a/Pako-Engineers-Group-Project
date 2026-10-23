
import { useEffect, useState } from "react";
import { testDatabase } from "../services/api";

export default function BackendConnectionTest() {
  const [status, setStatus] = useState("Checking connection...");
  const [data, setData] = useState(null);

  useEffect(() => {
    testDatabase()
      .then((result) => {
        if (result.success) {
          setStatus("React, Flask, and MySQL are connected!");
          setData(result.data);
        } else {
          setStatus("Database test failed.");
        }
      })
      .catch((error) => {
        console.error("Connection error:", error);
        setStatus("Could not connect to backend.");
      });
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Backend Connection Test</h2>
      <p>{status}</p>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
