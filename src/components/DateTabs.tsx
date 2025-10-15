import React, { useMemo, useState } from 'react';
import '../styles/DataTabs.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DateTabs: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState(0);

  const days = useMemo(() => {
    const arr: { d: number; w: string }[] = [];
    for (let i = -1; i <= 3; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      arr.push({ d: dt.getDate(), w: dayNames[dt.getDay()] });
    }
    return arr;
  }, [today]);

  return (
    <div className="date-tabs">
      {days.map((x, i) => (
        <button
          key={i}
          className={`pill ${i === selected ? 'active' : ''}`}
          onClick={() => setSelected(i)}
        >
          <span className="pill-day">{x.d}</span>
          <span className="pill-week">{x.w}</span>
        </button>
      ))}
    </div>
  );
};

export default DateTabs;
