import { Map } from 'lucide-react';
import { MACHINES, ZONES } from '../../config/factoryConfig';
import DashboardCard from './DashboardCard';

const FactoryMiniMap = ({ factoryData }) => {
  const getStatusColor = (machineId) => {
    const status = factoryData?.[machineId]?.status;
    if (status === 'critical') return '#EF4444';
    if (status === 'warning') return '#F59E0B';
    return '#22C55E';
  };

  // Scale positions to fit minimap (original: 120-920 x, 140-380 y)
  const scaleX = (x) => ((x - 80) / 900) * 230 + 10;
  const scaleY = (y) => ((y - 120) / 300) * 110 + 10;

  return (
    <DashboardCard title="Map" icon={<Map size={11} />} iconBg="#22C55E">
      <div className="dt-minimap-body">
        <svg className="dt-minimap-svg" viewBox="0 0 250 130">
          {/* Zone backgrounds */}
          {Object.entries(ZONES).map(([zoneId, zone]) => {
            const zoneMachines = MACHINES.filter((m) => m.zone === zoneId);
            if (!zoneMachines.length) return null;
            const xs = zoneMachines.map((m) => scaleX(m.position.x));
            const ys = zoneMachines.map((m) => scaleY(m.position.y));
            return (
              <rect
                key={zoneId}
                x={Math.min(...xs) - 12}
                y={Math.min(...ys) - 12}
                width={Math.max(...xs) - Math.min(...xs) + 24}
                height={Math.max(...ys) - Math.min(...ys) + 24}
                rx="4"
                fill={zone.color}
                opacity="0.08"
                stroke={zone.color}
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
            );
          })}

          {/* Zone labels */}
          {Object.entries(ZONES).map(([zoneId, zone]) => {
            const zoneMachines = MACHINES.filter((m) => m.zone === zoneId);
            if (!zoneMachines.length) return null;
            const xs = zoneMachines.map((m) => scaleX(m.position.x));
            const ys = zoneMachines.map((m) => scaleY(m.position.y));
            return (
              <text
                key={`label-${zoneId}`}
                x={Math.min(...xs) - 8}
                y={Math.min(...ys) - 5}
                fill={zone.color}
                fontSize="6"
                fontWeight="600"
                opacity="0.6"
              >
                {zone.label.split(' ').slice(-1)[0]} {zoneId}
              </text>
            );
          })}

          {/* Connection lines */}
          {MACHINES.slice(0, -1).map((m, i) => {
            const next = MACHINES[i + 1];
            if (!next) return null;
            return (
              <line
                key={i}
                x1={scaleX(m.position.x)}
                y1={scaleY(m.position.y)}
                x2={scaleX(next.position.x)}
                y2={scaleY(next.position.y)}
                stroke="#22C55E"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}

          {/* Machine dots */}
          {MACHINES.map((m) => (
            <g key={m.id}>
              <circle
                cx={scaleX(m.position.x)}
                cy={scaleY(m.position.y)}
                r="5"
                fill={getStatusColor(m.id)}
                opacity="0.15"
              />
              <circle
                cx={scaleX(m.position.x)}
                cy={scaleY(m.position.y)}
                r="3"
                fill={getStatusColor(m.id)}
              />
            </g>
          ))}
        </svg>
      </div>
    </DashboardCard>
  );
};

export default FactoryMiniMap;
