// Isometric machine SVG definitions for factory floor visualization
// Each machine type has an SVG render function, dimensions, and color scheme

export const MACHINE_TYPES = {
  cnc: {
    label: 'CNC Makina',
    width: 90,
    height: 80,
    color: '#3B82F6',
    colorLight: '#DBEAFE',
    colorDark: '#1E40AF',
    render: (color, colorLight, colorDark) => `
      <!-- Base -->
      <polygon points="0,40 45,20 90,40 45,60" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Left wall -->
      <polygon points="0,40 0,10 45,-10 45,20" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Right wall -->
      <polygon points="45,20 45,-10 90,10 90,40" fill="${colorDark}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Top surface -->
      <polygon points="0,10 45,-10 90,10 45,30" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Screen -->
      <polygon points="10,8 30,-2 50,8 30,18" fill="#1E293B" stroke="#475569" stroke-width="0.8"/>
      <polygon points="14,8 30,0 46,8 30,16" fill="#0F172A"/>
      <!-- Control panel dots -->
      <circle cx="65" cy="12" r="2.5" fill="#22C55E" opacity="0.9"/>
      <circle cx="72" cy="12" r="2.5" fill="#F59E0B" opacity="0.7"/>
      <!-- Spindle -->
      <line x1="45" y1="-10" x2="45" y2="-22" stroke="${colorDark}" stroke-width="3"/>
      <circle cx="45" cy="-24" r="4" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
    `,
  },

  press: {
    label: 'Hidrolik Pres',
    width: 80,
    height: 90,
    color: '#F59E0B',
    colorLight: '#FEF3C7',
    colorDark: '#B45309',
    render: (color, colorLight, colorDark) => `
      <!-- Base plate -->
      <polygon points="0,50 40,30 80,50 40,70" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Left pillar -->
      <polygon points="5,48 5,8 15,-2 15,38" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Right pillar -->
      <polygon points="65,38 65,-2 75,8 75,48" fill="${colorDark}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Top beam -->
      <polygon points="5,8 40,-12 75,8 40,28" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Ram -->
      <rect x="30" y="-5" width="20" height="25" rx="2" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Hydraulic cylinder -->
      <rect x="35" y="-15" width="10" height="12" rx="1" fill="#64748B" stroke="#475569" stroke-width="0.8"/>
      <!-- Pressure gauge -->
      <circle cx="40" cy="-18" r="5" fill="#1E293B" stroke="#475569" stroke-width="0.8"/>
      <circle cx="40" cy="-18" r="3" fill="#0F172A"/>
      <line x1="40" y1="-20" x2="42" y2="-17" stroke="#EF4444" stroke-width="0.8"/>
    `,
  },

  'robot-arm': {
    label: 'Robot Kol',
    width: 80,
    height: 85,
    color: '#8B5CF6',
    colorLight: '#EDE9FE',
    colorDark: '#6D28D9',
    render: (color, colorLight, colorDark) => `
      <!-- Circular base -->
      <ellipse cx="40" cy="55" rx="25" ry="12" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Base cylinder -->
      <rect x="30" y="35" width="20" height="20" rx="3" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Shoulder joint -->
      <circle cx="40" cy="32" r="7" fill="${colorDark}" stroke="${color}" stroke-width="1.2"/>
      <!-- Upper arm -->
      <rect x="37" y="5" width="6" height="30" rx="2" fill="${color}" stroke="${colorDark}" stroke-width="1" transform="rotate(-15, 40, 32)"/>
      <!-- Elbow joint -->
      <circle cx="36" cy="5" r="5" fill="${colorLight}" stroke="${color}" stroke-width="1.2"/>
      <!-- Forearm -->
      <rect x="34" y="-15" width="5" height="22" rx="2" fill="${colorDark}" stroke="${color}" stroke-width="0.8" transform="rotate(25, 36, 5)"/>
      <!-- End effector -->
      <polygon points="48,-18 55,-14 55,-8 48,-12" fill="#64748B" stroke="#475569" stroke-width="0.8"/>
      <polygon points="55,-14 62,-10 62,-4 55,-8" fill="#94A3B8" stroke="#475569" stroke-width="0.8"/>
      <!-- Status LED -->
      <circle cx="40" cy="42" r="2" fill="#22C55E"/>
    `,
  },

  conveyor: {
    label: 'Konveyor Bant',
    width: 110,
    height: 50,
    color: '#10B981',
    colorLight: '#D1FAE5',
    colorDark: '#059669',
    render: (color, colorLight, colorDark) => `
      <!-- Belt frame -->
      <polygon points="0,30 55,10 110,30 55,50" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Left roller -->
      <ellipse cx="15" cy="32" rx="8" ry="5" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Right roller -->
      <ellipse cx="95" cy="32" rx="8" ry="5" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Belt top -->
      <polygon points="15,27 55,12 95,27 55,42" fill="${colorDark}" stroke="${color}" stroke-width="0.8" opacity="0.3"/>
      <!-- Belt lines (movement indicator) -->
      <line x1="30" y1="22" x2="45" y2="17" stroke="${color}" stroke-width="0.5" stroke-dasharray="3,3"/>
      <line x1="50" y1="20" x2="65" y2="15" stroke="${color}" stroke-width="0.5" stroke-dasharray="3,3"/>
      <line x1="70" y1="25" x2="85" y2="20" stroke="${color}" stroke-width="0.5" stroke-dasharray="3,3"/>
      <!-- Support legs -->
      <line x1="20" y1="35" x2="20" y2="50" stroke="${colorDark}" stroke-width="2"/>
      <line x1="90" y1="35" x2="90" y2="50" stroke="${colorDark}" stroke-width="2"/>
      <!-- Box on belt -->
      <polygon points="45,16 60,11 72,16 57,21" fill="#F59E0B" stroke="#D97706" stroke-width="0.8" opacity="0.8"/>
      <polygon points="45,16 45,10 60,5 60,11" fill="#FBBF24" stroke="#D97706" stroke-width="0.8" opacity="0.8"/>
    `,
  },

  compressor: {
    label: 'Kompresor',
    width: 75,
    height: 70,
    color: '#EF4444',
    colorLight: '#FEE2E2',
    colorDark: '#B91C1C',
    render: (color, colorLight, colorDark) => `
      <!-- Base -->
      <polygon points="0,45 37,25 75,45 37,65" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Tank body -->
      <ellipse cx="37" cy="20" rx="22" ry="10" fill="${colorDark}" stroke="${color}" stroke-width="1"/>
      <rect x="15" y="20" width="45" height="25" rx="0" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <ellipse cx="37" cy="45" rx="22" ry="10" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Top cap -->
      <ellipse cx="37" cy="20" rx="18" ry="7" fill="${colorLight}" stroke="${color}" stroke-width="1"/>
      <!-- Pressure gauge -->
      <circle cx="37" cy="10" r="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
      <circle cx="37" cy="10" r="4" fill="#0F172A"/>
      <line x1="37" y1="12" x2="40" y2="8" stroke="#EF4444" stroke-width="1"/>
      <!-- Outlet valve -->
      <rect x="57" y="28" width="12" height="5" rx="1" fill="#64748B" stroke="#475569" stroke-width="0.8"/>
      <!-- Pipes -->
      <line x1="69" y1="30" x2="75" y2="30" stroke="#94A3B8" stroke-width="2"/>
    `,
  },

  welder: {
    label: 'Kaynak Robotu',
    width: 80,
    height: 80,
    color: '#F97316',
    colorLight: '#FFEDD5',
    colorDark: '#C2410C',
    render: (color, colorLight, colorDark) => `
      <!-- Base plate -->
      <polygon points="0,50 40,30 80,50 40,70" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Main body -->
      <polygon points="15,48 15,20 40,8 40,36" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <polygon points="40,36 40,8 65,20 65,48" fill="${colorDark}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Arm -->
      <rect x="55" y="5" width="5" height="20" rx="1" fill="${color}" stroke="${colorDark}" stroke-width="0.8" transform="rotate(-30, 57, 15)"/>
      <!-- Torch tip (welding point) -->
      <circle cx="68" cy="-2" r="3" fill="#FBBF24" opacity="0.9"/>
      <circle cx="68" cy="-2" r="6" fill="#FCD34D" opacity="0.3"/>
      <!-- Sparks -->
      <line x1="68" y1="-2" x2="72" y2="-8" stroke="#FBBF24" stroke-width="0.5" opacity="0.7"/>
      <line x1="68" y1="-2" x2="74" y2="2" stroke="#FBBF24" stroke-width="0.5" opacity="0.7"/>
      <line x1="68" y1="-2" x2="63" y2="-7" stroke="#FBBF24" stroke-width="0.5" opacity="0.7"/>
      <!-- Wire spool -->
      <circle cx="25" cy="15" r="6" fill="${colorLight}" stroke="${color}" stroke-width="0.8"/>
      <circle cx="25" cy="15" r="3" fill="${colorDark}"/>
    `,
  },

  packaging: {
    label: 'Paketleme',
    width: 90,
    height: 60,
    color: '#06B6D4',
    colorLight: '#CFFAFE',
    colorDark: '#0E7490',
    render: (color, colorLight, colorDark) => `
      <!-- Base -->
      <polygon points="0,40 45,20 90,40 45,60" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Machine body -->
      <polygon points="5,38 5,15 45,0 45,22" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <polygon points="45,22 45,0 85,15 85,38" fill="${colorDark}" stroke="${colorDark}" stroke-width="1"/>
      <!-- Top -->
      <polygon points="5,15 45,0 85,15 45,30" fill="${colorLight}" stroke="${color}" stroke-width="1"/>
      <!-- Input slot -->
      <rect x="10" y="18" width="15" height="10" rx="1" fill="#1E293B" stroke="#475569" stroke-width="0.8"/>
      <!-- Output slot -->
      <rect x="65" y="18" width="15" height="10" rx="1" fill="#1E293B" stroke="#475569" stroke-width="0.8"/>
      <!-- Conveyor rollers -->
      <ellipse cx="18" cy="40" rx="5" ry="3" fill="${color}" stroke="${colorDark}" stroke-width="0.5"/>
      <ellipse cx="72" cy="40" rx="5" ry="3" fill="${color}" stroke="${colorDark}" stroke-width="0.5"/>
      <!-- Package -->
      <polygon points="55,14 65,9 75,14 65,19" fill="#F59E0B" stroke="#D97706" stroke-width="0.8"/>
    `,
  },

  pump: {
    label: 'Pompa',
    width: 70,
    height: 65,
    color: '#6366F1',
    colorLight: '#E0E7FF',
    colorDark: '#4338CA',
    render: (color, colorLight, colorDark) => `
      <!-- Base -->
      <polygon points="0,45 35,25 70,45 35,65" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Pump body (cylinder) -->
      <ellipse cx="35" cy="20" rx="20" ry="8" fill="${colorDark}" stroke="${color}" stroke-width="1"/>
      <rect x="15" y="20" width="40" height="25" fill="${color}" stroke="${colorDark}" stroke-width="1"/>
      <ellipse cx="35" cy="45" rx="20" ry="8" fill="${colorLight}" stroke="${color}" stroke-width="1.5"/>
      <!-- Motor -->
      <rect x="5" y="18" width="12" height="18" rx="2" fill="#64748B" stroke="#475569" stroke-width="1"/>
      <!-- Inlet pipe -->
      <rect x="-5" y="24" width="12" height="4" rx="1" fill="#94A3B8" stroke="#64748B" stroke-width="0.8"/>
      <!-- Outlet pipe -->
      <rect x="53" y="24" width="12" height="4" rx="1" fill="#94A3B8" stroke="#64748B" stroke-width="0.8"/>
      <!-- Pressure indicator -->
      <circle cx="35" cy="30" r="5" fill="#1E293B" stroke="#475569" stroke-width="0.8"/>
      <circle cx="35" cy="30" r="3" fill="#0F172A"/>
      <line x1="35" y1="32" x2="37" y2="28" stroke="#22C55E" stroke-width="0.8"/>
    `,
  },
};

export const getMachineType = (type) => MACHINE_TYPES[type] || MACHINE_TYPES.cnc;
