export const getStatusColor = (status) => {
  switch (status) {
    case 'critical':
      return '#ef4444';
    case 'warning':
      return '#f59e0b';
    case 'normal':
      return '#22c55e';
    default:
      return '#94a3b8';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'critical':
      return 'Kritik';
    case 'warning':
      return 'Uyarı';
    case 'normal':
      return 'Normal';
    default:
      return 'Bilinmiyor';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'critical':
      return '✕';
    case 'warning':
      return '⚠';
    case 'normal':
      return '✓';
    default:
      return '?';
  }
};

export const formatValue = (value, decimals = 1) => {
  if (value === null || value === undefined) return '--';
  return Number(value).toFixed(decimals);
};

export const calculateRiskLevel = (sensors) => {
  if (!sensors) return 0;
  let risk = 0;
  let count = 0;

  Object.values(sensors).forEach((s) => {
    if (s?.status === 'critical') risk += 100;
    else if (s?.status === 'warning') risk += 60;
    else if (s?.status === 'normal') risk += 10;
    count++;
  });

  return count > 0 ? Math.round(risk / count) : 0;
};
