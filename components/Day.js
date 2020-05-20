import { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import DateContext from './DateContext';

const Day = ({ tides, offset = 0 }) => {
  const dateObj = useContext(DateContext);
  const { dayOfWeek, date: exactDate } = dateObj.dateInfo[`day${offset}`];

  return (
    <div className="border-2 border-orange-600 p-3 relative">
      <div className="flex">
        <h3 className="headingText text-blue-700 text-md">
          {dayOfWeek}, {exactDate}
        </h3>
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

export default Day;
