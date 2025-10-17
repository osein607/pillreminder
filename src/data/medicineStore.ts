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

  deleteMedicine: (id: number) => void;

  reset: () => void;
}

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set) => ({
      medicines: {},

      // ✅ 약 정보 수정
      updateMedicine: (date, id, newData) =>
        set((state) => {
          const updated = { ...state.medicines };
          updated[date] = updated[date].map((m) =>
            m.id === id ? { ...m, ...newData } : m
          );
          return { medicines: updated };
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

      deleteMedicine: (id: number) =>
        set((state) => {
          const updated = { ...state.medicines };
          Object.keys(updated).forEach((date) => {
            updated[date] = updated[date].filter((m) => m.id !== id);
          });
          return { medicines: updated };
        }),

      toggleTaken: (date, id) =>
        set((state) => {
          const updated = { ...state.medicines };
          updated[date] = updated[date].map((m) =>
            m.id === id ? { ...m, taken: !m.taken } : m
          );
          return { medicines: updated };
        }),

      reset: () => set(() => ({ medicines: {} })),
    }),
    { name: "medicine-storage" }
  )
);
