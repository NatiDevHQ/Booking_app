import { DayInfo } from '../types';

// Helper to format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate grid data from Jan 1st to Dec 31st of current year
export const generateGridDates = (): DayInfo[][] => {
  // Normalize "Today" to midnight for accurate day comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = today.getFullYear();
  
  // Start from Jan 1st to ensure the current date is always within the grid
  const startDate = new Date(year, 0, 1); 
  startDate.setHours(0, 0, 0, 0);
  
  // End at Dec 31st
  const endDate = new Date(year, 11, 31);
  endDate.setHours(0, 0, 0, 0);

  // We need to align weeks.
  // We want the grid to start on a Monday to match the "Mon" top label logic effectively.
  // Find the Monday of the week containing start date.
  const startDayOfWeek = startDate.getDay(); // 0=Sun, 1=Mon...
  // ISO week starts Monday (1). 
  // If Start is Tuesday (2), we need to go back 1 day.
  // If Start is Sunday (0), we need to go back 6 days.
  const daysToSubtract = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  
  const gridStartDate = new Date(startDate);
  gridStartDate.setDate(startDate.getDate() - daysToSubtract);

  const weeks: DayInfo[][] = [];
  let currentWeek: DayInfo[] = [];
  let currentDate = new Date(gridStartDate);

  // Generate weeks until we pass the end date
  // Safety break: 400 days max to prevent infinite loops (52 weeks * 7 = 364)
  let loopCount = 0;
  // We continue as long as currentDate <= endDate OR we haven't finished the last week row
  while ((currentDate <= endDate || currentWeek.length > 0) && loopCount < 400) {
    loopCount++;
    
    // Create a clean date object for comparison/storage
    const d = new Date(currentDate);
    d.setHours(0, 0, 0, 0);

    const isFuture = d.getTime() > today.getTime();
    const isToday = d.getTime() === today.getTime();
    
    currentWeek.push({
      date: d,
      dateString: formatDate(d),
      isToday,
      isFuture,
      dayOfWeek: d.getDay()
    });

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
};

export const getMonthLabel = (week: DayInfo[], isFirstWeek: boolean = false): string | null => {
  // Logic: Show month label if the first day of the week is the start of a month 
  // OR if the month changed mid-week, we usually label the week where the majority of days are, 
  // OR standard approach: Label the first week where the 1st of the month appears.
  
  const firstDay = week[0].date;
  
  // If the 1st of the month is within this week, return that month name
  // Iterate through days to see if any is '01'
  for (const day of week) {
    if (day.date.getDate() === 1) {
      return day.date.toLocaleString('default', { month: 'short' });
    }
  }
  
  // Special case for the very first week if it doesn't contain the 1st
  // (e.g. May 1st starts on Wed, so the Mon of that week is April)
  if (isFirstWeek) { 
      return firstDay.toLocaleString('default', { month: 'short' });
  }

  return null;
};