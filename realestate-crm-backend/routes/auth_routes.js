const express = require("express");
const { register, login, updateProfile, getBrokerProfile } = require("../controller/auth_controller");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, getBrokerProfile);
router.put("/profile", authenticateToken, updateProfile);

module.exports = router;
