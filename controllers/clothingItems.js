const Item = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const ForbiddenError = require("../errors/forbidden");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  Item.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(new ForbiddenError("Not permitted access"));
      }

      return item
        .deleteOne()
        .then(res.status(200).send({ message: "Item has been deleted" }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Invalid data"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

const itemLike = (req, res, next) => {
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
        return next(new NotFoundError("Invalid data"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

const itemUnlike = (req, res, next) => {
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
        return next(new NotFoundError("Invalid data"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, itemLike, itemUnlike };
