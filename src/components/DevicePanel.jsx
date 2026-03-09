import { calculateRiskLevel } from '../utils/helpers';

const DevicePanel = ({ device, sensors, connected }) => {
  const riskLevel = calculateRiskLevel(sensors);

  const getRiskColor = (level) => {
    if (level >= 80) return '#ef4444';
    if (level >= 50) return '#f59e0b';
    return '#22c55e';
  };

  const getRiskLabel = (level) => {
    if (level >= 80) return 'Kritik';
    if (level >= 50) return 'Orta';
    return 'Düşük';
  };

  return (
    <div className="device-panel">
      <div className="device-header">
        <h3>Cihaz Bilgileri</h3>
        <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}>
          <span className="connection-dot" />
          {connected ? 'Bağlı' : 'Bağlantı Yok'}
        </div>
      </div>

      {device && (
        <div className="device-info">
          <div className="device-info-row">
            <span className="device-label">Cihaz</span>
            <span className="device-value">{device.name}</span>
          </div>
          <div className="device-info-row">
            <span className="device-label">ID</span>
            <span className="device-value mono">{device.id}</span>
          </div>
          <div className="device-info-row">
            <span className="device-label">Firmware</span>
            <span className="device-value mono">{device.firmware}</span>
          </div>
          <div className="device-info-row">
            <span className="device-label">Çalışma Süresi</span>
            <span className="device-value">{device.uptime}</span>
          </div>
          <div className="device-info-row">
            <span className="device-label">Konum</span>
            <span className="device-value">{device.location}</span>
          </div>
          <div className="device-info-row">
            <span className="device-label">Son Güncelleme</span>
            <span className="device-value">{device.lastUpdate}</span>
          </div>

          {/* Battery */}
          <div className="device-battery">
            <div className="battery-header">
              <span>Batarya</span>
              <span className="battery-percent">{device.battery}%</span>
            </div>
            <div className="battery-bar">
              <div
                className="battery-fill"
                style={{
                  width: `${device.battery}%`,
                  backgroundColor:
                    device.battery > 50 ? '#22c55e' : device.battery > 20 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>

          {/* Signal Strength */}
          <div className="device-signal">
            <span className="device-label">Sinyal Gücü</span>
            <div className="signal-bars">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`signal-bar ${
                    Math.abs(device.signalStrength) < bar * 20 ? 'active' : ''
                  }`}
                  style={{ height: `${bar * 5 + 5}px` }}
                />
              ))}
              <span className="signal-value">{device.signalStrength} dBm</span>
            </div>
          </div>

          {/* Risk Level */}
          <div className="device-risk">
            <div className="risk-header">
              <span>Risk Seviyesi</span>
              <span
                className="risk-label"
                style={{ color: getRiskColor(riskLevel) }}
              >
                {riskLevel}% ({getRiskLabel(riskLevel)})
              </span>
            </div>
            <div className="risk-bar">
              <div
                className="risk-fill"
                style={{
                  width: `${riskLevel}%`,
                  backgroundColor: getRiskColor(riskLevel),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicePanel;
