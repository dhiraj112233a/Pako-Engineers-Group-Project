
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
