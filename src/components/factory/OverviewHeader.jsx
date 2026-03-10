import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Shield, AlertTriangle, Clock, Wifi, WifiOff,
  RefreshCw, FileText, Factory, Cpu
} from 'lucide-react';

const OverviewHeader = ({ stats, connected }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = currentTime.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const timeStr = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="overview-header">
      <div className="oh-left">
        <div className="oh-logo">
          <Factory size={22} />
        </div>
        <div className="oh-title">
          <h1>VibrationGuard</h1>
          <span className="oh-subtitle">Fabrika Dijital Ikiz</span>
        </div>
      </div>

      <div className="oh-stats">
        <motion.div
          className="oh-stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <Cpu size={16} className="oh-stat-icon" />
          <div className="oh-stat-info">
            <span className="oh-stat-value">{stats?.total || 0}</span>
            <span className="oh-stat-label">Toplam Makina</span>
          </div>
        </motion.div>

        <motion.div
          className="oh-stat-card success"
          whileHover={{ scale: 1.03 }}
        >
          <Shield size={16} className="oh-stat-icon" />
          <div className="oh-stat-info">
            <span className="oh-stat-value">{stats?.normal || 0}</span>
            <span className="oh-stat-label">Normal</span>
          </div>
        </motion.div>

        <motion.div
          className="oh-stat-card warning"
          whileHover={{ scale: 1.03 }}
        >
          <AlertTriangle size={16} className="oh-stat-icon" />
          <div className="oh-stat-info">
            <span className="oh-stat-value">{stats?.warning || 0}</span>
            <span className="oh-stat-label">Uyari</span>
          </div>
        </motion.div>

        <motion.div
          className="oh-stat-card danger"
          whileHover={{ scale: 1.03 }}
        >
          <Activity size={16} className="oh-stat-icon" />
          <div className="oh-stat-info">
            <span className="oh-stat-value">{stats?.critical || 0}</span>
            <span className="oh-stat-label">Kritik</span>
          </div>
        </motion.div>

        <div className="oh-health">
          <div className="oh-health-ring">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke={
                  (stats?.healthScore || 0) >= 80 ? '#10B981' :
                  (stats?.healthScore || 0) >= 50 ? '#F59E0B' : '#EF4444'
                }
                strokeWidth="3"
                strokeDasharray={`${((stats?.healthScore || 0) / 100) * 100.5} 100.5`}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <span className="oh-health-value">{stats?.healthScore || 0}%</span>
          </div>
          <span className="oh-health-label">Saglik</span>
        </div>
      </div>

      <div className="oh-right">
        <div className="oh-datetime">
          <Clock size={14} />
          <span>{dateStr}</span>
          <span className="oh-time">{timeStr}</span>
        </div>
        <div className={`oh-conn ${connected ? 'online' : 'offline'}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? 'Bagli' : 'Baglanti Yok'}
        </div>
        <button className="oh-btn" onClick={() => window.location.reload()}>
          <RefreshCw size={14} />
        </button>
        <button className="oh-btn accent">
          <FileText size={14} />
          <span>Rapor</span>
        </button>
      </div>
    </header>
  );
};

export default OverviewHeader;
