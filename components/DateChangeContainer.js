import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Dashboard from './Dashboard';
import Upcoming from './Upcoming';
import Month from './Month';
import { findFutureDays, getTidesData } from '../helpers';

const DateChangeWrapper = () => {
  const [datetime, setDateTime] = useState(Date.now());
  const [dayNow, setDateDayNow] = useState(format(Date.now(), 'M-dd-yyyy'));
  const [currentMonth, setCurrentMonth] = useState(format(Date.now(), 'MM-yyyy'));
  const [futureDays, setFutureDays] = useState(findFutureDays(Date.now()));
  const [tides, setTides] = useState('');

  // set the datetime and date every second
  useEffect(() => {
    const everySecond = setInterval(() => {
      setDateTime(Date.now());
      setDateDayNow(format(Date.now(), 'M-dd-yyyy'));
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
  }, [dayNow]);

  useEffect(() => {
    const demTides = getTidesData(datetime);
    setTides(demTides);
  }, [datetime]);

  return (
    <main className="border-2 border-green-600">
      <Dashboard day={dayNow} tides={tides} />
      <Upcoming futureDays={futureDays} tides={tides} />
      <Month month={currentMonth} />
      <style jsx>{`
        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </main>
  );
};

export default DateChangeWrapper;
