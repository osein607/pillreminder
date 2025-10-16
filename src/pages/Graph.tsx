import React from "react";
import { useMedicineStore } from "../data/medicineStore";
import "../styles/Graph.css";

const Graph: React.FC = () => {
  const { medicines } = useMedicineStore();

  // 📅 이번 주 날짜 범위 구하기
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // 일요일 기준
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // ✅ 이번 주 전체 약 데이터 수집
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return formatDate(d);
  });

  const weekMeds = weekDates.flatMap((d) => medicines[d] || []);
  const total = weekMeds.length;
  const taken = weekMeds.filter((m) => m.taken).length;
  const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="graph-container">
      <h2 className="graph-title">📈 이번 주 복약 완료율</h2>

      <div className="graph-card">
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
          <p>
            총 {total}회 중 {taken}회 완료
          </p>
          <p className="sub">이번 주 복약 습관 점검!</p>
        </div>
      </div>
    </div>
  );
};

export default Graph;
