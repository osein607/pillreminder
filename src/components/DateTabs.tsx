import React, { useState, useEffect, useRef } from "react";
// 💡 CSS 파일 경로를 'DataTabs.css'에서 'DateTabs.css'로 수정했습니다.
//    만약 'DataTabs.css'가 맞다면 원래대로 돌려주세요.
import "../styles/DataTabs.css"; 

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DateTabsProps {
  onDateChange?: (date: Date) => void;
}

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

const DateTabs: React.FC<DateTabsProps> = ({ onDateChange }) => {
  const today = new Date();
  const todayString = formatDate(today);

  // 💡 '선택된' 날짜를 (문자열이 아닌) Date 객체로 관리 (월/년 표시용)
  const [activeDate, setActiveDate] = useState(today);
  const [days, setDays] = useState<{ d: number; w: string; date: Date; dateString: string }[]>([]);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const todayPillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const arr: { d: number; w: string; date: Date; dateString: string }[] = [];
    
    // 오늘 기준 -30일부터 +30일까지 (총 61일)
    for (let i = -30; i <= 30; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      arr.push({
        d: dt.getDate(),
        w: dayNames[dt.getDay()],
        date: dt,
        dateString: formatDate(dt),
      });
    }
    setDays(arr);

    // '오늘' 날짜 탭이 중앙으로 오도록 자동 스크롤
    setTimeout(() => {
      if (todayPillRef.current && listContainerRef.current) {
        const container = listContainerRef.current;
        const pill = todayPillRef.current;
        const containerWidth = container.offsetWidth;
        const pillLeft = pill.offsetLeft;
        const pillWidth = pill.offsetWidth;
        container.scrollLeft = pillLeft - (containerWidth / 2) + (pillWidth / 2);
      }
    }, 100); 
  }, []); 

  const handleSelect = (day: { date: Date; dateString: string }) => {
    setActiveDate(day.date); // 💡 Date 객체로 선택
    onDateChange?.(day.date);
  };

  return (
    // 💡 1. '년/월' 제목을 포함하기 위한 wrapper 추가
    <div className="date-tabs-wrapper">
      {/* 💡 2. '년/월' 제목 (좌측 정렬) */}
      <h2 className="date-tabs-title">
        {activeDate.getFullYear()}년 {activeDate.getMonth() + 1}월
      </h2>

      {/* 3. 스크롤 컨테이너 */}
      <div className="date-tabs" ref={listContainerRef}>
        {days.map((x) => {
          const isActive = x.dateString === formatDate(activeDate);
          const isToday = x.dateString === todayString;

          return (
            <button
              key={x.dateString}
              // 💡 4. 'today' 클래스 추가
              className={`pill ${isActive ? "active" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleSelect(x)}
              ref={isToday ? todayPillRef : null}
            >
              <span className="pill-day">{x.d}</span>
              <span className="pill-week">{x.w}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateTabs;