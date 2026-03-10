import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import DashboardCard from './DashboardCard';

const OEEChart = ({ data = [] }) => (
  <DashboardCard
    title="OEE Over Time"
    icon={<TrendingUp size={11} />}
    iconBg="#22C55E"
    headerRight={
      <div style={{ display: 'flex', gap: 4 }}>
        {['6h', '12h', '1d', '7d'].map((t) => (
          <button
            key={t}
            style={{
              padding: '2px 6px', fontSize: 9, fontWeight: 500,
              border: '1px solid #E6EDF2', borderRadius: 4,
              background: t === '6h' ? '#F0F4F7' : 'transparent',
              color: '#64748B', cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    }
  >
    <div className="dt-chart-legend">
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#22C55E' }} /> Performance
      </span>
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#3B82F6' }} /> Quality
      </span>
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#F59E0B' }} /> Availability
      </span>
    </div>
    <div className="dt-chart-body">
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F7" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E6EDF2', borderRadius: 8, fontSize: 11 }}
          />
          <Line type="monotone" dataKey="performance" stroke="#22C55E" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="quality" stroke="#3B82F6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="availability" stroke="#F59E0B" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </DashboardCard>
);

export default OEEChart;
