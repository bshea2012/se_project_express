const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  itemLike,
  itemUnlike,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", itemLike);
router.delete("/:itemId/likes", itemUnlike);

module.exports = router;
