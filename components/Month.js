import { useState, useEffect } from 'react';
import { endOfMonth, format, add } from 'date-fns';
import Tides from './Tides';
import Day from './Day';
import { getTidesMonth, buildDay } from '../helpers';

const Month = ({ month, date }) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [tides, setTides] = useState('');
  const [monthDays, setMonthDays] = useState('');
  const [daySelected, setDaySelected] = useState('');

  function handleDayClick(e) {
    const { day } = e.target.dataset;
    if (day === '00') return;
    const theYear = selectedMonth.slice(3);
    const theMonth = selectedMonth.slice(0, 2);

    const dayDets = buildDay(new Date(theYear, theMonth - 1, day));
    return setDaySelected({ ...dayDets, day });
  }

  function buildMonth(month) {
    if (!selectedMonth) return;
    const theYear = selectedMonth.slice(3);
    const theMonth = selectedMonth.slice(0, 2);
    const startingPosition = new Date(theYear, theMonth - 1, 1).getDay();
    const lastDay = endOfMonth(new Date(theYear, theMonth - 1, 1)).getDate();

    const blanks = [0, 1, 2, 3, 4, 5, 6]
      .filter(val => val < startingPosition)
      .map(val => ({
        currentDay: '00',
        hideMe: true
      }));
    const daysInMonth = [];
    for (let i = 1; i <= lastDay; i++) {
      const currentDay = `000000000${i}`.substr(-2);
      const nextDay = `${theMonth}-${currentDay}-${theYear}`;
      daysInMonth.push({ nextDay, currentDay });
    }
    return [...blanks, ...daysInMonth];
  }

  const handleMonthChange = direction => {
    if (currentMonth === selectedMonth && direction === -1) return;
    const [mm, yyyy] = selectedMonth.split('-');
    const calcMonth = add(new Date(yyyy, Number(mm) - 1, 1), { months: direction });
    const newMonth = format(Date.parse(calcMonth), 'MM-yyyy');
    setDaySelected('');
    return setSelectedMonth(newMonth);
  };

  useEffect(() => {
    async function tidesMonth() {
      const apiMonth = `${selectedMonth.slice(3)}-${selectedMonth.slice(0, 2)}`;
      const tideDets = await getTidesMonth(apiMonth);
      const daysInTheMonth = buildMonth(selectedMonth);
      setTides(tideDets);
      setMonthDays(daysInTheMonth);
    }
    tidesMonth();
  }, [selectedMonth]);

  return (
    <>
      <h3 className="headingText text-lg text-center mb-1">Pick a Date</h3>
      <div className="month p-3 relative m-auto">
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-10 mr-2 ml-2 h-full icon-cheveron-left-circle ${
              currentMonth === selectedMonth ? 'hideMe' : ''
            }`}
            onClick={() => handleMonthChange(-1)}
          >
            <circle cx="12" cy="12" r="10" className="primary" style={{ fill: '#e1c99b' }} />
            <path
              className="secondary"
              d="M13.7 15.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 1.4L10.42 12l3.3 3.3z"
            />
          </svg>
          <h3 className="monthText w-full text-center text-blue-700 text-lg">
            {selectedMonth
              ? format(
                  new Date(selectedMonth.slice(3), selectedMonth.slice(0, 2) - 1, 1),
                  'MMM-yyyy'
                )
              : ''}
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 mr-2 ml-2 h-full icon-cheveron-right-circle"
            onClick={() => handleMonthChange(1)}
          >
            <circle cx="12" cy="12" r="10" className="" style={{ fill: '#e1c99b' }} />
            <path
              className="secondary"
              // style={{ fill: 'transparent' }}
              d="M10.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z"
            />
          </svg>
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
                  data-today={
                    !!(
                      date &&
                      currentMonth === selectedMonth &&
                      dayz.currentDay === date.slice(-7, -5)
                    )
                  }
                  className={`cursor-pointer monthDay bg-white text-center ${
                    dayz.hideMe ? 'hideMe' : ''
                  } ${daySelected.day && daySelected.day === dayz.currentDay ? 'selected' : ''}
                  `}
                >
                  {Number(dayz.currentDay)}
                  {/* <Tides className="" day={dayz.date} tides={tides} /> */}
                </div>
              ))
            : ''}
        </div>
        <div>
          {daySelected ? (
            <div className="singleDay mt-5">
              <Day day={daySelected} color="#057173" tides={tides} />

              <button
                className="text-center flex m-auto pl-3 pr-3 pt-2 pb-2 text-sm"
                onClick={() => setDaySelected('')}
                type="button"
              >
                Close Date
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <style jsx>{`
        .selected {
          border-color: #28dfe2 !important;
        }

        [data-today='true'] {
          background: #e7f4ff !important;
          color: #0081ff;
        }
        button {
          border-radius: 5px;
          background: #ebe0ff;
          color: #421987;
        }
        .singleDay {
          background: linear-gradient(0deg, #fff6d2, #bafff9);
          border-top: 3px solid #28dfe2;
          border-radius: 5px;
        }
        .sep4 {
          top: 1px;
          transform: translateY(-100%) translateY(2px) scale(1, 1);
          transform-origin: top;
        }
        .headingText {
          color: #f0f8ff;
          font-family: 'Open Sans', sans-serif;
        }
        .monthText {
          color: #975a16;
          font-family: 'Open Sans', sans-serif;
        }
        .hideMe {
          opacity: 0;
        }
        .month {
          background: #fff6d2;
          max-width: 325px;
          border-radius: 5px;
        }
        .monthDay {
          width: calc(100% / 7);
          border: 2px solid black;
          border-color: #fff6d2;
          border-radius: 5px;
        }
        @media only screen and (max-width: 485px) {
          .shrinkIt > h1 {
            font-size: 1.25rem;
            margin-left: 0.5rem;
          }
        }
        @media only screen and (min-width: 1024px) {
          .month {
            max-width: 425px;
          }
        }
      `}</style>
    </>
  );
};

export default Month;
