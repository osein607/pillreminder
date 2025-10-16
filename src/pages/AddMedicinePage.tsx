import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicineStore } from "../data/medicineStore";
import type { Medicine } from "../data/medicine";
import "../styles/AddMedicinePage.css";

const TYPE_OPTIONS = ["처방약", "일반약", "건강보조제"] as const;
const TIME_OPTIONS = ["식전 복용", "식후 30분"] as const;

export default function AddMedicinePage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const addMedicine = useMedicineStore((state) => state.addMedicine);

  const [type, setType] = useState<Medicine["type"] | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instruction, setInstruction] = useState<Medicine["time"] | null>(null);
  const [notification, setNotification] = useState("10:00");
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const today = formatDate(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const handleSubmit = () => {
    if (!type) {
      alert("약 종류를 선택해주세요.");
      return;
    }
    if (!instruction) {
      alert("복용 시간을 선택해주세요.");
      return;
    }

    // 📅 날짜 포맷 유틸
    const getDateList = (start: string, end: string): string[] => {
      const result: string[] = [];
      let current = new Date(start);
      const endDateObj = new Date(end);

      while (current <= endDateObj) {
        result.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return result;
    };

    const dateList = getDateList(startDate, endDate);

    // ✅ 각 날짜마다 등록
    dateList.forEach((d) => {
      addMedicine(d, {
        type,
        name,
        dosage: `${quantity}개`,
        time: instruction,
        quantity,
        startDate,
        endDate,
        notification,
      });
    });

    // ✅ 등록 후 알림 띄우기
    alert(`${name || "약"}이(가) 등록되었습니다!`);
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

      {/* 약 종류 */}
      <section className="add-section">
        <label>약 종류</label>
        <div className="pill-buttons">
          {TYPE_OPTIONS.map((label) => (
            <button
              key={label}
              className={`pill-option ${type === label ? "active" : ""}`}
              onClick={() => setType(label)} // 🔹 label이 리터럴로 추론됨
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 약 이름 */}
      <section className="add-section">
        <label>약 이름</label>
        <input
          className="input-box"
          placeholder="예: Paracetamol XL2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </section>

      {/* 수량 */}
      <section className="add-section">
        <label>수량</label>
        <div className="quantity-control">
          <button
            onClick={() => setQuantity((p) => Math.max(1, p - 1))}
            className="qty-btn"
          >
            -
          </button>
          <span className="qty-display">{quantity}</span>
          <button onClick={() => setQuantity((p) => p + 1)} className="qty-btn">
            +
          </button>
        </div>
      </section>

      {/* 기간 */}
      <section className="add-section">
        <label>복용 기간</label>
        <div className="calendar-section">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="calendar-input"
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="calendar-input"
          />
        </div>
      </section>

      {/* 복용 시간 */}
      <section className="add-section">
        <label>복용 시간</label>
        <div className="pill-buttons">
          {TIME_OPTIONS.map((label) => (
            <button
              key={label}
              className={`pill-option ${instruction === label ? "active" : ""}`}
              onClick={() => setInstruction(label)} // 🔹 리터럴로 추론
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 알림 시간 */}
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
