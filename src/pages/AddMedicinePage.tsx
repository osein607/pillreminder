import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicineStore } from "../data/medicineStore";
import { registerMedicineAPI } from "../apis/medicineApi"; // 👈 API 임포트 (경로 확인!)
import type { Medicine } from "../data/medicine";
import "../styles/AddMedicinePage.css";

const TYPE_OPTIONS = ["처방약", "일반약", "건강보조제"] as const;
const TIME_OPTIONS = ["식전 복용", "식후 30분"] as const;

export default function AddMedicinePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // ✅ addMedicine은 이제 안 쓰므로 제거 (누런 줄 원인 제거)
  const { medicines, deleteMedicine } = useMedicineStore(); 
  
  // --- [기존 로직 유지] 수정 모드일 때 데이터 불러오기 ---
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
  // ----------------------------------------------------

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const today = formatLocalDate(new Date());

  const [type, setType] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instruction, setInstruction] = useState<string | null>(null);
  const [notification, setNotification] = useState("10:00");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // 수정 모드일 때 데이터 채워넣기
  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setName(existing.name);
      setQuantity(existing.quantity);
      setInstruction(existing.time);
      // setNotification(existing.notification); // 백엔드 데이터에 있다면 추가
      setStartDate(existing.startDate);
      setEndDate(existing.endDate);
    }
  }, [existing]);

  const handleDelete = () => {
    if (!existing) return;
    if (window.confirm(`"${existing.name}" 약 정보를 삭제할까요?`)) {
      deleteMedicine(existing.id); // 나중에 이것도 API로 바꿔야 함
      alert("약 정보가 삭제되었습니다.");
      navigate("/");
    }
  };

  // 🚀 [핵심 수정] API를 사용하여 약 등록하기
const handleSubmit = async () => {
    // 1. 유효성 검사
    if (!type) return alert("약 종류를 선택해주세요.");
    if (!name.trim()) return alert("약 이름을 입력해주세요.");
    if (!instruction) return alert("복용 시간을 선택해주세요.");
    if (new Date(startDate) > new Date(endDate))
      return alert("복용 시작일은 종료일보다 늦을 수 없습니다.");

    // 2. [변환] 한글 -> 백엔드용 영어 (Enum)
    let typeKey = "GENERAL"; // 기본값 (일반약)
    if (type === "처방약") typeKey = "PRESCRIPTION";
    else if (type === "일반약") typeKey = "GENERAL";
    else if (type === "건강보조제") typeKey = "SUPPLEMENT";

    let timeKey = "BEFORE_MEAL"; // 기본값
    if (instruction === "식전 복용") timeKey = "BEFORE_MEAL";
    else if (instruction === "식후 30분") timeKey = "AFTER_MEAL";
    // 필요하다면 다른 시간 옵션도 여기에 추가 (예: 식후 30분 -> AFTER_MEAL 등 팀원에게 확인)

    // 3. [변환] 시간 포맷 (10:00 -> 10:00:00)
    // 백엔드 예시가 "07:05:59.934Z" 인걸 보니 초 단위까지 필요할 수 있습니다.
    // 일단 ":00"을 붙여서 보냅니다.
    const formattedTime = `${notification}:00`; 

    // 4. 최종 데이터 생성
    const apiData = {
      name: name,
      type: typeKey,           // "PRESCRIPTION" 등 영어로 전송
      quantity: Number(quantity),
      start_date: startDate,
      end_date: endDate,
      time: timeKey,           // "BEFORE_MEAL" 등 영어로 전송
      alarm_time: formattedTime, // "10:00:00"
      
      // ❌ dosage는 삭제했습니다.
    };

    console.log("🚀 서버로 보내는 최종 데이터:", apiData);

    try {
      await registerMedicineAPI(apiData);
      alert("등록 성공!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("등록 실패! (여전히 안 되면 alarm_time 형식을 팀원에게 문의하세요)");
    }
  };
  if (!hydrated) {
    return <div className="add-page"><h3>⏳ 로딩 중...</h3></div>;
  }

  return (
    <div className="add-page">
      <header className="add-header">
        <button className="back-btn" onClick={() => navigate(-1)}>🏠</button>
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
          <button onClick={() => setQuantity((p) => Math.max(1, p - 1))} className="qty-btn">-</button>
          <span className="qty-display">{quantity}</span>
          <button onClick={() => setQuantity((p) => p + 1)} className="qty-btn">+</button>
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