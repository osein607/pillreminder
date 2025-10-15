import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <div>
        <h1>동국님, 오늘의 약이에요!</h1>
        <p>Reminder</p>
      </div>
      <button className="bell-btn">🔔</button>
    </header>
  );
};

export default Header;
