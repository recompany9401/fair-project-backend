const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { updateBuyerByAdmin } = require("../controllers/adminBuyerController");

router.get("/businesses", adminController.getAllBusinesses);
router.get("/buyers", adminController.getAllBuyers);
router.get("/purchases", adminController.getAllPurchases);
router.get("/purchases/:id", adminController.getPurchaseById);
router.get("/purchases/:purchaseId", adminController.getPurchaseById);
router.get("/buyers/:id", adminController.getBuyerById);
router.get("/businesses/:id", adminController.getBusinessById);
router.patch("/business/:id/approve", adminController.approveBusiness);
router.patch("/buyer/:id/approve", adminController.approveBuyer);

router.patch("/buyers/:id", updateBuyerByAdmin);

module.exports = router;
