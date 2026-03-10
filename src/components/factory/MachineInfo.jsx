import { motion } from 'framer-motion';
import {
  Cpu, MapPin, Clock, Wrench, Activity, Radio
} from 'lucide-react';
import { ZONES } from '../../config/factoryConfig';
import { getMachineType } from '../../config/machineTypes';

const MachineInfo = ({ machine, machineData }) => {
  if (!machine) return null;

  const typeConfig = getMachineType(machine.type);
  const zone = ZONES[machine.zone];
  const status = machineData?.status || 'normal';
  const sensorCount = machine.sensors.length;

  const statusLabel =
    status === 'critical' ? 'Kritik' :
    status === 'warning' ? 'Uyari' : 'Normal';

  const statusColor =
    status === 'critical' ? '#EF4444' :
    status === 'warning' ? '#F59E0B' : '#10B981';

  return (
    <div className="machine-info-panel">
      <h3 className="mip-title">
        <Cpu size={16} />
        Makina Bilgileri
      </h3>

      <div className="mip-rows">
        <div className="mip-row">
          <span className="mip-label"><Cpu size={13} /> Tip</span>
          <span className="mip-value">{typeConfig.label}</span>
        </div>
        <div className="mip-row">
          <span className="mip-label"><MapPin size={13} /> Bolge</span>
          <span className="mip-value" style={{ color: zone?.color }}>{zone?.label}</span>
        </div>
        <div className="mip-row">
          <span className="mip-label"><Radio size={13} /> Sensor Sayisi</span>
          <span className="mip-value">{sensorCount} adet</span>
        </div>
        <div className="mip-row">
          <span className="mip-label"><Activity size={13} /> Durum</span>
          <span className="mip-value" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
        <div className="mip-row">
          <span className="mip-label"><Clock size={13} /> Son Guncelleme</span>
          <span className="mip-value">{machineData?.lastUpdate || '--'}</span>
        </div>
        <div className="mip-row">
          <span className="mip-label"><Wrench size={13} /> Bakim</span>
          <span className="mip-value">12 gun once</span>
        </div>
      </div>

      <motion.div
        className="mip-health"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="mip-health-label">
          <span>Genel Saglik</span>
          <span style={{ color: statusColor, fontWeight: 600 }}>
            {status === 'normal' ? '95%' : status === 'warning' ? '72%' : '38%'}
          </span>
        </div>
        <div className="mip-health-bar">
          <motion.div
            className="mip-health-fill"
            style={{ background: statusColor }}
            initial={{ width: 0 }}
            animate={{
              width: status === 'normal' ? '95%' : status === 'warning' ? '72%' : '38%'
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MachineInfo;
