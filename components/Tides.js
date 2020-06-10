import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { findDayTides } from '../helpers';

const Tides = ({ date, size = 'sm', padding = '3', tides }) => {
  const [dateTides, setDateTides] = useState(findDayTides(date, tides));
  // const [dayTides, setDayTides] = useState('');

  useEffect(() => {
    if (!tides) return;
    const tidy = findDayTides(date, tides);
    setDateTides(tidy);
  }, [tides, date]);

  return (
    <div className={`p-${padding} relative`}>
      <div className="">
        {/* {console.log(dateTides)} */}
        {dateTides
          ? dateTides.map((tide, i) => (
              <p key={i} className={`tideText text-blue-700 text-${size}`}>
                {tide.type}: <span className="">{tide.tideTime}</span>
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
