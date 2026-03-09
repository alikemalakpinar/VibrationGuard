import { useState, useCallback } from 'react';
import Header from './components/Header';
import SensorCard from './components/SensorCard';
import AlertPanel from './components/AlertPanel';
import DevicePanel from './components/DevicePanel';
import DetailChart from './components/DetailChart';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import SensorVisualization3D from './components/SensorVisualization3D';
import VibrationWaveform from './components/VibrationWaveform';
import useSensorData from './hooks/useSensorData';
import './App.css';

const SENSOR_TYPES = ['vibration', 'temperature', 'humidity', 'sound', 'magnetic'];

const SENSOR_LABELS = {
  vibration: 'Vibrasyon',
  temperature: 'Sıcaklık',
  humidity: 'Nem',
  sound: 'Ses',
  magnetic: 'Manyetik',
};

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

        {/* Center panel - Charts & Visualization */}
        <section className="charts-panel">
          {/* 3D Board Visualization */}
          <div className="viz-3d-card">
            <div className="viz-3d-header">
              <h2>VibrationGuard Kartı</h2>
              <div className="viz-3d-badge">
                <span className="viz-3d-dot" />
                3D Görünüm
              </div>
            </div>
            <SensorVisualization3D sensors={sensorData} />
          </div>

          {/* Chart Tabs */}
          <div className="panel-header">
            <h2>Detaylı Analiz</h2>
            <div className="chart-tabs">
              {SENSOR_TYPES.map((type) => (
                <button
                  key={type}
                  className={`chart-tab ${activeChart === type ? 'active' : ''}`}
                  onClick={() => setActiveChart(type)}
                >
                  {SENSOR_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="charts-container">
            {/* Vibration Waveform */}
            {activeChart === 'vibration' && sensorData?.vibration && (
              <VibrationWaveform data={sensorData.vibration} />
            )}

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
                      <span className="stat-label">{SENSOR_LABELS[type]}</span>
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
