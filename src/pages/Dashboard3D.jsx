import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import DashboardScene from '../components/DashboardScene';
import DataOverviewWidget from '../components/Widgets/DataOverviewWidget';
import MapWidget from '../components/Widgets/MapWidget';
import ChartWidget from '../components/Widgets/ChartWidget';
import MachineIndicatorsWidget from '../components/Widgets/MachineIndicatorsWidget';
import './Dashboard3D.css';

export default function Dashboard3D() {
  return (
    <div className="dashboard-grid-layout">
      {/* 3D SCENE BACKGROUND */}
      <div className="dashboard-scene-container">
        <DashboardScene />
      </div>

      {/* OVERLAY UI */}
      <div className="dashboard-overlay">
        
        {/* LEFT: Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <Sidebar />
        </aside>

        {/* CENTER/RIGHT COLUMN */}
        <main className="dashboard-main">
          
          {/* TOP: Timeline & Zone */}
          <header className="dashboard-topbar">
            <TopBar />
          </header>

          {/* MIDDLE: 3D Viewport Area & Absolute Widgets */}
          <div className="dashboard-widgets-viewport">
            
            {/* RIGHT: Stacked Widgets */}
            <div className="dashboard-right-panel">
              <DataOverviewWidget />
              <MapWidget />
              <ChartWidget />
            </div>

            {/* BOTTOM: Wide Widget */}
            <div className="dashboard-bottom-panel">
              <MachineIndicatorsWidget />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
