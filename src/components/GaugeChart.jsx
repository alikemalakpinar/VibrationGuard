import { useMemo } from 'react';

const GaugeChart = ({
  value = 0,
  min = 0,
  max = 100,
  unit = '',
  label = '',
  thresholds = { warning: 60, critical: 80 },
  size = 160,
}) => {
  const percentage = useMemo(
    () => Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)),
    [value, min, max]
  );

  const getColor = () => {
    if (percentage >= thresholds.critical) return '#ef4444';
    if (percentage >= thresholds.warning) return '#f59e0b';
    return '#22c55e';
  };

  const radius = size / 2 - 15;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2 + 10;

  return (
    <div className="gauge-chart" style={{ width: size, height: size * 0.7 }}>
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={getColor()}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = cx + (radius - 15) * Math.cos(angle);
          const y1 = cy - (radius - 15) * Math.sin(angle);
          const x2 = cx + (radius - 8) * Math.cos(angle);
          const y2 = cy - (radius - 8) * Math.sin(angle);
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
          );
        })}
        {/* Needle */}
        {(() => {
          const angle = Math.PI - (percentage / 100) * Math.PI;
          const needleLen = radius - 25;
          const nx = cx + needleLen * Math.cos(angle);
          const ny = cy - needleLen * Math.sin(angle);
          return (
            <>
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={getColor()}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transition: 'all 0.8s ease' }}
              />
              <circle cx={cx} cy={cy} r="4" fill={getColor()} />
            </>
          );
        })()}
        {/* Value text */}
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="gauge-value"
          fill="#1e293b"
          fontSize="20"
          fontWeight="700"
        >
          {value?.toFixed?.(1) ?? value}
        </text>
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="#64748b"
          fontSize="11"
        >
          {unit}
        </text>
      </svg>
      {label && <div className="gauge-label">{label}</div>}
    </div>
  );
};

export default GaugeChart;
