import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, AlertTriangle, XCircle, Info, ChevronRight,
  BarChart3
} from 'lucide-react';
import { MACHINES, ZONES } from '../../config/factoryConfig';

const FactorySidebar = ({ factoryData, alerts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const filteredMachines = MACHINES.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const machineStatus = factoryData?.[m.id]?.status || 'normal';
    const matchesFilter = statusFilter === 'all' || machineStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    if (status === 'critical') return '#EF4444';
    if (status === 'warning') return '#F59E0B';
    return '#10B981';
  };

  const getAlertIcon = (type) => {
    if (type === 'critical') return <XCircle size={14} className="alert-icon critical" />;
    if (type === 'warning') return <AlertTriangle size={14} className="alert-icon warning" />;
    return <Info size={14} className="alert-icon info" />;
  };

  return (
    <aside className="factory-sidebar">
      {/* Machine List */}
      <div className="fs-card">
        <div className="fs-card-header">
          <h3><BarChart3 size={16} /> Makinalar</h3>
          <div className="fs-filters">
            {['all', 'normal', 'warning', 'critical'].map((f) => (
              <button
                key={f}
                className={`fs-filter-btn ${statusFilter === f ? 'active' : ''} ${f}`}
                onClick={() => setStatusFilter(f)}
              >
                {f === 'all' ? 'Tum' :
                 f === 'normal' ? 'Normal' :
                 f === 'warning' ? 'Uyari' : 'Kritik'}
              </button>
            ))}
          </div>
        </div>

        <div className="fs-search">
          <Search size={14} className="fs-search-icon" />
          <input
            type="text"
            placeholder="Makina ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="fs-machine-list">
          {filteredMachines.map((machine) => {
            const data = factoryData?.[machine.id];
            const status = data?.status || 'normal';
            const zone = ZONES[machine.zone];

            return (
              <div
                key={machine.id}
                className="fs-machine-item"
                onClick={() => navigate(`/machine/${machine.id}`)}
              >
                <div className="fs-mi-left">
                  <div
                    className="fs-mi-status"
                    style={{ background: getStatusColor(status) }}
                  />
                  <div className="fs-mi-info">
                    <span className="fs-mi-name">{machine.name}</span>
                    <span className="fs-mi-zone" style={{ color: zone?.color }}>
                      {zone?.label}
                    </span>
                  </div>
                </div>
                <div className="fs-mi-right">
                  <div className="fs-mi-sensors">
                    {machine.sensors.slice(0, 3).map((s) => {
                      const sData = data?.sensors?.[s];
                      const sColor = getStatusColor(sData?.status || 'normal');
                      return (
                        <span
                          key={s}
                          className="fs-mi-sensor-dot"
                          style={{ background: sColor }}
                          title={`${s}: ${sData?.value || '--'}`}
                        />
                      );
                    })}
                  </div>
                  <ChevronRight size={14} className="fs-mi-arrow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="fs-card">
        <div className="fs-card-header">
          <h3><AlertTriangle size={16} /> Son Alarmlar</h3>
        </div>
        <div className="fs-alerts-list">
          {(alerts || []).slice(0, 6).map((alert) => (
            <div
              key={alert.id}
              className={`fs-alert-item ${alert.type}`}
              onClick={() => navigate(`/machine/${alert.machineId}`)}
            >
              {getAlertIcon(alert.type)}
              <div className="fs-alert-content">
                <span className="fs-alert-msg">{alert.message}</span>
                <span className="fs-alert-time">{alert.time}</span>
              </div>
            </div>
          ))}
          {(!alerts || alerts.length === 0) && (
            <div className="fs-empty">Alarm yok</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FactorySidebar;
