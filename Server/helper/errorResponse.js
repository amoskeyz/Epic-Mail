const errorResponse = (statCode, error, res) => res.status(statCode).json({
  status: 'Failure',
  error,
});

export default errorResponse;
