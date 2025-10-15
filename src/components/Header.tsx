import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/add');
  };

  return (
    <header className="header-container">
      <div>
        <h1>동국님, 오늘의 약이에요!</h1>
        <p>Reminder</p>
      </div>
      <button className="add-btn" onClick={handleAddClick}>
        ➕
      </button>
    </header>
  );
};

export default Header;
