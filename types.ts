export interface HabitData {
  [dateString: string]: boolean;
}

export interface DayInfo {
  date: Date;
  dateString: string;
  isToday: boolean;
  isFuture: boolean;
  dayOfWeek: number; // 0-6
}

export interface Grid {
  id: string;
  title: string;
  data: HabitData;
  frequency: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved';
}