export interface Snapshot {
  date: string; // '202405'
  total: number;
  data: { name: string; value: number }[];
  createdAt: number;
}
