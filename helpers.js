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

export function findFutureDays(date) {
  if (!date) return;
  const isNow1 = add(date, { days: 1 });
  const isNow2 = add(date, { days: 2 });
  const isNow3 = add(date, { days: 3 });
  const upcoming = [
    {
      dt: isNow1,
      dayOfWeek: format(isNow1, 'EEEE'),
      date: format(isNow1, 'M-dd-yyyy')
    },
    {
      dt: isNow2,
      dayOfWeek: format(isNow2, 'EEEE'),
      date: format(isNow2, 'M-dd-yyyy')
    },
    {
      dt: isNow3,
      dayOfWeek: format(isNow3, 'EEEE'),
      date: format(isNow3, 'M-dd-yyyy')
    }
  ];

  return upcoming;
}

export function getTidesData(date) {
  if (!date) return;
  const isNow3 = add(date, { days: 3 });
  const monthOfCurrentDate = format(date, 'yyyy-MM');
  const monthOfLatestDate = format(isNow3, 'yyyy-MM');
  let tidesObj = {};

  // check if current month tides are saved
  if (!window.localStorage.getItem(monthOfCurrentDate)) {
    getMonthOfTides(monthOfCurrentDate);
    return;
  }

  // grab the current month of tides
  const currentMonthSaved = JSON.parse(window.localStorage.getItem(monthOfCurrentDate));

  // check if the latest date month = current month date
  if (monthOfCurrentDate !== monthOfLatestDate) {
    // check if latest month tides saved
    if (!window.localStorage.getItem(monthOfLatestDate)) {
      getMonthOfTides(monthOfLatestDate);
      return;
    }

    const futureMonthSaved = JSON.parse(window.localStorage.getItem(monthOfLatestDate));
    tidesObj = { ...currentMonthSaved, ...futureMonthSaved };
  } else {
    tidesObj = { ...currentMonthSaved };
  }
  return tidesObj;
}

export function getTidesMonth(month) {
  // check if current month tides are saved
  if (!window.localStorage.getItem(month)) {
    getMonthOfTides(month);
    return;
  }

  // grab the current month of tides
  const currentMonthSaved = JSON.parse(window.localStorage.getItem(month));
  const tidesObj = { ...currentMonthSaved };
  return tidesObj;
}

export function findDayTides(date, tides) {
  if (!tides || !tides.data) return;
  // if (!tides || !tides.data || typeof tides.data !== 'object') return;
  // console.log(typeof tides.data !== 'object');

  try {
    const getDayTides = tides.data
      .filter(tide => {
        const tideDate = format(new Date(tide.eventTime), 'M-dd-yyyy');
        return tideDate === date;
      })
      .sort((a, b) => a.eventTime < b.eventTime);

    const finalDayTides = getDayTides.map(tides => {
      const { eventTime } = tides;
      const tideTime = format(new Date(eventTime), 'h:mm aaaa');
      // console.log(format(new Date(eventTime), 'h:mm aaaa'));
      return { ...tides, tideTime };
    });
    return finalDayTides;
  } catch (error) {
    console.error(error);
  }
}
