// controllers/adminController.js
const Buyer = require("../models/Buyer");
const Business = require("../models/Business");
const Purchase = require("../models/Purchase");

/**
 * (1) 사업자 전체 조회 (GET /api/admin/businesses)
 */
// controllers/adminController.js (예시)
exports.getAllBusinesses = async (req, res) => {
  try {
    // 쿼리 파라미터 approved
    const { approved } = req.query;

    // (A) 필터 객체
    const filter = {};

    // (B) 만약 approved가 'false'라면, filter.approved = false
    //     approved가 'true'라면, filter.approved = true
    //     없으면 필터에 넣지 않음
    if (approved === "true") {
      filter.approved = true;
    } else if (approved === "false") {
      filter.approved = false;
    }

    // DB 검색 시 filter 적용
    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    return res.json(businesses);
  } catch (err) {
    console.error("getAllBusinesses 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * (2) 입주자 전체 조회 (GET /api/admin/buyers)
 */
exports.getAllBuyers = async (req, res) => {
  try {
    const { approved } = req.query; // "true" or "false" or undefined
    const filter = {};

    // approved가 "true"면 filter.approved = true
    // approved가 "false"면 filter.approved = false
    // undefined이면 전체 조회
    if (approved === "true") {
      filter.approved = true;
    } else if (approved === "false") {
      filter.approved = false;
    }

    // DB 검색
    const buyers = await Buyer.find(filter).sort({ createdAt: -1 });
    return res.json(buyers);
  } catch (err) {
    console.error("getAllBuyers 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * (3) 구매 내역 전체 조회 (GET /api/admin/purchases)
 *    - 필요시 ?businessId=xxx or ?buyerId=xxx 로 필터링 가능
 */
// controllers/adminController.js
exports.getAllPurchases = async (req, res) => {
  try {
    const { field, keyword } = req.query;
    const filter = {};

    // field: "buyerName" / "businessName" / "itemCategory" / "productName" / "option"
    // keyword: 검색어
    if (field && keyword) {
      // 부분 일치 검색 (정규식)
      filter[field] = { $regex: keyword, $options: "i" };
    }

    const list = await Purchase.find(filter).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error("getAllPurchases 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

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

// (B) 입주자 상세
exports.getBuyerById = async (req, res) => {
  try {
    const { id } = req.params;
    // 전체 필드
    const buyer = await Buyer.findById(id, { password: 0 });
    // password 필드 제외(1)

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

// (A) 사업자 상세
exports.getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    // 전체 필드
    const business = await Business.findById(id, { password: 0 });
    // password 필드는 제외(1)

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

exports.approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    // approved => true
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
