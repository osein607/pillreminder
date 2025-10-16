import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Medicine } from "./medicine";

interface MedicineStore {
  medicines: Record<string, Medicine[]>;

  addMedicine: (
    date: string,
    newMed: Omit<Medicine, "id" | "remaining" | "taken" | "date">
  ) => void;

  toggleTaken: (date: string, id: number) => void;

  updateMedicine: ( 
    date: string,
    id: number,
    updates: Partial<Medicine>
  ) => void;

  reset: () => void;
}

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set) => ({
      medicines: {},

      // ✅ 약 정보 수정
      updateMedicine: (date, id, updates) =>
        set((state) => {
          const updated = (state.medicines[date] || []).map((m) =>
            m.id === id ? { ...m, ...updates } : m
          );
          return { medicines: { ...state.medicines, [date]: updated } };
        }),

      // ✅ 약 추가
      addMedicine: (date, newMed) =>
        set((state) => {
          const prev = state.medicines[date] || [];
          const id = Date.now();
          const newMedicine: Medicine = {
            id,
            ...newMed,
            remaining: newMed.quantity,
            taken: false,
            date,
          };
          return {
            medicines: {
              ...state.medicines,
              [date]: [...prev, newMedicine],
            },
          };
        }),

      // ✅ 복용 완료 토글
      toggleTaken: (date, id) =>
        set((state) => {
          const updated = (state.medicines[date] || []).map((m) =>
            m.id === id ? { ...m, taken: !m.taken } : m
          );
          return {
            medicines: {
              ...state.medicines,
              [date]: updated,
            },
          };
        }),

        reset: () => set(() => ({ medicines: {} })),
    }),
    { name: "medicine-storage" }
  )
);
