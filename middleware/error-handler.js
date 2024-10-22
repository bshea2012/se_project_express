const { DefaultError } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || DefaultError;
  const message = err.message || "An error has occurred on the server";

  res.status(status).send({ message });
  next();
};
