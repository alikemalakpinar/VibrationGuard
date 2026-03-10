import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FactoryDataContext } from '../App';
import { 
  ArrowLeft, Waves, Volume2, Thermometer, Droplets, Magnet 
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts';
import './MachineDetailDark.css';

// Config layout for 5 sensors
const SENSORS = [
  { id: 'vib', label: 'Vibration', icon: Waves, unit: 'mm/s', color: 'var(--accent-green)', class: 'vib' },
  { id: 'snd', label: 'Sound Spectrum', icon: Volume2, unit: 'dB', color: 'var(--chart-blue)', class: 'snd' },
  { id: 'tmp', label: 'Temperature', icon: Thermometer, unit: '°C', color: 'var(--accent-orange)', class: 'tmp' },
  { id: 'mag', label: 'Magnetic Field', icon: Magnet, unit: 'mT', color: '#a855f7', class: 'mag' },
  { id: 'hum', label: 'Humidity', icon: Droplets, unit: '%RH', color: '#06b6d4', class: 'hum' }
];

export default function MachineDetailPage() {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const { factoryData } = useContext(FactoryDataContext);

  const machine = useMemo(() => {
    return factoryData?.find(m => m.id === machineId);
  }, [factoryData, machineId]);

  // Simulate trailing 10-point historical data per sensor locally for charts
  const [history, setHistory] = useState(() => {
    const init = {};
    SENSORS.forEach(s => {
      init[s.id] = Array.from({length: 15}, (_, i) => ({ 
        time: i, 
        val: (Math.random() * 20) + 10 
      }));
    });
    return init;
  });

  // Ticking specific data values
  const [currentVals, setCurrentVals] = useState({
    vib: 2.4, snd: 82, tmp: 45.2, hum: 38.5, mag: 1.2
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // Generate new mock val
      const newVib = +(currentVals.vib + (Math.random() * 0.4 - 0.2)).toFixed(2);
      const newSnd = +(currentVals.snd + (Math.random() * 4 - 2)).toFixed(1);
      const newTmp = +(currentVals.tmp + (Math.random() * 0.5 - 0.25)).toFixed(1);
      const newHum = +(currentVals.hum + (Math.random() * 0.2 - 0.1)).toFixed(1);
      const newMag = +(currentVals.mag + (Math.random() * 0.04 - 0.02)).toFixed(2);

      setCurrentVals({ vib: newVib, snd: newSnd, tmp: newTmp, hum: newHum, mag: newMag });

      setHistory(prev => {
        const next = {...prev};
        // push new val, pop old
        next.vib = [...next.vib.slice(1), { time: next.vib[next.vib.length-1].time + 1, val: newVib }];
        next.snd = [...next.snd.slice(1), { time: next.snd[next.snd.length-1].time + 1, val: newSnd }];
        next.tmp = [...next.tmp.slice(1), { time: next.tmp[next.tmp.length-1].time + 1, val: newTmp }];
        next.hum = [...next.hum.slice(1), { time: next.hum[next.hum.length-1].time + 1, val: newHum }];
        next.mag = [...next.mag.slice(1), { time: next.mag[next.mag.length-1].time + 1, val: newMag }];
        return next;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [currentVals]);

  if (!machine) {
    return (
      <div className="md-container" style={{ alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <h2>Machine Disconnected</h2>
        <button className="md-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="md-container">
      
      {/* Top Header */}
      <header className="md-header">
        <button className="md-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        
        <div className="md-machine-title">
          <h1>{machine.id}</h1>
          <span className={`md-status-badge ${machine.status}`}>
            {machine.status}
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="md-layout">
        
        {/* Left: 3D Hologram Area */}
        <div className="glass-panel md-hologram-container">
          <div className="md-hologram-bg" />
          <div className="md-radar-sweep">
             <div className="md-hologram-mock-machine">
               {machine.type.toUpperCase()}<br/>MODEL ACTIVE
             </div>
          </div>
        </div>

        {/* Right: Sensor Pipeline */}
        <div className="md-sensor-scroller">
          {SENSORS.map(sensor => {
            const Icon = sensor.icon;
            const currentVal = currentVals[sensor.id];
            const data = history[sensor.id];

            return (
              <div key={sensor.id} className="glass-panel md-sensor-card">
                <div className="md-sensor-header">
                  <div className={`md-sensor-title ${sensor.class}`}>
                    <Icon size={16} /> {sensor.label}
                  </div>
                  <div className="md-sensor-value tabular-data glow-text">
                    {currentVal} <span className="md-sensor-unit">{sensor.unit}</span>
                  </div>
                </div>

                <div className="md-sensor-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={sensor.color} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={sensor.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke={sensor.color} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill={`url(#grad-${sensor.id})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
