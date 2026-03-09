import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts';

const chartColors = {
  vibration: { stroke: '#ef4444', fill: '#ef444420' },
  temperature: { stroke: '#f59e0b', fill: '#f59e0b20' },
  humidity: { stroke: '#3b82f6', fill: '#3b82f620' },
  sound: { stroke: '#8b5cf6', fill: '#8b5cf620' },
  magnetic: { stroke: '#06b6d4', fill: '#06b6d420' },
};

const sensorLabels = {
  vibration: 'Vibrasyon',
  temperature: 'Sıcaklık',
  humidity: 'Nem',
  sound: 'Ses',
  magnetic: 'Manyetik Alan',
};

const DetailChart = ({ type, data = [], threshold = null }) => {
  const colors = chartColors[type] || chartColors.vibration;

  return (
    <div className="detail-chart">
      <div className="detail-chart-header">
        <h4>{sensorLabels[type] || type} - Zaman Grafiği</h4>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            interval="preserveStartEnd"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '12px',
              padding: '8px 12px',
            }}
          />
          {threshold && (
            <ReferenceLine
              y={threshold}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              label={{
                value: 'Eşik',
                fill: '#ef4444',
                fontSize: 10,
                position: 'right',
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            fill={`url(#gradient-${type})`}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailChart;
