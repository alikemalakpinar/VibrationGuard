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
        <div className="map-view-container">
          
          {/* Isometric SVG Map Projection */}
          <svg className="isometric-svg-map" viewBox="0 0 200 150">
            {/* Grid Definition */}
            <defs>
              <pattern id="iso-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            
            <g transform="translate(100, 30) scale(1, 0.5) rotate(45)">
              {/* Floor Base */}
              <rect x="-60" y="-60" width="120" height="120" fill="url(#iso-grid)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Floor Blocks / Machines */}
              <g className="map-block">
                <rect x="-40" y="-40" width="30" height="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x="-25" y="-28" fontSize="6" fill="#fff" textAnchor="middle" transform="rotate(-90 -25 -28)">Line 4</text>
              </g>

              <g className="map-block active">
                <rect x="10" y="10" width="40" height="25" fill="rgba(45, 226, 91, 0.2)" stroke="var(--accent-green)" strokeWidth="1.5"/>
                <text x="30" y="24" fontSize="6" fill="#fff" textAnchor="middle" transform="rotate(-90 30 24)">Line 3</text>
                
                {/* Highlight Label translated back out of isometric perspective for readability */}
              </g>

              <g className="map-block warning">
                <rect x="-30" y="30" width="20" height="20" fill="rgba(242, 156, 56, 0.2)" stroke="var(--accent-orange)" strokeWidth="1"/>
              </g>
            </g>
            
            {/* Floating Labels over SVG */}
            <g transform="translate(115, 80)">
              <rect x="0" y="0" width="24" height="12" rx="2" fill="var(--bg-color)" stroke="var(--accent-green)" />
              <text x="12" y="8" fontSize="6" fill="var(--accent-green)" textAnchor="middle" fontWeight="bold">MI 7</text>
            </g>
          </svg>

        </div>

        <div className="map-controls">
          <button className="zoom-btn"><Plus size={14} /></button>
          <button className="zoom-btn"><Minus size={14} /></button>
        </div>
      </div>
    </div>
  );
}
