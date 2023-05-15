export type User = {
  id: number;
  role: number;
  email: string;
  firstname: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
}

export type Consumption = {
  id: number;
  date: number;
  day_number: number;
  time_start: string;
  shift_number: number;
  time_end: string;
  consumption: number;
  final_consumption: number;
  gap: number;
  avg_consumption?: number;
  month?: number;
  year?: number;
}