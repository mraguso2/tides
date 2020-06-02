import Link from 'next/link';

const Header = () => (
  <div className="theNeck pt-5 relative">
    <div className="" />
    <Link href="/">
      <a className="relative">
        <div className="flex shrinkIt">
          <h1 className="headingText text-blue-700 ml-2 text-2xl tracking-wide leading-7">
            Eaton's Neck Tides
          </h1>
        </div>
      </a>
    </Link>
    <div className="row dark-blue">
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
            style={{ opacity: 1, fill: '#273a4c' }}
            d="M-40,71.627C20.307,71.627,20.058,32,80,32s60.003,40,120,40s59.948-40,120-40s60.313,40,120,40s60.258-40,120-40s60.202,40,120,40s60.147-40,120-40s60.513,40,120,40s60.036-40,120-40c59.964,0,60.402,40,120,40s59.925-40,120-40s60.291,40,120,40s60.235-40,120-40s60.18,40,120,40s59.82,0,59.82,0l0.18,26H-60V72L-40,71.627z"
          />
          <path
            className=""
            style={{ opacity: 1, fill: '#2a3f54' }}
            d="M-40,83.627C20.307,83.627,20.058,44,80,44s60.003,40,120,40s59.948-40,120-40s60.313,40,120,40s60.258-40,120-40s60.202,40,120,40s60.147-40,120-40s60.513,40,120,40s60.036-40,120-40c59.964,0,60.402,40,120,40s59.925-40,120-40s60.291,40,120,40s60.235-40,120-40s60.18,40,120,40s59.82,0,59.82,0l0.18,14H-60V84L-40,83.627z"
          />
          <path
            className=""
            style={{ fill: 'rgb(34, 49, 63)' }}
            d="M-40,95.627C20.307,95.627,20.058,56,80,56s60.003,40,120,40s59.948-40,120-40s60.313,40,120,40s60.258-40,120-40s60.202,40,120,40s60.147-40,120-40s60.513,40,120,40s60.036-40,120-40c59.964,0,60.402,40,120,40s59.925-40,120-40s60.291,40,120,40s60.235-40,120-40s60.18,40,120,40s59.82,0,59.82,0l0.18,138H-60V96L-40,95.627z"
          />
        </svg>
      </div>
    </div>
    <style jsx>{`
      .theNeck {
        background-image: url('EatonsNeck.JPG');
        background-size: cover;
        background-position: bottom;
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .logo {
        width: 65px;
        height: 65px;
      }
      .headingText {
        font-family: 'Open Sans', sans-serif;
        padding: 5px;
        background: #c4d9fb;
        border-radius: 5px;
        box-shadow: 0px 5px 20px rgba(9, 50, 121, 0.73);
        color: #23313f;
        top: 25px;
        position: relative;
        top: -65px;
        left: 10px;
      }
      .headingText {
        font-family: 'Open Sans', sans-serif;
        padding: 5px 10px;
        background: #c4fafb;
        border-radius: 5px;
        box-shadow: 0px 5px 20px rgb(162, 217, 218);
        color: #23313f;
        position: relative;
        top: -65px;
        left: 10px;
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

export default Header;
