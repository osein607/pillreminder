import React from "react";
import { useMedicineStore } from "../data/medicineStore";
import "../styles/Graph.css";

// 날짜 포맷 함수
const formatLocalDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const Graph: React.FC = () => {
  const { medicines } = useMedicineStore();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 📅 이번 달 1일부터 말일까지 표시
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // 이번 달 날짜 리스트
  const monthDates: string[] = [];
  let currentDate = startOfMonth;
  while (currentDate <= endOfMonth) {
    monthDates.push(formatLocalDate(currentDate));
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    currentDate = nextDay;
  }

  // 날짜별 복약 요약
  const monthMeds = monthDates.map((d) => {
    const meds = medicines[d] || [];
    const total = meds.length;
    const taken = meds.filter((m) => m.taken).length;

    // 부분 복용 판별
    const partial = total > 0 && taken > 0 && taken < total;
    const allTaken = total > 0 && taken === total;
    const noneTaken = total > 0 && taken === 0;

    let status: "none" | "taken" | "partial" | "missed" = "none";
    if (allTaken) status = "taken";
    else if (partial) status = "partial";
    else if (noneTaken) status = "missed";

    return { date: d, total, taken, status };
  });

  // 전체 통계
  const allMeds = monthMeds.flatMap((m) => medicines[m.date] || []);
  const total = allMeds.length;
  const taken = allMeds.filter((m) => m.taken).length;
  const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

  // 표시 기호
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

  return (
    <div className="graph-container">
      <h2 className="graph-title">📅 이번 달 복약 현황</h2>

      {/* 🗓️ 달력 */}
      <div className="calendar-grid">
        {monthMeds.map((item) => {
          const dateObj = new Date(item.date);
          const day = dateObj.getDate();
          const symbol = getSymbol(item.status);
          return (
            <div key={item.date} className="calendar-cell">
              <span className="calendar-day">{day}</span>
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

      {/* 📈 도넛 그래프 */}
      <div className="graph-card">
        <div className="donut">
          <svg viewBox="0 0 36 36" className="circular-chart" width="160" height="160">
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
