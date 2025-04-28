const Buyer = require("../models/Buyer");
const bcrypt = require("bcrypt");

exports.updateBuyerByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phoneNumber,
      dong,
      ho,
      birthDate,
      gender,
      householdCount,
      password,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (dong !== undefined) updateData.dong = dong;
    if (ho !== undefined) updateData.ho = ho;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (gender !== undefined) updateData.gender = gender;
    if (householdCount !== undefined) {
      updateData.householdCount = Number(householdCount);
    }

    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "비밀번호는 8자리 이상이어야 합니다." });
      }
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updated = await Buyer.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "존재하지 않는 Buyer" });
    }

    return res.json({
      message: "수정 완료",
      buyer: updated,
    });
  } catch (error) {
    console.error("updateBuyerByAdmin 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
