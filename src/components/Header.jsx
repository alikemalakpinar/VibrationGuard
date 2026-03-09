const Header = ({ connected, useMock, onToggleMock, mqttUrl, onMqttUrlChange }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <path
                d="M7 14 Q10 8, 14 14 Q18 20, 21 14"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <h1>VibrationGuard</h1>
            <span className="logo-subtitle">Sensör İzleme Paneli</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="mqtt-config">
          <input
            type="text"
            className="mqtt-input"
            placeholder="MQTT Broker URL (ws://...)"
            value={mqttUrl}
            onChange={(e) => onMqttUrlChange(e.target.value)}
            disabled={!useMock}
          />
        </div>
      </div>

      <div className="header-right">
        <button
          className={`mode-toggle ${useMock ? 'mock' : 'live'}`}
          onClick={onToggleMock}
        >
          <span className="mode-dot" />
          {useMock ? 'DEMO' : 'CANLI'}
        </button>

        <div className={`connection-status ${connected ? 'online' : 'offline'}`}>
          <span className="status-pulse" />
          {connected ? 'Bağlı' : 'Bağlantı Yok'}
        </div>

        <div className="header-time">
          {new Date().toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
