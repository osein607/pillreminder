import { create } from "zustand";

type Medicine = {
  id: number;
  name: string;
  dosage: string;
  instruction: string;  
  remaining: number;
  taken: boolean;
  date: string;
};

interface MedicineStore {
  medicines: Record<string, Medicine[]>;
  addMedicine: (date: string, newMed: Omit<Medicine, "id" | "remaining" | "taken" | "date">) => void;
}

export const useMedicineStore = create<MedicineStore>((set) => ({
  medicines: {},
  addMedicine: (date, newMed) =>
    set((state) => {
      const prev = state.medicines[date] || [];
      const id = Date.now(); // 간단한 id 생성
      const newMedicine: Medicine = {
        id,
        ...newMed,
        remaining: 7,
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
}));
