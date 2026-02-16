import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import KpiCards from './components/KpiCards';
import Charts from './components/Charts';
import ControlPanel from './components/ControlPanel';
import StatusPanel from './components/StatusPanel';
import AnalyticsDetail from './components/AnalyticsDetail';
import { fetchAppliances, fetchApplianceData } from './api/applianceApi';

const POLL_INTERVAL = 10000; // 10 seconds

const emptyData = {
    latest: { voltage: 0, current: 0, power: 0, temperature: 0, relayStatus: 0, timestamp: null },
    analytics: {
        totalEnergy: 0, todayEnergy: 0, avgPower: 0, peakPower: 0, minPower: 0,
        powerFluctuation: 0, loadFactor: 0, voltageStability: 100, currentStability: 100,
        energyCost: 0, dailyCost: 0, monthlyProjection: 0, carbonEmission: 0,
        maxTemperature: 0, avgTemperature: 0, overheatWarning: false,
        onTime: 0, offTime: 0, switchCount: 0, bulbLifetimeUsage: 0, alerts: [],
    },
    charts: {
        timestamps: [], powerData: [], temperatureData: [], voltageData: [],
        currentData: [], energyData: [], dailyEnergy: [],
    },
};

export default function App() {
    const [appliances, setAppliances] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [data, setData] = useState(emptyData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Fetch appliance list on mount
    useEffect(() => {
        async function loadAppliances() {
            try {
                const res = await fetchAppliances();
                setAppliances(res.appliances || []);
                if (res.appliances?.length > 0) {
                    setActiveId(res.appliances[0].applianceId);
                }
            } catch (err) {
                console.error('Failed to fetch appliances:', err);
                // Fallback to default appliance when backend is unreachable
                setAppliances([{
                    deviceId: 'ESP001',
                    applianceName: 'Bulb',
                    applianceId: 'LOAD_01',
                    icon: '💡',
                    type: 'lighting',
                    ratedPower: 60,
                }]);
                setActiveId('LOAD_01');
            }
        }
        loadAppliances();
    }, []);

    // Fetch data for active appliance with polling
    const loadData = useCallback(async () => {
        if (!activeId) return;
        try {
            const res = await fetchApplianceData(activeId);
            if (res.success) {
                setData({
                    latest: res.latest,
                    analytics: res.analytics,
                    charts: res.charts,
                });
                setIsOnline(true);
                setError(null);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setIsOnline(false);
            setError(err.response?.data?.error || 'Unable to connect to server');
        } finally {
            setLoading(false);
            setLastUpdate(new Date().toLocaleTimeString());
        }
    }, [activeId]);

    useEffect(() => {
        setLoading(true);
        loadData();
        const interval = setInterval(loadData, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [loadData]);

    // Handle appliance selection
    const handleSelect = (id) => {
        if (id !== activeId) {
            setActiveId(id);
            setLoading(true);
            setData(emptyData);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar
                appliances={appliances}
                activeId={activeId}
                onSelect={handleSelect}
            />

            <main className="main-content">
                {/* Header */}
                <div className="dashboard-header slide-up">
                    <div>
                        <h1>Energy Monitoring Dashboard</h1>
                        <div className="subtitle">
                            Real-time monitoring • {appliances.find(a => a.applianceId === activeId)?.applianceName || 'Loading...'}
                        </div>
                    </div>
                    <div className="header-status">
                        <span className={`status-dot ${isOnline ? '' : 'offline'}`}></span>
                        <span>{isOnline ? 'Live' : 'Offline'}</span>
                        {lastUpdate && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>• {lastUpdate}</span>}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Connecting to IoT sensors...</div>
                    </div>
                )}

                {/* Error State — still show dashboard with last known data */}
                {error && !loading && (
                    <div className="alert-item warning" style={{ marginBottom: 20 }}>
                        ⚠ {error} — Showing last known data. Auto-retrying every 10s.
                    </div>
                )}

                {/* Dashboard Content */}
                {!loading && (
                    <>
                        {/* KPI Cards */}
                        <KpiCards latest={data.latest} analytics={data.analytics} />

                        {/* Charts */}
                        <Charts charts={data.charts} />

                        {/* Control & Status Panels */}
                        <div className="panels-row">
                            <ControlPanel
                                applianceId={activeId}
                                relayStatus={data.latest.relayStatus}
                                analytics={data.analytics}
                            />
                            <StatusPanel
                                isOnline={isOnline}
                                analytics={data.analytics}
                                latest={data.latest}
                            />
                        </div>

                        {/* Detailed Analytics Grid */}
                        <AnalyticsDetail analytics={data.analytics} />
                    </>
                )}
            </main>
        </div>
    );
}
