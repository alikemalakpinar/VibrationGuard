import { AlertTriangle } from 'lucide-react';

const DonutGauge = ({ completed, planned, size = 70, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(completed / planned, 1);
  const offset = circumference * (1 - pct);
  const color = pct >= 0.8 ? '#22C55E' : pct >= 0.5 ? '#F59E0B' : '#EF4444';

  return (
    <div className="dt-pg-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#F0F4F7" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="dt-pg-gauge-text">
        <div className="dt-pg-gauge-val">{completed}</div>
        <div className="dt-pg-gauge-total">/{planned}</div>
      </div>
    </div>
  );
};

const ProgressGauges = ({ production }) => {
  if (!production?.lines) return null;

  return (
    <div className="dt-card">
      <div className="dt-card-body">
        <div className="dt-pg-list">
          {production.lines.map((line) => (
            <div className="dt-pg-item" key={line.id}>
              <DonutGauge completed={line.completed} planned={line.planned} />
              <div className="dt-pg-info">
                <div className="dt-pg-label">
                  {line.id}
                  {line.status === 'warning' && (
                    <AlertTriangle size={12} className="dt-pg-status-icon" />
                  )}
                </div>
                <div className="dt-pg-legend">
                  <span className="dt-pg-legend-item">
                    <span className="dt-pg-legend-dot" style={{ background: '#22C55E' }} />
                    Completed
                  </span>
                  <span className="dt-pg-legend-item">
                    <span className="dt-pg-legend-dot" style={{ background: '#F59E0B' }} />
                    Planned
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressGauges;
