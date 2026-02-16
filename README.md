# IoT Energy Monitoring Dashboard

A full-stack Industrial IoT application for real-time energy monitoring, cost analysis, and remote control of appliances. This system leverages an ESP8266-based hardware setup, ThingSpeak for cloud data storage, a Node.js/Express backend for data processing, and a modern React/Vite frontend for visualization.

## 🚀 Features

- **Real-Time Monitoring**: Live visualization of Voltage (V), Current (A), Power (W), and Energy (kWh).
- **Cost Analysis**: Automatic calculation of energy costs based on configurable tariffs.
- **Carbon Footprint**: Real-time estimation of CO2 emissions based on energy usage.
- **Remote Control**: Toggle appliances (Relays) ON/OFF directly from the dashboard.
- **Historical Data**: View trends and historical performance via integrated charts.
- **Health Monitoring**: Backend health check endpoints to ensure system reliability.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (via Vite)
- **Language**: JavaScript / JSX
- **Styling**: Vanilla CSS (Custom Dashboard Design)
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Cloud Integration**: ThingSpeak API
- **Utilities**: Dotenv, CORS

### Hardware (Reference)
- **Microcontroller**: ESP8266 (NodeMCU)
- **Sensors**: PZEM-004T (Voltage/Current/Power)
- **Actuators**: 5V Relay Module

## 📂 Project Structure

```
Iot_minor/
├── backend/                # Node.js Express Server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route logic
│   ├── routes/             # API endpoint definitions
│   ├── utils/              # Helper functions
│   ├── server.js           # Entry point
│   └── .env                # Environment variables
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── api/            # API service calls
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # DOM entry point
│   └── vite.config.js      # Vite configuration
└── README.md               # Project Documentation
```

## ⚙️ prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **ThingSpeak Account**: Channel ID and API Keys required.

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Iot_minor
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your configuration:
```env
# ThingSpeak Configuration
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_READ_API_KEY=your_read_api_key
THINGSPEAK_WRITE_API_KEY=your_write_api_key

# Server Configuration
PORT=5000

# Energy Parameters
ENERGY_TARIFF=8         # Cost per kWh
CARBON_FACTOR=0.82      # kg CO2 per kWh
```

Start the backend server:
```bash
npm start
# OR for development
npm run dev
```
*The server will start on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
*The application will open at `http://localhost:5173` (or similar)*

## 📡 API Endpoints

The backend exposes the following REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/appliances` | Get list of all registered appliances. |
| **GET** | `/api/appliance/:id/data` | Fetch real-time data and analytics for an appliance. |
| **POST** | `/api/appliance/:id/relay` | Control the relay (ON/OFF) for an appliance. |
| **GET** | `/api/health` | Check API status and uptime. |

## 🖥 Usage

1.  **Dashboard**: Open the frontend URL in your browser.
2.  **Monitor**: View live gauges for Voltage, Current, and Power.
3.  **Analyze**: Check the KPI cards for Total Energy, Cost, and Carbon Emissions.
4.  **Control**: Use the "Status" toggle switch to turn the connected appliance ON or OFF.
5.  **History**: View the line charts to analyze power consumption trends over time.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
