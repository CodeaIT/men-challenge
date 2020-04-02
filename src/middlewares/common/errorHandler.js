const errorHandler = (error, req, res, next) => {
  res.status(500).send(error);
  next();
};

export default errorHandler;
