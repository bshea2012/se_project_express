const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserBody } = require("../middleware/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserBody, updateProfile);

module.exports = router;
