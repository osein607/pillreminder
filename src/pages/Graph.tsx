import React, { useState } from "react";
import { useMedicineStore } from "../data/medicineStore";
import "../styles/Graph.css";

// 날짜 포맷 함수 (YYYY-MM-DD)
const formatLocalDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 요일 헤더
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const Graph: React.FC = () => {
  const { medicines } = useMedicineStore();
  // 현재 날짜가 아닌 '표시할 날짜'를 state로 관리
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 = 1월, 11 = 12월

  // 📅 이번 달 1일과 말일
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // GRID 생성 로직
  // 1. 달력의 시작 날짜 (1일이 속한 주의 일요일)
  const gridStartDate = new Date(startOfMonth);
  gridStartDate.setDate(gridStartDate.getDate() - startOfMonth.getDay()); // getDay() (0=일, 1=월...)

  // 2. 달력의 끝 날짜 (말일이 속한 주의 토요일)
  const gridEndDate = new Date(endOfMonth);
  gridEndDate.setDate(gridEndDate.getDate() + (6 - endOfMonth.getDay()));

  // 3. 달력에 표시할 날짜 배열 생성
  const gridDates: Date[] = [];
  let day = new Date(gridStartDate);
  while (day <= gridEndDate) {
    gridDates.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  // 날짜별 복약 요약
  const gridMeds = gridDates.map((date) => {
    const dateString = formatLocalDate(date);
    const meds = medicines[dateString] || [];
    const total = meds.length;
    const taken = meds.filter((m) => m.taken).length;

    const partial = total > 0 && taken > 0 && taken < total;
    const allTaken = total > 0 && taken === total;
    const noneTaken = total > 0 && taken === 0;

    let status: "none" | "taken" | "partial" | "missed" = "none";
    if (allTaken) status = "taken";
    else if (partial) status = "partial";
    else if (noneTaken) status = "missed";

    return {
      dateObj: date,
      dateString,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth,
      status,
    };
  });

  // 📈 전체 통계 (현재 '표시된 월' 기준)
  const currentMonthMeds = gridMeds.filter(
    (m) => m.isCurrentMonth && (medicines[m.dateString] || []).length > 0
  );
  
  const allMedsForStats = currentMonthMeds.flatMap(
    (m) => medicines[m.dateString] || []
  );
  
  const total = allMedsForStats.length;
  const taken = allMedsForStats.filter((m) => m.taken).length;
  const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;


  // 기호
  const getSymbol = (status: string) => {
    switch (status) {
      case "taken":
        return "○";
      case "partial":
        return "△";
      case "missed":
        return "✕";
      default:
        return "";
    }
  };

  // ◀️ 이전 달
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // ▶️ 다음 달
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="graph-container">
      {/* 🗓️ 달력 헤더 (네비게이션 추가) */}
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-button">
          &lt;
        </button>
        <h2 className="graph-title">
          {currentYear}년 {currentMonth + 1}월
        </h2>
        <button onClick={handleNextMonth} className="nav-button">
          &gt;
        </button>
      </div>

      {/* 🗓️ 달력 */}
      <div className="calendar-grid">
        {/* 요일 헤더 렌더링 */}
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-cell day-header">
            {day}
          </div>
        ))}

        {/* 날짜 렌더링 */}
        {gridMeds.map((item) => {
          const symbol = getSymbol(item.status);
          return (
            <div
              key={item.dateString}
              // 다른 달의 날짜는 흐리게 표시
              className={`calendar-cell ${
                !item.isCurrentMonth ? "other-month" : ""
              }`}
            >
              <span className="calendar-day">{item.day}</span>
              <span
                className={`calendar-symbol ${
                  item.status === "taken"
                    ? "taken"
                    : item.status === "partial"
                    ? "partial"
                    : item.status === "missed"
                    ? "missed"
                    : ""
                }`}
              >
                {symbol}
              </span>
            </div>
          );
        })}
      </div>

      {/* 📈 도넛 그래프 (기존과 동일) */}
      <div className="graph-card">
        <h3 className="graph-subtitle">이번 달 복약 달성률</h3>
        <div className="donut">
          <svg
            viewBox="0 0 36 36"
            className="circular-chart"
            width="160"
            height="160"
          >
            <path
              className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.5" className="percentage">
              {percentage}%
            </text>
          </svg>
        </div>

        <div className="graph-info">
          <p className="total-info">
            총 {total}회 중 {taken}회 완료
          </p>
          <p className="sub">이번 달 복약 습관 점검!</p>
        </div>
      </div>
    </div>
  );
};

export default Graph;