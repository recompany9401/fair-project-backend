const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const Buyer = require("../models/Buyer");

// 구매 정보 등록
exports.createPurchase = async (req, res) => {
  try {
    const {
      buyerId,
      businessId,
      itemCategory,
      businessName,
      productName,
      option,
      price,
      discountOrSurcharge,
      finalPrice,
      deposit,
      contractDate,
      installationDate,
      note,
    } = req.body;

    if (
      !buyerId ||
      !itemCategory ||
      !businessName ||
      !productName ||
      !option ||
      price == null
    ) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    // Buyer DB에서 구매자명, 동/호수 가져오기
    let dongHoValue = "";
    let buyerNameValue = "";
    const buyer = await Buyer.findById(buyerId);
    if (buyer) {
      buyerNameValue = buyer.name || "";
      dongHoValue = `${buyer.dong}동 ${buyer.ho}호`;
    }

    const cDate = contractDate ? new Date(contractDate) : null;
    const iDate = installationDate ? new Date(installationDate) : null;

    let bizObjId = null;
    if (businessId) {
      bizObjId = new mongoose.Types.ObjectId(businessId);
    }

    const newPurchase = new Purchase({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      buyerName: buyerNameValue,
      businessId: bizObjId,
      dongHo: dongHoValue,

      itemCategory,
      businessName,
      productName,
      option,
      price: Number(price),
      discountOrSurcharge: discountOrSurcharge || 0,
      finalPrice:
        finalPrice || Number(price) - (Number(discountOrSurcharge) || 0),
      deposit: deposit || 0,
      contractDate: cDate,
      installationDate: iDate,
      note: note || "",
      status: "PENDING",
    });

    await newPurchase.save();

    return res.status(201).json({
      message: "구매 내역 등록 성공",
      purchase: newPurchase,
    });
  } catch (error) {
    console.error("구매 등록 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 특정 구매자의 전체 구매 목록 조회
exports.getPurchases = async (req, res) => {
  try {
    const { buyerId } = req.query;
    if (!buyerId) {
      return res.status(400).json({ message: "buyerId is required" });
    }

    const buyerObjectId = new mongoose.Types.ObjectId(buyerId);
    const list = await Purchase.find({ buyerId: buyerObjectId }).sort({
      createdAt: -1,
    });
    return res.json(list);
  } catch (error) {
    console.error("구매 리스트 조회 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 구매 상세 조회
exports.getPurchaseById = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "구매내역 없음" });
    }
    return res.json(purchase);
  } catch (err) {
    console.error("구매 상세 조회 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 구매 정보 수정
exports.updatePurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const updateData = req.body;

    if (updateData.price != null && updateData.discountOrSurcharge != null) {
      updateData.finalPrice =
        Number(updateData.price) - Number(updateData.discountOrSurcharge);
    }

    const updated = await Purchase.findByIdAndUpdate(purchaseId, updateData, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "구매내역 없음" });
    }
    return res.json({ message: "수정 성공", purchase: updated });
  } catch (err) {
    console.error("구매 수정 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 특정 옵션으로 구매 내역 조회
exports.getPurchasesByOption = async (req, res) => {
  try {
    const { businessId, itemCategory, productName, option, search } = req.query;

    let bizObjId = null;
    if (businessId) {
      bizObjId = new mongoose.Types.ObjectId(businessId);
    }

    const filter = {
      businessId: bizObjId,
      itemCategory,
      productName,
      option,
    };

    if (search) {
      filter.buyerName = { $regex: search, $options: "i" };
    }
    console.log("Final filter in getPurchasesByOption:", filter);
    const purchases = await Purchase.find(filter).sort({ createdAt: -1 });
    return res.json(purchases);
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 구매 상태 업데이트
exports.updatePurchaseStatus = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const { status } = req.body;

    if (!["CONFIRMED", "CANCELED"].includes(status)) {
      return res.status(400).json({ message: "올바르지 않은 status 값" });
    }

    const updated = await Purchase.findByIdAndUpdate(
      purchaseId,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "구매 내역 없음" });
    }

    return res.json({ message: "상태 업데이트 성공", purchase: updated });
  } catch (err) {
    console.error("updatePurchaseStatus 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};
