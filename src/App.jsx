import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard3D from './pages/Dashboard3D';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard3D />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
