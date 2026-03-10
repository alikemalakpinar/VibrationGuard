import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Factory, ChevronRight, Clock, Wifi, WifiOff,
  Shield, AlertTriangle, XCircle, CheckCircle2
} from 'lucide-react';

const DetailHeader = ({ machine, machineData, connected }) => {
  const navigate = useNavigate();

  const status = machineData?.status || 'normal';
  const statusConfig = {
    normal: { label: 'Normal', color: '#10B981', icon: CheckCircle2 },
    warning: { label: 'Uyari', color: '#F59E0B', icon: AlertTriangle },
    critical: { label: 'Kritik', color: '#EF4444', icon: XCircle },
  };
  const st = statusConfig[status];
  const StatusIcon = st.icon;

  return (
    <header className="detail-header">
      <div className="dh-left">
        <motion.button
          className="dh-back-btn"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          <span>Geri</span>
        </motion.button>

        <div className="dh-breadcrumb">
          <Factory size={14} />
          <span>Fabrika</span>
          <ChevronRight size={12} />
          <span className="dh-current">{machine?.name || 'Makina'}</span>
        </div>
      </div>

      <div className="dh-center">
        <h1 className="dh-title">{machine?.name || 'Makina Detayi'}</h1>
        <div className="dh-status-badge" style={{ background: `${st.color}15`, border: `1px solid ${st.color}30` }}>
          <StatusIcon size={14} style={{ color: st.color }} />
          <span style={{ color: st.color }}>{st.label}</span>
        </div>
      </div>

      <div className="dh-right">
        <div className="dh-meta">
          <Clock size={13} />
          <span>Son guncelleme: {machineData?.lastUpdate || '--'}</span>
        </div>
        <div className={`dh-conn ${connected ? 'online' : 'offline'}`}>
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
        </div>
      </div>
    </header>
  );
};

export default DetailHeader;
