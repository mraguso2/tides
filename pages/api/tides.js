import { format } from 'date-fns';
// import data2020 from '../../Data/2020data.json';
// import data2021 from '../../Data/2021data.json';
// import data2022 from '../../Data/2022data.json';
import data2023 from '../../Data/2023data.json';
import data2024 from '../../Data/2024data.json';

/*  ================================
    Need to run *LOCALLY IN NY* :) only when to format the data
    Data Source: https://tidesandcurrents.noaa.gov/noaatideannual.html?id=8515786
        TimeZone: LST/LDT
        Datum: MSL
        24 hour Clock
        Format: XML

    START
    ================================
*/

function setDateSt(dateInitial, timeInitial) {
  const [year, month, day] = dateInitial.split('/').map(item => parseInt(item));
  const [hour, min] = timeInitial.split(':').map(item => parseInt(item));
  const d = format(new Date(year, month - 1, day, hour, min, 0), "yyyy-MM-dd'T'HH:mm:ssxxx");
  return d;
}

function setMonthSt(dateInitial) {
  const [year, month] = dateInitial.split('/');
  return `mm_${year}-${month}`;
}

function formatData(dataYear) {
  const {
    datainfo: {
      data: { item: days }
    }
  } = dataYear;

  const formattedDays = days.map(day => {
    const eventTime = setDateSt(day.date, day.time);
    const type = day.highlow === 'L' ? 'Low' : 'High';
    const month = setMonthSt(day.date);
    return { eventTime, type, month };
  });

  const formattedMonths = formattedDays.reduce((acc, prev) => {
    if (!acc[prev.month]) {
      acc[prev.month] = [];
    }
    acc[prev.month].push(prev);
    return acc;
  }, {});

  return formattedMonths;
}

/*  ================================
    Years Run & Date Performed
      2020:   Yes   11/11/2020
      2021:   Yes   11/11/2020
      2022:   Yes   11/11/2020
      2023:   Yes   03/09/2023
    ================================ */

const getDemTides = (req, res) => {
  // const d2020 = formatData(data2020);
  // const d2021 = formatData(data2021);
  // const d2022 = formatData(data2022);
  const d2023 = formatData(data2023);
  const d2024 = formatData(data2024);
  res.json({ data: { ...d2023, ...d2024 } });
  res.json({ data: { ...d2023, ...d2024 } });
};

export default getDemTides;

/*  ================================
    END
    ================================
*/

/*  ================================
    Old broken way of getting tides :(
    was just a matter of time before tidessolunar/tidespro locked up that api :)
    ================================
*/
// import catchErrors from '../../middleware/withErrorHandler';

// const getTides = async (req, res) => {
//   const { month = '2020-01' } = req.query;
//   const dets = await fetch(
//     `https://www.tidessolunar.com/api/predictions/us/new-york/eatons-neck-point-long-island/${month}`
//   );
//   if (dets.status === 500) {
//     throw new Error('Server Error');
//   }

//   const output = await dets.json();

//   const dayTides = output.days.map(day => day.tides);

//   const flattenTides = [].concat(...dayTides);

//   const editedTides = flattenTides.map(tide => {
//     const estTime = `${tide.eventTime}-04:00`;
//     return { ...tide, eventTime: estTime };
//   });

//   const data = Array.from(new Set(editedTides.map(a => a.eventTime)))
//     .map(eventTime => editedTides.find(a => a.eventTime === eventTime))
//     .sort((a, b) => a.eventTime < b.eventTime);

//   res.statusCode = 200;
//   res.json({ data });
// };

// export default catchErrors(getTides);
