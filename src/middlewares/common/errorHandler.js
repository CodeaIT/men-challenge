const errors = {
  UNAUTHORIZED: 'UnauthorizedError',
};

const errorHandler = (error, req, res, next) => {
  if (error.name === errors.UNAUTHORIZED) {
    return res.status(401).send(error);
  }
  res.status(500).send(error);
  return next();
};

export default errorHandler;
