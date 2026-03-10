import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import DashboardCard from './DashboardCard';

const EquipmentMetricsChart = ({ data = [] }) => (
  <DashboardCard title="Equipment Metrics" icon={<BarChart3 size={11} />} iconBg="#3B82F6">
    <div className="dt-chart-legend">
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#22C55E' }} /> Actual
      </span>
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#F59E0B' }} /> Target
      </span>
    </div>
    <div className="dt-chart-body">
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barGap={2} barSize={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F7" vertical={false} />
          <XAxis dataKey="station" tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E6EDF2', borderRadius: 8, fontSize: 11 }}
          />
          <Bar dataKey="actual" fill="#22C55E" radius={[3, 3, 0, 0]} />
          <Bar dataKey="target" fill="#F59E0B" radius={[3, 3, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </DashboardCard>
);

export default EquipmentMetricsChart;
