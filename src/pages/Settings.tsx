import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
// import { useMedicineStore } from "../data/medicineStore";
// import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  // const navigate = useNavigate();
  // const resetStore = useMedicineStore((state) => state.reset);

  // --- 수정 모드 관리 ---
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingGuardian, setIsEditingGuardian] = useState(false);

  // --- 사용자 정보 ---
  const [userName, setUserName] = useState("동국"); // " 님" 제거
  const [userEmail, setUserEmail] = useState("dgu@medicare.com");

  // --- 보호자 정보 ---
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");

  // 💡 컴포넌트 로드 시 localStorage에서 정보 불러오기
  useEffect(() => {
    // 1. 사용자 정보 로드
    const savedUser = localStorage.getItem("user-info");
    if (savedUser) {
      const { name, email } = JSON.parse(savedUser);
      setUserName(name || "동국");
      setUserEmail(email || "dgu@medicare.com");
    }

    // 2. 보호자 정보 로드
    const savedGuardian = localStorage.getItem("guardian-info");
    if (savedGuardian) {
      const { guardianName, guardianPhone, guardianEmail } =
        JSON.parse(savedGuardian);
      setGuardianName(guardianName || "");
      setGuardianPhone(guardianPhone || "");
      setGuardianEmail(guardianEmail || "");
    }
  }, []); // [] 빈 배열: 처음 마운트될 때 한 번만 실행

  // 💾 사용자 정보 저장 핸들러
  const handleSaveUser = () => {
    const info = { name: userName, email: userEmail };
    localStorage.setItem("user-info", JSON.stringify(info));
    alert("사용자 정보가 저장되었습니다!");
    setIsEditingUser(false); // 💡 저장 후 조회 모드로 변경
  };

  // 💾 보호자 정보 저장 핸들러
  const handleSaveGuardian = () => {
    if (!guardianName || !guardianPhone) {
      alert("보호자 이름과 연락처를 모두 입력해주세요.");
      return;
    }
    const info = { guardianName, guardianPhone, guardianEmail };
    localStorage.setItem("guardian-info", JSON.stringify(info));
    alert("보호자 정보가 저장되었습니다!");
    setIsEditingGuardian(false); // 💡 저장 후 조회 모드로 변경
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h2 className="settings-title">⚙️ 설정</h2>
        <p className="settings-subtitle">
          계정 및 복약 관리 설정을 변경할 수 있습니다.
        </p>
      </header>

      {/* 👤 계정 정보 */}
      <section className="settings-section">
        <h3 className="section-title">계정 정보</h3>
        {isEditingUser ? (
          // 1. 사용자: 수정 모드
          <div className="edit-form-card">
            <label>이름</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <label>이메일</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <button className="save-btn" onClick={handleSaveUser}>
              💾 사용자 정보 저장
            </button>
          </div>
        ) : (
          // 2. 사용자: 조회 모드
          <div className="info-card">
            <button
              className="edit-btn"
              onClick={() => setIsEditingUser(true)}
            >
              정보 수정
            </button>
            <p>
              <strong>이름:</strong> {userName} 님
            </p>
            <p>
              <strong>이메일:</strong> {userEmail}
            </p>
          </div>
        )}
      </section>

      {/* 👨‍👩‍👧‍👦 보호자 연동 */}
      <section className="settings-section">
        <h3 className="section-title">보호자 연동</h3>
        {isEditingGuardian ? (
          // 1. 보호자: 수정 모드 (기존 UI 재활용)
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
            <button
              className="cancel-btn"
              onClick={() => setIsEditingGuardian(false)}
            >
              취소
            </button>
          </div>
        ) : (
          // 2. 보호자: 조회 모드
          <div className="info-card">
            <button
              className="edit-btn"
              onClick={() => setIsEditingGuardian(true)}
            >
              정보 수정
            </button>
            <p>
              <strong>이름:</strong> {guardianName || "정보 없음"}
            </p>
            <p>
              <strong>연락처:</strong> {guardianPhone || "정보 없음"}
            </p>
            <p>
              <strong>이메일:</strong> {guardianEmail || "정보 없음"}
            </p>
          </div>
        )}
      </section>
      
      {/* 데이터 관리 (주석 처리됨) */}
    </div>
  );
};

export default Settings;