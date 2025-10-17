import React, { useState, useEffect } from "react";
import MedicineCard from "../components/MedicineCard";
import Header from "../components/Header";
import DateTabs from "../components/DateTabs";
import { useMedicineStore } from "../data/medicineStore";
import type { Medicine } from "../data/medicine";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const medicines = useMedicineStore((state) => state.medicines);
  const toggleTaken = useMedicineStore((state) => state.toggleTaken);

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`; // ✅ 현지 날짜 그대로 문자열로 반환
  };

  const formattedDate = formatDate(selectedDate);

  const todayMeds: Medicine[] = medicines[formattedDate] || [];

  const getWeekday = (date: Date) => {
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return weekdays[date.getDay()];
  };

  const handleToggleTaken = (id: number) => {
    toggleTaken(formattedDate, id);
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.medicineId && data.taken) {
        handleToggleTaken(data.medicineId);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div className="home-container">
      <Header />
      <DateTabs onDateChange={setSelectedDate} />
      <h2 className="home-subtitle">{getWeekday(selectedDate)}</h2>

      <div className="medicine-list">
        {todayMeds.length === 0 ? (
          <div className="empty-box">
            <span className="emoji">💊</span>
            <p>등록된 약이 없습니다</p>
            <p className="guide">
              오른쪽 상단 ➕ 버튼을 눌러 복약 정보를 추가하세요
            </p>
          </div>
        ) : (
          todayMeds.map((med) => (
            <div
              key={med.id}
              onClick={() => navigate(`/edit/${med.id}`)} // ✅ 클릭 시 수정 페이지로 이동
            >
              <MedicineCard medicine={med} onToggleTaken={handleToggleTaken} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
