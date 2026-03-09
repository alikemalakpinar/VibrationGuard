import { useState, useEffect, useCallback, useRef } from 'react';
import mqttService, { MQTT_TOPICS } from '../services/mqttService';
import { startMockDataStream } from '../services/mockDataService';

const MAX_HISTORY_POINTS = 120;

const useSensorData = (mqttBrokerUrl = null) => {
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [connected, setConnected] = useState(false);
  const [useMock, setUseMock] = useState(!mqttBrokerUrl);
  const historyRef = useRef({
    vibration: [],
    temperature: [],
    humidity: [],
    sound: [],
    magnetic: [],
  });

  const appendHistory = useCallback((sensorType, value) => {
    const entry = {
      time: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      timestamp: Date.now(),
      value,
    };
    historyRef.current[sensorType] = [
      ...historyRef.current[sensorType].slice(-MAX_HISTORY_POINTS),
      entry,
    ];
  }, []);

  useEffect(() => {
    let cleanup;

    if (useMock || !mqttBrokerUrl) {
      cleanup = startMockDataStream((data) => {
        setSensorData(data.sensors);
        setAlerts(data.alerts);
        setDeviceInfo(data.device);
        setConnected(true);

        // Append to history
        if (data.sensors) {
          Object.keys(data.sensors).forEach((key) => {
            if (data.sensors[key]?.value !== undefined) {
              appendHistory(key, data.sensors[key].value);
            }
          });
        }
      }, 1500);
    } else {
      mqttService.connect(mqttBrokerUrl);

      const unsubConnection = mqttService.subscribe('connection', ({ connected: c }) => {
        setConnected(c);
      });

      const unsubAll = mqttService.subscribe('any', ({ topic, data }) => {
        setSensorData((prev) => {
          const sensorType = topic.split('/')[1];
          const updated = { ...prev, [sensorType]: data };
          if (data?.value !== undefined) {
            appendHistory(sensorType, data.value);
          }
          return updated;
        });
      });

      cleanup = () => {
        unsubConnection();
        unsubAll();
        mqttService.disconnect();
      };
    }

    return cleanup;
  }, [mqttBrokerUrl, useMock, appendHistory]);

  const getHistory = useCallback(
    (sensorType) => historyRef.current[sensorType] || [],
    []
  );

  const toggleMock = useCallback(() => {
    setUseMock((prev) => !prev);
  }, []);

  return {
    sensorData,
    alerts,
    deviceInfo,
    connected,
    useMock,
    toggleMock,
    getHistory,
  };
};

export default useSensorData;
