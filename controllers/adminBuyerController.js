const Buyer = require("../models/Buyer");
const bcrypt = require("bcrypt");

exports.updateBuyerByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      name,
      phoneNumber,
      dong,
      ho,
      birthDate,
      gender,
      householdCount,
      password,
    } = req.body;

    if (userId !== undefined) {
      const existing = await Buyer.findOne({ userId });
      if (existing && String(existing._id) !== id) {
        return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
      }
    }

    // 1. 기존 값 출력
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return res.status(404).json({ message: "존재하지 않는 Buyer" });
    }

    // 2. 값 변경
    if (userId !== undefined) buyer.userId = userId;
    if (name !== undefined) buyer.name = name;
    if (phoneNumber !== undefined) buyer.phoneNumber = phoneNumber;
    if (dong !== undefined) buyer.dong = dong;
    if (ho !== undefined) buyer.ho = ho;
    if (birthDate !== undefined) buyer.birthDate = birthDate;
    if (gender !== undefined) buyer.gender = gender;
    if (householdCount !== undefined)
      buyer.householdCount = Number(householdCount);

    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "비밀번호는 8자리 이상이어야 합니다." });
      }
      const hashed = await bcrypt.hash(password, 10);
      buyer.password = hashed;
    }

    await buyer.save();

    // 4. 결과 반환
    return res.json({
      message: "수정 완료",
      buyer,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }
    return res.status(500).json({ message: "서버 오류" });
  }
};
