import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicineStore } from "../data/medicineStore";
import "../styles/AddMedicinePage.css";

export default function AddMedicinePage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const addMedicine = useMedicineStore((state) => state.addMedicine);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instruction, setInstruction] = useState("");
  const [notification, setNotification] = useState("10:00");

  const handleSubmit = () => {
    if (!date) return;
    addMedicine(date, { name, dosage, instruction });
    navigate("/");
  };

  return (
    <div className="add-page">
      <header className="add-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          🏠
        </button>
        <h2 className="add-title">복약 등록</h2>
      </header>

      <section className="add-section">
        <label>약 이름</label>
        <input
          className="input-box"
          placeholder="예: Paracetamol XL2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </section>

      <section className="add-section">
        <label>용량</label>
        <input
          className="input-box"
          placeholder="150mg, 1 capsule"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
      </section>

      <section className="add-section">
        <label>복용 시점</label>
        <div className="pill-buttons">
          {["식전 복용", "식후 30분"].map((label) => (
            <button
              key={label}
              className={`pill-option ${instruction === label ? "active" : ""}`}
              onClick={() => setInstruction(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="add-section">
        <label>알림 시간</label>
        <input
          type="time"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          className="input-box"
        />
      </section>

      <button className="submit-btn" onClick={handleSubmit}>
        등록 완료
      </button>
    </div>
  );
}
