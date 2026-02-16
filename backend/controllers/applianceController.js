/**
 * Appliance Controller
 * 
 * Handles appliance listing, data fetching from ThingSpeak,
 * analytics computation, and relay control.
 */

const axios = require('axios');
const { APPLIANCES, getThingSpeakFeedUrl, getThingSpeakWriteUrl, FIELD_MAP } = require('../config/thingspeak');
const { computeAnalytics } = require('../utils/analytics');

/**
 * GET /api/appliances
 * Returns list of all registered appliances
 */
async function getAppliances(req, res) {
    try {
        const appliances = APPLIANCES.map(a => ({
            deviceId: a.deviceId,
            applianceName: a.applianceName,
            applianceId: a.applianceId,
            icon: a.icon,
            type: a.type,
            ratedPower: a.ratedPower,
        }));

        res.json({
            success: true,
            count: appliances.length,
            appliances,
        });
    } catch (error) {
        console.error('Error fetching appliances:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch appliances' });
    }
}

/**
 * GET /api/appliance/:id/data
 * Fetches ThingSpeak data and returns computed analytics
 */
async function getApplianceData(req, res) {
    try {
        const { id } = req.params;
        const results = parseInt(req.query.results) || 100;

        // Find appliance in registry
        const appliance = APPLIANCES.find(a => a.applianceId === id);
        if (!appliance) {
            return res.status(404).json({
                success: false,
                error: `Appliance with ID "${id}" not found`,
            });
        }

        // Fetch data from ThingSpeak
        const apiKey = process.env.THINGSPEAK_READ_API_KEY;
        const url = getThingSpeakFeedUrl(appliance.channelId, apiKey, results);

        const response = await axios.get(url, { timeout: 10000 });
        const feeds = response.data.feeds || [];
        const channel = response.data.channel || {};

        // Compute analytics
        const { latest, analytics, charts } = computeAnalytics(feeds);

        res.json({
            success: true,
            appliance: {
                id: appliance.applianceId,
                name: appliance.applianceName,
                deviceId: appliance.deviceId,
                icon: appliance.icon,
                type: appliance.type,
                ratedPower: appliance.ratedPower,
            },
            channel: {
                id: channel.id,
                name: channel.name,
                lastEntryId: channel.last_entry_id,
                entriesCount: feeds.length,
            },
            latest,
            analytics,
            charts,
        });
    } catch (error) {
        console.error('Error fetching appliance data:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                error: 'ThingSpeak API error',
                details: error.response.data,
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch appliance data',
            details: error.message,
        });
    }
}

/**
 * POST /api/appliance/:id/relay
 * Control relay state (ON/OFF) via ThingSpeak write API
 * 
 * Body: { state: 0 | 1 }
 * 
 * Note: This writes to ThingSpeak field6 (relay status).
 * The ESP8266 should poll ThingSpeak to read relay commands.
 */
async function controlRelay(req, res) {
    try {
        const { id } = req.params;
        const { state } = req.body;

        // Validate
        const appliance = APPLIANCES.find(a => a.applianceId === id);
        if (!appliance) {
            return res.status(404).json({ success: false, error: 'Appliance not found' });
        }

        if (state !== 0 && state !== 1) {
            return res.status(400).json({ success: false, error: 'State must be 0 (OFF) or 1 (ON)' });
        }

        // Write to ThingSpeak
        const writeApiKey = process.env.THINGSPEAK_WRITE_API_KEY;
        const writeUrl = getThingSpeakWriteUrl();

        const response = await axios.post(writeUrl, null, {
            params: {
                api_key: writeApiKey,
                [FIELD_MAP.relayStatus]: state,
            },
            timeout: 10000,
        });

        // ThingSpeak returns 0 on failure, entry ID on success
        const entryId = response.data;
        if (entryId === 0) {
            return res.status(429).json({
                success: false,
                error: 'ThingSpeak rate limit. Wait 15 seconds between writes.',
            });
        }

        res.json({
            success: true,
            appliance: {
                id: appliance.applianceId,
                name: appliance.applianceName,
            },
            relay: {
                state,
                stateLabel: state === 1 ? 'ON' : 'OFF',
                entryId,
            },
        });
    } catch (error) {
        console.error('Error controlling relay:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to control relay',
            details: error.message,
        });
    }
}

module.exports = {
    getAppliances,
    getApplianceData,
    controlRelay,
};
