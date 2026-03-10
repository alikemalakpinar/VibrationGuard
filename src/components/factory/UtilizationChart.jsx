import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart } from 'lucide-react';
import DashboardCard from './DashboardCard';

const UtilizationChart = ({ data = [] }) => (
  <DashboardCard title="Equipment Utilization by Station" icon={<PieChart size={11} />} iconBg="#8B5CF6">
    <div className="dt-chart-legend">
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#22C55E' }} /> Active
      </span>
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#F59E0B' }} /> Idle
      </span>
      <span className="dt-chart-legend-item">
        <span className="dt-chart-legend-dot" style={{ background: '#93C5FD' }} /> Downtime
      </span>
    </div>
    <div className="dt-chart-body">
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F7" vertical={false} />
          <XAxis dataKey="station" tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E6EDF2', borderRadius: 8, fontSize: 11 }}
          />
          <Bar dataKey="active" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
          <Bar dataKey="idle" stackId="a" fill="#F59E0B" opacity={0.6} />
          <Bar dataKey="downtime" stackId="a" fill="#93C5FD" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </DashboardCard>
);

export default UtilizationChart;
