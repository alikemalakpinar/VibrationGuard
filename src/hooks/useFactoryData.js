import { useState, useEffect, useCallback, useRef } from 'react';
import { startFactoryDataStream } from '../services/mockDataService';

const MAX_HISTORY = 60;

const useFactoryData = () => {
  const [factoryData, setFactoryData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [connected, setConnected] = useState(false);
  const [production, setProduction] = useState(null);
  const [oee, setOee] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [productionStats, setProductionStats] = useState(null);
  const historyRef = useRef({});

  useEffect(() => {
    const cleanup = startFactoryDataStream((data) => {
      setFactoryData(data.machines);
      setAlerts(data.alerts);
      setStats(data.stats);
      setConnected(true);
      setProduction(data.production);
      setOee(data.oee);
      setUtilization(data.utilization);
      setMetrics(data.metrics);
      setProductionStats(data.productionStats);

      // Append history for each machine's sensors
      Object.entries(data.machines).forEach(([machineId, machineData]) => {
        if (!historyRef.current[machineId]) {
          historyRef.current[machineId] = {};
        }
        Object.entries(machineData.sensors).forEach(([sensorType, sensorData]) => {
          if (!historyRef.current[machineId][sensorType]) {
            historyRef.current[machineId][sensorType] = [];
          }
          historyRef.current[machineId][sensorType] = [
            ...historyRef.current[machineId][sensorType].slice(-MAX_HISTORY),
            {
              time: new Date().toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              timestamp: Date.now(),
              value: sensorData.value,
            },
          ];
        });
      });
    }, 1500);

    return cleanup;
  }, []);

  const getMachineData = useCallback(
    (machineId) => factoryData?.[machineId] || null,
    [factoryData]
  );

  const getMachineHistory = useCallback(
    (machineId, sensorType) =>
      historyRef.current[machineId]?.[sensorType] || [],
    []
  );

  const getMachineAlerts = useCallback(
    (machineId) => alerts.filter((a) => a.machineId === machineId),
    [alerts]
  );

  return {
    factoryData,
    alerts,
    stats,
    connected,
    production,
    oee,
    utilization,
    metrics,
    productionStats,
    getMachineData,
    getMachineHistory,
    getMachineAlerts,
  };
};

export default useFactoryData;
