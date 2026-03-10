import React from 'react';
import { Map as MapIcon, Plus, Minus } from 'lucide-react';
import './Widgets.css';

export default function MapWidget() {
  return (
    <div className="glass-panel widget map-widget">
      <div className="widget-header">
        <h3 className="widget-title"><MapIcon size={16} /> Map</h3>
        <button className="info-btn">i</button>
      </div>
      
      <div className="map-content">
        {/* Placeholder for the isometric floor map graphic */}
        <div className="isometric-map-graphic">
          <div className="grid-plane"></div>
          <div className="floor-block">
            <span className="floor-label">Line 4</span>
          </div>
          <div className="floor-block active">
            <span className="floor-label">Line 3</span>
            <div className="block-highlight">MI 7</div>
          </div>
        </div>

        <div className="map-controls">
          <button className="zoom-btn"><Plus size={16} /></button>
          <button className="zoom-btn"><Minus size={16} /></button>
        </div>
      </div>
    </div>
  );
}
