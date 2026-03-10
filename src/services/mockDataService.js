// Mock data generator for development/demo when MQTT is not available
import { MACHINES } from '../config/factoryConfig';

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

const getStatus = (value, baseline, type) => {
  const ratio = value / baseline;
  if (type === 'vibration' || type === 'sound') {
    if (ratio > 1.6) return 'critical';
    if (ratio > 1.3) return 'warning';
    return 'normal';
  }
  if (type === 'temperature') {
    if (value > 80) return 'critical';
    if (value > 65) return 'warning';
    return 'normal';
  }
  if (ratio > 1.5) return 'warning';
  return 'normal';
};

const generateSensorForMachine = (type, baseline) => {
  const variance = baseline * 0.2;
  const value = randomInRange(
    Math.max(0.1, baseline - variance),
    baseline + variance * 1.8
  );
  const status = getStatus(value, baseline, type);

  const base = {
    value,
    status,
    trend: generateTrend(baseline, variance * 0.3),
  };

  switch (type) {
    case 'vibration':
      return {
        ...base,
        unit: 'mm/s',
        frequency: randomInRange(10, 500, 0),
        frequencyUnit: 'Hz',
        peak: randomInRange(value * 1.2, value * 2.5),
        rms: randomInRange(value * 0.4, value * 0.8),
      };
    case 'temperature':
      return {
        ...base,
        unit: '\u00B0C',
        min: randomInRange(baseline * 0.5, baseline * 0.7),
        max: randomInRange(baseline * 1.2, baseline * 1.5),
      };
    case 'humidity':
      return {
        ...base,
        unit: '%RH',
        dewPoint: randomInRange(10, 25),
      };
    case 'sound':
      return {
        ...base,
        unit: 'dB',
        peak: randomInRange(value * 1.1, value * 1.4, 0),
        average: randomInRange(value * 0.7, value * 0.9, 0),
        spectrum: Array.from({ length: 32 }, (_, i) => ({
          freq: `${(i + 1) * 125}`,
          value: randomInRange(20, 90, 0),
        })),
      };
    case 'magnetic':
      return {
        ...base,
        unit: 'mT',
        x: randomInRange(-25, 25),
        y: randomInRange(-25, 25),
        z: randomInRange(-25, 25),
      };
    default:
      return base;
  }
};

export const generateSensorData = () => ({
  vibration: generateSensorForMachine('vibration', 3.2),
  temperature: generateSensorForMachine('temperature', 45),
  humidity: generateSensorForMachine('humidity', 55),
  sound: generateSensorForMachine('sound', 65),
  magnetic: generateSensorForMachine('magnetic', 12),
});

export const generateMachineData = (machine) => {
  const sensors = {};
  machine.sensors.forEach((sensorType) => {
    sensors[sensorType] = generateSensorForMachine(
      sensorType,
      machine.baselines[sensorType]
    );
  });

  const statuses = Object.values(sensors).map((s) => s.status);
  const overallStatus = statuses.includes('critical')
    ? 'critical'
    : statuses.includes('warning')
    ? 'warning'
    : 'normal';

  return {
    machineId: machine.id,
    sensors,
    status: overallStatus,
    lastUpdate: new Date().toLocaleTimeString('tr-TR'),
  };
};

export const generateFactoryData = () => {
  const machines = {};
  const allAlerts = [];
  let alertId = 1;

  MACHINES.forEach((machine) => {
    machines[machine.id] = generateMachineData(machine);

    // Generate alerts based on sensor statuses
    Object.entries(machines[machine.id].sensors).forEach(([sensorType, data]) => {
      if (data.status === 'critical') {
        allAlerts.push({
          id: alertId++,
          machineId: machine.id,
          machineName: machine.name,
          type: 'critical',
          sensor: sensorType,
          message: `${machine.name} - ${sensorType} kritik: ${data.value} ${data.unit}`,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now() - Math.random() * 300000,
        });
      } else if (data.status === 'warning') {
        allAlerts.push({
          id: alertId++,
          machineId: machine.id,
          machineName: machine.name,
          type: 'warning',
          sensor: sensorType,
          message: `${machine.name} - ${sensorType} uyari: ${data.value} ${data.unit}`,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now() - Math.random() * 600000,
        });
      }
    });
  });

  allAlerts.sort((a, b) => b.timestamp - a.timestamp);

  const statusCounts = { normal: 0, warning: 0, critical: 0 };
  Object.values(machines).forEach((m) => {
    statusCounts[m.status]++;
  });

  return {
    machines,
    alerts: allAlerts.slice(0, 10),
    stats: {
      total: MACHINES.length,
      ...statusCounts,
      healthScore: Math.round(
        ((statusCounts.normal * 100 + statusCounts.warning * 60 + statusCounts.critical * 10) /
          MACHINES.length)
      ),
    },
  };
};

export const generateAlerts = () => [
  {
    id: 1,
    type: 'critical',
    sensor: 'vibration',
    message: 'Vibrasyon esigi asildi - 7.8 mm/s',
    time: '14:32',
    timestamp: Date.now() - 120000,
  },
  {
    id: 2,
    type: 'warning',
    sensor: 'temperature',
    message: 'Sicaklik yukseliyor - 78\u00B0C',
    time: '14:28',
    timestamp: Date.now() - 360000,
  },
  {
    id: 3,
    type: 'warning',
    sensor: 'sound',
    message: 'Ses seviyesi normalin ustunde - 95 dB',
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
  name: 'VibrationGuard Karti #1',
  id: 'VG-2025-001',
  firmware: 'v2.1.3',
  uptime: '48 saat 32 dk',
  battery: 87,
  signalStrength: -42,
  lastUpdate: new Date().toLocaleTimeString('tr-TR'),
  location: 'Uretim Hatti #7',
});

let intervalId = null;

export const startMockDataStream = (callback, intervalMs = 1000) => {
  if (intervalId) clearInterval(intervalId);

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

let factoryIntervalId = null;

// --- Dashboard-level data generators ---

export const generateProductionData = () => ({
  lines: [
    { id: 'LP-1', label: 'Uretim Hatti A', completed: Math.round(700 + Math.random() * 200), planned: 1000, status: 'normal' },
    { id: 'LP-2', label: 'Uretim Hatti B', completed: Math.round(400 + Math.random() * 250), planned: 800, status: Math.random() > 0.7 ? 'warning' : 'normal' },
    { id: 'LP-3', label: 'Montaj Alani', completed: Math.round(200 + Math.random() * 150), planned: 400, status: 'normal' },
  ],
});

export const generateOEEData = () => {
  const now = new Date();
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    data.push({
      time: t.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      performance: Math.round(60 + Math.random() * 35),
      quality: Math.round(70 + Math.random() * 28),
      availability: Math.round(55 + Math.random() * 40),
    });
  }
  return data;
};

export const generateUtilizationData = () =>
  MACHINES.slice(0, 6).map((m) => {
    const active = Math.round(50 + Math.random() * 40);
    const idle = Math.round(5 + Math.random() * 25);
    const downtime = 100 - active - idle;
    return { station: m.name.split(' ')[0], active, idle, downtime: Math.max(0, downtime) };
  });

export const generateEquipmentMetrics = () =>
  MACHINES.slice(0, 6).map((m) => ({
    station: m.name.split(' ')[0],
    actual: Math.round(40 + Math.random() * 60),
    target: Math.round(70 + Math.random() * 30),
  }));

export const generateProductionStats = () => ({
  unitsProduced: Math.round(2400 + Math.random() * 600),
  unitsPerHour: Math.round(110 + Math.random() * 60),
  efficiencyRate: Number((75 + Math.random() * 20).toFixed(1)),
  downtimeToday: Math.round(10 + Math.random() * 40),
  issuesPerDay: Math.round(1 + Math.random() * 6),
  cycleTime: Number((8 + Math.random() * 10).toFixed(1)),
});

export const startFactoryDataStream = (callback, intervalMs = 1500) => {
  if (factoryIntervalId) clearInterval(factoryIntervalId);

  const generate = () => ({
    ...generateFactoryData(),
    production: generateProductionData(),
    oee: generateOEEData(),
    utilization: generateUtilizationData(),
    metrics: generateEquipmentMetrics(),
    productionStats: generateProductionStats(),
  });

  callback(generate());

  factoryIntervalId = setInterval(() => {
    callback(generate());
  }, intervalMs);

  return () => {
    if (factoryIntervalId) {
      clearInterval(factoryIntervalId);
      factoryIntervalId = null;
    }
  };
};
