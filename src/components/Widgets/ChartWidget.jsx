import React from 'react';
import { BarChart as BarChartIcon, Activity } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import './Widgets.css';

// --- Mock Data ---
const utilData = [
  { name: 'Riveting', active: 120, idle: 45, downtime: 15 },
  { name: 'Packing', active: 90, idle: 60, downtime: 30 },
  { name: 'Cutting', active: 140, idle: 20, downtime: 5 },
  { name: 'Labeling', active: 110, idle: 50, downtime: 20 },
];

const oeeData = [
  { time: '07:00', performance: 65, quality: 40, availability: 80 },
  { time: '08:00', performance: 75, quality: 50, availability: 60 },
  { time: '09:00', performance: 90, quality: 80, availability: 75 },
  { time: '10:00', performance: 80, quality: 70, availability: 95 },
  { time: '11:00', performance: 60, quality: 55, availability: 65 },
  { time: '12:00', performance: 85, quality: 90, availability: 100 },
];

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
  return (
    <>
      {/* 1. Equipment Utilization Stacked Bar */}
      <div className="glass-panel widget chart-widget">
        <div className="widget-header">
          <h3 className="widget-title"><BarChartIcon size={16} /> Equipment Utilization by Station</h3>
          <button className="info-btn">i</button>
        </div>

        <div className="chart-container" style={{ width: '100%', height: 180, marginTop: '8px' }}>
          <ResponsiveContainer>
            <BarChart data={utilData} maxBarSize={32}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)', paddingTop: '10px' }} />
              <Bar dataKey="active" stackId="a" fill="var(--accent-green)" radius={[0, 0, 2, 2]} />
              <Bar dataKey="idle" stackId="a" fill="var(--chart-blue)" />
              <Bar dataKey="downtime" stackId="a" fill="var(--accent-critical)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. OEE Over Time Spline Chart */}
      <div className="glass-panel widget chart-widget">
        <div className="widget-header">
          <h3 className="widget-title"><Activity size={16} /> OEE Over Time</h3>
          <button className="info-btn">i</button>
        </div>

        <div className="chart-container" style={{ width: '100%', height: 180, marginTop: '8px' }}>
          <ResponsiveContainer>
            <LineChart data={oeeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)', paddingTop: '10px' }} />
              
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="var(--accent-green)" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'var(--bg-color)', strokeWidth: 2 }} 
                activeDot={{ r: 5, fill: 'var(--accent-green)', stroke: '#fff' }} 
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="var(--chart-blue)" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'var(--bg-color)', strokeWidth: 2 }} 
                activeDot={{ r: 5, fill: 'var(--chart-blue)', stroke: '#fff' }} 
              />
              <Line 
                type="monotone" 
                dataKey="availability" 
                stroke="var(--accent-orange)" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'var(--bg-color)', strokeWidth: 2 }} 
                activeDot={{ r: 5, fill: 'var(--accent-orange)', stroke: '#fff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
