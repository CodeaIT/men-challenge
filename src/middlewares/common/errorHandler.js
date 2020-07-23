const errors = {
  UNAUTHORIZED: 'UnauthorizedError',
};

const errorHandler = (error, req, res, next) => {
  if (error.name === errors.UNAUTHORIZED) {
    res.status(401).send(error);
    return next();
  }
  res.status(500).send(error);
  return next();
};

export default errorHandler;
