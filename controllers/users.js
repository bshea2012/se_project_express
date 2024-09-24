const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  castError,
  documentNotFoundError,
  authorizationError,
  existingError,
  defaultError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email already in use");
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({ email, password: hash, name, avatar }).then((user) =>
        res
          .status(201)
          .send({ name: user.name, email: user.email, avatar: user.avatar })
      )
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      if (err.message === "Email already in use") {
        return res
          .status(existingError)
          .send({ message: "An account already exists with this email" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(castError).send({ message: `Invalid data` });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(authorizationError).send({ message: "Invalid data" });
      }

      return res.status(defaultError).send({ message: "Not authorized" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Invalid data" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Invalid data" });
      }

      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
