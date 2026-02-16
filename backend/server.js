/**
 * IoT Energy Monitor — Express Server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const applianceRoutes = require('./routes/applianceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', applianceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n⚡ IoT Energy Monitor API running on port ${PORT}`);
    console.log(`  → Appliances:      http://localhost:${PORT}/api/appliances`);
    console.log(`  → Appliance Data:  http://localhost:${PORT}/api/appliance/LOAD_01/data`);
    console.log(`  → Health Check:    http://localhost:${PORT}/api/health\n`);
});
