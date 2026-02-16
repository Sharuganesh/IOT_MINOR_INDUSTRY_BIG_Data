import React from 'react';

export default function AnalyticsDetail({ analytics }) {
    const items = [
        { label: 'Avg Power', value: `${analytics.avgPower} W`, color: 'var(--neon-green)' },
        { label: 'Min Power', value: `${analytics.minPower} W`, color: 'var(--neon-blue)' },
        { label: 'Load Factor', value: `${analytics.loadFactor}%`, color: 'var(--neon-purple)' },
        { label: 'Voltage Stability', value: `${analytics.voltageStability}%`, color: analytics.voltageStability < 90 ? 'var(--danger)' : 'var(--neon-blue)' },
        { label: 'Current Stability', value: `${analytics.currentStability}%`, color: analytics.currentStability < 90 ? 'var(--danger)' : 'var(--neon-purple)' },
        { label: 'Power Fluctuation', value: `${analytics.powerFluctuation}%`, color: analytics.powerFluctuation > 30 ? 'var(--danger)' : 'var(--neon-orange)' },
        { label: 'Daily Cost', value: `₹${analytics.dailyCost}`, color: 'var(--neon-yellow)' },
        { label: 'Monthly Projection', value: `₹${analytics.monthlyProjection}`, color: 'var(--neon-yellow)' },
        { label: 'Max Temperature', value: `${analytics.maxTemperature}°C`, color: analytics.overheatWarning ? 'var(--danger)' : 'var(--neon-orange)' },
        { label: 'Avg Temperature', value: `${analytics.avgTemperature}°C`, color: 'var(--neon-orange)' },
    ];

    return (
        <>
            <div className="section-title">
                📈 Detailed Analytics
                <span className="section-line"></span>
            </div>
            <div className="analytics-grid">
                {items.map((item, i) => (
                    <div key={i} className="analytics-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                        <div className="a-label">{item.label}</div>
                        <div className="a-value" style={{ color: item.color }}>{item.value}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
