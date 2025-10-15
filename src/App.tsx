import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './styles/AppView.css';

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <div className="app-view">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
