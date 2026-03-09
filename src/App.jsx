import { useState, useCallback } from 'react';
import Header from './components/Header';
import SensorCard from './components/SensorCard';
import AlertPanel from './components/AlertPanel';
import DevicePanel from './components/DevicePanel';
import DetailChart from './components/DetailChart';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import useSensorData from './hooks/useSensorData';
import './App.css';

const SENSOR_TYPES = ['vibration', 'temperature', 'humidity', 'sound', 'magnetic'];

function App() {
  const [mqttUrl, setMqttUrl] = useState('');
  const [expandedSensor, setExpandedSensor] = useState(null);
  const [activeChart, setActiveChart] = useState('vibration');

  const { sensorData, alerts, deviceInfo, connected, useMock, toggleMock, getHistory } =
    useSensorData(mqttUrl || null);

  const handleSensorToggle = useCallback(
    (type) => {
      setExpandedSensor((prev) => (prev === type ? null : type));
      setActiveChart(type);
    },
    []
  );

  return (
    <div className="app">
      <Header
        connected={connected}
        useMock={useMock}
        onToggleMock={toggleMock}
        mqttUrl={mqttUrl}
        onMqttUrlChange={setMqttUrl}
      />

      <main className="main-content">
        {/* Left panel - Sensor Cards */}
        <section className="sensors-panel">
          <div className="panel-header">
            <h2>Sensörler</h2>
            <span className="sensor-count">{SENSOR_TYPES.length} aktif</span>
          </div>
          <div className="sensor-cards-grid">
            {SENSOR_TYPES.map((type) => (
              <SensorCard
                key={type}
                type={type}
                data={sensorData?.[type]}
                history={getHistory(type)}
                expanded={expandedSensor === type}
                onToggle={() => handleSensorToggle(type)}
              />
            ))}
          </div>
        </section>

        {/* Center panel - Charts */}
        <section className="charts-panel">
          <div className="panel-header">
            <h2>Detaylı Analiz</h2>
            <div className="chart-tabs">
              {SENSOR_TYPES.map((type) => (
                <button
                  key={type}
                  className={`chart-tab ${activeChart === type ? 'active' : ''}`}
                  onClick={() => setActiveChart(type)}
                >
                  {type === 'vibration' && 'Vibrasyon'}
                  {type === 'temperature' && 'Sıcaklık'}
                  {type === 'humidity' && 'Nem'}
                  {type === 'sound' && 'Ses'}
                  {type === 'magnetic' && 'Manyetik'}
                </button>
              ))}
            </div>
          </div>

          <div className="charts-container">
            <DetailChart
              type={activeChart}
              data={sensorData?.[activeChart]?.trend || getHistory(activeChart)}
            />

            {activeChart === 'sound' && sensorData?.sound?.spectrum && (
              <SpectrumAnalyzer data={sensorData.sound.spectrum} />
            )}

            {/* Summary Stats */}
            <div className="stats-grid">
              {SENSOR_TYPES.map((type) => {
                const d = sensorData?.[type];
                if (!d) return null;
                return (
                  <div
                    key={type}
                    className={`stat-card ${activeChart === type ? 'active' : ''}`}
                    onClick={() => setActiveChart(type)}
                  >
                    <div className={`stat-indicator status-${d.status}`} />
                    <div className="stat-info">
                      <span className="stat-label">
                        {type === 'vibration' && 'Vibrasyon'}
                        {type === 'temperature' && 'Sıcaklık'}
                        {type === 'humidity' && 'Nem'}
                        {type === 'sound' && 'Ses'}
                        {type === 'magnetic' && 'Manyetik'}
                      </span>
                      <span className="stat-value">
                        {d.value?.toFixed(1)} {d.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right panel - Device info & Alerts */}
        <aside className="info-panel">
          <DevicePanel device={deviceInfo} sensors={sensorData} connected={connected} />
          <AlertPanel alerts={alerts} />
        </aside>
      </main>
    </div>
  );
}

export default App;
