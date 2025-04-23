// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// 관리자 전용 미들웨어(권한체크) 생략 가능
// router.use(checkAdminMiddleware);

router.get("/businesses", adminController.getAllBusinesses);
router.get("/buyers", adminController.getAllBuyers);
router.get("/purchases", adminController.getAllPurchases);
router.get("/purchases/:id", adminController.getPurchaseById);
router.get("/purchases/:purchaseId", adminController.getPurchaseById);
router.get("/buyers/:id", adminController.getBuyerById);
router.get("/businesses/:id", adminController.getBusinessById);
router.patch("/business/:id/approve", adminController.approveBusiness);
router.patch("/buyer/:id/approve", adminController.approveBuyer);

module.exports = router;
