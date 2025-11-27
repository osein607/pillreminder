import React, { useState, useEffect } from "react"; // 💡 useState, useEffect 추가
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  // 💡 사용자 이름을 state로 관리
  const [userName, setUserName] = useState("동국"); // 기본값

  // 💡 컴포넌트가 처음 렌더링될 때 localStorage에서 이름 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user-info");
    if (savedUser) {
      const { name } = JSON.parse(savedUser);
      if (name) {
        setUserName(name); // 저장된 이름으로 state 변경
      }
    }
  }, []); // [] 빈 배열: 처음 한 번만 실행

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const today = formatDate(new Date());

  const handleAddClick = () => {
    navigate(`/add/${today}`);
  };

  return (
    <header className="header-container">
      <div>
        {/* 💡 state 변수를 사용하도록 수정 */}
        <h1>{userName}님, 오늘의 약이에요!</h1>
        <p>Pillmate</p>
      </div>
      <button className="add-btn" onClick={handleAddClick}>
        ➕
      </button>
    </header>
  );
};

export default Header;