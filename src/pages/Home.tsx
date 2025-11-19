import React, { useState, useEffect } from "react";
import MedicineCard from "../components/MedicineCard";
import Header from "../components/Header";
import DateTabs from "../components/DateTabs";
import { useDailyDoseStore } from "../data/dailyDoseStore";
import "../styles/Home.css";
import dayjs from "dayjs"; //npm install dayjs
import { useNavigate } from "react-router-dom";
import { mapTypeCodeToLabel, type MedicineTypeCode } from "../data/medicine";
import { mapTimeCodeToLabel } from "../data/medicine";


const Home: React.FC = () => {
  const navigate = useNavigate();

  const doses = useDailyDoseStore((state) => state.doses);
  const setDate = useDailyDoseStore((state) => state.setDate);
  const markTaken = useDailyDoseStore((state) => state.markTaken);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  useEffect(() => {
    setDate(formattedDate);
  }, [formattedDate]); // setDate 제거

  const getWeekday = (date: Date) => {
    const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return weekdays[date.getDay()];
  };

  const handleToggleTaken = (doseId: number) => {
    markTaken(doseId);
  };

  return (
    <div className="home-container">
      <Header />

      {/* 날짜 선택 */}
      <DateTabs onDateChange={setSelectedDate} />

      <h2 className="home-subtitle">{getWeekday(selectedDate)}</h2>

      <div className="medicine-list">
        {doses.length === 0 ? (
          <div className="empty-box">
            <span className="emoji">💊</span>
            <p>등록된 약이 없습니다</p>
            <p className="guide">오른쪽 상단 ➕ 버튼을 눌러 복약 정보를 추가하세요</p>
          </div>
        ) : (
          doses.map((d) => (
            <div key={d.id} onClick={() => navigate(`/edit/${d.medicine.id}`)}>
              <MedicineCard
                medicine={{
                  id: d.medicine.id,
                  name: d.medicine.name,
                  quantity: d.quantity,
                  time: mapTimeCodeToLabel(d.medicine.time as "BEFORE_MEAL" | "AFTER_MEAL"),
                  type: mapTypeCodeToLabel(d.medicine.type as MedicineTypeCode),
                  taken: d.is_taken,
                }}
                onToggleTaken={() => handleToggleTaken(d.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
