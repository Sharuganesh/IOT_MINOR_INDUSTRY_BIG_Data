/**
 * Appliance Routes
 */

const express = require('express');
const router = express.Router();
const {
    getAppliances,
    getApplianceData,
    controlRelay,
} = require('../controllers/applianceController');

// GET /api/appliances — List all registered appliances
router.get('/appliances', getAppliances);

// GET /api/appliance/:id/data — Fetch data + analytics for a specific appliance
router.get('/appliance/:id/data', getApplianceData);

// POST /api/appliance/:id/relay — Control relay ON/OFF
router.post('/appliance/:id/relay', controlRelay);

module.exports = router;
