import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Graph from './pages/Graph';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import AddMedicinePage from './pages/AddMedicinePage';

import './styles/AppView.css';

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <div className="app-view">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add/:date" element={<AddMedicinePage />} />
          <Route path="/add/:id" element={<AddMedicinePage />} />
        </Routes>
        <BottomNav />
      </div>
    </div>
  );
};

export default App;
