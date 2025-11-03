export interface Member {
  _id: string;
  name: string;
  rank: string;
  level: string;
  kills: number;
  cp: number;
  notes?: string;
  location?: {
    row: number;
    col: number;
  };
}
