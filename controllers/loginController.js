// controllers/loginController.js
const Buyer = require("../models/Buyer");
const Business = require("../models/Business");
const Admin = require("../models/Admin"); // ★ 관리자 모델 추가
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // 1) Buyer 먼저 찾기
    let user = await Buyer.findOne({ userId });
    let role = "BUYER";
    let businessName = null; // 사업자 상호명(기본 null)

    if (!user) {
      // 2) Buyer 없으면 Business에서 찾기
      const bizUser = await Business.findOne({ userId });
      if (!bizUser) {
        // 3) Business도 없으면 Admin에서 찾기
        const adminUser = await Admin.findOne({ userId });
        if (!adminUser) {
          // 4) Buyer/Business/Admin 다 없으면 에러
          return res
            .status(400)
            .json({ message: "존재하지 않는 아이디입니다." });
        }
        // ============ Admin 찾음 ============
        user = adminUser;
        role = "ADMIN";
        businessName = null; // 관리자에게는 상호명 같은 필드가 없으므로 null
      } else {
        // ============ Business 찾음 ============
        user = bizUser;
        role = "BUSINESS";
        businessName = bizUser.name; // 예: Business 스키마의 상호명이 'name' 필드라고 가정
      }
    }
    // else => 이미 Buyer 찾았으므로 role = "BUYER"

    // 5) 비밀번호 비교(bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 틀립니다." });
    }

    // 6) 관리자 승인 체크 (Admin 계정은 승인 개념 없다고 가정)
    //    => Buyer나 Business만 approved 필드 체크
    if (role !== "ADMIN") {
      if (!user.approved) {
        return res.status(403).json({
          message: "관리자 승인 대기중입니다. 승인 후 로그인 가능합니다.",
        });
      }
    }

    // 7) JWT 발급 (payload에 user._id, role)
    const token = jwt.sign(
      { userId: user._id.toString(), role },
      process.env.JWT_SECRET || "mytestsecret",
      { expiresIn: "1h" }
    );

    // 8) 로그인 성공 응답
    return res.status(200).json({
      message: "로그인 성공",
      token,
      role, // "BUYER" | "BUSINESS" | "ADMIN"
      userId: user._id,
      businessName, // 사업자일 때만 상호명 (BUYER/ADMIN이면 null)
    });
  } catch (error) {
    console.error("login 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
