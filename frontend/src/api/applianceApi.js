import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
});

/**
 * Fetch list of all registered appliances
 */
export async function fetchAppliances() {
    const { data } = await api.get('/appliances');
    return data;
}

/**
 * Fetch data + analytics for a specific appliance
 * @param {string} id - Appliance ID (e.g. "LOAD_01")
 * @param {number} results - Number of ThingSpeak feed entries to fetch
 */
export async function fetchApplianceData(id, results = 100) {
    const { data } = await api.get(`/appliance/${id}/data`, {
        params: { results },
    });
    return data;
}

/**
 * Control relay state
 * @param {string} id - Appliance ID
 * @param {number} state - 0 (OFF) or 1 (ON)
 */
export async function controlRelay(id, state) {
    const { data } = await api.post(`/appliance/${id}/relay`, { state });
    return data;
}

/**
 * Health check
 */
export async function checkHealth() {
    const { data } = await api.get('/health');
    return data;
}

export default api;
