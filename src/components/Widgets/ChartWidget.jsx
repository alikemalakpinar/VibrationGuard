import React, { useState, useEffect } from 'react';
import { Activity, Waves, Volume2 } from 'lucide-react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import './Widgets.css';

// Custom Glassmorphic Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-secondary)' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, boxShadow: `0 0 6px ${entry.color}` }} />
            <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }} className="tabular-data">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartWidget() {
  const [soundData, setSoundData] = useState([]);
  const [vibData, setVibData] = useState([]);

  // Mock initial data arrays
  useEffect(() => {
    const initSound = Array.from({ length: 12 }, (_, i) => ({ freq: `${(i+1)*100}Hz`, db: Math.random() * 80 + 20 }));
    const initVib = Array.from({ length: 20 }, (_, i) => ({ time: i, amp: Math.random() * 5 + 1 }));
    setSoundData(initSound);
    setVibData(initVib);

    // Live update simulation
    const interval = setInterval(() => {
      setSoundData(prev => prev.map(d => ({ ...d, db: Math.max(20, Math.min(110, d.db + (Math.random() * 20 - 10))) })));
      setVibData(prev => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, amp: Math.max(0.5, Math.min(8, prev[prev.length - 1].amp + (Math.random() * 3 - 1.5))) }];
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. Frequency / Sound Spectrum Bar Chart */}
      <div className="glass-panel widget chart-widget">
        <div className="widget-header">
          <h3 className="widget-title"><Volume2 size={16} /> Sound Spectrum Analysis</h3>
          <button className="info-btn">i</button>
        </div>

        <div className="chart-container" style={{ width: '100%', height: 180, marginTop: '8px' }}>
          <ResponsiveContainer>
            <BarChart data={soundData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="freq" stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} dy={5} />
              <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              
              <Bar dataKey="db" name="Sound (dB)" radius={[2, 2, 0, 0]}>
                {soundData.map((entry, index) => {
                  let color = 'var(--chart-blue)'; // Default safe
                  if (entry.db > 75) color = 'var(--accent-orange)';
                  if (entry.db > 95) color = 'var(--accent-critical)';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Vibration Waveform Area Chart */}
      <div className="glass-panel widget chart-widget">
        <div className="widget-header">
          <h3 className="widget-title"><Waves size={16} /> Transient Vibration Waveform</h3>
          <button className="info-btn">i</button>
        </div>

        <div className="chart-container" style={{ width: '100%', height: 180, marginTop: '8px' }}>
          <ResponsiveContainer>
            <AreaChart data={vibData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} horizontal={false} />
              <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dy={5} tickFormatter={() => ''} />
              <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="amp" 
                name="Amplitude (mm/s)"
                stroke="var(--accent-green)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAmp)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
