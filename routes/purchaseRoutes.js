// routes/purchaseRoutes.js
const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// 1) 구매 목록 (buyerId 등으로 필터)
router.get("/", purchaseController.getPurchases);
// 2) 구매 등록
router.post("/", purchaseController.createPurchase);

// 3) 옵션별 구매내역 조회 (중요: 이 라우트를 purchaseId 라우트보다 상단에!)
router.get("/by-option", purchaseController.getPurchasesByOption);

// 4) 구매 상세조회 (purchaseId)
router.get("/:purchaseId", purchaseController.getPurchaseById);

// 5) 구매 수정 (PUT)
router.put("/:purchaseId", purchaseController.updatePurchase);

// 6) 구매 상태 변경 (PATCH)
router.patch("/:purchaseId/status", purchaseController.updatePurchaseStatus);

module.exports = router;
