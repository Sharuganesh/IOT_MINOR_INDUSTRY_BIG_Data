import React from 'react';

export default function KpiCards({ latest, analytics }) {
    const cards = [
        {
            label: 'Total Energy',
            value: analytics.totalEnergy,
            unit: 'kWh',
            icon: '⚡',
            accent: 'accent-green',
            sub: `Today: ${analytics.todayEnergy} kWh`,
        },
        {
            label: "Today's Energy",
            value: analytics.todayEnergy,
            unit: 'kWh',
            icon: '📊',
            accent: 'accent-blue',
            sub: `Cost: ₹${analytics.dailyCost}`,
        },
        {
            label: 'Peak Power',
            value: analytics.peakPower,
            unit: 'W',
            icon: '🔺',
            accent: 'accent-orange',
            sub: `Avg: ${analytics.avgPower} W`,
        },
        {
            label: 'Energy Cost',
            value: analytics.energyCost,
            unit: '₹',
            icon: '💰',
            accent: 'accent-yellow',
            sub: `Monthly: ₹${analytics.monthlyProjection}`,
        },
        {
            label: 'Carbon Emission',
            value: analytics.carbonEmission,
            unit: 'kg CO₂',
            icon: '🌿',
            accent: 'accent-purple',
            sub: 'Based on grid factor',
        },
    ];

    return (
        <div className="kpi-grid">
            {cards.map((card, i) => (
                <div key={i} className={`kpi-card ${card.accent} slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="kpi-header">
                        <span className="kpi-label">{card.label}</span>
                        <span className="kpi-icon">{card.icon}</span>
                    </div>
                    <div className="kpi-value">
                        {card.label === 'Energy Cost' && <span className="kpi-unit">₹</span>}
                        {card.label === 'Energy Cost' ? card.value : card.value}
                        {card.label !== 'Energy Cost' && <span className="kpi-unit">{card.unit}</span>}
                    </div>
                    <div className="kpi-sub">{card.sub}</div>
                </div>
            ))}

            {/* Relay Status Card */}
            <div className="kpi-card relay-card slide-up" style={{ animationDelay: '0.25s' }}>
                <div className="kpi-label" style={{ marginBottom: 12 }}>Relay Status</div>
                <div className={`relay-indicator ${latest.relayStatus === 1 ? 'on' : 'off'}`}>
                    {latest.relayStatus === 1 ? '💡' : '⏹'}
                </div>
                <div className="kpi-value" style={{ color: latest.relayStatus === 1 ? 'var(--neon-green)' : 'var(--danger)' }}>
                    {latest.relayStatus === 1 ? 'ON' : 'OFF'}
                </div>
            </div>
        </div>
    );
}
