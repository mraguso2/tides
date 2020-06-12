import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Tides from './Tides';

const Dashboard = ({ date, datetime, tides }) => {
  const [dateForms, setDateForms] = useState('');
  const [theTime, setTime] = useState(format(datetime, 'h:mm'));
  const [tideStatus, setTideStatus] = useState(' ');

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
    setTime(time);
  }, [datetime]);

  useEffect(() => {
    if (!tides || !tides.data) return;

    const dt = datetime;

    const sortedTidesWithNow = tides.data
      .map(tide => {
        const tideDt = Date.parse(tide.eventTime);
        return { ...tide, tideDt };
      })
      .concat({ now: true, tideDt: dt })
      .sort((a, b) => a.tideDt - b.tideDt);

    const nowIndex = sortedTidesWithNow.findIndex(t => t.now);

    let status;
    if (nowIndex === 0) {
      status = sortedTidesWithNow[1].type === 'Low' ? 'Falling' : 'Rising';
    } else {
      status = sortedTidesWithNow[nowIndex - 1].type === 'Low' ? 'Rising' : 'Falling';
    }
    setTideStatus(status);
  }, [datetime]);

  return (
    <div className="dash relative">
      <div className="flex flex-col">
        <div className="flex justify-between pt-3 pb-4">
          <div>
            <h1 className="headingText text-gray-700 text-lg tracking-wide leading-7">
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
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-between items-center text-center p-1 relative w-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-12 icon-arrow absolute top-0 right-0"
            >
              <circle cx="12" cy="12" r="10" className="primaryArrow" />
              <path
                className={`secondaryArrow ${tideStatus === 'Rising' ? '' : 'hideMe'}`}
                d="M13 9.41V17a1 1 0 0 1-2 0V9.41l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.42L13 9.4z"
              />
              <path
                className={`secondaryArrow ${tideStatus === 'Falling' ? '' : 'hideMe'}`}
                d="M11 14.59V7a1 1 0 0 1 2 0v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42l2.3 2.3z"
              />
            </svg>
            <p className="tideStatusText mr-12">
              Tides are currently <br />
              <span className="bg-white status mt-1 inline-block">{tideStatus}</span>
            </p>
          </div>
          <Tides date={date} size="base" padding="1" tides={tides} />
        </div>
      </div>
      <style jsx>{`
        .sec {
          width: 20px;
          display: inline-block;
        }
        .tideStatusText {
          color: #406991;
          width: 100px;
        }
        .status {
          padding: 3px 10px;
          border-radius: 5px;
          box-shadow: inset 0px 0px 5px rgba(34, 49, 64, 0.19);
          color: #057173;
        }
        .hideMe {
          opacity: 0;
        }
        .pill {
          padding: 0.1rem 0.15rem;
          background: #acffe3;
          width: 70px;
          height: 27px;
          // height: 35px;
          display: flex;
          justify-content: center;
          border-radius: 18px;
          // border: 5px solid #8eedc7;
          color: #00814f;
          letter-spacing: 0.5px;
          position: relative;
          top: -15px;
        }
        // p.pill {
        //   animation-duration: 1.25s;
        //   animation-name: blink;
        //   animation-iteration-count: infinite;
        //   animation-direction: alternate;
        // }

        @keyframes blink {
          from {
            border-color: #8eedc7;
          }

          to {
            border-color: aliceblue;
          }
        }
        .icon-arrow {
          top: 5px;
        }
        svg.icon-arrow {
          animation-duration: 1.65s;
          animation-name: slide;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        @keyframes slide {
          from {
            top: 10px;
          }
          to {
            top: 25px;
          }
        }
        .primaryArrow {
          fill: #abfdff;
        }
        .secondaryArrow {
          fill: #057173;
        }
        .icon-time {
          width: 20px;
          margin: 0 0.35rem 0 0rem;
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
          margin: auto auto 3rem auto;
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
