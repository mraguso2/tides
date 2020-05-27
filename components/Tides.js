import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { findDayTides } from '../helpers';

const Tides = ({ day, tides }) => {
  // const [dayTides, setDayTides] = useState(findDayTides(day, tides));
  const [dayTides, setDayTides] = useState('');

  useEffect(() => {
    const tidy = findDayTides(day, tides);
    setDayTides(tidy);
  }, [tides]);

  return (
    <div className="border-2 border-orange-600 p-3 relative">
      <div className="">
        {dayTides
          ? dayTides.map((tide, i) => (
              <p key={i} className="tideText text-blue-700 text-sm">
                {tide.type}: {tide.tideTime}
              </p>
            ))
          : ''}
      </div>
      <style jsx>{`
        .tideText {
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Tides;
