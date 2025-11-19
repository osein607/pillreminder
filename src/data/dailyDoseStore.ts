import type { DailyDose } from "./medicine";
import { create } from "zustand";
import { fetchDailyDose, takeDailyDose } from "../apis/dailydoseApi";

interface DailyDoseState {
  doses: DailyDose[];
  selectedDate: string | null;
  setDate: (date: string) => Promise<void>;
  markTaken: (id: number) => Promise<void>;
}

export const useDailyDoseStore = create<DailyDoseState>((set) => ({
  doses: [],
  selectedDate: null,

  setDate: async (date) => {
    const data = await fetchDailyDose(date);
    set({ doses: data, selectedDate: date });
  },

  markTaken: async (id) => {
    const updated = await takeDailyDose(id);
    set((state) => ({
      doses: state.doses.map((d) =>
        d.id === id ? { ...d, ...updated } : d
      ),
    }));
  },
}));
