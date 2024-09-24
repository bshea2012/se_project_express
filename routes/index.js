const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { documentNotFoundError } = require("../utils/errors");
const auth = require("../middleware/auth");
const { createUser, login } = require("../controllers/users");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(documentNotFoundError).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
