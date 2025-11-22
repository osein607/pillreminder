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
        
        {/* ✅ 1. 스크롤이 필요한 콘텐츠 영역을 main 태그로 감쌉니다. */}
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add/:date" element={<AddMedicinePage />} />
            <Route path="/edit/:id" element={<AddMedicinePage />} />
          </Routes>
        </main>

        {/* ✅ 2. BottomNav는 main 태그 바깥에 둡니다. */}
        <BottomNav />
        
      </div>
    </div>
  );
};

export default App;