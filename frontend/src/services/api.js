const API_BASE_URL = "http://127.0.0.1:5000";

export async function testBackend() {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}

export async function testDatabase() {
  const response = await fetch(`${API_BASE_URL}/api/test-db`);

  if (!response.ok) {
    throw new Error("Database request failed");
  }

  return response.json();
}

// Load every saved key from MySQL -> { "pako.workOrders": [...], ... }
export async function fetchAllStore() {
  const response = await fetch(`${API_BASE_URL}/api/store`);

  if (!response.ok) {
    throw new Error("Could not load data from server");
  }

  const result = await response.json();
  return result.data || {};
}

// Save one key to MySQL
export async function saveStoreKey(key, value) {
  const response = await fetch(`${API_BASE_URL}/api/store/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(`Could not save ${key}`);
  }

  return response.json();
}