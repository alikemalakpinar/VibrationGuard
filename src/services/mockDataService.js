// Mock data generator for development/demo when MQTT is not available

const randomInRange = (min, max, decimals = 1) =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));

const generateTrend = (base, variance, points = 60) => {
  const data = [];
  let value = base;
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    value += (Math.random() - 0.5) * variance;
    value = Math.max(base - variance * 3, Math.min(base + variance * 3, value));
    data.push({
      time: new Date(now - i * 1000).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      timestamp: now - i * 1000,
      value: Number(value.toFixed(1)),
    });
  }
  return data;
};

export const generateSensorData = () => ({
  vibration: {
    value: randomInRange(0.5, 8.0),
    unit: 'mm/s',
    frequency: randomInRange(10, 500, 0),
    frequencyUnit: 'Hz',
    peak: randomInRange(5, 15),
    rms: randomInRange(1, 5),
    status: Math.random() > 0.7 ? 'warning' : Math.random() > 0.9 ? 'critical' : 'normal',
    trend: generateTrend(3.2, 0.8),
  },
  temperature: {
    value: randomInRange(18, 85),
    unit: '°C',
    min: randomInRange(15, 20),
    max: randomInRange(80, 95),
    status: Math.random() > 0.8 ? 'warning' : 'normal',
    trend: generateTrend(45, 5),
  },
  humidity: {
    value: randomInRange(20, 90),
    unit: '%RH',
    dewPoint: randomInRange(10, 25),
    status: Math.random() > 0.85 ? 'warning' : 'normal',
    trend: generateTrend(55, 8),
  },
  sound: {
    value: randomInRange(30, 110),
    unit: 'dB',
    peak: randomInRange(80, 120),
    average: randomInRange(50, 70),
    status: Math.random() > 0.75 ? 'warning' : 'normal',
    trend: generateTrend(65, 10),
    spectrum: Array.from({ length: 32 }, (_, i) => ({
      freq: `${(i + 1) * 125}`,
      value: randomInRange(20, 90, 0),
    })),
  },
  magnetic: {
    value: randomInRange(0.1, 50),
    unit: 'mT',
    x: randomInRange(-25, 25),
    y: randomInRange(-25, 25),
    z: randomInRange(-25, 25),
    status: Math.random() > 0.9 ? 'warning' : 'normal',
    trend: generateTrend(12, 3),
  },
});

export const generateAlerts = () => [
  {
    id: 1,
    type: 'critical',
    sensor: 'vibration',
    message: 'Vibrasyon eşiği aşıldı - 7.8 mm/s',
    time: '14:32',
    timestamp: Date.now() - 120000,
  },
  {
    id: 2,
    type: 'warning',
    sensor: 'temperature',
    message: 'Sıcaklık yükseliyor - 78°C',
    time: '14:28',
    timestamp: Date.now() - 360000,
  },
  {
    id: 3,
    type: 'warning',
    sensor: 'sound',
    message: 'Ses seviyesi normalin üstünde - 95 dB',
    time: '14:15',
    timestamp: Date.now() - 1020000,
  },
  {
    id: 4,
    type: 'info',
    sensor: 'magnetic',
    message: 'Manyetik alan stabil',
    time: '14:00',
    timestamp: Date.now() - 1920000,
  },
];

export const generateDeviceInfo = () => ({
  name: 'VibrationGuard Kartı #1',
  id: 'VG-2025-001',
  firmware: 'v2.1.3',
  uptime: '48 saat 32 dk',
  battery: 87,
  signalStrength: -42,
  lastUpdate: new Date().toLocaleTimeString('tr-TR'),
  location: 'Üretim Hattı #7',
});

let intervalId = null;

export const startMockDataStream = (callback, intervalMs = 1000) => {
  if (intervalId) clearInterval(intervalId);

  // Send initial data
  callback({
    sensors: generateSensorData(),
    alerts: generateAlerts(),
    device: generateDeviceInfo(),
  });

  intervalId = setInterval(() => {
    callback({
      sensors: generateSensorData(),
      alerts: generateAlerts(),
      device: generateDeviceInfo(),
    });
  }, intervalMs);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};
