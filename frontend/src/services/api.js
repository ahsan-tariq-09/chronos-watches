const API_BASE = "/api/watches";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Request failed.";
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // ignore parse failure
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const WatchAPI = {
  async getAllWatches() {
    const response = await fetch(API_BASE);
    return handleResponse(response);
  },

  async getWatchById(id) {
    const response = await fetch(`${API_BASE}/${id}`);
    return handleResponse(response);
  },

  async addWatch(watchData) {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(watchData)
    });
    return handleResponse(response);
  },

  async updateWatch(id, watchData) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(watchData)
    });
    return handleResponse(response);
  },

  async deleteWatch(id) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE"
    });
    return handleResponse(response);
  }
};