import { AlertTriangle, AlertCircle, X, CheckCircle } from 'lucide-react';

const FloatingAlertBar = ({ alerts = [] }) => {
  const topAlert = alerts[0];

  if (!topAlert) {
    return (
      <div className="dt-alert-empty">
        <CheckCircle size={14} style={{ color: '#22C55E' }} />
        All systems operational
      </div>
    );
  }

  const isCritical = topAlert.type === 'critical';

  return (
    <div className={`dt-floating-alert ${topAlert.type}`}>
      <span className={`dt-alert-icon ${topAlert.type}`}>
        {isCritical ? <AlertCircle size={16} /> : <AlertTriangle size={16} />}
      </span>
      <span className="dt-alert-msg">{topAlert.message}</span>
      <span className={`dt-alert-badge ${topAlert.type}`}>
        {isCritical ? 'Critical' : 'Warning'}
      </span>
      <button className="dt-alert-dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

export default FloatingAlertBar;
