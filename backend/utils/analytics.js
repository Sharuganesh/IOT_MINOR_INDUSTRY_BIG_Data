/**
 * Analytics Engine
 * 
 * Computes all analytics from raw ThingSpeak feed data.
 * Designed to work per-appliance for scalability.
 */

const TARIFF = parseFloat(process.env.ENERGY_TARIFF) || 8; // ₹ per kWh
const CARBON_FACTOR = parseFloat(process.env.CARBON_FACTOR) || 0.82; // kg CO2 per kWh

/**
 * Parse a single ThingSpeak feed entry into numeric values
 */
function parseFeedEntry(entry) {
    return {
        timestamp: entry.created_at,
        voltage: parseFloat(entry.field1) || 0,
        current: parseFloat(entry.field2) || 0,
        power: parseFloat(entry.field3) || 0,
        energy: parseFloat(entry.field4) || 0,
        temperature: parseFloat(entry.field5) || 0,
        relayStatus: parseInt(entry.field6, 10) || 0,
    };
}

/**
 * Get today's start timestamp in ISO
 */
function getTodayStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

/**
 * Compute comprehensive analytics from ThingSpeak feeds
 * 
 * @param {Array} feeds - Raw ThingSpeak feed entries
 * @returns {Object} - { latest, analytics, charts }
 */
function computeAnalytics(feeds) {
    if (!feeds || feeds.length === 0) {
        return getEmptyAnalytics();
    }

    const parsed = feeds.map(parseFeedEntry);
    const latest = parsed[parsed.length - 1];

    // ── Chart Data ──────────────────────────────────────────
    const timestamps = parsed.map(p => p.timestamp);
    const powerData = parsed.map(p => p.power);
    const temperatureData = parsed.map(p => p.temperature);
    const voltageData = parsed.map(p => p.voltage);
    const currentData = parsed.map(p => p.current);
    const energyData = parsed.map(p => p.energy);

    // ── Power Analytics ─────────────────────────────────────
    const powers = parsed.map(p => p.power).filter(p => p > 0);
    const avgPower = powers.length > 0
        ? +(powers.reduce((a, b) => a + b, 0) / powers.length).toFixed(2)
        : 0;
    const peakPower = powers.length > 0 ? +Math.max(...powers).toFixed(2) : 0;
    const minPower = powers.length > 0 ? +Math.min(...powers).toFixed(2) : 0;

    // Power fluctuation detection
    const powerStdDev = computeStdDev(powers);
    const powerFluctuation = avgPower > 0
        ? +((powerStdDev / avgPower) * 100).toFixed(2)
        : 0;

    // ── Energy Analytics ────────────────────────────────────
    const energyValues = parsed.map(p => p.energy).filter(e => e > 0);
    const totalEnergy = energyValues.length > 0
        ? +Math.max(...energyValues).toFixed(4)
        : 0;

    // Today's energy
    const todayStart = getTodayStart();
    const todayEntries = parsed.filter(p => p.timestamp >= todayStart);
    const todayEnergyValues = todayEntries.map(p => p.energy).filter(e => e > 0);
    const todayEnergy = todayEnergyValues.length > 0
        ? +(Math.max(...todayEnergyValues) - Math.min(...todayEnergyValues)).toFixed(4)
        : 0;

    // ── Cost Analysis ───────────────────────────────────────
    const energyCost = +(totalEnergy * TARIFF).toFixed(2);
    const dailyCost = +(todayEnergy * TARIFF).toFixed(2);
    const monthlyProjection = +(dailyCost * 30).toFixed(2);

    // ── Efficiency Analysis ─────────────────────────────────
    const loadFactor = peakPower > 0
        ? +((avgPower / peakPower) * 100).toFixed(2)
        : 0;

    // Voltage stability
    const voltages = parsed.map(p => p.voltage).filter(v => v > 0);
    const avgVoltage = voltages.length > 0
        ? voltages.reduce((a, b) => a + b, 0) / voltages.length
        : 0;
    const voltageStdDev = computeStdDev(voltages);
    const voltageStability = avgVoltage > 0
        ? +(100 - (voltageStdDev / avgVoltage) * 100).toFixed(2)
        : 100;

    // Current stability
    const currents = parsed.map(p => p.current).filter(c => c > 0);
    const currentStdDev = computeStdDev(currents);
    const avgCurrent = currents.length > 0
        ? currents.reduce((a, b) => a + b, 0) / currents.length
        : 0;
    const currentStability = avgCurrent > 0
        ? +(100 - (currentStdDev / avgCurrent) * 100).toFixed(2)
        : 100;

    // ── Environmental Impact ────────────────────────────────
    const carbonEmission = +(totalEnergy * CARBON_FACTOR).toFixed(4);

    // ── Temperature Analysis ────────────────────────────────
    const temps = parsed.map(p => p.temperature).filter(t => t > 0);
    const maxTemperature = temps.length > 0 ? +Math.max(...temps).toFixed(2) : 0;
    const avgTemperature = temps.length > 0
        ? +(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
        : 0;
    const overheatWarning = maxTemperature > 50; // °C threshold

    // ── Relay Analytics ─────────────────────────────────────
    const { onTime, offTime, switchCount } = computeRelayAnalytics(parsed);

    // Estimated bulb lifetime usage (rated at ~1000 hrs for incandescent)
    const bulbLifetimeHours = 1000;
    const bulbLifetimeUsage = +((onTime / bulbLifetimeHours) * 100).toFixed(2);

    // ── Daily Energy Aggregation for Bar Chart ──────────────
    const dailyEnergy = computeDailyEnergy(parsed);

    // ── Alerts ──────────────────────────────────────────────
    const alerts = [];
    if (latest.power > 100) {
        alerts.push({ type: 'warning', message: `High power consumption: ${latest.power}W` });
    }
    if (latest.temperature > 50) {
        alerts.push({ type: 'danger', message: `Overheating detected: ${latest.temperature}°C` });
    }
    if (voltageStability < 90) {
        alerts.push({ type: 'warning', message: `Voltage fluctuation high: ${voltageStability}% stability` });
    }
    if (powerFluctuation > 30) {
        alerts.push({ type: 'warning', message: `Power fluctuation detected: ${powerFluctuation}%` });
    }

    return {
        latest: {
            voltage: latest.voltage,
            current: latest.current,
            power: latest.power,
            temperature: latest.temperature,
            relayStatus: latest.relayStatus,
            timestamp: latest.timestamp,
        },
        analytics: {
            totalEnergy,
            todayEnergy,
            avgPower,
            peakPower,
            minPower,
            powerFluctuation,
            loadFactor,
            voltageStability,
            currentStability,
            energyCost,
            dailyCost,
            monthlyProjection,
            carbonEmission,
            maxTemperature,
            avgTemperature,
            overheatWarning,
            onTime: +onTime.toFixed(2),
            offTime: +offTime.toFixed(2),
            switchCount,
            bulbLifetimeUsage,
            alerts,
        },
        charts: {
            timestamps,
            powerData,
            temperatureData,
            voltageData,
            currentData,
            energyData,
            dailyEnergy,
        },
    };
}

/**
 * Compute standard deviation
 */
function computeStdDev(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
}

/**
 * Compute relay ON/OFF durations from parsed feed data
 */
function computeRelayAnalytics(parsed) {
    let onTime = 0;  // hours
    let offTime = 0; // hours
    let switchCount = 0;
    let lastStatus = null;

    for (let i = 1; i < parsed.length; i++) {
        const timeDiffMs = new Date(parsed[i].timestamp) - new Date(parsed[i - 1].timestamp);
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        if (parsed[i - 1].relayStatus === 1) {
            onTime += timeDiffHours;
        } else {
            offTime += timeDiffHours;
        }

        if (lastStatus !== null && parsed[i].relayStatus !== lastStatus) {
            switchCount++;
        }
        lastStatus = parsed[i].relayStatus;
    }

    return { onTime, offTime, switchCount };
}

/**
 * Aggregate energy data by day for bar chart
 */
function computeDailyEnergy(parsed) {
    const daily = {};

    for (const entry of parsed) {
        const day = entry.timestamp.split('T')[0];
        if (!daily[day]) {
            daily[day] = { min: entry.energy, max: entry.energy };
        } else {
            daily[day].min = Math.min(daily[day].min, entry.energy);
            daily[day].max = Math.max(daily[day].max, entry.energy);
        }
    }

    return Object.entries(daily).map(([date, { min, max }]) => ({
        date,
        energy: +((max - min).toFixed(4)),
    }));
}

/**
 * Return empty analytics structure (used when no data is available)
 */
function getEmptyAnalytics() {
    return {
        latest: {
            voltage: 0,
            current: 0,
            power: 0,
            temperature: 0,
            relayStatus: 0,
            timestamp: null,
        },
        analytics: {
            totalEnergy: 0,
            todayEnergy: 0,
            avgPower: 0,
            peakPower: 0,
            minPower: 0,
            powerFluctuation: 0,
            loadFactor: 0,
            voltageStability: 100,
            currentStability: 100,
            energyCost: 0,
            dailyCost: 0,
            monthlyProjection: 0,
            carbonEmission: 0,
            maxTemperature: 0,
            avgTemperature: 0,
            overheatWarning: false,
            onTime: 0,
            offTime: 0,
            switchCount: 0,
            bulbLifetimeUsage: 0,
            alerts: [],
        },
        charts: {
            timestamps: [],
            powerData: [],
            temperatureData: [],
            voltageData: [],
            currentData: [],
            energyData: [],
            dailyEnergy: [],
        },
    };
}

module.exports = { computeAnalytics };
