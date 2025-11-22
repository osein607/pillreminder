import React, { useState, useEffect } from "react";
import MedicineCard from "../components/MedicineCard";
import Header from "../components/Header";
import DateTabs from "../components/DateTabs";
// 👇 파일 경로가 실제 파일 위치와 맞는지 꼭 확인하세요! (apis -> api 등)
import { fetchMedicines } from "../apis/medicineApi"; 
import { useMedicineStore } from "../data/medicineStore";
import { useDailyDoseStore } from "../data/dailyDoseStore";

import type { Medicine, MedicineCardData } from "../data/medicine";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

// 🚀 [최적화] formatDate를 컴포넌트 밖으로 뺐습니다. (useEffect 의존성 문제 해결)
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const weekdaysShort = ["일", "월", "화", "수", "목", "금", "토"];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { doses, setDate, markTaken } = useDailyDoseStore();
  const setMedicines = useMedicineStore((state) => state.setMedicines);

  // 날짜 설정
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 현재 선택된 날짜 문자열
  const formattedDate = formatDate(selectedDate);
  // 해당 날짜의 약 목록 가져오기
  const convertType = (t: string) => {
    switch (t) {
      case "PRESCRIPTION":
        return "처방약";
      case "SUPPLEMENT":
        return "건강보조제";
      case "GENERAL":
      default:
        return "일반약";
    }
  };

  const todayMeds: MedicineCardData[] = doses.map((d) => ({
    dose_id: d.id,                 // DailyDose.id
    id: d.medicine.id,             // Medicine.id
    name: d.medicine.name,
    quantity: d.quantity,
    time: d.medicine.time,
    type: convertType(d.medicine.type),         // ⭐ 필수: '처방약' | '일반약' | '건강보조제'
    taken: d.is_taken,
  }));

  const getWeekday = (date: Date) => {
    return weekdaysShort[date.getDay()];
  };

  const handleToggleTaken = (doseId: number) => {
    markTaken(doseId);
  };


  // ⭐ [수정됨] API 호출 및 데이터 가공 로직
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMedicines();
        
        // 데이터를 저장할 빈 객체
        const grouped: Record<string, Medicine[]> = {};

        // 1. API에서 받은 약 리스트를 순회
        data.forEach((med: any) => {
          const start = new Date(med.start_date);
          const end = new Date(med.end_date);

          // 🔄 [변환] 영어 -> 한글 (백엔드 데이터에 맞춰 변환)
          let typeKr = "일반약";
          if (med.type === "PRESCRIPTION") typeKr = "처방약";
          else if (med.type === "GENERAL") typeKr = "일반약";
          else if (med.type === "SUPPLEMENT") typeKr = "건강보조제";

          let timeKr = "식후 30분";
          if (med.time === "BEFORE_MEAL") timeKr = "식전 복용";
          else if (med.time === "AFTER_MEAL") timeKr = "식후 30분";

          // 🔄 [변환] 알림 시간 (초 단위 제거)
          const rawTime = med.alarm_time || "09:00";
          const notificationStr = String(rawTime).substring(0, 5);

          // 2. 시작일부터 종료일까지 날짜를 하루씩 늘려가며 반복 (Loop)
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            // 여기서 formatDate를 안전하게 사용
            const dateStr = formatDate(d); 

            if (!grouped[dateStr]) {
              grouped[dateStr] = [];
            }

            // 3. 해당 날짜(dateStr) 배열에 약 추가
            grouped[dateStr].push({
              id: med.id,
              name: med.name,
              
              // 변환된 한글 값 사용
              type: typeKr as any,
              time: timeKr as any,
              
              quantity: med.quantity,
              remaining: med.quantity, // 필요 시 수정
              
              // 백엔드 필드 확인 (is_taken_today 등)
              taken: med.is_taken_today || false, 
              
              date: dateStr,
              notification: notificationStr, // 프론트엔드 필드명에 매핑
              dosage: `${med.quantity}개`,   // 보여주기용 문자열
              
              startDate: med.start_date,
              endDate: med.end_date,
            } as Medicine);
          }
        });

        // 4. 완성된 데이터를 스토어에 저장
        setMedicines(grouped);
      } catch (e) {
        console.error("약 목록 불러오기 실패:", e);
      }
    }
    load();
  }, [setMedicines]); 


  useEffect(() => {
    setDate(formattedDate);  // ⭐ DailyDose 불러오기
  }, [formattedDate]);

  return (
    <div className="home-container">
      <Header />
      <DateTabs onDateChange={setSelectedDate} />
      <h2 className="home-subtitle">{getWeekday(selectedDate)}요일</h2>

      <div className="medicine-list">
        {todayMeds.length === 0 ? (
          <div className="empty-box">
            <span className="emoji">💊</span>
            <p>등록된 약이 없습니다</p>
            <p className="guide">
              오른쪽 상단 ➕ 버튼을 눌러 복약 정보를 추가하세요
            </p>
          </div>
        ) : (
          todayMeds.map((med) => (
            <div
              key={med.dose_id}
              onClick={() => navigate(`/edit/${med.id}`)}
            >
              <MedicineCard medicine={med} onToggleTaken={handleToggleTaken} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;