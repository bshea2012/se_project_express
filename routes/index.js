const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { documentNotFoundError } = require("../utils/errors");
const auth = require("../middleware/auth");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateAuthLoginBody,
} = require("../middleware/validation");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthLoginBody, login);

router.use((req, res) => {
  res.status(documentNotFoundError).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
