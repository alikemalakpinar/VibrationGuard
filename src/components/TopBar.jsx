import React from 'react';
import { Share2, ChevronDown } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
  const times = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55', '11:00', '11:05'];

  return (
    <header className="glass-panel topbar-container">
      <div className="zone-selector">
        <span className="label">Select Zone</span>
        <div className="zone-dropdown-wrapper">
          <select className="zone-dropdown tabular-data" defaultValue="Zone - T2">
            <option>Zone - T1</option>
            <option>Zone - T2</option>
            <option>Zone - T3</option>
            <option>Zone - Analytics</option>
          </select>
          <ChevronDown size={14} className="dropdown-icon" />
        </div>
      </div>

      <div className="timeline-container">
        {times.map((time, index) => {
          const isHighlighted = index >= 4 && index <= 8;
          // Assign random issues to mimic screenshot
          let statusClass = 'normal';
          if (index === 0 || index === 2 || index === 6 || index === 11) statusClass = 'warning';
          if (index === 5 || index === 9) statusClass = 'critical';

          return (
            <div key={time} className={`timeline-tick ${isHighlighted ? 'active' : ''}`}>
              <div className={`tick-dot ${statusClass}`}></div>
              <span className="tick-time tabular-data">{time}</span>
            </div>
          );
        })}
        {/* Green Highlight Selection Box */}
        <div className="timeline-highlight">
           <div className="highlight-handle left"></div>
           <div className="highlight-handle right"></div>
        </div>
      </div>

      <button className="share-btn">
        <Share2 size={18} strokeWidth={2} />
      </button>
    </header>
  );
}
