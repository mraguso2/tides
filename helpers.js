import { format, add } from 'date-fns';

export async function getMonthOfTides(month) {
  try {
    const res = await fetch(`/api/tides?month=${month}`);
    const tideInfo = await res.json();
    localStorage.setItem(month, JSON.stringify(tideInfo));
    return tideInfo;
  } catch (error) {
    console.error(error);
  }
}

export function buildDay(datetime = Date.now(), offset = 0) {
  const calcNow = add(datetime, { days: offset });
  return {
    dt: calcNow,
    dayOfWeek: format(calcNow, 'EEEE'),
    date: format(calcNow, 'M-dd-yyyy')
  };
}

export function findFutureDays(date = Date.now()) {
  const isNow1 = buildDay(date, 1);
  const isNow2 = buildDay(date, 2);
  const isNow3 = buildDay(date, 3);

  const upcoming = [isNow1, isNow2, isNow3];

  return upcoming;
}

export async function getTidesData(date = Date.now()) {
  // find out what is 3 days from now
  const isNow3 = add(date, { days: 3 });
  const monthOfCurrentDate = format(date, 'yyyy-MM');
  const monthOfLatestDate = format(isNow3, 'yyyy-MM');
  let tidesObj = {};
  let currentMonth = {};
  let nextMonth = {};

  // check if current month saved
  if (!window.localStorage.getItem(monthOfCurrentDate)) {
    currentMonth = await getMonthOfTides(monthOfCurrentDate);
  } else {
    currentMonth = JSON.parse(window.localStorage.getItem(monthOfCurrentDate));
  }
  // check if you need to get next month
  if (monthOfCurrentDate !== monthOfLatestDate) {
    // check if latest month tides saved
    if (!window.localStorage.getItem(monthOfLatestDate)) {
      nextMonth = await getMonthOfTides(monthOfLatestDate);
    } else {
      nextMonth = JSON.parse(window.localStorage.getItem(monthOfLatestDate));
    }
    tidesObj = { data: [...currentMonth.data, ...nextMonth.data] };
  } else {
    tidesObj = { data: [...currentMonth.data] };
  }

  const data = Array.from(new Set(tidesObj.data.map(a => a.eventTime)))
    .map(eventTime => tidesObj.data.find(a => a.eventTime === eventTime))
    .sort((a, b) => a.eventTime < b.eventTime);

  return { data };
}

export async function getTidesMonth(month) {
  let currentMonth = {};
  // check if current month tides are saved
  if (!window.localStorage.getItem(month)) {
    currentMonth = await getMonthOfTides(month);
  } else {
    // grab the current month of tides
    currentMonth = JSON.parse(window.localStorage.getItem(month));
  }
  const tidesObj = { data: [...currentMonth.data] };
  return tidesObj;
}

export function findDayTides(date, tides) {
  if (!tides || !tides.data) return;

  const getDayTides = tides.data
    .filter(tide => {
      const tideDate = format(new Date(tide.eventTime), 'M-dd-yyyy');
      return tideDate === date;
    })
    .sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime));

  const finalDayTides = getDayTides.map(tides => {
    const { eventTime } = tides;
    const tideTime = format(new Date(eventTime), 'h:mm aaaa');
    return { ...tides, tideTime };
  });
  return finalDayTides;
}
