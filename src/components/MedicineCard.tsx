import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Medicine } from '../data/medicine';

type Props = {
  medicine: Medicine;
  onToggleTaken: (id: number) => void;
};

const MedicineCard: React.FC<Props> = ({ medicine, onToggleTaken }) => {
  const navigate = useNavigate();

  // ✅ 카드 클릭 시 수정 페이지로 이동
  const handleCardClick = () => {
    navigate(`/add/${medicine.id}`);
  };

  return (
    <div className="medicine-card" onClick={handleCardClick}>
      <div className="medicine-info">
        <div className="medicine-name">{medicine.name}</div>
        <div className="medicine-dosage">{medicine.dosage}</div>
        <div className="medicine-time">{medicine.time}</div>
      </div>

      {/* ✅ 버튼 클릭 시에는 카드 클릭 이벤트 방지 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 카드 클릭 막기
          onToggleTaken(medicine.id);
        }}
        className={`take-btn ${medicine.taken ? 'taken' : ''}`}
      >
        {medicine.taken ? '완료' : '복용'}
      </button>
    </div>
  );
};

export default MedicineCard;
