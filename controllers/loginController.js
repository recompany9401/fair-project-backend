const Buyer = require("../models/Buyer");
const Business = require("../models/Business");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 로그인 처리
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    let user = await Buyer.findOne({ userId });
    let role = "BUYER";
    let businessName = null;

    if (!user) {
      const bizUser = await Business.findOne({ userId });
      if (!bizUser) {
        const adminUser = await Admin.findOne({ userId });
        if (!adminUser) {
          return res
            .status(400)
            .json({ message: "존재하지 않는 아이디입니다." });
        }

        user = adminUser;
        role = "ADMIN";
        businessName = null;
      } else {
        user = bizUser;
        role = "BUSINESS";
        businessName = bizUser.name;
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 틀립니다." });
    }

    if (role !== "ADMIN") {
      if (!user.approved) {
        return res.status(403).json({
          message: "관리자 승인 대기중입니다. 승인 후 로그인 가능합니다.",
        });
      }
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "로그인 성공",
      token,
      role,
      userId: user._id,
      businessName,
    });
  } catch (error) {
    console.error("login 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
