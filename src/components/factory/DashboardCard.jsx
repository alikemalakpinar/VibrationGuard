import { Info } from 'lucide-react';

const DashboardCard = ({ title, icon, iconBg = '#3B82F6', children, className = '', headerRight }) => (
  <div className={`dt-card ${className}`}>
    <div className="dt-card-header">
      <div className="dt-card-title">
        {icon && (
          <span className="dt-card-title-icon" style={{ background: iconBg }}>
            {icon}
          </span>
        )}
        {title}
      </div>
      {headerRight || (
        <button className="dt-card-info-btn">
          <Info size={13} />
        </button>
      )}
    </div>
    {children}
  </div>
);

export default DashboardCard;
