import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const NextTideUp = ({ nextTide, date }) => {
  const [nextTideDets, setNextTideDets] = useState('');

  useEffect(() => {
    if (nextTide.eventTime) {
      const tideTime = format(new Date(nextTide.eventTime), 'h:mm aaaa');
      const tideDate = format(new Date(nextTide.eventTime), 'M-dd-yyyy');
      setNextTideDets({ tideTime, tideDate });
    }
  }, [nextTide]);

  return (
    <div className="flex justify-center items-center p-2 pl-1 pr-1 m-2 mb-4 bg-white nextTideUp">
      <p>
        Next Tide: {nextTide.type} @ {nextTideDets.tideTime}{' '}
        <em className="text-sm text-gray-600">
          {date !== nextTideDets.tideDate ? 'Tomorrow' : ''}
        </em>
      </p>
      <style jsx>{`
        .nextTideUp {
          border-radius: 5px;
          color: rgb(34, 49, 63);
        }
      `}</style>
    </div>
  );
};

export default NextTideUp;
