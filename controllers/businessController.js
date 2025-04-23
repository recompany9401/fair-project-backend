const Business = require("../models/Business");
const bcrypt = require("bcrypt");

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

    // 중복 체크
    const existing = await Business.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사업자 생성
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
      // role: "BUSINESS" (기본값이라 생략 가능)
      // approved: false (기본값이라 생략 가능)
    });

    await newBusiness.save();
    return res.status(201).json({ message: "사업자 회원가입 성공" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// ─── 내 정보 조회 ───────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // authBusiness에서 req.user = decoded (userId, role 등)
    const businessId = req.user.userId; // JWT payload에 들어있다고 가정
    const business = await Business.findById(businessId);

    if (!business) {
      return res
        .status(404)
        .json({ message: "사업자 계정이 존재하지 않습니다." });
    }

    // 필요한 필드만 응답
    res.json({
      _id: business._id,
      userId: business.userId,
      name: business.name, // 상호명
      managerName: business.managerName, // 담당자명
      businessNumber: business.businessNumber,
      address: business.address,
      phoneNumber: business.phoneNumber,
      approved: business.approved,
      // ...원하는 필드 추가
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};
