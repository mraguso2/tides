import { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import DateContext from './DateContext';
import Day from './Day';

const Dashboard = ({ date, tides }) => {
  const dateObj = useContext(DateContext);

  function findDayTides(date, tides) {
    if (!tides.data) return;

    const dayTides = tides.data.days
      .map(day => day.tides)
      .flat()
      .filter(tide => {
        const tideDate = format(new Date(tide.eventTime), 'M-dd-yyyy');
        return tideDate === date;
      });

    const uniqueDayTides = Array.from(new Set(dayTides.map(a => a.eventTime)))
      .map(eventTime => dayTides.find(a => a.eventTime === eventTime))
      .sort((a, b) => a.eventTime < b.eventTime);

    const finalDayTides = uniqueDayTides.map(tides => {
      const { eventTime } = tides;
      const tideTime = format(new Date(eventTime), 'h:mm aaaa');
      return { ...tides, tideTime };
    });
    return finalDayTides;
  }

  return (
    <div className="border-2 border-orange-600 p-5 relative">
      <div className="flex">
        <h1 className="headingText text-blue-700 ml-2 text-2xl tracking-wide leading-7">
          Today: {dateObj.prettyDate}
        </h1>
      </div>
      <div className="flex justify-between">
        {[1, 2, 3].map(offset => (
          <Day key={offset} tides={tides} offset={offset} />
        ))}
      </div>

      <style jsx>{`
        .headingText {
          font-family: 'Open Sans', sans-serif;
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

export default Dashboard;
