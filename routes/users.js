const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const {
  validateUserBody,
  validateUserEditBody,
} = require("../middleware/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserEditBody, updateProfile);

module.exports = router;
