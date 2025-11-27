import React, { useState, useEffect } from "react";
import "../styles/Settings.css";

// 💡 방금 만드신 API 파일 경로에 맞게 import 경로를 수정해주세요!
// 예: import { fetchGuardianAPI, updateGuardianAPI } from "../api/medicine";
import { fetchGuardianAPI, updateGuardianAPI } from "../apis/medicineApi"; 

const Settings: React.FC = () => {
  // --- 상태 관리 ---
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingGuardian, setIsEditingGuardian] = useState(false);

  // 사용자 정보
  const [userName, setUserName] = useState(""); 
  const [userEmail, setUserEmail] = useState("");

  // 보호자 정보
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");

  // =========================================================
  // 📡 1. 데이터 조회 (API 함수 사용)
  // =========================================================
  const loadData = async () => {
    try {
      // API 호출 (instance가 토큰, URL 등을 알아서 처리함)
      const data = await fetchGuardianAPI();

      // 보호자 정보 업데이트
      setGuardianName(data.name || "");
      setGuardianPhone(data.phone || "");
      setGuardianEmail(data.email || "");

      // 사용자 정보 업데이트 ("동국 님" -> "동국" 처리)
      if (data.owner_name) {
        setUserName(data.owner_name.replace(" 님", ""));
      }
      if (data.owner_email) {
        setUserEmail(data.owner_email);
      }
    } catch (error) {
      // API 파일에서 에러 로그를 찍으므로 여기서는 사용자 알림 정도만
      console.log("데이터를 불러오지 못했습니다.");
    }
  };

  // 화면이 처음 켜질 때 실행
  useEffect(() => {
    loadData();
  }, []);


  // =========================================================
  // 💾 2. 데이터 저장 (API 함수 사용)
  // =========================================================
  const handleSaveGuardian = async () => {
    // 유효성 검사
    if (!guardianName || !guardianPhone) {
      alert("보호자 이름과 연락처를 모두 입력해주세요.");
      return;
    }

    // 서버로 보낼 데이터 구성
    const requestBody = {
      owner_name: `${userName} 님`, // 서버 형식에 맞춤
      owner_email: userEmail,
      name: guardianName,
      phone: guardianPhone,
      email: guardianEmail,
    };

    try {
      // API 호출
      const data = await updateGuardianAPI(requestBody);

      // 성공 시 데이터 최신화
      setGuardianName(data.name);
      setGuardianPhone(data.phone);
      setGuardianEmail(data.email);
      
      if (data.owner_name) setUserName(data.owner_name.replace(" 님", ""));
      if (data.owner_email) setUserEmail(data.owner_email);

      alert("보호자 정보가 저장되었습니다!");
      setIsEditingGuardian(false); // 조회 모드로 변경
    } catch (error) {
      // 에러 발생 시
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 사용자 정보만 로컬 저장 (보호자 저장 시 같이 전송되므로 UI 처리만 함)
  const handleSaveUserLocal = () => {
     alert("사용자 정보는 [보호자 정보 저장] 버튼을 누를 때 함께 서버로 전송됩니다.");
     setIsEditingUser(false);
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h2 className="settings-title">⚙️ 설정</h2>
        <p className="settings-subtitle">
          계정 및 복약 관리 설정을 변경할 수 있습니다.
        </p>
      </header>

      {/* 👤 계정 정보 섹션 */}
      <section className="settings-section">
        <h3 className="section-title">계정 정보</h3>
        {isEditingUser ? (
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
            <button className="save-btn" onClick={handleSaveUserLocal}>
              ✅ 입력 완료
            </button>
          </div>
        ) : (
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

      {/* 👨‍👩‍👧‍👦 보호자 연동 섹션 */}
      <section className="settings-section">
        <h3 className="section-title">보호자 연동</h3>
        {isEditingGuardian ? (
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

            <label>보호자 이메일</label>
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
              onClick={() => {
                setIsEditingGuardian(false);
                loadData(); // 취소 시 서버 데이터로 원복
              }}
            >
              취소
            </button>
          </div>
        ) : (
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
    </div>
  );
};

export default Settings;