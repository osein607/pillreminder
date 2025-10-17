import React, { useState } from "react";
import "../styles/Settings.css";
import { useMedicineStore } from "../data/medicineStore";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const resetStore = useMedicineStore((state) => state.reset);

  // 보호자 정보 입력값
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");

  const handleReset = () => {
    if (window.confirm("정말 모든 복약 데이터를 초기화할까요?")) {
      resetStore();
      localStorage.removeItem("medicine-storage");
      alert("데이터가 초기화되었습니다!");
      navigate("/");
    }
  };

  const handleSaveGuardian = () => {
    if (!guardianName || !guardianPhone) {
      alert("보호자 이름과 연락처를 모두 입력해주세요.");
      return;
    }
    const info = { guardianName, guardianPhone, guardianEmail };
    localStorage.setItem("guardian-info", JSON.stringify(info));
    alert("보호자 정보가 저장되었습니다!");
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h2 className="settings-title">⚙️ 설정</h2>
        <p className="settings-subtitle">
          계정 및 복약 관리 설정을 변경할 수 있습니다.
        </p>
      </header>

      {/* 계정 정보 */}
      <section className="settings-section">
        <h3 className="section-title">계정 정보</h3>
        <div className="info-card">
          <p>
            <strong>이름:</strong> 동국 님
          </p>
          <p>
            <strong>이메일:</strong> dgu@medicare.com
          </p>
        </div>
      </section>

      {/* 보호자 연동 */}
      <section className="settings-section">
        <h3 className="section-title">보호자 연동</h3>
        <div className="guardian-card">
          <label>보호자 이름</label>
          <input
            type="text"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            placeholder="예: 김철수"
          />

          <label>보호자 연락처</label>
          <input
            type="tel"
            value={guardianPhone}
            onChange={(e) => setGuardianPhone(e.target.value)}
            placeholder="010-0000-0000"
          />

          <label>보호자 이메일 (선택)</label>
          <input
            type="email"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
            placeholder="example@email.com"
          />

          <p className="guardian-tip">
            ⚠️ 복약 알림이 2회 이상 무시되면 보호자에게 알림이 전송됩니다.
          </p>

          <button className="save-btn" onClick={handleSaveGuardian}>
            💾 보호자 정보 저장
          </button>
        </div>
      </section>

      {/* 데이터 관리 */}
      {/* <section className="settings-section danger-zone">
        <h3 className="section-title">데이터 관리</h3>
        <button className="reset-btn" onClick={handleReset}>
          💣 복약 데이터 초기화
        </button>
      </section> */}
    </div>
  );
};

export default Settings;
