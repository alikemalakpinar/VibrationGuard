import React from 'react';
import { Home, Grid, Wrench, Menu, Maximize, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <nav className="glass-panel sidebar-container">
      <div className="logo-container">
        {/* Placeholder for the N-shaped logo */}
        <div className="logo-icon">И</div>
      </div>
      
      <div className="nav-icons top-icons">
        <button className="nav-btn active">
          <Home size={20} />
        </button>
        <button className="nav-btn">
          <Grid size={20} />
        </button>
        <button className="nav-btn">
          <Wrench size={20} />
        </button>
        <button className="nav-btn">
          <Menu size={20} />
        </button>
        <button className="nav-btn">
          <Maximize size={20} />
        </button>
      </div>

      <div className="nav-icons bottom-icons">
        <button className="nav-btn">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
}
