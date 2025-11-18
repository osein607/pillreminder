import instance from "./utils/instance";

export async function fetchMedicines() {
  const res = await instance.get("/medicine/");
  return res.data; // 백엔드에서 오는 약 리스트
}
