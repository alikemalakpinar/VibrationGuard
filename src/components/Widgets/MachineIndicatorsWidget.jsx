import React from 'react';
import { Settings, Maximize, Activity, Navigation, RotateCw, RefreshCw } from 'lucide-react';
import './Widgets.css';

export default function MachineIndicatorsWidget() {
  return (
    <div className="glass-panel widget machine-indicators">
      <div className="widget-header bottom-padded">
        <h3 className="widget-title"><Activity size={16} /> Machine Indicators</h3>
        <button className="info-btn">i</button>
      </div>

      <div className="indicator-grid">
        <div className="indicator-item">
          <div className="indicator-icon"><Maximize size={20} /></div>
          <div className="indicator-info">
            <span className="label">Size</span>
            <span className="val">12.430 <span className="u">mm</span></span>
          </div>
        </div>
        
        <div className="indicator-item">
          <div className="indicator-icon"><Activity size={20} /></div>
          <div className="indicator-info">
            <span className="label">Frequency</span>
            <span className="val">320 <span className="u">Hz</span></span>
          </div>
        </div>

        <div className="indicator-item">
          <div className="indicator-icon"><RefreshCw size={20} /></div>
          <div className="indicator-info">
            <span className="label">Rotation Angle</span>
            <span className="val">99 <span className="u">[°]</span></span>
          </div>
        </div>

        <div className="indicator-item">
          <div className="indicator-icon"><Navigation size={20} /></div>
          <div className="indicator-info">
            <span className="label">Move Direction</span>
            <span className="val" style={{fontSize: '13px'}}>Positive Front</span>
          </div>
        </div>

        <div className="indicator-item">
          <div className="indicator-icon"><RotateCw size={20} /></div>
          <div className="indicator-info">
            <span className="label">Num. Cycle</span>
            <span className="val">10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
