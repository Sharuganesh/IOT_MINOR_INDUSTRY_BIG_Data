import React from 'react';

export default function Sidebar({ appliances, activeId, onSelect }) {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">⚡</div>
                    <div>
                        <div className="logo-text">EnergyMonitor</div>
                        <div className="logo-sub">Industrial IoT</div>
                    </div>
                </div>
            </div>

            {/* Appliance List */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">Appliances</div>
                {appliances.map((app) => (
                    <div
                        key={app.applianceId}
                        className={`appliance-item ${activeId === app.applianceId ? 'active' : ''}`}
                        onClick={() => onSelect(app.applianceId)}
                    >
                        <div className="appliance-icon">{app.icon || '🔌'}</div>
                        <div className="appliance-info">
                            <div className="appliance-name">{app.applianceName}</div>
                            <div className="appliance-id">{app.applianceId}</div>
                        </div>
                    </div>
                ))}

                {/* Future: Add Appliance */}
                <button className="add-appliance-btn" title="Feature coming soon">
                    <span>＋</span> Add Appliance
                </button>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                IoT Energy Monitor v1.0<br />
                ESP8266 • ThingSpeak
            </div>
        </aside>
    );
}
