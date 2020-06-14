import { useState, useEffect } from 'react';
import { endOfMonth, format } from 'date-fns';
import Tides from './Tides';
import Day from './Day';
import { getTidesMonth, buildDay } from '../helpers';

const Month = ({ month, date }) => {
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
    return setDaySelected({ ...dayDets, day });
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
    <>
      <h3 className="headingText text-lg text-center mb-1">Pick a Date</h3>
      <div className="month p-3 relative m-auto">
        <div className="flex">
          <h3 className="monthText w-full text-center text-blue-700 text-md">
            {month ? format(new Date(month.slice(3), month.slice(0, 2) - 1, 1), 'MMM-yyyy') : ''}
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
                  data-today={!!(date && dayz.currentDay === date.slice(-7, -5))}
                  className={`cursor-pointer monthDay bg-white text-center ${
                    dayz.hideMe ? 'hideMe' : ''
                  } ${daySelected.day && daySelected.day === dayz.currentDay ? 'selected' : ''}
                  ${dayz.currentDay === new Date().getDate() ? 'today' : ''}`}
                >
                  {Number(dayz.currentDay)}
                  {/* <Tides className="" day={dayz.date} tides={tides} /> */}
                </div>
              ))
            : ''}
        </div>
        <div>
          {/* {daySelected ? (
            <div className="row green2">
              <div>
                <svg
                  id=""
                  preserveAspectRatio="xMidYMax meet"
                  className="svg-separator sep4 relative"
                  viewBox="0 0 1600 200"
                  style={{ display: 'block' }}
                >
                  <polygon
                    className=""
                    style={{ fill: 'rgb(27, 188, 155)' }}
                    points="886,86 800,172 714,86 -4,86 -4,204 1604,204 1604,86 "
                  />
                  <polygon
                    className=""
                    style={{ opacity: 1, fill: '#0e9382' }}
                    points="800,172 886,86 900,86 800,186 700,86 714,86 "
                  />
                  <polygon
                    className=""
                    style={{ opacity: 1, fill: '#14a084' }}
                    points="800,162 876,86 888,86 800,174 712,86 724,86 "
                  />
                </svg>
              </div>
            </div>
          ) : (
            ''
          )} */}
          {daySelected ? (
            <div className="singleDay mt-5">
              <Day day={daySelected} color="#057173" tides={tides} />

              <button
                className="text-center flex m-auto pl-3 pr-3 pt-2 pb-2 text-sm"
                onClick={() => setDaySelected('')}
                type="button"
              >
                Clear Date
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
      `}</style>
    </>
  );
};

export default Month;
