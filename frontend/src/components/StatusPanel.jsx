import React from 'react';

export default function StatusPanel({ isOnline, analytics, latest }) {
    const alerts = analytics.alerts || [];

    return (
        <div className="panel-card">
            <div className="panel-title">
                📡 System Status & Alerts
            </div>

            {/* Online Indicator */}
            <div className="alert-item success" style={{ marginBottom: 16 }}>
                <span className={`status-dot ${isOnline ? '' : 'offline'}`}></span>
                <span>{isOnline ? 'System Online — Receiving Data' : 'System Offline'}</span>
            </div>

            {/* Live Readings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div className="relay-stat">
                    <div className="stat-label">Voltage</div>
                    <div className="stat-value" style={{ color: 'var(--neon-blue)' }}>{latest.voltage} V</div>
                </div>
                <div className="relay-stat">
                    <div className="stat-label">Current</div>
                    <div className="stat-value" style={{ color: 'var(--neon-purple)' }}>{latest.current} A</div>
                </div>
                <div className="relay-stat">
                    <div className="stat-label">Power</div>
                    <div className="stat-value" style={{ color: 'var(--neon-green)' }}>{latest.power} W</div>
                </div>
                <div className="relay-stat">
                    <div className="stat-label">Temperature</div>
                    <div className="stat-value" style={{ color: latest.temperature > 50 ? 'var(--danger)' : 'var(--neon-orange)' }}>
                        {latest.temperature} °C
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 ? (
                alerts.map((alert, i) => (
                    <div key={i} className={`alert-item ${alert.type}`}>
                        <span>{alert.type === 'danger' ? '🔴' : '🟡'}</span>
                        <span>{alert.message}</span>
                    </div>
                ))
            ) : (
                <div className="no-alerts">
                    ✅ No active alerts — All parameters normal
                </div>
            )}
        </div>
    );
}
