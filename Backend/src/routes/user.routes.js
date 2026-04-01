const express = require("express");
const router = express.Router();

const { getUserAccount } = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

// 🔍 search user → get accountId
router.get("/getAccount", authMiddleware, getUserAccount);

module.exports = router;