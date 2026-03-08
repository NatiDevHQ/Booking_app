export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'cancelled';
}

export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM"
];