const User = require("../models/user");
const {
  castError,
  documentNotFoundError,
  defaultError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(defaultError).send({ message: err.message }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }

      return res.status(defaultError).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: err.message });
      }

      return res.status(defaultError).send({ message: err.message });
    });
};

module.exports = { getUsers, getUser, createUser };
