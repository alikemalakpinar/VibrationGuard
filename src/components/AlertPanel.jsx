import { motion, AnimatePresence } from 'framer-motion';
import { getStatusColor } from '../utils/helpers';

const alertIcons = {
  critical: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const AlertPanel = ({ alerts = [] }) => {
  return (
    <div className="alert-panel">
      <div className="alert-panel-header">
        <h3>
          <span className="alert-icon-header">🔔</span>
          Olay Zaman Çizelgesi
        </h3>
        <span className="alert-count">
          {alerts.filter((a) => a.type === 'critical').length} kritik
        </span>
      </div>

      <div className="alert-list">
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={`alert-item alert-${alert.type}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="alert-type-indicator"
                style={{ backgroundColor: getStatusColor(alert.type) }}
              >
                {alertIcons[alert.type]}
              </div>
              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                <span className="alert-time">{alert.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertPanel;
