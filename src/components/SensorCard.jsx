import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';
import { getStatusColor, getStatusIcon, getStatusLabel, formatValue } from '../utils/helpers';
import GaugeChart from './GaugeChart';

const sensorConfig = {
  vibration: {
    label: 'Vibrasyon',
    icon: '📳',
    gradient: ['#ef4444', '#f97316'],
    gaugeMax: 15,
    thresholds: { warning: 50, critical: 75 },
  },
  temperature: {
    label: 'Sıcaklık',
    icon: '🌡️',
    gradient: ['#f59e0b', '#ef4444'],
    gaugeMax: 100,
    thresholds: { warning: 65, critical: 85 },
  },
  humidity: {
    label: 'Nem',
    icon: '💧',
    gradient: ['#3b82f6', '#06b6d4'],
    gaugeMax: 100,
    thresholds: { warning: 70, critical: 90 },
  },
  sound: {
    label: 'Ses',
    icon: '🔊',
    gradient: ['#8b5cf6', '#a855f7'],
    gaugeMax: 120,
    thresholds: { warning: 65, critical: 80 },
  },
  magnetic: {
    label: 'Manyetik Alan',
    icon: '🧲',
    gradient: ['#06b6d4', '#3b82f6'],
    gaugeMax: 60,
    thresholds: { warning: 60, critical: 85 },
  },
};

const SensorCard = ({ type, data, history = [], expanded = false, onToggle }) => {
  const config = sensorConfig[type];
  if (!config || !data) return null;

  const statusColor = getStatusColor(data.status);

  return (
    <motion.div
      className={`sensor-card ${expanded ? 'expanded' : ''} status-${data.status}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onToggle}
    >
      {/* Status indicator bar */}
      <div
        className="sensor-status-bar"
        style={{
          background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`,
          opacity: data.status === 'normal' ? 0.3 : 0.9,
        }}
      />

      <div className="sensor-card-header">
        <div className="sensor-icon-wrapper">
          <span className="sensor-icon">{config.icon}</span>
        </div>
        <div className="sensor-title-group">
          <h3 className="sensor-title">{config.label}</h3>
          <div className="sensor-status-badge" style={{ color: statusColor }}>
            <span className="status-dot" style={{ backgroundColor: statusColor }} />
            {getStatusLabel(data.status)}
          </div>
        </div>
        <div className="sensor-value-main">
          <span className="value-number">{formatValue(data.value)}</span>
          <span className="value-unit">{data.unit}</span>
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="sensor-sparkline">
        <ResponsiveContainer width="100%" height={50}>
          <LineChart data={data.trend?.slice(-30) || history.slice(-30)}>
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '11px',
                padding: '4px 8px',
              }}
              formatter={(v) => [`${v} ${data.unit}`, config.label]}
              labelFormatter={(l) => l}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.gradient[0]}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          className="sensor-details"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="sensor-gauge-container">
            <GaugeChart
              value={data.value}
              min={0}
              max={config.gaugeMax}
              unit={data.unit}
              label={config.label}
              thresholds={config.thresholds}
              size={180}
            />
          </div>

          <div className="sensor-meta-grid">
            {type === 'vibration' && (
              <>
                <div className="meta-item">
                  <span className="meta-label">Frekans</span>
                  <span className="meta-value">{data.frequency} {data.frequencyUnit}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Peak</span>
                  <span className="meta-value">{formatValue(data.peak)} {data.unit}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">RMS</span>
                  <span className="meta-value">{formatValue(data.rms)} {data.unit}</span>
                </div>
              </>
            )}
            {type === 'temperature' && (
              <>
                <div className="meta-item">
                  <span className="meta-label">Min</span>
                  <span className="meta-value">{formatValue(data.min)}°C</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Max</span>
                  <span className="meta-value">{formatValue(data.max)}°C</span>
                </div>
              </>
            )}
            {type === 'humidity' && (
              <div className="meta-item">
                <span className="meta-label">Çiy Noktası</span>
                <span className="meta-value">{formatValue(data.dewPoint)}°C</span>
              </div>
            )}
            {type === 'sound' && (
              <>
                <div className="meta-item">
                  <span className="meta-label">Peak</span>
                  <span className="meta-value">{formatValue(data.peak)} dB</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Ortalama</span>
                  <span className="meta-value">{formatValue(data.average)} dB</span>
                </div>
              </>
            )}
            {type === 'magnetic' && (
              <>
                <div className="meta-item">
                  <span className="meta-label">X</span>
                  <span className="meta-value">{formatValue(data.x)} mT</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Y</span>
                  <span className="meta-value">{formatValue(data.y)} mT</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Z</span>
                  <span className="meta-value">{formatValue(data.z)} mT</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SensorCard;
