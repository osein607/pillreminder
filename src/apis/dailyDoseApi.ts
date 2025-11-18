import instance from "./utils/instance";
import type { DailyDose } from "../data/medicine";

export async function fetchDailyDose(date: string): Promise<DailyDose[]> {
  const res = await instance.get(`/medicine/daily-dose/?date=${date}`);
  return res.data; // DailyDose[]
}

export async function takeDailyDose(id: number): Promise<DailyDose> {
  const res = await instance.patch(`/medicine/daily-dose/${id}/take/`);
  return res.data; // DailyDose
}
