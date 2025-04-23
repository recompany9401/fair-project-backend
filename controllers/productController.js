const Product = require("../models/Product");

// 전체 상품 목록 조회
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 특정 사업자 상품 목록 조회 (검색 포함)
exports.getProducts = async (req, res) => {
  try {
    const { businessId, search } = req.query;
    if (!businessId) {
      return res.status(400).json({ message: "businessId is required" });
    }

    const filter = { businessId };

    if (search) {
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

// 사업자 품목 등록
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

    if (
      !businessId ||
      !itemCategory ||
      !businessName ||
      !productName ||
      price == null
    ) {
      return res.status(400).json({ message: "필수 필드가 누락됨" });
    }

    const newProduct = new Product({
      businessId,
      itemCategory,
      businessName,
      productName,
      option,
      price: Number(price) || 0,
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
