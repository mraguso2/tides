import { format } from 'date-fns';
import catchErrors from '../../middleware/withErrorHandler';

const getTides = async (req, res) => {
  const { month = '2020-01' } = req.query;
  const dets = await fetch(
    `https://www.tidessolunar.com/api/predictions/us/new-york/eatons-neck-point-long-island/${month}`
  );
  if (dets.status === 500) {
    throw new Error('Server Error');
  }

  const output = await dets.json();

  const dayTides = output.days.map(day => day.tides);

  const flattenTides = [].concat(...dayTides);

  const data = Array.from(new Set(flattenTides.map(a => a.eventTime)))
    .map(eventTime => flattenTides.find(a => a.eventTime === eventTime))
    .sort((a, b) => a.eventTime < b.eventTime);

  res.statusCode = 200;
  res.json({ data });
};

export default catchErrors(getTides);
