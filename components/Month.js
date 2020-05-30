import { useState, useEffect } from 'react';
import { endOfMonth, format } from 'date-fns';
import Tides from './Tides';
import { getTidesMonth } from '../helpers';

const Month = ({ month }) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [tides, setTides] = useState('');
  const [monthDays, setMonthDays] = useState('');

  function buildMonth(month) {
    if (!month) return;
    const currentYear = month.slice(3);
    const currentMonth = month.slice(0, 2);
    // const firstExactDay = `${month.slice(0, 3)}01-${month.slice(3)}`;
    const startingPosition = new Date(currentYear, currentMonth - 1, 1).getDay();
    const lastDay = endOfMonth(new Date(currentYear, currentMonth - 1, 1)).getDate();

    const blanks = [0, 1, 2, 3, 4, 5, 6]
      .filter(val => val < startingPosition)
      .map(val => ({
        currentDay: '00'
      }));
    const daysInMonth = [];
    for (let i = 1; i <= lastDay; i++) {
      const currentDay = `000000000${i}`.substr(-2);
      const nextDay = `${currentMonth}-${currentDay}-${currentYear}`;
      daysInMonth.push({ nextDay, currentDay });
    }
    console.log(blanks);
    return [...blanks, ...daysInMonth];
  }

  useEffect(() => {
    async function tidesMonth() {
      const apiMonth = `${month.slice(3)}-${month.slice(0, 2)}`;
      const tideDets = await getTidesMonth(apiMonth);
      const daysInTheMonth = buildMonth(selectedMonth);
      setTides(tideDets);
      setMonthDays(daysInTheMonth);
    }
    tidesMonth();
  }, [selectedMonth]);

  return (
    <div className="border-2 border-orange-600 p-3 relative">
      <div className="flex">
        <h3 className="headingText w-full text-center text-blue-700 text-md">
          {month ? format(new Date(month.slice(3), month.slice(0, 2), 1), 'MMM-yyyy') : ''}
        </h3>
      </div>
      <div className="flex flex-wrap">
        {monthDays
          ? monthDays.map((dayz, i) => (
              <div key={i} className="monthDay bg-white border border-solid border-gray-200">
                {dayz.currentDay}
              </div>
            ))
          : ''}
      </div>
      {/* <Tides day={day.date} tides={tides} /> */}

      <style jsx>{`
        .headingText {
          font-family: 'Open Sans', sans-serif;
        }
        .monthDay {
          width: calc(100% / 7);
        }
        @media only screen and (max-width: 485px) {
          .shrinkIt > h1 {
            font-size: 1.25rem;
            margin-left: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Month;
