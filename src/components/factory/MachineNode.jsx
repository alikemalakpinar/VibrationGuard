import { getMachineType } from '../../config/machineTypes';

const MachineNode = ({ machine, machineData, history, onMachineClick }) => {
  const typeConfig = getMachineType(machine.type);

  const status = machineData?.status || 'normal';
  const statusColor =
    status === 'critical' ? '#EF4444' :
    status === 'warning' ? '#F59E0B' : '#10B981';

  const primarySensor = machine.sensors[0];
  const primaryValue = machineData?.sensors?.[primarySensor]?.value;
  const primaryUnit = machineData?.sensors?.[primarySensor]?.unit;

  return (
    <g
      className="machine-node"
      transform={`translate(${machine.position.x}, ${machine.position.y})`}
      onClick={() => onMachineClick(machine.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Shadow */}
      <ellipse
        cx={typeConfig.width / 2}
        cy={typeConfig.height - 5}
        rx={typeConfig.width * 0.45}
        ry={8}
        fill="rgba(0,0,0,0.08)"
        className="machine-shadow"
      />

      {/* Status pulse ring */}
      <circle
        cx={typeConfig.width / 2}
        cy={typeConfig.height / 2 - 5}
        r={Math.max(typeConfig.width, typeConfig.height) * 0.55}
        fill="none"
        stroke={statusColor}
        strokeWidth="2"
        opacity="0.3"
        className="status-pulse-ring"
      >
        <animate
          attributeName="r"
          values={`${Math.max(typeConfig.width, typeConfig.height) * 0.5};${Math.max(typeConfig.width, typeConfig.height) * 0.65};${Math.max(typeConfig.width, typeConfig.height) * 0.5}`}
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0.1;0.4"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Hover glow - shown via CSS */}
      <circle
        cx={typeConfig.width / 2}
        cy={typeConfig.height / 2 - 5}
        r={Math.max(typeConfig.width, typeConfig.height) * 0.5}
        fill={statusColor}
        opacity="0"
        className="machine-hover-glow"
      />

      {/* Machine SVG */}
      <g dangerouslySetInnerHTML={{
        __html: typeConfig.render(
          typeConfig.color,
          typeConfig.colorLight,
          typeConfig.colorDark
        )
      }} />

      {/* Status indicator dot */}
      <circle
        cx={typeConfig.width - 5}
        cy={-5}
        r="6"
        fill={statusColor}
        stroke="#fff"
        strokeWidth="2"
      >
        {status !== 'normal' && (
          <animate
            attributeName="r"
            values="5;7;5"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Floating label */}
      <g className="machine-floating-label">
        <foreignObject
          x={-30}
          y={-50}
          width={typeConfig.width + 60}
          height={45}
          style={{ overflow: 'visible' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="machine-label"
          >
            <span className="ml-name">{machine.name}</span>
            {primaryValue !== undefined && (
              <span className="ml-value">
                <span className="ml-dot" style={{ background: statusColor }} />
                {Number(primaryValue).toFixed(1)} {primaryUnit}
              </span>
            )}
          </div>
        </foreignObject>
      </g>
    </g>
  );
};

export default MachineNode;
