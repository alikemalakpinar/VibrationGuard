import { useNavigate } from 'react-router-dom';
import { MACHINES, ZONES, CONNECTION_LINES } from '../../config/factoryConfig';
import MachineNode from './MachineNode';

const FactoryFloorCanvas = ({ factoryData, getMachineHistory }) => {
  const navigate = useNavigate();

  const handleMachineClick = (machineId) => {
    navigate(`/machine/${machineId}`);
  };
  // Get machine positions for connection lines
  const machineMap = {};
  MACHINES.forEach((m) => {
    machineMap[m.id] = m;
  });

  return (
    <div className="factory-floor-canvas">
      <svg
        viewBox="0 60 1100 440"
        width="100%"
        className="factory-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="0.5"
              opacity="0.4"
            />
          </pattern>

          {/* Isometric grid pattern */}
          <pattern id="iso-grid" width="60" height="34.64" patternUnits="userSpaceOnUse">
            <line x1="0" y1="17.32" x2="60" y2="17.32" stroke="#CBD5E1" strokeWidth="0.3" opacity="0.3" />
            <line x1="0" y1="0" x2="30" y2="17.32" stroke="#CBD5E1" strokeWidth="0.3" opacity="0.3" />
            <line x1="60" y1="0" x2="30" y2="17.32" stroke="#CBD5E1" strokeWidth="0.3" opacity="0.3" />
          </pattern>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated dash for connection lines */}
          <style>{`
            .connection-line {
              animation: dash-flow 2s linear infinite;
            }
            @keyframes dash-flow {
              to { stroke-dashoffset: -20; }
            }
          `}</style>
        </defs>

        {/* Background */}
        <rect y="60" width="1100" height="440" fill="#F0F2F5" rx="12" />
        <rect y="60" width="1100" height="440" fill="url(#grid)" rx="12" />

        {/* Zone backgrounds */}
        {Object.entries(ZONES).map(([zoneId, zone]) => {
          const zoneMachines = MACHINES.filter((m) => m.zone === zoneId);
          if (zoneMachines.length === 0) return null;

          const xs = zoneMachines.map((m) => m.position.x);
          const ys = zoneMachines.map((m) => m.position.y);
          const padding = 60;
          const x = Math.min(...xs) - padding;
          const y = Math.min(...ys) - padding - 15;
          const w = Math.max(...xs) - Math.min(...xs) + padding * 2 + 100;
          const h = Math.max(...ys) - Math.min(...ys) + padding * 2 + 60;

          return (
            <g key={zoneId}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="16"
                fill={zone.color}
                opacity="0.04"
                stroke={zone.color}
                strokeWidth="1"
                strokeOpacity="0.15"
                strokeDasharray="8,4"
              />
              <text
                x={x + 12}
                y={y + 18}
                fill={zone.color}
                fontSize="11"
                fontWeight="600"
                opacity="0.6"
              >
                {zone.label}
              </text>
            </g>
          );
        })}

        {/* Connection lines between machines */}
        {CONNECTION_LINES.map((line, i) => {
          const from = machineMap[line.from];
          const to = machineMap[line.to];
          if (!from || !to) return null;

          const x1 = from.position.x + 45;
          const y1 = from.position.y + 30;
          const x2 = to.position.x + 45;
          const y2 = to.position.y + 30;

          // Curved path
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - 20;

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              opacity="0.4"
              className="connection-line"
            />
          );
        })}

        {/* Data flow particles on connection lines */}
        {CONNECTION_LINES.map((line, i) => {
          const from = machineMap[line.from];
          const to = machineMap[line.to];
          if (!from || !to) return null;

          const x1 = from.position.x + 45;
          const y1 = from.position.y + 30;
          const x2 = to.position.x + 45;
          const y2 = to.position.y + 30;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - 20;

          return (
            <circle key={`particle-${i}`} r="3" fill="#3B82F6" opacity="0.6">
              <animateMotion
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
                path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              />
            </circle>
          );
        })}

        {/* Machine nodes */}
        {MACHINES.map((machine) => (
          <MachineNode
            key={machine.id}
            machine={machine}
            machineData={factoryData?.[machine.id]}
            history={getMachineHistory(machine.id, machine.sensors[0])}
            onMachineClick={handleMachineClick}
          />
        ))}
      </svg>
    </div>
  );
};

export default FactoryFloorCanvas;
