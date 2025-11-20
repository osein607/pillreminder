import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Medicine } from "./medicine";
import instance from "../apis/utils/instance"

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
  setMedicines: (data: Record<string, Medicine[]>) => void;

  logs: Record<string, { taken: number; missed: number }>;
  setLogs: (items: { date: string; taken: number; missed: number }[]) => void;
  fetchLogs: (month: string | number) => Promise<void>;
}

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set) => ({
      medicines: {},
      logs: {},

      setMedicines: (data) =>
        set(() => ({
          medicines: data,
        })),

      updateMedicine: (date, id, newData) =>
        set((state) => {
          const updated = { ...state.medicines };
          updated[date] = updated[date].map((m) =>
            m.id === id ? { ...m, ...newData } : m
          );
          return { medicines: updated };
        }),

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

      // ✔ logs 저장하는 함수
      setLogs: (items) =>
        set(() => {
          const newLogs: MedicineStore["logs"] = {};
          items.forEach((d) => {
            newLogs[d.date] = {
              taken: d.taken,
              missed: d.missed,
            };
          });
          return { logs: newLogs };
        }),

      fetchLogs: async (month: string | number) => {
        try {
          const res = await instance.get(`/medicine/logs/?month=${month}`);
          const newLogs: Record<string, { taken: number; missed: number }> = {};

          res.data.forEach((d: any) => {
            newLogs[d.date] = {
              taken: d.taken,
              missed: d.missed,
            };
          });

          set({ logs: newLogs });
        } catch (e) {
          console.error("fetchLogs error:", e);
        }
      },


      reset: () =>
        set(() => ({
          medicines: {},
          logs: {},
        })),
    }),
    { name: "medicine-storage" }
  )
);
