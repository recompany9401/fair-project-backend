// controllers/productController.js
const Product = require("../models/Product");

/**
 * 1) GET /api/products/all
 *    - 필터 없이 모든 상품 목록 반환
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 2) GET /api/products
 *    - businessId가 필수
 *    - optional: search (productName 부분 검색)
 *    예) /api/products?businessId=12345&search=냉장고
 */
exports.getProducts = async (req, res) => {
  try {
    const { businessId, search } = req.query;
    if (!businessId) {
      return res.status(400).json({ message: "businessId is required" });
    }

    const filter = { businessId };

    if (search) {
      // productName OR option OR itemCategory
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { option: { $regex: search, $options: "i" } },
        { itemCategory: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 3) POST /api/products
 *    - 사업자가 품목/업체명/상품명/옵션/판매금액을 등록
 *    body 예: {
 *      businessId, itemCategory, businessName, productName, option, price
 *    }
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      businessId,
      itemCategory,
      businessName,
      productName,
      option,
      price,
    } = req.body;

    // 필수 필드 체크
    if (
      !businessId ||
      !itemCategory ||
      !businessName ||
      !productName ||
      price == null
    ) {
      return res.status(400).json({ message: "필수 필드가 누락됨" });
    }

    // 새 상품 생성
    const newProduct = new Product({
      businessId,
      itemCategory,
      businessName,
      productName,
      option,
      price: Number(price) || 0, // 판매금액
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ message: "상품 등록 성공", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
