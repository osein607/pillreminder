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

  const { medicines, addMedicine, deleteMedicine } = useMedicineStore(); 
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useMedicineStore.persist.onFinishHydration(() => setHydrated(true));
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

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const today = formatLocalDate(new Date());

  const [type, setType] = useState<Medicine["type"] | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instruction, setInstruction] = useState<Medicine["time"] | null>(null);
  const [notification, setNotification] = useState("10:00");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

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

  // ✅ 약 삭제 함수
  const handleDelete = () => {
    if (!existing) return;
    if (window.confirm(`"${existing.name}" 약 정보를 삭제할까요?`)) {
      deleteMedicine(existing.id);
      alert("약 정보가 삭제되었습니다.");
      navigate("/"); // 홈으로 이동
    }
  };

  const handleSubmit = () => {
    if (!type) return alert("약 종류를 선택해주세요.");
    if (!name.trim()) return alert("약 이름을 입력해주세요.");
    if (!instruction) return alert("복용 시간을 선택해주세요.");
    if (new Date(startDate) > new Date(endDate))
      return alert("복용 시작일은 종료일보다 늦을 수 없습니다.");

    const getDateList = (start: string, end: string) => {
      const result: string[] = [];
      const parseLocalDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d);
      };
      let cur = parseLocalDate(start);
      const endObj = parseLocalDate(end);
      while (cur <= endObj) {
        result.push(formatLocalDate(cur));
        cur.setDate(cur.getDate() + 1);
      }
      return result;
    };

    const newMedicineData = {
      type,
      name,
      dosage: `${quantity}개`,
      time: instruction!,
      quantity,
      startDate,
      endDate,
      notification,
    };

    if (isEditMode && existing) {
      const oldDates = getDateList(existing.startDate, existing.endDate);
      const newDates = getDateList(startDate, endDate);

      useMedicineStore.setState((state) => {
        const updated = { ...state.medicines };
        oldDates.forEach((d) => {
          const dayList = updated[d] || [];
          updated[d] = dayList.filter((m) => m.id !== existing.id);
        });
        return { medicines: updated };
      });

      newDates.forEach((d) => {
        addMedicine(d, {
          id: existing.id,
          ...newMedicineData,
        } as any);
      });

      alert("수정이 완료되었습니다!");
      navigate("/", { replace: true });
    } else {
      const newDates = getDateList(startDate, endDate);
      newDates.forEach((d) => addMedicine(d, newMedicineData));
      alert(`${name} 이/(가) 등록되었습니다!`);
      navigate("/", { replace: true });
    }
  };

  if (!hydrated) {
    return (
      <div className="add-page">
        <h3 style={{ textAlign: "center", marginTop: "50px" }}>⏳ 데이터 불러오는 중...</h3>
      </div>
    );
  }

  return (
    <div className="add-page">
      <header className="add-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          🏠
        </button>
        <h2 className="add-title">{isEditMode ? "복약 정보 수정" : "복약 등록"}</h2>
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
          placeholder="예: 감기약"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </section>

      {/* 수량 */}
      <section className="add-section">
        <label>수량</label>
        <div className="quantity-control">
          <button onClick={() => setQuantity((p) => Math.max(1, p - 1))} className="qty-btn">
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

      {isEditMode && (
        <button className="delete-btn" onClick={handleDelete}>
          🗑️ 약 삭제하기
        </button>
      )}
    </div>
  );
}
