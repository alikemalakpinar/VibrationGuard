import { useMemo } from 'react';

const SensorVisualization3D = ({ sensors }) => {
  const riskLevel = useMemo(() => {
    if (!sensors) return 0;
    let risk = 0;
    let count = 0;
    Object.values(sensors).forEach((s) => {
      if (s?.status === 'critical') risk += 100;
      else if (s?.status === 'warning') risk += 60;
      else risk += 10;
      count++;
    });
    return count > 0 ? Math.round(risk / count) : 0;
  }, [sensors]);

  const getOverallStatus = () => {
    if (riskLevel >= 70) return { color: '#ef4444', label: 'KRİTİK', glow: 'rgba(239,68,68,0.3)' };
    if (riskLevel >= 40) return { color: '#f59e0b', label: 'UYARI', glow: 'rgba(245,158,11,0.3)' };
    return { color: '#22c55e', label: 'NORMAL', glow: 'rgba(34,197,94,0.2)' };
  };

  const status = getOverallStatus();
  const vibVal = sensors?.vibration?.value ?? 0;
  const tempVal = sensors?.temperature?.value ?? 0;

  return (
    <div className="sensor-viz-3d">
      <svg viewBox="0 0 400 280" width="100%" height="100%">
        <defs>
          {/* Gradients */}
          <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#0f2847" />
            <stop offset="100%" stopColor="#1a3355" />
          </linearGradient>
          <linearGradient id="boardSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d1f35" />
            <stop offset="100%" stopColor="#071525" />
          </linearGradient>
          <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id="sensorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
          <linearGradient id="ledGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={status.color} stopOpacity="1" />
            <stop offset="100%" stopColor={status.color} stopOpacity="0.6" />
          </linearGradient>
          <filter id="shadow3d">
            <feDropShadow dx="4" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
          </filter>
          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ledFilter">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* PCB trace pattern */}
          <pattern id="pcbTraces" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="15" y2="20" stroke="#1e4a6f" strokeWidth="0.8" opacity="0.5" />
            <line x1="20" y1="0" x2="20" y2="15" stroke="#1e4a6f" strokeWidth="0.8" opacity="0.5" />
            <line x1="25" y1="20" x2="40" y2="20" stroke="#1e4a6f" strokeWidth="0.8" opacity="0.5" />
            <line x1="20" y1="25" x2="20" y2="40" stroke="#1e4a6f" strokeWidth="0.8" opacity="0.5" />
            <circle cx="20" cy="20" r="1.5" fill="#1e4a6f" opacity="0.4" />
            <circle cx="0" cy="0" r="1" fill="#1e4a6f" opacity="0.3" />
            <circle cx="40" cy="0" r="1" fill="#1e4a6f" opacity="0.3" />
          </pattern>
        </defs>

        {/* 3D PCB Board - isometric view */}
        <g filter="url(#shadow3d)" transform="translate(40, 30)">
          {/* Board side (3D depth) */}
          <path
            d="M 0 180 L 30 200 L 350 200 L 320 180 Z"
            fill="url(#boardSide)"
          />
          <path
            d="M 320 30 L 350 50 L 350 200 L 320 180 Z"
            fill="url(#boardSide)"
            opacity="0.7"
          />

          {/* Main board top */}
          <rect x="0" y="30" width="320" height="150" rx="8" fill="url(#boardGrad)" />
          <rect x="0" y="30" width="320" height="150" rx="8" fill="url(#pcbTraces)" />

          {/* Board edge highlight */}
          <rect x="0" y="30" width="320" height="2" rx="1" fill="#2a5a8f" opacity="0.4" />

          {/* Copper traces */}
          <path d="M 60 80 L 120 80 L 120 110 L 180 110" stroke="#c87533" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M 180 80 L 240 80 L 240 130 L 280 130" stroke="#c87533" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M 60 130 L 100 130 L 100 100 L 140 100" stroke="#c87533" strokeWidth="1.2" fill="none" opacity="0.3" />

          {/* Main MCU chip */}
          <rect x="130" y="75" width="60" height="50" rx="3" fill="url(#chipGrad)" stroke="#444" strokeWidth="0.5" />
          <text x="160" y="95" textAnchor="middle" fill="#888" fontSize="6" fontWeight="600" fontFamily="monospace">ESP32</text>
          <text x="160" y="107" textAnchor="middle" fill="#666" fontSize="5" fontFamily="monospace">WROOM</text>
          {/* MCU pins */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`pin-l-${i}`} x="124" y={78 + i * 5.5} width="6" height="2" rx="0.5" fill="#c0c0c0" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`pin-r-${i}`} x="190" y={78 + i * 5.5} width="6" height="2" rx="0.5" fill="#c0c0c0" />
          ))}

          {/* Vibration sensor (ADXL345) */}
          <g>
            <rect x="40" y="60" width="35" height="30" rx="2" fill="url(#sensorGrad)" stroke="#999" strokeWidth="0.5" />
            <text x="57" y="73" textAnchor="middle" fill="#333" fontSize="4.5" fontWeight="700">ADXL</text>
            <text x="57" y="81" textAnchor="middle" fill="#555" fontSize="4">345</text>
            {/* Vibration indicator - animated */}
            <circle cx="57" cy="55" r="4" fill="none" stroke={vibVal > 5 ? '#ef4444' : vibVal > 3 ? '#f59e0b' : '#22c55e'} strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Temperature sensor */}
          <g>
            <rect x="40" y="110" width="30" height="25" rx="2" fill="url(#chipGrad)" stroke="#555" strokeWidth="0.5" />
            <text x="55" y="122" textAnchor="middle" fill="#aaa" fontSize="4" fontWeight="600">TMP</text>
            <text x="55" y="129" textAnchor="middle" fill="#888" fontSize="3.5">117</text>
          </g>

          {/* Sound sensor (microphone) */}
          <g>
            <circle cx="240" cy="75" r="12" fill="#222" stroke="#555" strokeWidth="0.5" />
            <circle cx="240" cy="75" r="5" fill="#333" stroke="#666" strokeWidth="0.5" />
            <circle cx="240" cy="75" r="2" fill="#555" />
            <text x="240" y="94" textAnchor="middle" fill="#8a8a8a" fontSize="4">MIC</text>
          </g>

          {/* Humidity sensor */}
          <g>
            <rect x="220" y="110" width="28" height="22" rx="2" fill="#ddd" stroke="#bbb" strokeWidth="0.5" />
            <text x="234" y="121" textAnchor="middle" fill="#555" fontSize="4" fontWeight="600">DHT</text>
            <text x="234" y="128" textAnchor="middle" fill="#777" fontSize="3.5">22</text>
          </g>

          {/* Magnetic sensor */}
          <g>
            <rect x="270" y="110" width="28" height="22" rx="2" fill="url(#chipGrad)" stroke="#555" strokeWidth="0.5" />
            <text x="284" y="121" textAnchor="middle" fill="#aaa" fontSize="4" fontWeight="600">HMC</text>
            <text x="284" y="128" textAnchor="middle" fill="#888" fontSize="3.5">5883</text>
          </g>

          {/* Capacitors & resistors */}
          <rect x="100" y="65" width="8" height="5" rx="1" fill="#c87533" opacity="0.7" />
          <rect x="112" y="65" width="8" height="5" rx="1" fill="#c87533" opacity="0.7" />
          <rect x="100" y="140" width="5" height="8" rx="1" fill="#4a3728" opacity="0.6" />
          <rect x="110" y="140" width="5" height="8" rx="1" fill="#4a3728" opacity="0.6" />
          <rect x="200" y="65" width="6" height="4" rx="1" fill="#c87533" opacity="0.6" />
          <rect x="210" y="65" width="6" height="4" rx="1" fill="#222" opacity="0.7" />

          {/* USB connector */}
          <rect x="-5" y="90" width="20" height="25" rx="2" fill="#c0c0c0" stroke="#999" strokeWidth="0.5" />
          <rect x="0" y="95" width="10" height="15" rx="1" fill="#333" />
          <text x="7" y="85" textAnchor="middle" fill="#8a8a8a" fontSize="4">USB</text>

          {/* Status LED */}
          <g>
            <circle cx="290" cy="55" r="4" fill={`url(#ledGlow)`} filter="url(#ledFilter)">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="290" cy="55" r="2" fill={status.color} />
          </g>

          {/* Power LED */}
          <circle cx="280" cy="55" r="2.5" fill="#22c55e" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.5;0.8" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Antenna trace */}
          <path d="M 300 40 L 310 40 L 310 55 L 305 55 L 305 45 L 300 45" stroke="#c87533" strokeWidth="1.5" fill="none" opacity="0.5" />

          {/* Board mounting holes */}
          <circle cx="15" cy="42" r="4" fill="none" stroke="#2a5a8f" strokeWidth="1" opacity="0.4" />
          <circle cx="305" cy="42" r="4" fill="none" stroke="#2a5a8f" strokeWidth="1" opacity="0.4" />
          <circle cx="15" cy="168" r="4" fill="none" stroke="#2a5a8f" strokeWidth="1" opacity="0.4" />
          <circle cx="305" cy="168" r="4" fill="none" stroke="#2a5a8f" strokeWidth="1" opacity="0.4" />

          {/* Board label */}
          <text x="160" y="165" textAnchor="middle" fill="#2a5a8f" fontSize="7" fontWeight="700" fontFamily="monospace" opacity="0.6">
            VibrationGuard v2.1
          </text>
        </g>

        {/* Data readout overlay */}
        <g transform="translate(10, 240)">
          <rect width="380" height="30" rx="8" fill="rgba(15,23,42,0.8)" />
          <text x="20" y="19" fill="#94a3b8" fontSize="9" fontWeight="600">
            VIB: <tspan fill={vibVal > 5 ? '#ef4444' : '#22c55e'}>{vibVal.toFixed(1)} mm/s</tspan>
          </text>
          <text x="110" y="19" fill="#94a3b8" fontSize="9" fontWeight="600">
            TEMP: <tspan fill={tempVal > 70 ? '#ef4444' : '#22c55e'}>{tempVal.toFixed(1)}°C</tspan>
          </text>
          <text x="210" y="19" fill="#94a3b8" fontSize="9" fontWeight="600">
            STATUS: <tspan fill={status.color}>{status.label}</tspan>
          </text>
          <text x="320" y="19" fill="#94a3b8" fontSize="9" fontWeight="600">
            RISK: <tspan fill={status.color}>{riskLevel}%</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SensorVisualization3D;
