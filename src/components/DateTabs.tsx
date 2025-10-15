import React, { useMemo, useState } from 'react';
import '../styles/DataTabs.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DateTabsProps {
  onDateChange?: (date: Date) => void; // ✅ 부모(Home)로 전달할 콜백
}

const DateTabs: React.FC<DateTabsProps> = ({ onDateChange }) => {
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState(1); // 오늘(중간) 기본 선택

  const days = useMemo(() => {
    const arr: { d: number; w: string; date: Date }[] = [];
    for (let i = -1; i <= 3; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      arr.push({ d: dt.getDate(), w: dayNames[dt.getDay()], date: dt });
    }
    return arr;
  }, [today]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onDateChange?.(days[index].date); // ✅ 부모에게 선택된 날짜 전달
  };

  return (
    <div className="date-tabs">
      {days.map((x, i) => (
        <button
          key={i}
          className={`pill ${i === selected ? 'active' : ''}`}
          onClick={() => handleSelect(i)}
        >
          <span className="pill-day">{x.d}</span>
          <span className="pill-week">{x.w}</span>
        </button>
      ))}
    </div>
  );
};

export default DateTabs;
