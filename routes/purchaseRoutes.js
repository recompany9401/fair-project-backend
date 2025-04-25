const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router.get("/", purchaseController.getPurchases);
router.post("/", purchaseController.createPurchase);
router.get("/by-option", purchaseController.getPurchasesByOption);
router.get("/:purchaseId", purchaseController.getPurchaseById);
router.put("/:purchaseId", purchaseController.updatePurchase);
router.patch("/:purchaseId/status", purchaseController.updatePurchaseStatus);
router.delete("/:purchaseId", purchaseController.deletePurchase);

module.exports = router;
