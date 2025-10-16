import React from "react";
import "../styles/Settings.css";
import { useMedicineStore } from "../data/medicineStore";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const resetStore = useMedicineStore((state) => state.reset);

  const handleReset = () => {
    if (window.confirm("정말 모든 복약 데이터를 초기화할까요?")) {
      resetStore();
      localStorage.removeItem("medicine-storage");
      alert("데이터가 초기화되었습니다!");
      navigate("/");
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h2 className="settings-title">⚙️ 설정</h2>
        <p className="settings-subtitle">계정 및 복약 관리 설정을 변경할 수 있습니다.</p>
      </header>

      <section className="settings-section">
        <h3 className="section-title">계정 정보</h3>
        <div className="info-card">
          <p><strong>이름:</strong> 동국 님</p>
          <p><strong>이메일:</strong> dgu@medicare.com</p>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="section-title">앱 설정</h3>
        <div className="toggle-row">
          <label htmlFor="theme">🌙 다크모드</label>
          <input id="theme" type="checkbox" disabled />
        </div>
        <div className="toggle-row">
          <label htmlFor="alarm">🔔 알림 허용</label>
          <input id="alarm" type="checkbox" checked readOnly />
        </div>
      </section>

      <section className="settings-section danger-zone">
        <h3 className="section-title">데이터 관리</h3>
        <button className="reset-btn" onClick={handleReset}>
          💣 복약 데이터 초기화
        </button>
      </section>
    </div>
  );
};

export default Settings;
