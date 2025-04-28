const Buyer = require("../models/Buyer");
const bcrypt = require("bcrypt");

// 입주자 회원가입
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

    const existing = await Buyer.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    });

    await newBuyer.save();
    return res.status(201).json({ message: "입주자 회원가입 성공" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 내정보 조회
exports.getMyInfo = async (req, res) => {
  try {
    const myId = req.user.id;
    const buyer = await Buyer.findById(myId, { password: 0 });
    if (!buyer) {
      return res.status(404).json({ message: "내 정보가 없습니다." });
    }
    return res.json(buyer);
  } catch (error) {
    console.error("getMyInfo 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

//내정보 수정
exports.updateMyInfo = async (req, res) => {
  try {
    const myId = req.user.id;
    const { name, phoneNumber, dong, ho } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (dong) updateData.dong = dong;
    if (ho) updateData.ho = ho;

    const updated = await Buyer.findByIdAndUpdate(myId, updateData, {
      new: true,
      projection: { password: 0 },
    });
    if (!updated) {
      return res.status(404).json({ message: "내 정보가 없습니다." });
    }

    return res.json({
      message: "내 정보 수정 완료",
      buyer: updated,
    });
  } catch (error) {
    console.error("updateMyInfo 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
