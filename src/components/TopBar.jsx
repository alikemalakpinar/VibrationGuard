import React from 'react';
import { Share2 } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
  const times = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55', '11:00', '11:05'];

  return (
    <header className="glass-panel topbar-container">
      <div className="zone-selector">
        <span className="label">Select Zone</span>
        <select className="zone-dropdown" defaultValue="Zone - T2">
          <option>Zone - T1</option>
          <option>Zone - T2</option>
          <option>Zone - T3</option>
        </select>
      </div>

      <div className="timeline-container">
        {times.map((time, index) => {
          // Highlight a section of the timeline (e.g., center parts)
          const isHighlighted = index >= 4 && index <= 8;
          return (
            <div key={time} className={`timeline-tick ${isHighlighted ? 'active' : ''}`}>
              <div className="tick-dot"></div>
              <span className="tick-time">{time}</span>
            </div>
          );
        })}
        {/* Highlight box */}
        <div className="timeline-highlight"></div>
      </div>

      <button className="share-btn">
        <Share2 size={18} />
      </button>
    </header>
  );
}
