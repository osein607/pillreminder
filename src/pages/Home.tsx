import React, { useState, useEffect } from 'react';
import MedicineCard from '../components/MedicineCard';
import Header from '../components/Header';
import DateTabs from '../components/DateTabs';
import type { Medicine } from '../data/medicine';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Paracetamol XL2', dosage: '150mg, 1 capsule', time: '식전 복용', remaining: 5, taken: false, date: '2025-10-15' },
    { id: 2, name: 'DPP-4 inhibitors', dosage: '150mg, 1 capsule', time: '식후 30분', remaining: 2, taken: false, date: '2025-10-15' },
    { id: 3, name: 'Ibuprofen', dosage: '200mg, 1 tablet', time: '식후 30분', remaining: 3, taken: false, date: '2025-10-16' },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getWeekday = (date: Date) => {
    const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return weekdays[date.getDay()];
  };

  const handleToggleTaken = (id: number) => {
    setMedicines(prev =>
      prev.map(med => med.id === id ? { ...med, taken: !med.taken } : med)
    );
  };

  // ⚙️ 아두이노 센서값 받아오기
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // 센서 서버 주소
    ws.onmessage = event => {
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
      <h2 className="home-subtitle">
          {getWeekday(selectedDate)}
      </h2>
      <div className="medicine-list">
        {medicines.map(med => (
          <MedicineCard
            key={med.id}
            medicine={med}
            onToggleTaken={handleToggleTaken}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
