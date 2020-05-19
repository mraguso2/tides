import Link from 'next/link';

const Header = () => (
  <div className="border-2 border-red-600 p-5 relative">
    <Link href="/">
      <a className="relative">
        <div className="flex shrinkIt">
          <h1 className="headingText text-blue-700 ml-2 text-2xl tracking-wide leading-7">
            Eaton's Neck Tides
          </h1>
        </div>
      </a>
    </Link>
    <style jsx>{`
      .logo {
        width: 65px;
        height: 65px;
      }
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
