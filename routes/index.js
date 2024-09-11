const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { defaultError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(defaultError).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
