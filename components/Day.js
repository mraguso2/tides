import Tides from './Tides';

const Day = ({ day, color = '', tides }) => (
  <div className="p-3 relative">
    <div className="flex flex-col items-center">
      <h3 className="headingText text-blue-700 text-md pb-3" style={{ color: `${color}` }}>
        {day.dayOfWeek}, {day.date}
      </h3>
      <Tides date={day.date} size="base" tides={tides} />
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
export default Day;
