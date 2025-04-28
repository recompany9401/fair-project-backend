const Business = require("../models/Business");
const bcrypt = require("bcrypt");

// 사업자 회원가입
exports.register = async (req, res) => {
  try {
    const {
      userId,
      password,
      name,
      businessNumber,
      representativeName,
      address,
      businessType,
      businessCategory,
      managerName,
      phoneNumber,
    } = req.body;

    const existing = await Business.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBusiness = new Business({
      userId,
      password: hashedPassword,
      name,
      businessNumber,
      representativeName,
      address,
      businessType,
      businessCategory,
      managerName,
      phoneNumber,
    });

    await newBusiness.save();
    return res.status(201).json({ message: "사업자 회원가입 성공" });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.businessNumber === 1) {
        return res
          .status(400)
          .json({ message: "이미 등록된 사업자번호입니다." });
      } else if (error.keyPattern && error.keyPattern.userId === 1) {
        return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
      } else {
        return res.status(400).json({ message: "중복된 데이터가 존재합니다." });
      }
    }

    console.error("사업자 회원가입 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 사업자 내 정보 조회
exports.getMe = async (req, res) => {
  try {
    const businessId = req.user.userId;
    const business = await Business.findById(businessId);

    if (!business) {
      return res
        .status(404)
        .json({ message: "사업자 계정이 존재하지 않습니다." });
    }

    res.json({
      _id: business._id,
      userId: business.userId,
      name: business.name,
      managerName: business.managerName,
      businessNumber: business.businessNumber,
      address: business.address,
      phoneNumber: business.phoneNumber,
      approved: business.approved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};
