export type Medicine = {
  id: number;
  name: string;
  dosage: string;
  time: '식전 복용' | '식후 30분';
  remaining: number;
  taken: boolean; // 복용 완료 여부
  date: string;
};
