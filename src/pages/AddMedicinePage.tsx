import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicineStore } from "../data/medicineStore";
import type { Medicine } from "../data/medicine";
import "../styles/AddMedicinePage.css";

const TYPE_OPTIONS = ["처방약", "일반약", "건강보조제"] as const;
const TIME_OPTIONS = ["식전 복용", "식후 30분"] as const;

export default function AddMedicinePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { medicines, addMedicine, updateMedicine } = useMedicineStore();
  const [hydrated, setHydrated] = useState(false); // ✅ persist 복원 여부 확인

  // ✅ Zustand persist 복원 완료 감지
  useEffect(() => {
    const unsub = useMedicineStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    // 이미 복원된 경우 대비
    if (useMedicineStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  const isEditMode = !!id;
  const [existing, setExisting] = useState<Medicine | null>(null);

  useEffect(() => {
    if (hydrated) {
      const allMeds = Object.values(medicines).flat();
      const found = allMeds.find((m) => m.id === Number(id));
      if (found) setExisting(found);
    }
  }, [hydrated, medicines, id]);

  // ✅ 기본값들
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const today = formatDate(new Date());

  const [type, setType] = useState<Medicine["type"] | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instruction, setInstruction] = useState<Medicine["time"] | null>(null);
  const [notification, setNotification] = useState("10:00");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // ✅ existing이 로드되면 form 값 채우기
  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setName(existing.name);
      setQuantity(existing.quantity);
      setInstruction(existing.time);
      setNotification(existing.notification);
      setStartDate(existing.startDate);
      setEndDate(existing.endDate);
    }
  }, [existing]);

  const handleSubmit = () => {
    if (!type) return alert("약 종류를 선택해주세요.");
    if (!instruction) return alert("복용 시간을 선택해주세요.");

    if (isEditMode && existing) {
      updateMedicine(existing.date, existing.id, {
        type,
        name,
        dosage: `${quantity}개`,
        time: instruction,
        quantity,
        startDate,
        endDate,
        notification,
      });
      alert("수정이 완료되었습니다!");
      navigate("/");
    } else {
      const getDateList = (start: string, end: string) => {
        const result: string[] = [];
        let cur = new Date(start);
        const endObj = new Date(end);
        while (cur <= endObj) {
          result.push(cur.toISOString().split("T")[0]);
          cur.setDate(cur.getDate() + 1);
        }
        return result;
      };

      const dates = getDateList(startDate, endDate);
      dates.forEach((d) => {
        addMedicine(d, {
          type,
          name,
          dosage: `${quantity}개`,
          time: instruction!,
          quantity,
          startDate,
          endDate,
          notification,
        });
      });
      alert(`${name} 이/(가) 등록되었습니다!`);
      navigate("/");
    }
  };

  // ✅ 복원이 끝나기 전에는 로딩 표시
  if (!hydrated) {
    return (
      <div className="add-page">
        <h3 style={{ textAlign: "center", marginTop: "50px" }}>
          ⏳ 데이터 불러오는 중...
        </h3>
      </div>
    );
  }

  return (
    <div className="add-page">
      <header className="add-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          🏠
        </button>
        <h2 className="add-title">
          {isEditMode ? "복약 정보 수정" : "복약 등록"}
        </h2>
      </header>

      {/* 약 종류 */}
      <section className="add-section">
        <label>약 종류</label>
        <div className="pill-buttons">
          {TYPE_OPTIONS.map((label) => (
            <button
              key={label}
              className={`pill-option ${type === label ? "active" : ""}`}
              onClick={() => setType(label)}
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

      {/* 복용 기간 */}
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
              onClick={() => setInstruction(label)}
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
        {isEditMode ? "수정 완료" : "등록 완료"}
      </button>
    </div>
  );
}
