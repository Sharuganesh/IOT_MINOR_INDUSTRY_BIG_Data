# IoT Energy Monitoring System - Project Report

## 1. Executive Summary

The **IoT Energy Monitoring System** is a full-stack industrial-grade application designed to monitor, analyze, and control electrical appliances in real-time. By leveraging the Internet of Things (IoT), Cloud Computing, and Modern Web Technologies, this system provides users with granular visibility into their energy consumption patterns, cost implications, and carbon footprint.

The solution integrates an **ESP8266** microcontroller for data acquisition, **ThingSpeak** for cloud-based time-series data storage, a **Node.js/Express** backend for complex analytics, and a **React-based** frontend for an immersive user experience.

---

## 2. System Architecture

The system follows a 4-tier architecture:

1.  **Perception Layer (Hardware)**
    *   **Sensors**: PZEM-004T (Voltage, Current, Power, Energy).
    *   **Controller**: NodeMCU (ESP8266).
    *   **Actuator**: 5V Relay Module for remote switching.
    *   **Function**: Collects electrical parameters every 15 seconds and pushes data to the cloud.

2.  **Network & Cloud Layer**
    *   **Platform**: MathWorks ThingSpeak.
    *   **Protocol**: HTTP / REST API.
    *   **Function**: Acts as the raw data historian, storing fields for Voltage, Current, Power, Energy, Temperature, and Relay Status.

3.  **Application Layer (Backend)**
    *   **Runtime**: Node.js.
    *   **Framework**: Express.js.
    *   **Key Modules**: Analytics Engine, ThingSpeak Connector, Relay Controller.
    *   **Function**: Fetches raw data, computes derived metrics (Costs, CO2, Stability), and exposes REST APIs.

4.  **Presentation Layer (Frontend)**
    *   **Framework**: React (Vite).
    *   **Library**: Recharts for visualization.
    *   **Function**: Displays real-time dashboards, historical charts, and provides control interfaces.

---

## 3. Detailed Implementation

### 3.1 Backend Implementation

The backend is built with **Node.js** and **Express**, serving as the intelligence hub.

*   **Entry Point (`server.js`)**: Initializes the Express app, middleware (CORS, Logger), and routes.
*   **Controller (`applianceController.js`)**:
    *   `getAppliances`: Returns a registry of connected devices (currently "LOAD_01").
    *   `getApplianceData`: Fetches the last 100 feeds from ThingSpeak and passes them to the analytics engine.
    *   `controlRelay`: Sends a POST request to ThingSpeak's `update.json` API to toggle the relay status (Field 6).
*   **Analytics Engine (`utils/analytics.js`)**:
    *   **Data Parsing**: Converts raw CSV-like feeds into structured JSON objects.
    *   **Power Quality**: Calculates Voltage/Current stability and Power Fluctuation using Standard Deviation.
    *   **Energy & Cost**: Computes daily energy usage ($E_{max} - E_{min}$) and multiplies by the configured Tariff (₹8/kWh).
    *   **Carbon Footprint**: Estimates CO2 emissions using a factor of 0.82 kg/kWh.
    *   **Safety**: Triggers alerts for Overheating (>50°C), Overloading combined with Relay status.

### 3.2 Frontend Implementation

The frontend is a **Single Page Application (SPA)** built with React.

*   **State Management (`App.jsx`)**: Uses `useState` and `useEffect` hooks to poll the backend every 10 seconds. It handles loading states, error boundaries, and device selection.
*   **Visualization (`Charts.jsx`)**:
    *   Uses **Recharts** to render synchronized line charts for Power, Voltage, Current, and Temperature.
    *   Implements a custom tooltip and responsive containers for a seamless UI on all devices.
*   **KPI Dashboard (`KpiCards.jsx`)**:
    *   Displays 6 core metrics: Total Energy, Estimated Cost, Carbon Emissions, Voltage Stability, Load Factor, and Power Factor.
    *   Uses CSS grid for a responsive layout.
*   **Control Panel (`ControlPanel.jsx` & `StatusPanel.jsx`)**:
    *   Provides a toggle switch to turn the appliance ON/OFF.
    *   Displays real-time system status and active alerts (e.g., "High Voltage Fluctuation").

---

## 4. Key Algorithms & Features

### 4.1 Cost Estimation Algorithm
Ref: `backend/utils/analytics.js`
```javascript
const dailyCost = (todayEnergy_kWh * TARIFF).toFixed(2);
const monthlyProjection = (dailyCost * 30).toFixed(2);
```
The system projects monthly costs based on the current day's usage pattern, helping users budget effectively.

### 4.2 Stability Analysis
The system calculates the stability of the power supply to detect grid anomalies.
```javascript
Stability (%) = 100 - (StandardDeviation / Average) * 100
```
Scores below 90% trigger a "Voltage Instability" alert.

### 4.3 Relay Control Logic
To control the hardware, the backend writes to a specific field in the ThingSpeak channel.
1.  User clicks "Toggle" on Frontend.
2.  Backend sends `POST` to ThingSpeak with `field6=0` (OFF) or `field6=1` (ON).
3.  ESP8266 polls ThingSpeak every 15s to check `field6` and updates the GPIO pin accordingly.

---

## 5. Deployment & Configuration

### Prerequisites
*   Node.js v16+
*   ThingSpeak Channel (Public/Private)

### Configuration
Environment variables in `.env`:
```env
THINGSPEAK_CHANNEL_ID=3262654
THINGSPEAK_READ_API_KEY=MQDH6IR59TOT5JF5
ENERGY_TARIFF=8
CARBON_FACTOR=0.82
```

---

## 6. Future Scope

1.  **Machine Learning**: Integrate ML models to predict appliance failure based on power signatures.
2.  **Multi-Device Support**: Expand the registry to support unlimited devices via dynamic channel mapping.
3.  **Mobile App**: Wrap the React frontend into a generic mobile app (React Native) for push notifications.

---
**Report Generated**: 2026-02-16
**Author**: Antigravity AI
