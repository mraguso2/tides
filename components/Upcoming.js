import Day from './Day';

const days = ['Tomorrow', 'Overmorrow', 'Following'];

const Upcoming = ({ futureDays, tides }) => (
  <div className="upcoming relative w-full">
    <div className="flex flex-col justify-between">
      {futureDays
        // .sort((a, b) => a.dt < b.dt)
        .map((day, i) => (
          <div key={day.dt + i} className="flex flex-col">
            <div className="flex">
              <h3 className="dayTitle self-center text-center origin-center w-32">{days[i]}</h3>
              <Day day={day} tides={tides} />
            </div>

            <div>
              <svg
                id=""
                preserveAspectRatio="xMidYMax meet"
                className="svg-separator sep3"
                viewBox="0 0 1300 125"
                data-height="125"
              >
                <path
                  className=""
                  style={{ opacity: 1, fill: '#83bfe9' }}
                  d="M-40,71.627C20.307,71.627,20.058,32,80,32s60.003,40,120,40s59.948-40,120-40s60.313,40,120,40s60.258-40,120-40s60.202,40,120,40s60.147-40,120-40s60.513,40,120,40s60.036-40,120-40c59.964,0,60.402,40,120,40s59.925-40,120-40s60.291,40,120,40s60.235-40,120-40s60.18,40,120,40s59.82,0,59.82,0l0.18,26H-60V72L-40,71.627z"
                />
                <path
                  className=""
                  style={{ opacity: 1, fill: '#406991' }}
                  d="M-40,83.627C20.307,83.627,20.058,44,80,44s60.003,40,120,40s59.948-40,120-40s60.313,40,120,40s60.258-40,120-40s60.202,40,120,40s60.147-40,120-40s60.513,40,120,40s60.036-40,120-40c59.964,0,60.402,40,120,40s59.925-40,120-40s60.291,40,120,40s60.235-40,120-40s60.18,40,120,40s59.82,0,59.82,0l0.18,14H-60V84L-40,83.627z"
                />
                <path
                  className=""
                  style={{ fill: `${i === 2 ? 'rgb(35, 49, 63)' : 'rgb(240, 248, 255)'}` }}
                  d="M-40,95.627C20.307,95.627,20.058,56,80,56s60.003,40,120,40s59.948-40,120-40s60.313,40,120,40s60.258-40,120-40s60.202,40,120,40s60.147-40,120-40s60.513,40,120,40s60.036-40,120-40c59.964,0,60.402,40,120,40s59.925-40,120-40s60.291,40,120,40s60.235-40,120-40s60.18,40,120,40s59.82,0,59.82,0l0.18,138H-60V96L-40,95.627z"
                />
              </svg>
            </div>
          </div>
        ))}
    </div>

    <style jsx>{`
      .dayTitle {
        transform: rotate(-25deg);
        color: #057173;
        font-weight: 500;
      }
      .headingText {
        font-family: 'Open Sans', sans-serif;
      }
      .upcoming {
        background: aliceblue;
        margin: auto auto 3rem auto;
        max-width: 450px;
        border-radius: 5px;
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
