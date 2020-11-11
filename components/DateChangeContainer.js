import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Dashboard from './Dashboard';
import Upcoming from './Upcoming';
import Month from './Month';
import { findFutureDays, getTidesData } from '../helpers';

const DateChangeWrapper = () => {
  const [datetime, setDateTime] = useState(Date.now());
  const [date, setDate] = useState(format(Date.now(), 'M-dd-yyyy'));
  const [currentMonth, setCurrentMonth] = useState(format(Date.now(), 'MM-yyyy'));
  const [futureDays, setFutureDays] = useState(findFutureDays(Date.now()));
  const [tides, setTides] = useState('');

  // set the datetime and date every second
  useEffect(() => {
    const everySecond = setInterval(() => {
      setDateTime(Date.now());
      setDate(format(Date.now(), 'M-dd-yyyy'));
      // console.log('tick-tock');
    }, 1000);
    return () => clearInterval(everySecond);
  }, []);

  // run effect when it is a new day
  useEffect(() => {
    const nextDays = findFutureDays(datetime);
    setFutureDays(nextDays);

    const whatMonthIsIt = format(datetime, 'MM-yyyy');
    setCurrentMonth(whatMonthIsIt);
  }, [date]);

  useEffect(() => {
    function tippyTides() {
      const demTides = getTidesData(datetime);
      setTides(demTides);
    }
    tippyTides();
  }, [datetime]);

  return (
    <main className="relative">
      <svg
        id="anchor"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="heroicon-anchor heroicon heroicons-lg"
      >
        <path
          className="heroicon-anchor-body heroicon-component-fill"
          fill="#FFFFFF"
          d="M55 20.8V75a10 10 0 0 0 10 10h1a14 14 0 0 0 14-14 2 2 0 0 0-2-2h-6l1.33-2L86 48l2-3v26a24 24 0 0 1-24 24h-7c-1.1 0-2.63.63-3.42 1.42l-2.17 2.17L50 100l-1.41-1.41-2.17-2.17A5.56 5.56 0 0 0 43 95h-7a24 24 0 0 1-24-24V45l2 3 12.67 19L28 69h-6a2 2 0 0 0-2 2 14 14 0 0 0 14 14h1a10 10 0 0 0 10-10V20.8a11 11 0 1 1 10 0zM50 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
        />
        <rect
          className="heroicon-anchor-stock heroicon-component-accent heroicon-component-fill"
          width="60"
          height="12"
          x="20"
          y="27"
          fill="#7ACFC0"
          rx="4"
        />
        <path
          className="heroicon-anchor-hoops heroicon-component-fill"
          fill="#FFFFFF"
          d="M26 28c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V28zm42 0c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V28z"
        />
        <rect
          className="heroicon-shadows"
          width="10"
          height="4"
          x="45"
          y="39"
          fill="#000000"
          opacity=".2"
        />
        <path
          className="heroicon-outline"
          fill="#4A4A4A"
          fillRule="nonzero"
          d="M68.27 27A2 2 0 0 1 70 26h2a2 2 0 0 1 1.73 1H76a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-2.27A2 2 0 0 1 72 40h-2a2 2 0 0 1-1.73-1H55v36a10 10 0 0 0 10 10h1a14 14 0 0 0 14-14 2 2 0 0 0-2-2h-6l1.33-2L86 48l2-3v26a24 24 0 0 1-24 24h-7c-1.1 0-2.63.63-3.42 1.42l-2.17 2.17L50 100l-1.41-1.41-2.17-2.17A5.56 5.56 0 0 0 43 95h-7a24 24 0 0 1-24-24V45l2 3 12.67 19L28 69h-6a2 2 0 0 0-2 2 14 14 0 0 0 14 14h1a10 10 0 0 0 10-10V39H31.73A2 2 0 0 1 30 40h-2a2 2 0 0 1-1.73-1H24a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4h2.27A2 2 0 0 1 28 26h2a2 2 0 0 1 1.73 1H45v-6.2a11 11 0 1 1 10 0V27h13.27zm-14.18-7.98a9 9 0 1 0-8.18 0l1.09.56V27h6v-7.42l1.09-.56zM32 29v2h5v1h-5v5h36v-2H58v-1h10v-5H32zm42 0v5h4v-3a2 2 0 0 0-2-2h-2zm0 8h2a2 2 0 0 0 2-2h-4v2zm-50-8a2 2 0 0 0-2 2h4v-2h-2zm-2 3v3c0 1.1.9 2 2 2h2v-5h-4zm25 43a12 12 0 0 1-12 12h-1a16 16 0 0 1-16-16 4 4 0 0 1 4-4h2.26L14 51.6V71a22 22 0 0 0 22 22h7c1.63 0 3.68.85 4.83 2L50 97.18l2.17-2.16C53.33 93.84 55.37 93 57 93h7a22 22 0 0 0 22-22V51.6L75.74 67H78a4 4 0 0 1 4 4 16 16 0 0 1-16 16h-1a12 12 0 0 1-12-12V39h-4v3h-1v-3h-1v36zM28 28v10h2V28h-2zm42 0v10h2V28h-2zM54 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0-9v1a6 6 0 0 0-5.37 8.68l-.9.45A7 7 0 0 1 50 4zm-7 28h-4v-1h4v1zm6 14v20h-1V46h1zM16 57v8h-1v-8h1zm48 34v1h-6v-1h6z"
        />
      </svg>
      <svg
        id="buoy"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="heroicon-buoy heroicon heroicons-lg"
      >
        <path
          className="heroicon-buoy-markers heroicon-component-accent heroicon-component-fill"
          fill="#7ACFC0"
          d="M50 2c3.83 0 7.46.43 11 1.26l-6.48 23.17A25 25 0 0 0 50 26a25 25 0 0 0-4.52.43L38.99 3.26A47.22 47.22 0 0 1 50 2zM2 50c0-3.83.43-7.46 1.26-11l23.17 6.48A24.98 24.98 0 0 0 26 50c0 1.51.16 3.05.43 4.52L3.26 61.01A47.21 47.21 0 0 1 2 50zm96 0c0 3.83-.43 7.46-1.26 11l-23.17-6.48c.27-1.47.43-3 .43-4.52 0-1.51-.16-3.05-.43-4.52l23.17-6.49A47.21 47.21 0 0 1 98 50zM54.52 73.57l6.49 23.17A47.21 47.21 0 0 1 50 98c-3.83 0-7.46-.43-11-1.26l6.48-23.17A25 25 0 0 0 50 74a25 25 0 0 0 4.52-.43z"
        />
        <path
          className="heroicon-buoy-floater heroicon-component-fill"
          fill="#FFFFFF"
          d="M57.01 24.96l5.4-19.27a46.1 46.1 0 0 1 31.9 31.9L75.04 43a26.05 26.05 0 0 0-18.03-18.03zm0 50.08a26.05 26.05 0 0 0 18.03-18.03l19.27 5.4a46.1 46.1 0 0 1-31.9 31.9L57 75.04zM24.96 57.01a26.05 26.05 0 0 0 18.03 18.03l-5.4 19.27A46.1 46.1 0 0 1 5.7 62.4L24.96 57zm18.03-32.05a26.05 26.05 0 0 0-18.03 18.03l-19.27-5.4A46.1 46.1 0 0 1 37.6 5.7L43 24.96z"
        />
        <path
          className="heroicon-buoy-rope heroicon-component-accent heroicon-component-fill"
          fill="#7ACFC0"
          d="M97 36.84l-.77.21a47.6 47.6 0 0 0-.23-.8V22A18 18 0 0 0 78 4H63.76l-.81-.23.21-.77H78a19 19 0 0 1 19 19v14.84zM63.16 97l-.21-.77.8-.23H78a18 18 0 0 0 18-18V63.76l.23-.81.77.21V78a19 19 0 0 1-19 19H63.16zM3 63.16l.77-.21.23.8V78a18 18 0 0 0 18 18h14.24l.81.23-.21.77H22A19 19 0 0 1 3 78V63.16zm34.05-59.4l-.8.24H22A18 18 0 0 0 4 22v14.24l-.23.81-.77-.21V22A19 19 0 0 1 22 3h14.84l.21.77z"
        />
        <path
          className="heroicon-shadows"
          fill="#000000"
          d="M93.11 62.07c.24-.62.46-1.25.66-1.89l1.03.29A46.07 46.07 0 0 1 60.47 94.8l-1.06-3.76a46.08 46.08 0 0 0 32.2-25.4l-17.88-5a25.8 25.8 0 0 0 1.31-3.63l18.07 5.06zm-86.22 0c-.24-.62-.46-1.25-.66-1.89l-1.03.29A46.07 46.07 0 0 0 39.53 94.8l1.06-3.76a46.08 46.08 0 0 1-32.2-25.4l17.88-5a25.8 25.8 0 0 1-1.31-3.63L6.89 62.07zM75.97 44.8a26.01 26.01 0 0 0-19.85-24.08l-1.05 3.77A26.03 26.03 0 0 1 75.5 44.93l.46-.13zm-51.94 0a26.01 26.01 0 0 1 19.85-24.08l1.05 3.77A26.03 26.03 0 0 0 24.5 44.93l-.46-.13zm32.09-24.08a26.07 26.07 0 0 0-12.24 0l1.6 5.71A25 25 0 0 1 50 26a25 25 0 0 1 4.52.43l1.6-5.7zm3.3 70.32a46.2 46.2 0 0 1-18.83 0l-1.6 5.7C42.54 97.57 46.17 98 50 98s7.46-.43 11-1.26l-1.59-5.7z"
          opacity=".2"
        />
        <path
          className="heroicon-outline"
          fill="#4A4A4A"
          fillRule="nonzero"
          d="M98 63.44V78a20 20 0 0 1-20 20H63.44l.05.16A49.55 49.55 0 0 1 50 100a50.14 50.14 0 0 1-13.48-1.84l.04-.16H22A20 20 0 0 1 2 78V63.44l-.16.04A49.64 49.64 0 0 1 0 50a50.13 50.13 0 0 1 1.84-13.48l.16.04V22A20 20 0 0 1 22 2h14.56l-.05-.16A49.64 49.64 0 0 1 50 0a50.14 50.14 0 0 1 13.48 1.84l-.04.16H78a20 20 0 0 1 20 20v14.56l.16-.04A49.55 49.55 0 0 1 100 50a50.13 50.13 0 0 1-1.84 13.48l-.16-.04zM50 2c-3.83 0-7.46.43-11 1.26l6.48 23.17A25 25 0 0 1 50 26a25 25 0 0 1 4.52.43l6.49-23.17A47.22 47.22 0 0 0 50 2zm7.01 22.96a26.05 26.05 0 0 1 18.03 18.03l19.27-5.4A46.1 46.1 0 0 0 62.4 5.7L57 24.96zM97 36.84V22A19 19 0 0 0 78 3H63.16l-.21.77.8.23H78a18 18 0 0 1 18 18v14.24l.23.81.77-.21zM95 22A17 17 0 0 0 78 5H66.74A48.15 48.15 0 0 1 95 33.26V22zm-38.53 4.88l-.54 1.93a22.02 22.02 0 0 0-11.86 0l-.54-1.93a24.05 24.05 0 0 0-16.65 16.65l1.93.54a22.02 22.02 0 0 0 0 11.86l-1.93.54a24.05 24.05 0 0 0 16.65 16.65l.54-1.93a22.02 22.02 0 0 0 11.86 0l.54 1.93a24.05 24.05 0 0 0 16.65-16.65l-1.93-.54a22.02 22.02 0 0 0 0-11.86l1.93-.54a24.05 24.05 0 0 0-16.65-16.65zm.54 48.16l5.4 19.27a46.1 46.1 0 0 0 31.9-31.9L75.04 57a26.05 26.05 0 0 1-18.03 18.03zM66.74 95H78a17 17 0 0 0 17-17V66.74A48.15 48.15 0 0 1 66.74 95zm-3.58 2H78a19 19 0 0 0 19-19V63.16l-.77-.21-.23.8V78a18 18 0 0 1-18 18H63.76l-.81.23.21.77zm-38.2-39.99l-19.27 5.4a46.1 46.1 0 0 0 31.9 31.9L43 75.04a26.05 26.05 0 0 1-18.03-18.03zM5 66.74V78a17 17 0 0 0 17 17h11.26A48.15 48.15 0 0 1 5 66.74zm-2-3.58V78a19 19 0 0 0 19 19h14.84l.21-.77-.8-.23H22A18 18 0 0 1 4 78V63.76l-.23-.81-.77.21zm39.99-38.2l-5.4-19.27A46.1 46.1 0 0 0 5.7 37.6L24.96 43a26.05 26.05 0 0 1 18.03-18.03zM33.26 5H22A17 17 0 0 0 5 22v11.26A48.15 48.15 0 0 1 33.26 5zm3.8-1.23L36.83 3H22A19 19 0 0 0 3 22v14.84l.77.21.23-.8V22A18 18 0 0 1 22 4h14.24l.81-.23zM2 50c0 3.83.43 7.46 1.26 11l23.17-6.48A24.98 24.98 0 0 1 26 50c0-1.51.16-3.05.43-4.52L3.26 38.99A47.21 47.21 0 0 0 2 50zm96 0c0-3.83-.43-7.46-1.26-11l-23.17 6.48c.27 1.47.43 3 .43 4.52 0 1.51-.16 3.05-.43 4.52l23.17 6.49A47.21 47.21 0 0 0 98 50zM54.52 73.57A25 25 0 0 1 50 74a25 25 0 0 1-4.52-.43l-6.49 23.17C42.54 97.57 46.17 98 50 98s7.46-.43 11-1.26l-6.48-23.17zM50 6c2.77 0 5.48.26 8.11.75l-.27.96a43.25 43.25 0 0 0-15.68 0l-.27-.96C44.52 6.25 47.23 6 50 6zM7.71 57.84l-.96.27a44.25 44.25 0 0 1 0-16.22l.96.27a43.24 43.24 0 0 0 0 15.68zM92.3 42.16l.96-.27a44.25 44.25 0 0 1 0 16.22l-.96-.27a43.25 43.25 0 0 0 0-15.68zM57.84 92.29l.27.96a44.24 44.24 0 0 1-16.22 0l.27-.96a43.24 43.24 0 0 0 15.68 0z"
        />
      </svg>
      <Dashboard date={date} datetime={datetime} tides={tides} />
      <Upcoming futureDays={futureDays} tides={tides} />
      <Month month={currentMonth} date={date} />
      <style jsx>{`
        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          border-bottom: 5px solid #406991;
        }
        #anchor {
          position: absolute;
          width: 15rem;
          height: 15rem;
          opacity: 0;
          display: none;
          transform: rotate(15deg);
          top: 6rem;
        }
        #buoy {
          position: absolute;
          width: 15rem;
          height: 15rem;
          opacity: 0;
          display: none;
          transform: rotate(-15deg);
          bottom: 35%;
          right: 0;
        }

        @media only screen and (min-width: 600px) {
          #anchor {
            opacity: 0.2;
            display: block;
          }
          #buoy {
            opacity: 0.2;
            display: block;
          }
        }
      `}</style>
    </main>
  );
};

export default DateChangeWrapper;
