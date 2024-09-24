const Item = require("../models/clothingItem");
const {
  castError,
  documentNotFoundError,
  forbiddenError,
  defaultError,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" })
    );
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  Item.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(forbiddenError)
          .send({ message: "Not permitted access" });
      }

      return item
        .deleteOne()
        .then(res.status(200).send({ message: "Item has been deleted" }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Invalid data" });
      }

      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
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
        return res
          .status(documentNotFoundError)
          .send({ message: "Invalid data" });
      }

      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
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
        return res
          .status(documentNotFoundError)
          .send({ message: "Invalid data" });
      }

      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }

      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getItems, createItem, deleteItem, itemLike, itemUnlike };
