const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  itemLike,
  itemUnlike,
} = require("../controllers/clothingItems");
const auth = require("../middleware/auth");
const {
  validateItemId,
  validateCardBody,
} = require("../middleware/validation");

router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, itemLike);
router.delete("/:itemId/likes", validateItemId, itemUnlike);

module.exports = router;
