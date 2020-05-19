import catchErrors from '../../middleware/withErrorHandler';

const getTides = async (req, res) => {
  const { month = '2020-01' } = req.query;
  const dets = await fetch(
    `https://www.tidessolunar.com/api/predictions/us/new-york/eatons-neck-point-long-island/${month}`
  );

  const data = await dets.json();

  res.statusCode = 200;
  res.json({ data });
};

export default catchErrors(getTides);
