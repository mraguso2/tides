const Header = ({ date }) => (
  <div className="border-2 border-orange-600 p-5 relative">
    <div className="flex">
      <h1 className="headingText text-blue-700 ml-2 text-2xl tracking-wide leading-7">
        Today: {date}
      </h1>
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

export default Header;
