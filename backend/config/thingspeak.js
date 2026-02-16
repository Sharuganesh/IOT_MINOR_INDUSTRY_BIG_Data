/**
 * ThingSpeak Configuration & Appliance Registry
 * 
 * Field Mapping:
 *   field1 → Voltage
 *   field2 → Current
 *   field3 → Power
 *   field4 → Energy (kWh)
 *   field5 → Temperature
 *   field6 → Relay Status (0=OFF, 1=ON)
 */

const THINGSPEAK_BASE_URL = 'https://api.thingspeak.com';

const FIELD_MAP = {
  voltage: 'field1',
  current: 'field2',
  power: 'field3',
  energy: 'field4',
  temperature: 'field5',
  relayStatus: 'field6',
};

/**
 * Appliance Registry
 * 
 * Each appliance maps to a ThingSpeak channel.
 * Currently only 1 bulb, but designed for multi-appliance expansion.
 * 
 * To add a new appliance:
 *   1. Create a new ThingSpeak channel for the appliance
 *   2. Add a new entry below with unique applianceId
 *   3. The API will automatically serve analytics for the new appliance
 */
const APPLIANCES = [
  {
    deviceId: 'ESP001',
    applianceName: 'Bulb',
    applianceId: 'LOAD_01',
    channelId: process.env.THINGSPEAK_CHANNEL_ID,
    icon: '💡',
    ratedPower: 60, // watts
    type: 'lighting',
  },
  // Future appliances:
  // {
  //   deviceId: 'ESP001',
  //   applianceName: 'Fan',
  //   applianceId: 'LOAD_02',
  //   channelId: 'ANOTHER_CHANNEL_ID',
  //   icon: '🌀',
  //   ratedPower: 75,
  //   type: 'motor',
  // },
];

const getThingSpeakFeedUrl = (channelId, apiKey, results = 100) => {
  return `${THINGSPEAK_BASE_URL}/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`;
};

const getThingSpeakWriteUrl = () => {
  return `${THINGSPEAK_BASE_URL}/update.json`;
};

module.exports = {
  THINGSPEAK_BASE_URL,
  FIELD_MAP,
  APPLIANCES,
  getThingSpeakFeedUrl,
  getThingSpeakWriteUrl,
};
