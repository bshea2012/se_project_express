const Item = require("../models/clothingItem");
const {
  castError,
  documentNotFoundError,
  defaultError,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => res.status(defaultError).send({ message: err.message }));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: err.message });
      }

      return res.status(defaultError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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

const itemLike = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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

const itemUnlike = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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

module.exports = { getItems, createItem, deleteItem, itemLike, itemUnlike };
