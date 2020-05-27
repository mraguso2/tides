import Day from './Day';

const Upcoming = ({ futureDays, tides }) => (
  <div className="border-2 border-orange-600 p-5 relative">
    <div className="flex justify-between">
      {futureDays
        // .sort((a, b) => a.dt < b.dt)
        .map((day, i) => (
          <Day key={day.dt + i} day={day} tides={tides} />
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
export default Upcoming;
