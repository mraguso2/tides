const withErrorHandler = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ exception: { code: 500, message: error.message } });
      return;
    }
    res.status(error.code || 500).json({ exception: error });
  }
};

export default withErrorHandler;
