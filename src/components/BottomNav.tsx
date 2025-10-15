import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/BottomNav.css';

const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" end className="nav-item">
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </NavLink>

      <NavLink to="/graph" className="nav-item">
        <span className="icon">📊</span>
        <span className="label">Graph</span>
      </NavLink>

      <NavLink to="/settings" className="nav-item">
        <span className="icon">⚙️</span>
        <span className="label">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
