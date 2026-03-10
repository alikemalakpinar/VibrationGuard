import React, { useState, useEffect } from 'react';
import { Activity, Waves, Volume2, Thermometer, Droplets, Magnet } from 'lucide-react';
import './Widgets.css';

export default function MachineIndicatorsWidget() {
  // Simulate live data ticking
  const [data, setData] = useState({
    vib: 2.4,
    snd: 82,
    tmp: 45.2,
    hum: 38.5,
    mag: 1.2
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => ({
        vib: +(prev.vib + (Math.random() * 0.4 - 0.2)).toFixed(2),
        snd: +(prev.snd + (Math.random() * 4 - 2)).toFixed(1),
        tmp: +(prev.tmp + (Math.random() * 0.5 - 0.25)).toFixed(1),
        hum: +(prev.hum + (Math.random() * 0.2 - 0.1)).toFixed(1),
        mag: +(prev.mag + (Math.random() * 0.04 - 0.02)).toFixed(2),
      }));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel widget machine-indicators">
      <div className="widget-header bottom-padded">
        <h3 className="widget-title"><Activity size={16} /> AICO Live Sensor Telemetry</h3>
        <button className="info-btn">i</button>
      </div>

      <div className="indicator-grid">
        {/* 1. Vibration */}
        <div className="indicator-item">
          <div className="indicator-icon"><Waves size={20} /></div>
          <div className="indicator-info">
            <span className="label">Vibration</span>
            <span className="val tabular-data glow-text">{data.vib} <span className="u">mm/s</span></span>
          </div>
        </div>
        
        {/* 2. Sound */}
        <div className="indicator-item">
          <div className="indicator-icon"><Volume2 size={20} /></div>
          <div className="indicator-info">
            <span className="label">Sound Spectrum</span>
            <span className="val tabular-data glow-text">{data.snd} <span className="u">dB</span></span>
          </div>
        </div>

        {/* 3. Temperature */}
        <div className="indicator-item">
          <div className="indicator-icon"><Thermometer size={20} /></div>
          <div className="indicator-info">
            <span className="label">Temperature</span>
            <span className="val tabular-data glow-text">{data.tmp} <span className="u">°C</span></span>
          </div>
        </div>

        {/* 4. Humidity */}
        <div className="indicator-item">
          <div className="indicator-icon"><Droplets size={20} /></div>
          <div className="indicator-info">
            <span className="label">Humidity</span>
            <span className="val tabular-data glow-text">{data.hum} <span className="u">%RH</span></span>
          </div>
        </div>

        {/* 5. Magnetic Field */}
        <div className="indicator-item">
          <div className="indicator-icon"><Magnet size={20} /></div>
          <div className="indicator-info">
            <span className="label">Magnetic Field</span>
            <span className="val tabular-data glow-text">{data.mag} <span className="u">mT</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
