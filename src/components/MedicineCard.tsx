import React from 'react';
import type { Medicine } from '../data/medicine';

type Props = {
  medicine: Medicine;
  onToggleTaken: (id: number) => void;
};

const MedicineCard: React.FC<Props> = ({ medicine, onToggleTaken }) => {
  return (
    <div className="medicine-card">
      <div className="medicine-info">
        <div className="medicine-name">{medicine.name}</div>
        <div className="medicine-dosage">{medicine.dosage}</div>
        <div className="medicine-time">{medicine.time}</div>
      </div>
      <button
        onClick={() => onToggleTaken(medicine.id)}
        className={`take-btn ${medicine.taken ? 'taken' : ''}`}
      >
        {medicine.taken ? '완료' : '복용'}
      </button>
    </div>
  );
};

export default MedicineCard;
