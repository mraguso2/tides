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
    <div className={`p-${padding} relative bg-white tideContainer`}>
      <div className="w-32 m-auto">
        {/* {console.log(dateTides)} */}
        {dateTides
          ? dateTides.map((tide, i) => (
              <p
                key={i}
                className={`flex justify-between tideText text-blue-700 text-${size} ${tide.type.toLowerCase()}`}
              >
                {tide.type}: <span className="">{tide.tideTime}</span>
              </p>
            ))
          : ''}
      </div>
      <style jsx>{`
        .tideContainer {
          // box-shadow: 0px 5px 20px rgba(103, 151, 203, 0.2);
          border-radius: 5px;
          max-width: 175px;
        }
        .tideText {
          font-family: 'Open Sans', sans-serif;
          padding: 0 5px;
        }
        .tideText.high {
          background: #d1fff0;
          background: #e2e8f0;
          background: #d7e7fd;
          background: #fffde6;
        }
        .tideText.low {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default Tides;
