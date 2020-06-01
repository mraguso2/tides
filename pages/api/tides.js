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

  const editedTides = flattenTides.map(tide => {
    const estTime = `${tide.eventTime}-04:00`;
    return { ...tide, eventTime: estTime };
  });

  const data = Array.from(new Set(editedTides.map(a => a.eventTime)))
    .map(eventTime => editedTides.find(a => a.eventTime === eventTime))
    .sort((a, b) => a.eventTime < b.eventTime);

  res.statusCode = 200;
  res.json({ data });
};

export default catchErrors(getTides);
