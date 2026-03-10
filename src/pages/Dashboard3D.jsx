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
    <div className="dashboard-layout">
      {/* 3D Scene Background Layer */}
      <div className="scene-layer">
        <DashboardScene />
      </div>

      {/* UI Overlay Layer */}
      <div className="ui-layer">
        <aside className="sidebar-area">
          <Sidebar />
        </aside>

        <main className="main-area">
          <header className="topbar-area">
            <TopBar />
          </header>

          <div className="widgets-area">
            {/* Left side empty for 3D visibility */}
            
            {/* Bottom Panel */}
            <div className="bottom-panel-container">
              <MachineIndicatorsWidget />
            </div>

            {/* Right Side Panels */}
            <div className="right-panel-container">
              <DataOverviewWidget />
              <MapWidget />
              <ChartWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
