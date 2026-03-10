import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MACHINES, SENSOR_CONFIG } from '../config/factoryConfig';
import DetailHeader from '../components/factory/DetailHeader';
import SensorMetricCard from '../components/factory/SensorMetricCard';
import MachineInfo from '../components/factory/MachineInfo';
import SensorVisualization3D from '../components/SensorVisualization3D';
import VibrationWaveform from '../components/VibrationWaveform';
import DetailChart from '../components/DetailChart';
import SpectrumAnalyzer from '../components/SpectrumAnalyzer';
import GaugeChart from '../components/GaugeChart';
import {
  AlertTriangle, XCircle, Info, Clock
} from 'lucide-react';


const MachineDetailPage = ({
  factoryData, connected, getMachineHistory, getMachineAlerts
}) => {
  const { machineId } = useParams();
  const [activeSensor, setActiveSensor] = useState(null);

  const machine = useMemo(
    () => MACHINES.find((m) => m.id === machineId),
    [machineId]
  );

  const machineData = factoryData?.[machineId];
  const machineAlerts = getMachineAlerts(machineId);

  useEffect(() => {
    if (machine?.sensors?.length > 0) {
      setActiveSensor(machine.sensors[0]);
    }
  }, [machineId]);

  if (!machine) {
    return (
      <div className="machine-not-found">
        <h2>Makina bulunamadi</h2>
        <p>ID: {machineId}</p>
      </div>
    );
  }

  const activeSensorData = machineData?.sensors?.[activeSensor];
  const activeSensorConfig = SENSOR_CONFIG[activeSensor];

  // Build a sensors object for SensorVisualization3D
  const sensorsFor3D = machineData?.sensors || {};

  return (
    <div className="machine-detail">
      <DetailHeader
        machine={machine}
        machineData={machineData}
        connected={connected}
      />

      <div className="md-content">
        {/* Sensor Metric Cards */}
        <div className="md-sensor-grid">
          {machine.sensors.map((sensorType) => (
            <SensorMetricCard
              key={sensorType}
              type={sensorType}
              data={machineData?.sensors?.[sensorType]}
              history={getMachineHistory(machineId, sensorType)}
              isActive={activeSensor === sensorType}
              onClick={() => setActiveSensor(sensorType)}
            />
          ))}
        </div>

        {/* Main content area */}
        <div className="md-main-grid">
          {/* Left: Charts */}
          <div className="md-charts">
            {/* Active sensor gauge + chart */}
            <div className="md-charts-row">
              <div className="md-card md-gauge-card">
                <div className="md-card-header">
                  <span className="md-card-title">
                    {activeSensorConfig?.label || 'Sensor'} Gauge
                  </span>
                  <span
                    className="md-card-badge"
                    style={{
                      background: `${
                        activeSensorData?.status === 'critical' ? '#EF444420' :
                        activeSensorData?.status === 'warning' ? '#F59E0B20' : '#10B98120'
                      }`,
                      color: activeSensorData?.status === 'critical' ? '#EF4444' :
                        activeSensorData?.status === 'warning' ? '#F59E0B' : '#10B981'
                    }}
                  >
                    {activeSensorData?.status === 'critical' ? 'Kritik' :
                     activeSensorData?.status === 'warning' ? 'Uyari' : 'Normal'}
                  </span>
                </div>
                <div className="md-gauge-wrap">
                  <GaugeChart
                    value={activeSensorData?.value || 0}
                    min={0}
                    max={activeSensorConfig?.gaugeMax || 100}
                    unit={activeSensorData?.unit || ''}
                    label={activeSensorConfig?.label || ''}
                    thresholds={activeSensorConfig?.thresholds || { warning: 60, critical: 80 }}
                    size={180}
                  />
                </div>
              </div>

              <div className="md-card md-chart-card">
                {activeSensor === 'vibration' && activeSensorData ? (
                  <VibrationWaveform data={activeSensorData} />
                ) : (
                  <DetailChart
                    type={activeSensor}
                    data={
                      activeSensorData?.trend ||
                      getMachineHistory(machineId, activeSensor)
                    }
                  />
                )}
              </div>
            </div>

            {/* Spectrum analyzer for sound */}
            {activeSensor === 'sound' && activeSensorData?.spectrum && (
              <div className="md-card">
                <SpectrumAnalyzer data={activeSensorData.spectrum} />
              </div>
            )}

            {/* Additional vibration trend */}
            {activeSensor === 'vibration' && (
              <div className="md-card">
                <DetailChart
                  type="vibration"
                  data={
                    activeSensorData?.trend ||
                    getMachineHistory(machineId, 'vibration')
                  }
                />
              </div>
            )}
          </div>

          {/* Right: 3D Viz + Info + Alerts */}
          <div className="md-side">
            <div className="md-card md-viz-card">
              <div className="md-card-header">
                <span className="md-card-title">3D Sensor Gorunumu</span>
              </div>
              <SensorVisualization3D sensors={sensorsFor3D} />
            </div>

            <MachineInfo machine={machine} machineData={machineData} />

            {/* Alert history */}
            <div className="md-card md-alerts-card">
              <div className="md-card-header">
                <span className="md-card-title">
                  <Clock size={14} /> Olay Gecmisi
                </span>
              </div>
              <div className="md-alerts-list">
                {machineAlerts.length > 0 ? (
                  machineAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`md-alert-item ${alert.type}`}
                    >
                      {alert.type === 'critical' ? <XCircle size={13} /> :
                       alert.type === 'warning' ? <AlertTriangle size={13} /> :
                       <Info size={13} />}
                      <span className="md-alert-msg">{alert.message}</span>
                      <span className="md-alert-time">{alert.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="md-no-alerts">Bu makina icin alarm yok</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailPage;
