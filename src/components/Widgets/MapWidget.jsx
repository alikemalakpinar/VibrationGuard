import React from 'react';
import { Map as MapIcon, Plus, Minus } from 'lucide-react';
import './Widgets.css';

export default function MapWidget() {
  return (
    <div className="glass-panel widget map-widget">
      <div className="widget-header">
        <h3 className="widget-title"><MapIcon size={16} /> AICO Factory Topology</h3>
        <button className="info-btn">i</button>
      </div>
      
      <div className="map-content">
        <div className="map-view-container">
          
          {/* Isometric SVG Map Projection */}
          <svg className="isometric-svg-map" viewBox="0 0 200 150">
            <defs>
              <pattern id="iso-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            
            <g transform="translate(100, 30) scale(1, 0.5) rotate(45)">
              <rect x="-60" y="-60" width="120" height="120" fill="url(#iso-grid)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              <g className="map-block">
                <rect x="-40" y="-40" width="30" height="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x="-25" y="-28" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 -25 -28)">CNC-X1</text>
              </g>

              {/* Critical Machine Highlight */}
              <g className="map-block critical">
                <rect x="-10" y="-10" width="20" height="20" fill="rgba(239, 68, 68, 0.2)" stroke="var(--accent-critical)" strokeWidth="1"/>
                <text x="0" y="0" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 0 0)">RA-02</text>
              </g>

              <g className="map-block active">
                <rect x="10" y="40" width="40" height="10" fill="rgba(45, 226, 91, 0.2)" stroke="var(--accent-green)" strokeWidth="1.5"/>
                <text x="30" y="45" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 30 45)">CV-Main</text>
              </g>

              <g className="map-block warning">
                <rect x="-30" y="40" width="20" height="20" fill="rgba(242, 156, 56, 0.2)" stroke="var(--accent-orange)" strokeWidth="1"/>
                <text x="-20" y="50" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 -20 50)">CNC-Z1</text>
              </g>
            </g>
            
            {/* Absolute Floating SVG Popups corresponding to 3D scene mock data */}
            <g transform="translate(80, 75)">
              <rect x="0" y="0" width="20" height="10" rx="2" fill="var(--bg-color)" stroke="var(--accent-critical)" />
              <text x="10" y="7" fontSize="5" fill="var(--accent-critical)" textAnchor="middle" fontWeight="bold">RA-02</text>
            </g>

            <g transform="translate(130, 95)">
              <rect x="0" y="0" width="24" height="10" rx="2" fill="var(--bg-color)" stroke="var(--accent-green)" />
              <text x="12" y="7" fontSize="5" fill="var(--accent-green)" textAnchor="middle" fontWeight="bold">CV-Main</text>
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
