import { Factory, Package, Gauge, Activity, Clock, AlertTriangle, Timer } from 'lucide-react';

const ITEMS = [
  { key: 'unitsProduced', label: 'Units Produced', icon: Package, unit: 'Today', color: '#22C55E' },
  { key: 'unitsPerHour', label: 'Units Per Hour', icon: Gauge, unit: 'UPH', color: '#3B82F6' },
  { key: 'efficiencyRate', label: 'Efficiency Rate', icon: Activity, unit: '%', color: '#8B5CF6' },
  { key: 'downtimeToday', label: 'Downtime Today', icon: Clock, unit: 'mins', color: '#F59E0B' },
  { key: 'issuesPerDay', label: 'Issues Per Day', icon: AlertTriangle, unit: 'Issues', color: '#EF4444' },
  { key: 'cycleTime', label: 'Cycle Time', icon: Timer, unit: 'sec/unit', color: '#06B6D4' },
];

const ProductionBar = ({ data }) => {
  if (!data) return <div className="dt-production-bar" />;

  return (
    <div className="dt-production-bar">
      <div className="dt-pb-title">
        <Factory size={14} /> Production
      </div>
      <div className="dt-pb-items">
        {ITEMS.map((item) => (
          <div className="dt-pb-item" key={item.key}>
            <div className="dt-pb-icon" style={{ background: `${item.color}12`, color: item.color }}>
              <item.icon size={14} />
            </div>
            <div className="dt-pb-info">
              <div className="dt-pb-label">{item.label}</div>
              <div className="dt-pb-value">
                {data[item.key]?.toLocaleString?.() ?? data[item.key]}
                <span className="dt-pb-unit">{item.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionBar;
