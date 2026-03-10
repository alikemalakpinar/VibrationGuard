import { LayoutDashboard, BarChart3, Cpu, Bell, Settings, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'machines', icon: Cpu, label: 'Machines' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
];

const IconNavRail = ({ activePage = 'dashboard' }) => (
  <nav className="dt-nav-rail">
    <div className="dt-nav-logo">
      <Activity size={18} />
    </div>
    <div className="dt-nav-items">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`dt-nav-btn ${activePage === item.id ? 'active' : ''}`}
          title={item.label}
        >
          <item.icon size={18} />
        </button>
      ))}
    </div>
    <div className="dt-nav-bottom">
      <button className="dt-nav-btn" title="Settings">
        <Settings size={18} />
      </button>
    </div>
  </nav>
);

export default IconNavRail;
