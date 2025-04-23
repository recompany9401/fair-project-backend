const Buyer = require("../models/Buyer");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const {
      userId,
      password,
      name,
      phoneNumber,
      dong,
      ho,
      birthDate,
      gender,
      householdCount,
      personalInfoAgreement,
    } = req.body;

    // 중복 체크
    const existing = await Buyer.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 Buyer 생성
    const newBuyer = new Buyer({
      userId,
      password: hashedPassword,
      name,
      phoneNumber,
      dong,
      ho,
      birthDate: birthDate ? new Date(birthDate) : null,
      gender,
      householdCount,
      personalInfoAgreement,
      // role: "BUYER",
      // approved: false,
    });

    await newBuyer.save();
    return res.status(201).json({ message: "입주자 회원가입 성공" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
