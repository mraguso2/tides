import { useState, useEffect } from 'react';
import { endOfMonth, format } from 'date-fns';
import Tides from './Tides';
import Day from './Day';
import { getTidesMonth, buildDay } from '../helpers';

const Month = ({ month }) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [tides, setTides] = useState('');
  const [monthDays, setMonthDays] = useState('');
  const [daySelected, setDaySelected] = useState('');

  function handleDayClick(e) {
    const { day } = e.target.dataset;
    if (day === '00') return;
    const currentYear = month.slice(3);
    const currentMonth = month.slice(0, 2);

    const dayDets = buildDay(new Date(currentYear, currentMonth - 1, day));
    return setDaySelected(dayDets);
  }

  function buildMonth(month) {
    if (!month) return;
    const currentYear = month.slice(3);
    const currentMonth = month.slice(0, 2);
    const startingPosition = new Date(currentYear, currentMonth - 1, 1).getDay();
    const lastDay = endOfMonth(new Date(currentYear, currentMonth - 1, 1)).getDate();

    const blanks = [0, 1, 2, 3, 4, 5, 6]
      .filter(val => val < startingPosition)
      .map(val => ({
        currentDay: '00',
        hideMe: true
      }));
    const daysInMonth = [];
    for (let i = 1; i <= lastDay; i++) {
      const currentDay = `000000000${i}`.substr(-2);
      const nextDay = `${currentMonth}-${currentDay}-${currentYear}`;
      daysInMonth.push({ nextDay, currentDay });
    }
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
      <div className="flex">
        <p className="monthDay text-center text-gray-700 text-sm">Sun</p>
        <p className="monthDay text-center text-gray-700 text-sm">Mon</p>
        <p className="monthDay text-center text-gray-700 text-sm">Tue</p>
        <p className="monthDay text-center text-gray-700 text-sm">Wed</p>
        <p className="monthDay text-center text-gray-700 text-sm">Thu</p>
        <p className="monthDay text-center text-gray-700 text-sm">Fri</p>
        <p className="monthDay text-center text-gray-700 text-sm">Sat</p>
      </div>
      <div onClick={e => handleDayClick(e)} className="flex flex-wrap" role="grid">
        {monthDays
          ? monthDays.map((dayz, i) => (
              <div
                key={i}
                data-day={dayz.currentDay}
                className={`cursor-pointer monthDay bg-white border border-solid border-gray-200 ${
                  dayz.hideMe ? 'hideMe' : ''
                }`}
              >
                {Number(dayz.currentDay)}
                {/* <Tides className="" day={dayz.date} tides={tides} /> */}
              </div>
            ))
          : ''}
      </div>
      {daySelected ? <Day day={daySelected} tides={tides} /> : ''}
      {daySelected ? (
        <button onClick={() => setDaySelected('')} type="button">
          Clear Date
        </button>
      ) : (
        ''
      )}

      <style jsx>{`
        .hideMe {
          opacity: 0;
        }
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
