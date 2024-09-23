const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  itemLike,
  itemUnlike,
} = require("../controllers/clothingItems");
const auth = require("../middleware/auth");

router.get("/", getItems);
router.use(auth);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", itemLike);
router.delete("/:itemId/likes", itemUnlike);

module.exports = router;
