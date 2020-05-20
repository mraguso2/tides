import { useState, useEffect } from 'react';
import { format, add } from 'date-fns';
import DateContext from './DateContext';
import Dashboard from './Dashboard';

const DateChangeWrapper = () => {
  function dateIt() {
    const dateForm = 'EEEE M-dd-yyyy h:mm aaaa';
    const isNow = Date.now();
    const currentMonth = format(isNow, 'yyyy-MM');
    const isNow1 = add(isNow, { days: 1 });
    const isNow2 = add(isNow, { days: 2 });
    const isNow3 = add(isNow, { days: 3 });
    const dateInfo = {
      day0: {
        dayOfWeek: format(isNow, 'EEEE'),
        date: format(isNow, 'M-dd-yyyy'),
        time: format(isNow, 'h:mm aaaa')
      },
      day1: {
        dayOfWeek: format(isNow1, 'EEEE'),
        date: format(isNow1, 'M-dd-yyyy')
      },
      day2: {
        dayOfWeek: format(isNow2, 'EEEE'),
        date: format(isNow2, 'M-dd-yyyy')
      },
      day3: {
        dayOfWeek: format(isNow3, 'EEEE'),
        date: format(isNow3, 'M-dd-yyyy')
      }
    };
    const prettyDate = format(isNow, dateForm);
    const dateObj = {
      isNow,
      currentMonth,
      dateInfo,
      prettyDate
    };
    return dateObj;
  }

  const [date, setDate] = useState(dateIt());
  const [tides, setTides] = useState('');

  // set the time every minute
  useEffect(() => {
    const everySecond = setInterval(() => {
      setDate(dateIt());
      // console.log('tick-tock');
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
    if (!localStorage.getItem(monthOfDate)) {
      getMonthOfTides(monthOfDate);
      return;
    }
    const monthSaved = JSON.parse(localStorage.getItem(monthOfDate));
    setTides(monthSaved);
  }, [date]);

  return (
    <DateContext.Provider value={date}>
      <main className="border-2 border-green-600">
        <Dashboard tides={tides} />
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
    </DateContext.Provider>
  );
};

export default DateChangeWrapper;
