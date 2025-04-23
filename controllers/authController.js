const Buyer = require("../models/Buyer");
const Business = require("../models/Business");
const Admin = require("../models/Admin");

// 아이디 중복체크
exports.checkUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const buyer = await Buyer.findOne({ userId });
    if (buyer) {
      return res.json({ exists: true, role: "BUYER" });
    }

    const business = await Business.findOne({ userId });
    if (business) {
      return res.json({ exists: true, role: "BUSINESS" });
    }

    const admin = await Admin.findOne({ userId });
    if (admin) {
      return res.json({ exists: true, role: "ADMIN" });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("checkUserId 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
