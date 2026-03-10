import { motion } from 'framer-motion';
import {
  Activity, Thermometer, Droplets, Volume2, Magnet,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import MiniSparkline from './MiniSparkline';

const ICONS = {
  vibration: Activity,
  temperature: Thermometer,
  humidity: Droplets,
  sound: Volume2,
  magnetic: Magnet,
};

const LABELS = {
  vibration: 'Titresim',
  temperature: 'Sicaklik',
  humidity: 'Nem',
  sound: 'Ses',
  magnetic: 'Manyetik',
};

const COLORS = {
  vibration: '#EF4444',
  temperature: '#F59E0B',
  humidity: '#3B82F6',
  sound: '#8B5CF6',
  magnetic: '#06B6D4',
};

const SensorMetricCard = ({ type, data, history, onClick, isActive }) => {
  const Icon = ICONS[type] || Activity;
  const label = LABELS[type] || type;
  const color = COLORS[type] || '#3B82F6';

  const status = data?.status || 'normal';
  const statusColor =
    status === 'critical' ? '#EF4444' :
    status === 'warning' ? '#F59E0B' : '#10B981';

  // Determine trend from history
  let TrendIcon = Minus;
  let trendLabel = 'Stabil';
  if (history && history.length >= 3) {
    const recent = history.slice(-3).map(h => h.value);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prev = history.slice(-6, -3).map(h => h.value);
    if (prev.length > 0) {
      const prevAvg = prev.reduce((a, b) => a + b, 0) / prev.length;
      if (avg > prevAvg * 1.05) { TrendIcon = TrendingUp; trendLabel = 'Yukseliyor'; }
      else if (avg < prevAvg * 0.95) { TrendIcon = TrendingDown; trendLabel = 'Dusuyor'; }
    }
  }

  return (
    <motion.div
      className={`sensor-metric-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ '--card-accent': color }}
    >
      <div className="smc-top">
        <div className="smc-icon" style={{ background: `${color}12`, color }}>
          <Icon size={18} />
        </div>
        <div className="smc-status-dot" style={{ background: statusColor }} />
      </div>

      <div className="smc-label">{label}</div>

      <div className="smc-value-row">
        <span className="smc-value">{data?.value !== undefined ? Number(data.value).toFixed(1) : '--'}</span>
        <span className="smc-unit">{data?.unit || ''}</span>
      </div>

      {history && history.length > 3 && (
        <div className="smc-sparkline">
          <MiniSparkline data={history} color={color} width={120} height={30} />
        </div>
      )}

      <div className="smc-footer">
        <div className="smc-trend" style={{ color: statusColor }}>
          <TrendIcon size={12} />
          <span>{trendLabel}</span>
        </div>
        {data?.peak !== undefined && (
          <span className="smc-peak">Peak: {Number(data.peak).toFixed(1)}</span>
        )}
      </div>
    </motion.div>
  );
};

export default SensorMetricCard;
