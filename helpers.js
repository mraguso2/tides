import { format, add } from 'date-fns';
import allTideData from './Data/tidesDataCombined.json';

export function getMonthOfTides(month) {
  const tideInfo = allTideData.data[`mm_${month}`];
  // const now = new Date();
  localStorage.setItem(month, JSON.stringify(tideInfo));
  return tideInfo;
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

function tidesForTheMonth(monthValue) {
  let monthTides;
  if (!window.localStorage.getItem(monthValue)) {
    monthTides = getMonthOfTides(monthValue);
  } else {
    monthTides = JSON.parse(window.localStorage.getItem(monthValue));
  }
  return monthTides;
}

function comboTides(curr = {}, next = {}) {
  const tidys = { data: [...curr, ...next] };
  return tidys;
}

export function getTidesData(date = Date.now()) {
  // find out what is 3 days from now
  const isNow3 = add(date, { days: 3 });
  const monthOfCurrentDate = format(date, 'yyyy-MM');
  const monthOfLatestDate = format(isNow3, 'yyyy-MM');
  let nextMonth = [];

  // check if current month saved
  const currentMonth = tidesForTheMonth(monthOfCurrentDate);

  // check if you need to get next month
  if (monthOfCurrentDate !== monthOfLatestDate) {
    // check if latest month tides saved
    nextMonth = tidesForTheMonth(monthOfLatestDate);
  }

  const tidesObj = comboTides(currentMonth, nextMonth);

  const data = Array.from(new Set(tidesObj.data.map(a => a.eventTime)))
    .map(eventTime => tidesObj.data.find(a => a.eventTime === eventTime))
    .sort((a, b) => a.eventTime < b.eventTime);

  return { data };
}

export function getTidesMonth(month) {
  const currentMonth = tidesForTheMonth(month);
  const tidesObj = { data: [...currentMonth] };
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
