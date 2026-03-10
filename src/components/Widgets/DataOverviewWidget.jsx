import React from 'react';
import { Clock, Zap, Users, Activity } from 'lucide-react';
import './Widgets.css';

export default function DataOverviewWidget() {
  return (
    <div className="glass-panel widget data-overview">
      <div className="widget-header">
        <h3 className="widget-title"><Activity size={16} /> Data Overview</h3>
        <button className="info-btn">i</button>
      </div>
      
      <div className="widget-content">
        <div className="data-row">
          <div className="data-icon"><Clock size={18} /></div>
          <div className="data-info">
            <div className="data-label">Accumulated working hours</div>
            <div className="data-value">201 <span className="unit">h</span></div>
          </div>
        </div>

        <div className="data-row">
          <div className="data-icon"><Zap size={18} /></div>
          <div className="data-info">
            <div className="data-label">Accumulated Steam quantity</div>
            <div className="data-value">500.21 <span className="unit">T</span></div>
          </div>
        </div>

        <div className="data-row">
          <div className="data-icon"><Users size={18} /></div>
          <div className="data-info">
            <div className="data-label">Number of Staff</div>
            <div className="data-value">24/30 <span className="unit">Staff</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
