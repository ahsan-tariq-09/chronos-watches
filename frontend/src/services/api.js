const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/watches";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // noop
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const WatchAPI = {
  getAllWatches: async () => handleResponse(await fetch(API_BASE)),
  getWatchById: async (id) => handleResponse(await fetch(`${API_BASE}/${id}`)),
  addWatch: async (watchData) =>
    handleResponse(
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchData)
      })
    ),
  updateWatch: async (id, watchData) =>
    handleResponse(
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchData)
      })
    ),
  deleteWatch: async (id) => handleResponse(await fetch(`${API_BASE}/${id}`, { method: "DELETE" }))
};
