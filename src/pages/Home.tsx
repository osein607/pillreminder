import React, { useState, useEffect } from "react";
import MedicineCard from "../components/MedicineCard";
import Header from "../components/Header";
import DateTabs from "../components/DateTabs";
import { useMedicineStore } from "../data/medicineStore";
import type { Medicine } from "../data/medicine";
import "../styles/Home.css";

const Home: React.FC = () => {
  const { medicines, toggleTaken } = useMedicineStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
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
            <p className="guide">오른쪽 상단 ➕ 버튼을 눌러 복약 정보를 추가하세요</p>
          </div>
        ) : (
          todayMeds.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onToggleTaken={handleToggleTaken}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
