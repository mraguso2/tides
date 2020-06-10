import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Dashboard from './Dashboard';
import Upcoming from './Upcoming';
import Month from './Month';
import { findFutureDays, getTidesData } from '../helpers';

const DateChangeWrapper = () => {
  const [datetime, setDateTime] = useState(Date.now());
  const [date, setDate] = useState(format(Date.now(), 'M-dd-yyyy'));
  const [currentMonth, setCurrentMonth] = useState(format(Date.now(), 'MM-yyyy'));
  const [futureDays, setFutureDays] = useState(findFutureDays(Date.now()));
  const [tides, setTides] = useState('');

  // set the datetime and date every second
  useEffect(() => {
    const everySecond = setInterval(() => {
      setDateTime(Date.now());
      setDate(format(Date.now(), 'M-dd-yyyy'));
      // console.log('tick-tock');
    }, 1000);
    return () => clearInterval(everySecond);
  }, []);

  // run effect when it is a new day
  useEffect(() => {
    const nextDays = findFutureDays(datetime);
    setFutureDays(nextDays);

    const whatMonthIsIt = format(datetime, 'MM-yyyy');
    setCurrentMonth(whatMonthIsIt);
  }, [date]);

  useEffect(() => {
    async function tippyTides() {
      const demTides = await getTidesData(datetime);
      setTides(demTides);
    }
    tippyTides();
  }, [datetime]);

  return (
    <main className="">
      <Dashboard date={date} datetime={datetime} tides={tides} />
      <Upcoming futureDays={futureDays} tides={tides} />
      <Month month={currentMonth} />
      <style jsx>{`
        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          border-bottom: 5px solid #406991;
        }
      `}</style>
    </main>
  );
};

export default DateChangeWrapper;
