import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Hero from './Hero';

const DateChangeWrapper = () => {
  function dateIt() {
    const dateForm = 'EEEE M-dd-yyyy h:mm aaaa';
    const isNow = Date.now();
    const prettyDate = format(isNow, dateForm);
    const dateObj = {
      isNow,
      prettyDate
    };
    return dateObj;
  }

  // localStorage.getItem('2020-05') ||

  const [date, setDate] = useState(dateIt());
  const [tides, setTides] = useState('');

  // set the time every minute
  useEffect(() => {
    const everySecond = setInterval(() => {
      setDate(dateIt());
      console.log('tick-tock');
    }, 1000);
    return () => clearInterval(everySecond);
  }, []);

  async function getMonthOfTides(month) {
    try {
      const res = await fetch(`/api/tides?month=${month}`);
      const tideInfo = await res.json();
      localStorage.setItem(month, JSON.stringify(tideInfo));
      setTides(tideInfo);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const monthOfDate = format(date.isNow, 'yyyy-MM');
    const monthSaved = localStorage.getItem(monthOfDate);
    if (!monthSaved) {
      console.log('no month saved');
      getMonthOfTides(monthOfDate);
      return;
    }
    console.log('month found');
  }, [date]);

  return (
    <main className="border-2 border-green-600">
      <Hero date={date.prettyDate} />
      <style jsx>{`
        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          // align-items: center;
        }
      `}</style>
    </main>
  );
};

export default DateChangeWrapper;
