const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
).replace(/\/$/, "");

async function ensureSuccessful(response, fallbackMessage) {
  if (response.ok) return;

  let message = fallbackMessage;
  if (response.headers.get("content-type")?.includes("application/json")) {
    const result = await response.json();
    if (typeof result.error === "string") message = result.error;
  }
  throw new Error(message);
}

export async function testBackend() {
  const response = await fetch(`${API_BASE_URL}/`);
  await ensureSuccessful(response, "Backend request failed");
  return response.json();
}

export async function testDatabase() {
  const response = await fetch(`${API_BASE_URL}/api/test-db`);
  await ensureSuccessful(response, "Database request failed");
  return response.json();
}

// Load every saved key from MySQL -> { "pako.workOrders": [...], ... }
export async function fetchAllStore() {
  const response = await fetch(`${API_BASE_URL}/api/store`);
  await ensureSuccessful(response, "Could not load data from server");
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
  await ensureSuccessful(response, `Could not save ${key}`);
  return response.json();
}