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
