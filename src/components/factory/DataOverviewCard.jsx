import { Clock, Activity, Cpu, Zap } from 'lucide-react';
import DashboardCard from './DashboardCard';

const DataOverviewCard = ({ stats, factoryData }) => {
  const avgVibration = factoryData
    ? (Object.values(factoryData).reduce((sum, m) =>
        sum + (m.sensors?.vibration?.value || 0), 0) / Object.keys(factoryData).length).toFixed(1)
    : '0.0';

  const rows = [
    {
      icon: <Clock size={15} />,
      label: 'Accumulated working hours',
      value: '201',
      unit: 'h',
    },
    {
      icon: <Activity size={15} />,
      label: 'Accumulated Steam quantity',
      value: avgVibration,
      unit: 'mm/s',
    },
    {
      icon: <Cpu size={15} />,
      label: 'Number of Staff',
      value: `${stats?.normal || 0}/${stats?.total || 0}`,
      unit: 'Active',
    },
    {
      icon: <Zap size={15} />,
      label: 'Voltage',
      value: '42/60',
      unit: 'V',
    },
  ];

  return (
    <DashboardCard
      title="Data Overview"
      icon={<Activity size={11} />}
      iconBg="#22C55E"
    >
      <div className="dt-card-body">
        <div className="dt-do-rows">
          {rows.map((row, i) => (
            <div className="dt-do-row" key={i}>
              <div className="dt-do-icon">{row.icon}</div>
              <div className="dt-do-info">
                <div className="dt-do-label">{row.label}</div>
                <div className="dt-do-value">
                  {row.value} <span className="dt-do-unit">{row.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default DataOverviewCard;
