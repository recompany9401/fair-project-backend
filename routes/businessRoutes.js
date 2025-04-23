const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const businessController = require("../controllers/businessController");

// 인증 미들웨어 (사업자 전용)
function authBusiness(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "토큰이 없습니다." });
    }

    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, secretKey);

    if (decoded.role !== "BUSINESS") {
      return res.status(403).json({ message: "사업자 전용 API입니다." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "토큰 검증 실패" });
  }
}

router.post("/register", businessController.register);
router.get("/me", authBusiness, businessController.getMe);

module.exports = router;
