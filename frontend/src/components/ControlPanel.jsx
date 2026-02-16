import React, { useState } from 'react';
import { controlRelay } from '../api/applianceApi';

export default function ControlPanel({ applianceId, relayStatus, analytics }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleToggle = async () => {
        const newState = relayStatus === 1 ? 0 : 1;
        setLoading(true);
        setError(null);
        try {
            await controlRelay(applianceId, newState);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to control relay');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel-card">
            <div className="panel-title">
                🎛️ Control Panel
            </div>

            <button
                className={`relay-toggle-btn ${relayStatus === 1 ? 'turn-off' : 'turn-on'}`}
                onClick={handleToggle}
                disabled={loading}
            >
                {loading
                    ? 'Sending command...'
                    : relayStatus === 1
                        ? '⏹ Turn OFF'
                        : '▶ Turn ON'
                }
            </button>

            {error && (
                <div className="alert-item danger" style={{ marginTop: 12 }}>
                    ⚠ {error}
                </div>
            )}

            <div className="relay-info">
                <div className="relay-stat">
                    <div className="stat-label">ON Time</div>
                    <div className="stat-value" style={{ color: 'var(--neon-green)' }}>
                        {analytics.onTime} hrs
                    </div>
                </div>
                <div className="relay-stat">
                    <div className="stat-label">OFF Time</div>
                    <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>
                        {analytics.offTime} hrs
                    </div>
                </div>
                <div className="relay-stat">
                    <div className="stat-label">Switches</div>
                    <div className="stat-value" style={{ color: 'var(--neon-blue)' }}>
                        {analytics.switchCount}
                    </div>
                </div>
                <div className="relay-stat">
                    <div className="stat-label">Bulb Life Used</div>
                    <div className="stat-value" style={{ color: analytics.bulbLifetimeUsage > 80 ? 'var(--danger)' : 'var(--neon-orange)' }}>
                        {analytics.bulbLifetimeUsage}%
                    </div>
                </div>
            </div>
        </div>
    );
}
