import instance from "./utils/instance";

// 1. 약 리스트 조회 (GET /medicine/)
export const fetchMedicines = async () => {
  try {
    const response = await instance.get("/medicine/");
    console.log("약 리스트 응답:", response.data); // 데이터 확인용 로그
    return response.data;
  } catch (error) {
    console.error("약 리스트 조회 실패:", error);
    return []; // 💡 에러가 나면 빈 배열을 반환해서 화면이 안 깨지게 함
  }
};

// 2. 약 등록 (POST /medicine/)
export const registerMedicineAPI = async (data: any) => {
  try {
    const response = await instance.post("/medicine/", data);
    console.log("약 등록 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("약 등록 실패:", error);
    throw error; // 💡 에러를 밖으로 던져서, 화면에서 alert를 띄울 수 있게 함
  }
};

// 약 상세 조회
export const fetchMedicineDetailAPI = async (id: number) => {
  const res = await instance.get(`/medicine/${id}/`);
  return res.data;
};

// 약 수정
export const updateMedicineAPI = async (id: number, body: any) => {
  const res = await instance.put(`/medicine/${id}/`, body);
  return res.data;
};

// 약 삭제
export const deleteMedicineAPI = async (id: number) => {
  const res = await instance.delete(`/medicine/${id}/`);
  return res.data;
};

// 6. 보호자 정보 조회 (GET /medicine/guardian/)
export const fetchGuardianAPI = async () => {
  try {
    const response = await instance.get("/medicine/guardian/");
    console.log("보호자 조회 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("보호자 조회 실패:", error);
    throw error;
  }
};

// 7. 보호자 정보 수정 (POST /medicine/guardian/update)
export const updateGuardianAPI = async (data: any) => {
  try {
    const response = await instance.post("/medicine/guardian/update/", data);
    console.log("보호자 수정 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("보호자 수정 실패:", error);
    throw error;
  }
};