import { useNavigate } from 'react-router-dom';
import { MACHINES, ZONES, CONNECTION_LINES } from '../../config/factoryConfig';
import { getMachineType } from '../../config/machineTypes';

const DigitalTwinFloor = ({ factoryData, getMachineHistory }) => {
  const navigate = useNavigate();

  const handleMachineClick = (machineId) => {
    navigate(`/machine/${machineId}`);
  };

  const machineMap = {};
  MACHINES.forEach((m) => { machineMap[m.id] = m; });

  const getStatusColor = (status) =>
    status === 'critical' ? '#EF4444' :
    status === 'warning' ? '#F59E0B' : '#22C55E';

  const getHealthPct = (machineData) => {
    if (!machineData?.sensors) return 0;
    const statuses = Object.values(machineData.sensors).map((s) => s.status);
    const score = statuses.reduce((sum, s) =>
      sum + (s === 'normal' ? 100 : s === 'warning' ? 60 : 10), 0);
    return Math.round(score / statuses.length);
  };

  return (
    <div className="dt-twin-floor">
      <svg
        viewBox="0 50 1100 460"
        width="100%"
        className="dt-twin-floor-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Isometric grid */}
          <pattern id="dt-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <pattern id="dt-iso-grid" width="60" height="34.64" patternUnits="userSpaceOnUse">
            <line x1="0" y1="17.32" x2="60" y2="17.32" stroke="#CBD5E1" strokeWidth="0.3" opacity="0.25" />
            <line x1="0" y1="0" x2="30" y2="17.32" stroke="#CBD5E1" strokeWidth="0.3" opacity="0.25" />
            <line x1="60" y1="0" x2="30" y2="17.32" stroke="#CBD5E1" strokeWidth="0.3" opacity="0.25" />
          </pattern>
          <filter id="dt-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            .dt-conn-line { animation: dt-dash-flow 2s linear infinite; }
            @keyframes dt-dash-flow { to { stroke-dashoffset: -20; } }
          `}</style>
        </defs>

        {/* Background */}
        <rect y="50" width="1100" height="460" fill="#F8FAFC" rx="12" />
        <rect y="50" width="1100" height="460" fill="url(#dt-grid)" rx="12" />

        {/* Zone backgrounds */}
        {Object.entries(ZONES).map(([zoneId, zone]) => {
          const zoneMachines = MACHINES.filter((m) => m.zone === zoneId);
          if (!zoneMachines.length) return null;
          const xs = zoneMachines.map((m) => m.position.x);
          const ys = zoneMachines.map((m) => m.position.y);
          const pad = 65;
          const x = Math.min(...xs) - pad;
          const y = Math.min(...ys) - pad - 10;
          const w = Math.max(...xs) - Math.min(...xs) + pad * 2 + 100;
          const h = Math.max(...ys) - Math.min(...ys) + pad * 2 + 60;

          return (
            <g key={zoneId}>
              <rect x={x} y={y} width={w} height={h} rx="16"
                fill={zone.color} opacity="0.04"
                stroke={zone.color} strokeWidth="1" strokeOpacity="0.15" strokeDasharray="8,4"
              />
              <text x={x + 12} y={y + 16} fill={zone.color} fontSize="10" fontWeight="600" opacity="0.5">
                {zone.label}
              </text>
            </g>
          );
        })}

        {/* Connection lines */}
        {CONNECTION_LINES.map((line, i) => {
          const from = machineMap[line.from];
          const to = machineMap[line.to];
          if (!from || !to) return null;
          const x1 = from.position.x + 45, y1 = from.position.y + 30;
          const x2 = to.position.x + 45, y2 = to.position.y + 30;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 15;
          return (
            <path key={i}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none" stroke="#94A3B8" strokeWidth="1.5"
              strokeDasharray="6,4" opacity="0.35" className="dt-conn-line"
            />
          );
        })}

        {/* Data flow particles */}
        {CONNECTION_LINES.map((line, i) => {
          const from = machineMap[line.from];
          const to = machineMap[line.to];
          if (!from || !to) return null;
          const x1 = from.position.x + 45, y1 = from.position.y + 30;
          const x2 = to.position.x + 45, y2 = to.position.y + 30;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 15;
          return (
            <circle key={`p-${i}`} r="2.5" fill="#22C55E" opacity="0.5">
              <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite"
                path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              />
            </circle>
          );
        })}

        {/* Machine nodes with health rings */}
        {MACHINES.map((machine) => {
          const typeConfig = getMachineType(machine.type);
          const data = factoryData?.[machine.id];
          const status = data?.status || 'normal';
          const statusColor = getStatusColor(status);
          const healthPct = getHealthPct(data);
          const cx = machine.position.x + typeConfig.width / 2;
          const cy = machine.position.y + typeConfig.height / 2 - 5;
          const ringR = Math.max(typeConfig.width, typeConfig.height) * 0.55;
          const circumference = 2 * Math.PI * ringR;
          const healthOffset = circumference * (1 - healthPct / 100);

          const primarySensor = machine.sensors[0];
          const primaryValue = data?.sensors?.[primarySensor]?.value;
          const primaryUnit = data?.sensors?.[primarySensor]?.unit;

          return (
            <g key={machine.id} className="machine-node"
              transform={`translate(${machine.position.x}, ${machine.position.y})`}
              onClick={() => handleMachineClick(machine.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Click target (invisible rect covering the machine area) */}
              <rect x={-20} y={-20} width={typeConfig.width + 40} height={typeConfig.height + 30}
                fill="transparent" style={{ cursor: 'pointer' }}
              />

              {/* Isometric platform */}
              <polygon
                points={`${typeConfig.width / 2},-15 ${typeConfig.width + 20},${typeConfig.height / 2 - 10} ${typeConfig.width / 2},${typeConfig.height + 5} -20,${typeConfig.height / 2 - 10}`}
                fill={statusColor} opacity="0.06"
                stroke={statusColor} strokeWidth="0.5" strokeOpacity="0.15"
              />

              {/* Shadow */}
              <ellipse cx={typeConfig.width / 2} cy={typeConfig.height - 3}
                rx={typeConfig.width * 0.45} ry={8}
                fill="rgba(0,0,0,0.06)" className="machine-shadow"
              />

              {/* Health ring background */}
              <circle cx={typeConfig.width / 2} cy={typeConfig.height / 2 - 5}
                r={ringR} fill="none" stroke="#E2E8F0" strokeWidth="3"
              />

              {/* Health ring foreground */}
              <circle cx={typeConfig.width / 2} cy={typeConfig.height / 2 - 5}
                r={ringR} fill="none" stroke={statusColor} strokeWidth="3"
                strokeDasharray={circumference} strokeDashoffset={healthOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${typeConfig.width / 2} ${typeConfig.height / 2 - 5})`}
                className="dt-health-ring-fg"
              />

              {/* Status pulse ring */}
              <circle cx={typeConfig.width / 2} cy={typeConfig.height / 2 - 5}
                r={ringR + 5} fill="none" stroke={statusColor} strokeWidth="1" opacity="0.2"
              >
                <animate attributeName="r"
                  values={`${ringR + 3};${ringR + 10};${ringR + 3}`}
                  dur="2.5s" repeatCount="indefinite"
                />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {/* Hover glow */}
              <circle cx={typeConfig.width / 2} cy={typeConfig.height / 2 - 5}
                r={ringR} fill={statusColor} opacity="0" className="machine-hover-glow"
              />

              {/* Machine SVG */}
              <g dangerouslySetInnerHTML={{
                __html: typeConfig.render(typeConfig.color, typeConfig.colorLight, typeConfig.colorDark)
              }} />

              {/* Status dot */}
              <circle cx={typeConfig.width - 2} cy={-2} r="5"
                fill={statusColor} stroke="#fff" strokeWidth="2"
              />

              {/* Floating label with ID + health */}
              <g style={{ pointerEvents: 'none' }}>
                <foreignObject x={-35} y={-58} width={typeConfig.width + 70} height={55}
                  style={{ overflow: 'visible', pointerEvents: 'none' }}
                >
                  <div xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      background: 'white', borderRadius: 8, padding: '4px 10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #E6EDF2',
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: 'fit-content', margin: '0 auto',
                      fontFamily: 'Inter, sans-serif',
                      animation: 'dt-float 3s ease-in-out infinite',
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: statusColor, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                      {machine.name.split(' ')[0]}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: statusColor,
                      background: `${statusColor}15`, padding: '1px 6px',
                      borderRadius: 10, whiteSpace: 'nowrap',
                    }}>
                      {healthPct}%
                    </span>
                  </div>
                </foreignObject>
              </g>

              {/* Hover tooltip */}
              <g className="dt-machine-tooltip" style={{ pointerEvents: 'none' }}>
                <foreignObject x={typeConfig.width + 10} y={-20} width={150} height={90}
                  style={{ overflow: 'visible', pointerEvents: 'none' }}
                >
                  <div xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      background: 'white', borderRadius: 8, padding: '8px 10px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #E6EDF2',
                      fontFamily: 'Inter, sans-serif', fontSize: 10,
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#0F172A' }}>{machine.name}</div>
                    {data && Object.entries(data.sensors).slice(0, 4).map(([type, s]) => (
                      <div key={type} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#64748B', marginBottom: 1 }}>
                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                        <span style={{ fontWeight: 600, color: '#0F172A' }}>{Number(s.value).toFixed(1)} {s.unit}</span>
                      </div>
                    ))}
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DigitalTwinFloor;
