import React, { useState, useEffect } from "react";
import instance from "../apis/utils/instance";
import { useMedicineStore } from "../data/medicineStore";
import "../styles/Graph.css";

const formatLocalDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const Graph: React.FC = () => {
  const { logs, setLogs } = useMedicineStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1~12

  // 🔥 /medicine/logs 연동
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await instance.get(`/medicine/logs/?month=${currentMonth}`);
        setLogs(res.data);
      } catch (e) {
        console.error("failed to fetch logs", e);
      }
    }

    fetchLogs();
  }, [currentMonth, setLogs]);

  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0);

  const gridStartDate = new Date(startOfMonth);
  gridStartDate.setDate(gridStartDate.getDate() - startOfMonth.getDay());

  const gridEndDate = new Date(endOfMonth);
  gridEndDate.setDate(gridEndDate.getDate() + (6 - endOfMonth.getDay()));

  const gridDates: Date[] = [];
  let day = new Date(gridStartDate);
  while (day <= gridEndDate) {
    gridDates.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const gridMeds = gridDates.map((date) => {
    const dateString = formatLocalDate(date);
    const log = logs[dateString] || { taken: 0, missed: 0 };

    const total = log.taken + log.missed;
    let status: "none" | "taken" | "partial" | "missed" = "none";

    if (total === 0) status = "none";
    else if (log.taken === total) status = "taken";
    else if (log.taken > 0 && log.taken < total) status = "partial";
    else if (log.taken === 0 && log.missed > 0) status = "missed";

    return {
      dateObj: date,
      dateString,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() + 1 === currentMonth,
      status,
    };
  });

  const monthKeys = Object.keys(logs).filter((d) => {
    const dt = new Date(d);
    return dt.getFullYear() === currentYear && dt.getMonth() + 1 === currentMonth;
  });

  const totalCount = monthKeys.reduce(
    (sum, d) => sum + logs[d].taken + logs[d].missed,
    0
  );
  const takenCount = monthKeys.reduce((sum, d) => sum + logs[d].taken, 0);
  const percentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  return (
    <div className="graph-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-button">
          &lt;
        </button>
        <h2 className="graph-title">
          {currentYear}년 {currentMonth}월
        </h2>
        <button onClick={handleNextMonth} className="nav-button">
          &gt;
        </button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-cell day-header">
            {day}
          </div>
        ))}

        {gridMeds.map((item) => {
          const symbol = getSymbol(item.status);
          return (
            <div
              key={item.dateString}
              className={`calendar-cell ${
                !item.isCurrentMonth ? "other-month" : ""
              }`}
            >
              <span className="calendar-day">{item.day}</span>
              <span className={`calendar-symbol ${item.status}`}>{symbol}</span>
            </div>
          );
        })}
      </div>

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
            총 {totalCount}회 중 {takenCount}회 완료
          </p>
          <p className="sub">이번 달 복약 습관 점검!</p>
        </div>
      </div>
    </div>
  );
};

export default Graph;
