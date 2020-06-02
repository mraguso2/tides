import Tides from './Tides';

const Dashboard = ({ date, tides }) => (
  <div className="dash p-5 relative">
    <div className="flex flex-col">
      <h1 className="headingText text-blue-700 ml-2 text-2xl tracking-wide leading-7">
        Today: {date}
      </h1>
      <Tides date={date} tides={tides} />
    </div>
    <style jsx>{`
      .headingText {
        font-family: 'Open Sans', sans-serif;
      }
      .dash {
        margin: auto auto 2rem auto;
        min-width: 300px;
        border-radius: 5px;
        position: relative;
        background: aliceblue;
        box-shadow: 0px 5px 20px rgb(108, 137, 160);
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
export default Dashboard;
