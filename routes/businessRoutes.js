// routes/businessRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const businessController = require("../controllers/businessController");

// ─────────────────────────────────────────────────────────────
//  1) 인증 미들웨어 (사업자 전용)
//     - Authorization: "Bearer <JWT>" 헤더로부터 토큰을 꺼내 검증
//     - role이 "BUSINESS" 여야 통과
// ─────────────────────────────────────────────────────────────
function authBusiness(req, res, next) {
  try {
    const authHeader = req.headers.authorization; // 예: "Bearer xxxxxxx"
    if (!authHeader) {
      return res.status(401).json({ message: "토큰이 없습니다." });
    }

    const token = authHeader.split(" ")[1]; // "Bearer" 다음 토큰 부분
    const secretKey = process.env.JWT_SECRET;

    // 토큰 검증
    const decoded = jwt.verify(token, secretKey);

    // payload에서 role이 BUSINESS인지 확인
    if (decoded.role !== "BUSINESS") {
      return res.status(403).json({ message: "사업자 전용 API입니다." });
    }

    // req.user에 토큰 정보 저장 (userId, role 등)
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "토큰 검증 실패" });
  }
}

// ─────────────────────────────────────────────────────────────
//  2) 사업자 회원가입 (POST /api/businesses/register)
// ─────────────────────────────────────────────────────────────
router.post("/register", businessController.register);

// ─────────────────────────────────────────────────────────────
//  3) 사업자 내 정보 (GET /api/businesses/me)
//     - 토큰 인증 -> 현재 로그인한 사업자 정보 반환
// ─────────────────────────────────────────────────────────────
router.get("/me", authBusiness, businessController.getMe);

module.exports = router;
