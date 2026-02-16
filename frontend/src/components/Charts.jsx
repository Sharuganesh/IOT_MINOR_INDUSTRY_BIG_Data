import React from 'react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildChartData(timestamps, values) {
    return timestamps.map((ts, i) => ({
        time: formatTime(ts),
        value: values[i] || 0,
    }));
}

function ChartWrapper({ title, dotColor, children }) {
    return (
        <div className="chart-card fade-in">
            <div className="chart-title">
                <span className={`dot ${dotColor}`}></span>
                {title}
            </div>
            {children}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div style={{
            background: '#1a1f2e',
            border: '1px solid #1e293b',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
        }}>
            <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </div>
            ))}
        </div>
    );
};

export default function Charts({ charts }) {
    const powerLine = buildChartData(charts.timestamps, charts.powerData);
    const tempLine = buildChartData(charts.timestamps, charts.temperatureData);
    const voltageLine = buildChartData(charts.timestamps, charts.voltageData);
    const currentLine = buildChartData(charts.timestamps, charts.currentData);
    const dailyBars = charts.dailyEnergy || [];

    return (
        <div className="charts-grid">
            {/* Power vs Time */}
            <ChartWrapper title="Power vs Time" dotColor="green">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={powerLine}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone" dataKey="value" name="Power (W)"
                            stroke="#00ff88" strokeWidth={2} dot={false}
                            activeDot={{ r: 4, stroke: '#00ff88', fill: '#0a0e17' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>

            {/* Temperature vs Time */}
            <ChartWrapper title="Temperature vs Time" dotColor="orange">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={tempLine}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone" dataKey="value" name="Temp (°C)"
                            stroke="#ff8c00" strokeWidth={2} dot={false}
                            activeDot={{ r: 4, stroke: '#ff8c00', fill: '#0a0e17' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>

            {/* Voltage vs Time */}
            <ChartWrapper title="Voltage vs Time" dotColor="blue">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={voltageLine}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone" dataKey="value" name="Voltage (V)"
                            stroke="#00d4ff" strokeWidth={2} dot={false}
                            activeDot={{ r: 4, stroke: '#00d4ff', fill: '#0a0e17' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>

            {/* Current vs Time */}
            <ChartWrapper title="Current vs Time" dotColor="purple">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={currentLine}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone" dataKey="value" name="Current (A)"
                            stroke="#a855f7" strokeWidth={2} dot={false}
                            activeDot={{ r: 4, stroke: '#a855f7', fill: '#0a0e17' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>

            {/* Daily Energy Bar Chart - Full width */}
            <div className="chart-card full-width fade-in">
                <div className="chart-title">
                    <span className="dot yellow"></span>
                    Daily Energy Consumption
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dailyBars}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="energy" name="Energy (kWh)"
                            fill="url(#energyGradient)" radius={[4, 4, 0, 0]}
                        />
                        <defs>
                            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffd700" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#ff8c00" stopOpacity={0.7} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
