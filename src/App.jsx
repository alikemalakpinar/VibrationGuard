import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard3D from './pages/Dashboard3D';
import MachineDetailPage from './pages/MachineDetailPage';

export const FactoryDataContext = createContext();

const initialFactoryData = [
  { type: 'robot', x: -8.5, z: -8.5, id: 'RA-01', health: 98, status: 'active' },
  { type: 'cnc', x: 0, z: -8.5, id: 'CNC-X1', health: 45, status: 'warning' },
  { type: 'conveyor', x: 8.5, z: -8.5, id: 'CV-Line-A', health: 95, status: 'active' },
  { type: 'conveyor', x: -8.5, z: 0, id: 'CV-Line-B', health: 92, status: 'active' },
  { type: 'robot', x: 0, z: 0, id: 'RA-02', health: 12, status: 'critical' },
  { type: 'cnc', x: 8.5, z: 0, id: 'CNC-X2', health: 88, status: 'active' },
  { type: 'cnc', x: -8.5, z: 8.5, id: 'CNC-Z1', health: 76, status: 'active' },
  { type: 'conveyor', x: 0, z: 8.5, id: 'CV-Main', health: 99, status: 'active' },
  { type: 'robot', x: 8.5, z: 8.5, id: 'RA-03', health: 34, status: 'warning' },
];

function App() {
  const [factoryData, setFactoryData] = useState(
    initialFactoryData.map(item => ({
      ...item,
      timeScale: 0.6 + Math.random() * 0.6,
      rotationOffset: Math.random() * Math.PI * 2
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setFactoryData(prev => prev.map(mac => {
        if (mac.status === 'critical') return mac;
        const shift = Math.floor(Math.random() * 5) - 2;
        const newHealth = Math.min(100, Math.max(0, mac.health + shift));
        let newStatus = mac.status;
        if (newHealth < 20) newStatus = 'critical';
        else if (newHealth < 50) newStatus = 'warning';
        else newStatus = 'active';
        return { ...mac, health: newHealth, status: newStatus };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <FactoryDataContext.Provider value={{ factoryData, setFactoryData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard3D />} />
          <Route path="/machine/:machineId" element={<MachineDetailPage />} />
        </Routes>
      </BrowserRouter>
    </FactoryDataContext.Provider>
  );
}

export default App;
