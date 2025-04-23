const Buyer = require("../models/Buyer");
const Business = require("../models/Business");
const Purchase = require("../models/Purchase");

// 사업자 전체 조회
exports.getAllBusinesses = async (req, res) => {
  try {
    const { approved } = req.query;

    const filter = {};

    if (approved === "true") {
      filter.approved = true;
    } else if (approved === "false") {
      filter.approved = false;
    }

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    return res.json(businesses);
  } catch (err) {
    console.error("getAllBusinesses 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 입주자 전체 조회
exports.getAllBuyers = async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};

    if (approved === "true") {
      filter.approved = true;
    } else if (approved === "false") {
      filter.approved = false;
    }

    const buyers = await Buyer.find(filter).sort({ createdAt: -1 });
    return res.json(buyers);
  } catch (err) {
    console.error("getAllBuyers 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 품목 필터 조회
exports.getAllPurchases = async (req, res) => {
  try {
    const { field, keyword } = req.query;
    const filter = {};
    if (field && keyword) {
      filter[field] = { $regex: keyword, $options: "i" };
    }

    const list = await Purchase.find(filter).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error("getAllPurchases 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 구매내역 상세 조회
exports.getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params; // id
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: "해당 구매 내역 없음" });
    }
    return res.json(purchase);
  } catch (err) {
    console.error("getPurchaseById 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 입주자 상세 조회
exports.getBuyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id, { password: 0 });

    if (!buyer) {
      return res
        .status(404)
        .json({ message: "해당 입주자 계정을 찾을 수 없음" });
    }
    return res.json(buyer);
  } catch (err) {
    console.error("getBuyerById 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 사업자 상세 조회
exports.getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id, { password: 0 });

    if (!business) {
      return res
        .status(404)
        .json({ message: "해당 사업자 계정을 찾을 수 없음" });
    }
    return res.json(business);
  } catch (err) {
    console.error("getBusinessById 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 사업자 가입 승인
exports.approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Business.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "사업자 계정 없음" });
    }
    return res.json({ message: "사업자 승인 완료", business: updated });
  } catch (err) {
    console.error("approveBusiness 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 입주자 가입 승인
exports.approveBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Buyer.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "입주자 계정 없음" });
    }
    return res.json({ message: "입주자 승인 완료", buyer: updated });
  } catch (err) {
    console.error("approveBuyer 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};
