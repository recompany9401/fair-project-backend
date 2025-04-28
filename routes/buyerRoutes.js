const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const buyerController = require("../controllers/buyerController");

router.post("/register", buyerController.register);
router.get("/me", authMiddleware, buyerController.getMyInfo);
router.patch("/me", authMiddleware, buyerController.updateMyInfo);

module.exports = router;
