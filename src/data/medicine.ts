export type Medicine = {
  id: number;
  name: string;
  dosage: string;
  type: '처방약' | '일반약' | '건강보조제';
  time: '식전 복용' | '식후 30분';
  remaining: number;
  taken: boolean;
  date: string;
  quantity: number;
  startDate: string;
  endDate: string;
  notification: string;
};

export type MedicineTypeCode = 'PRESCRIPTION' | 'GENERAL' | 'SUPPLEMENT';

export const mapTypeCodeToLabel = (code: MedicineTypeCode): Medicine["type"] => {
  switch (code) {
    case 'PRESCRIPTION':
      return '처방약';
    case 'GENERAL':
      return '일반약';
    case 'SUPPLEMENT':
      return '건강보조제';
    default:
      return '일반약'; // fallback
  }
};

export const mapTimeCodeToLabel = (time: "BEFORE_MEAL" | "AFTER_MEAL") => {
  switch (time) {
    case "BEFORE_MEAL":
      return "식전 복용";
    case "AFTER_MEAL":
      return "식후 30분";
    default:
      return "";
  }
};


export interface MedicineCardData {
  id: number;
  name: string;
  quantity: number;
  time: string;
  type: '처방약' | '일반약' | '건강보조제';
  taken: boolean;
}


export interface DailyDose {
  id: number;
  date: string;
  quantity: number;
  is_taken: boolean;
  taken_at: string | null;
  medicine: {
    id: number;
    name: string;
    type: string;
    quantity: number;      
    start_date: string;    
    end_date: string;      
    time: string; 
    alarm_time: string;
  };
}
