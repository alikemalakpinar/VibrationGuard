import React from 'react';
import { Home, LayoutGrid, Wrench, Menu, Maximize, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <nav className="glass-panel sidebar-container">
      <div className="logo-container">
        {/* Custom SVG N-Logo */}
        <svg className="logo-icon glow-active" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M4 22V2L14 18V2H20V22L10 6V22H4Z" fill="var(--accent-green)"/>
        </svg>
      </div>
      
      <div className="nav-icons top-icons">
        <button className="nav-btn active">
          <Home size={22} strokeWidth={1.5} />
        </button>
        <button className="nav-btn">
          <LayoutGrid size={22} strokeWidth={1.5} />
        </button>
        <button className="nav-btn">
          <Wrench size={22} strokeWidth={1.5} />
        </button>
        <button className="nav-btn">
          <Menu size={22} strokeWidth={1.5} />
        </button>
        <button className="nav-btn">
          <Maximize size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="nav-icons bottom-icons">
        <button className="nav-btn">
          <Settings size={22} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  );
}
