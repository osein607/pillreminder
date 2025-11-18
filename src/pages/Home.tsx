import React, { useState, useEffect } from "react";
import MedicineCard from "../components/MedicineCard";
import Header from "../components/Header";
import DateTabs from "../components/DateTabs";
import { fetchMedicines } from "../apis/medicineApi";
import { useMedicineStore } from "../data/medicineStore";
import type { Medicine } from "../data/medicine";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const medicines = useMedicineStore((state) => state.medicines);
  const toggleTaken = useMedicineStore((state) => state.toggleTaken);
  const setMedicines = useMedicineStore((state) => state.setMedicines);

  // 날짜 설정
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
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

  // ⭐ API 호출 → store 저장
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMedicines();

        const grouped = data.reduce((acc: any, med: any) => {
          const date = med.start_date;
          if (!acc[date]) acc[date] = [];
          acc[date].push({
            id: med.id,
            name: med.name,
            quantity: med.quantity,
            remaining: med.quantity,
            taken: med.is_taken_today,
            date,
            time: med.time,
            alarm_time: med.alarm_time,
            type: med.type,
          });
          return acc;
        }, {});

        setMedicines(grouped);
      } catch (e) {
        console.error("약 목록 불러오기 실패:", e);
      }
    }
    load();
  }, [setMedicines]);

  // WebSocket
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
              onClick={() => navigate(`/edit/${med.id}`)}
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
