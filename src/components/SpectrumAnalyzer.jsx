import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';

const SpectrumAnalyzer = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <div className="spectrum-analyzer">
      <div className="spectrum-header">
        <h4>Ses Spektrum Analizi</h4>
        <span className="spectrum-subtitle">Frekans (Hz)</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barGap={1}>
          <XAxis
            dataKey="freq"
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            interval={3}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '11px',
            }}
            formatter={(v) => [`${v} dB`, 'Seviye']}
            labelFormatter={(l) => `${l} Hz`}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.value > 80
                    ? '#ef4444'
                    : entry.value > 60
                    ? '#f59e0b'
                    : '#8b5cf6'
                }
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumAnalyzer;
