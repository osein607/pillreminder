import React, { useState, useEffect } from 'react';
import MedicineCard from '../components/MedicineCard';
import Header from '../components/Header';
import DateTabs from '../components/DateTabs';
import type { Medicine } from '../types/medicine';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Paracetamol XL2', dosage: '150mg, 1 capsule', time: '식전 복용', remaining: 5, taken: false },
    { id: 2, name: 'DPP-4 inhibitors', dosage: '150mg, 1 capsule', time: '식후 30분', remaining: 2, taken: false },
  ]);

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
      <DateTabs />
      <h2 className="home-subtitle">Today</h2>
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
