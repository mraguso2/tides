import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { findDayTides } from '../helpers';

const Tides = ({ date, tides }) => {
  const [dateTides, setDateTides] = useState(findDayTides(date, tides));
  // const [dayTides, setDayTides] = useState('');

  useEffect(() => {
    if (!tides) return;
    const tidy = findDayTides(date, tides);
    setDateTides(tidy);
  }, [tides, date]);

  return (
    <div className="border-2 border-orange-600 p-3 relative">
      <div className="">
        {dateTides
          ? dateTides.map((tide, i) => (
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
