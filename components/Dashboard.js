import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Tides from './Tides';

const Dashboard = ({ date, datetime, tides }) => {
  const [dateForms, setDateForms] = useState('');
  const [tideStatus, setTideStatus] = useState('');

  useEffect(() => {
    const dayOfWeek = format(datetime, 'EEEE');
    const time = format(datetime, 'h:mm');
    const seconds = format(datetime, 'ss');
    const ampm = format(datetime, 'aaaa');
    const dateDets = {
      dayOfWeek,
      date,
      time,
      seconds,
      ampm
    };
    setDateForms(dateDets);
  }, [datetime]);

  return (
    <div className="dash relative">
      <div className="flex flex-col">
        <div className="flex justify-between pt-2 pb-4">
          <div>
            <h1 className="headingText pt-1 text-gray-700 ml-2 text-xl tracking-wide leading-7">
              {dateForms.dayOfWeek}, {date} <br />
            </h1>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-time">
                <circle cx="12" cy="12" r="10" className="primary" />
                <path
                  className="secondary"
                  d="M13 11.59l3.2 3.2a1 1 0 0 1-1.4 1.42l-3.5-3.5A1 1 0 0 1 11 12V7a1 1 0 0 1 2 0v4.59z"
                />
              </svg>
              <p className="text-gray-700 text-lg">
                {dateForms.time}:
                <span className="sec text-base text-gray-600">{dateForms.seconds}</span>{' '}
                {dateForms.ampm}
              </p>
            </div>
          </div>
          <p className="pill text-sm">Today</p>
        </div>
        <div className="flex justify-between">
          <div className="tideStatusText flex justify-center items-center text-center p-1 relative w-40">
            **Tides are currently falling** <br />
            (currently Static)
          </div>
          <Tides date={date} size="sm" padding="1" tides={tides} />
        </div>
      </div>
      <style jsx>{`
        .sec {
          width: 20px;
          display: inline-block;
        }
        .tideStatusText {
          color: #406991;
        }
        .pill {
          padding: 0.1rem 0.15rem;
          background: #3ebd93;
          width: 70px;
          height: 35px;
          display: flex;
          justify-content: center;
          border-radius: 18px;
          border: 5px solid #8eedc7;
          color: #effcf6;
          letter-spacing: 0.5px;
        }
        p.pill {
          animation-duration: 1.5s;
          animation-name: blink;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        @keyframes blink {
          from {
            border-color: #8eedc7;
          }

          to {
            border-color: aliceblue;
          }
        }
        .icon-time {
          width: 20px;
          margin: 0 0.35rem 0 0.35rem;
        }
        .primary {
          fill: #cfbcf2;
        }
        .secondary {
          fill: #421987;
        }
        .headingText {
          font-family: 'Open Sans', sans-serif;
        }
        .dash {
          padding: 0.75rem;
          margin: auto auto 2rem auto;
          min-width: 335px;
          border-radius: 5px;
          position: relative;
          background: aliceblue;
          box-shadow: 0px 5px 20px rgba(108, 137, 160, 0.7);
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
