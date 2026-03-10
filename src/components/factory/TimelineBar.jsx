import { useMemo } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const TimelineBar = ({ alerts = [] }) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  const timeMarkers = useMemo(() => {
    const markers = [];
    const startHour = Math.max(0, currentHour - 1);
    for (let h = startHour; h <= Math.min(23, currentHour + 1); h++) {
      for (let m = 0; m < 60; m += 5) {
        markers.push({
          hour: h,
          minute: m,
          label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          isMajor: m === 0,
        });
      }
    }
    return markers;
  }, [currentHour]);

  const totalMinutes = timeMarkers.length * 5;
  const activeStart = (currentMin >= 20 ? currentMin - 20 : 0) + (currentHour - timeMarkers[0]?.hour || 0) * 60;
  const activeEnd = currentMin + (currentHour - (timeMarkers[0]?.hour || 0)) * 60;

  const getX = (h, m) => {
    const minutesSinceStart = (h - (timeMarkers[0]?.hour || 0)) * 60 + m;
    return (minutesSinceStart / totalMinutes) * 100;
  };

  const alertDots = useMemo(() =>
    alerts.slice(0, 8).map((alert, i) => {
      const alertTime = new Date(alert.timestamp);
      const x = getX(alertTime.getHours(), alertTime.getMinutes());
      return { ...alert, x, key: i };
    }).filter(a => a.x >= 0 && a.x <= 100),
    [alerts, timeMarkers]
  );

  return (
    <div className="dt-timeline">
      <div className="dt-tl-zone-select">
        <span className="dt-tl-zone-label">Select Zone</span>
        <span className="dt-tl-zone-value">
          Zone - T2 <ChevronDown size={12} />
        </span>
      </div>

      <div className="dt-tl-svg-wrap">
        <svg className="dt-tl-svg" viewBox="0 0 1000 50" preserveAspectRatio="xMidYMid meet">
          {/* Background line */}
          <line x1="0" y1="25" x2="1000" y2="25" stroke="#E6EDF2" strokeWidth="2" />

          {/* Active range highlight */}
          <rect
            x={activeStart / totalMinutes * 1000}
            y="8"
            width={Math.max(0, (activeEnd - activeStart) / totalMinutes * 1000)}
            height="34"
            rx="4"
            fill="rgba(34, 197, 94, 0.12)"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="1"
          />

          {/* Time markers */}
          {timeMarkers.map((marker, i) => {
            const x = (i / timeMarkers.length) * 1000;
            return (
              <g key={i}>
                <line
                  x1={x} y1={marker.isMajor ? 14 : 20}
                  x2={x} y2={marker.isMajor ? 36 : 30}
                  stroke={marker.isMajor ? '#94A3B8' : '#CBD5E1'}
                  strokeWidth={marker.isMajor ? 1.5 : 0.5}
                />
                {marker.isMajor && (
                  <text x={x} y={46} textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="500">
                    {marker.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Alert event dots */}
          {alertDots.map((dot) => (
            <circle
              key={dot.key}
              cx={dot.x * 10}
              cy="10"
              r="4"
              fill={dot.type === 'critical' ? '#EF4444' : dot.type === 'warning' ? '#F59E0B' : '#22C55E'}
              stroke="white"
              strokeWidth="1.5"
            />
          ))}

          {/* Current time cursor */}
          <line
            x1={getX(currentHour, currentMin) * 10}
            y1="5"
            x2={getX(currentHour, currentMin) * 10}
            y2="45"
            stroke="#22C55E"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle
            cx={getX(currentHour, currentMin) * 10}
            cy="25"
            r="4"
            fill="#22C55E"
          />
        </svg>
      </div>

      <button className="dt-tl-right-btn">
        <Sparkles size={16} />
      </button>
    </div>
  );
};

export default TimelineBar;
