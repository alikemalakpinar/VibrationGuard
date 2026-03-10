import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Widgets.css';

const data = [
  { name: 'Jan', actual: 4000, target: 2400 },
  { name: 'Feb', actual: 3000, target: 1398 },
  { name: 'Mar', actual: 2000, target: 9800 },
  { name: 'Apr', actual: 2780, target: 3908 },
  { name: 'May', actual: 1890, target: 4800 },
  { name: 'Jun', actual: 2390, target: 3800 },
  { name: 'Jul', actual: 3490, target: 4300 },
];

export default function ChartWidget() {
  return (
    <div className="glass-panel widget chart-widget">
      <div className="widget-header">
        <h3 className="widget-title"><BarChartIcon size={16} /> Equipment Metrics</h3>
        <button className="info-btn">i</button>
      </div>

      <div className="chart-container" style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#8a9b96" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8a9b96" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
            <Bar dataKey="actual" fill="var(--accent-green)" radius={[2, 2, 0, 0]} barSize={8} />
            <Bar dataKey="target" fill="var(--accent-orange)" radius={[2, 2, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
