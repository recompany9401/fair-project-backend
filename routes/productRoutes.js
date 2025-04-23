// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// 1) 전체 상품 조회
router.get("/all", productController.getAllProducts);

// 2) 특정 businessId + search (optional)
router.get("/", productController.getProducts);

// 3) 새 상품 등록 (사업자)
router.post("/", productController.createProduct);

module.exports = router;
