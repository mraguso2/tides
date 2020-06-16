import Head from 'next/head';
import Header from '../components/Header';
import DateChangeContainer from '../components/DateChangeContainer';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Eatons Neck Tides</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link rel="icon" href="/favtide.jpg" />
        <meta
          name="description"
          content="A quick and easy way to find out the ocean high and low tide times in Eatons Neck/Northport, NY"
        />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <Header />
      <DateChangeContainer />
      <footer className="bg-white">
        <p>Powered by Ocean Vibes 🏖</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: auto;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 65px;
          // border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 5px solid #83bfe9;
        }

        footer p {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          background-color: #ebf8ff;
          background-color: rgb(34, 49, 63);
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
