import { useMemo } from 'react';

const GaugeChart = ({
  value = 0,
  min = 0,
  max = 100,
  unit = '',
  label = '',
  thresholds = { warning: 60, critical: 80 },
  size = 180,
}) => {
  const percentage = useMemo(
    () => Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)),
    [value, min, max]
  );

  const getColor = () => {
    if (percentage >= thresholds.critical) return { main: '#ef4444', glow: 'rgba(239,68,68,0.4)' };
    if (percentage >= thresholds.warning) return { main: '#f59e0b', glow: 'rgba(245,158,11,0.4)' };
    return { main: '#22c55e', glow: 'rgba(34,197,94,0.3)' };
  };

  const color = getColor();
  const radius = size / 2 - 20;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  const gradientId = `gauge-grad-${uid}`;
  const glowId = `gauge-glow-${uid}`;

  const needleAngle = Math.PI - (percentage / 100) * Math.PI;
  const needleLen = radius - 28;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy - needleLen * Math.sin(needleAngle);

  return (
    <div className="gauge-chart" style={{ width: size, height: size * 0.75, position: 'relative' }}>
      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size * 0.75}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${glowId}-needle`}>
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color.main} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Track gradient arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.15"
        />

        {/* Value arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color.main}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#${glowId})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
        />

        {/* Tick marks with labels */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = cx + (radius - 20) * Math.cos(angle);
          const y1 = cy - (radius - 20) * Math.sin(angle);
          const x2 = cx + (radius - 12) * Math.cos(angle);
          const y2 = cy - (radius - 12) * Math.sin(angle);
          const lx = cx + (radius + 10) * Math.cos(angle);
          const ly = cy - (radius + 10) * Math.sin(angle);
          const tickVal = Math.round(min + (tick / 100) * (max - min));
          return (
            <g key={tick}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="8" fontWeight="600">
                {tickVal}
              </text>
            </g>
          );
        })}

        {/* Minor ticks */}
        {Array.from({ length: 21 }, (_, i) => i * 5).map((tick) => {
          if (tick % 25 === 0) return null;
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = cx + (radius - 17) * Math.cos(angle);
          const y1 = cy - (radius - 17) * Math.sin(angle);
          const x2 = cx + (radius - 12) * Math.cos(angle);
          const y2 = cy - (radius - 12) * Math.sin(angle);
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />;
        })}

        {/* Needle with glow */}
        <line
          x1={cx} y1={cy} x2={nx} y2={ny}
          stroke={color.main}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${glowId}-needle)`}
          style={{ transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="6" fill={color.main} />
        <circle cx={cx} cy={cy} r="3" fill="white" />

        {/* Value */}
        <text x={cx} y={cy - 24} textAnchor="middle" fill="#0f172a" fontSize="24" fontWeight="800" style={{ fontFeatureSettings: "'tnum'" }}>
          {value?.toFixed?.(1) ?? value}
        </text>
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
          {unit}
        </text>
      </svg>
      {label && (
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
