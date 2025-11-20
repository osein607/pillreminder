import React from "react";
import { useNavigate } from "react-router-dom";
import type { MedicineCardData } from "../data/medicine";

type Props = {
  medicine: MedicineCardData;
  onToggleTaken: (id: number) => void;
};

const MedicineCard: React.FC<Props> = ({ medicine, onToggleTaken }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/add/${medicine.id}`);
  };

  return (
    <div className="medicine-card" onClick={handleCardClick}>
      <div className="medicine-info">
        <div className="medicine-name">{medicine.name}</div>
        <div className="medicine-quantity">{medicine.quantity}개</div>
        <div className="medicine-time">{medicine.time}</div> {/* ⭐ 여기 복용 시기 표시 */}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleTaken(medicine.dose_id);
        }}
        className={`take-btn ${medicine.taken ? "taken" : ""}`}
      >
        {medicine.taken ? "완료" : "복용"}
      </button>
    </div>
  );
};

export default MedicineCard;
