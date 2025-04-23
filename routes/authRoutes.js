const express = require("express");
const router = express.Router();
const { checkUserId } = require("../controllers/authController");

router.get("/check-userid", checkUserId);

module.exports = router;
