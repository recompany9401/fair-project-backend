const Product = require("../models/Product");
const Purchase = require("../models/Purchase");

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

// 품목 수정
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemCategory, productName, option, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }

    const oldCategory = product.itemCategory;
    const oldPName = product.productName;
    const oldOpt = product.option;

    product.itemCategory = itemCategory || product.itemCategory;
    product.productName = productName || product.productName;
    product.option = option || product.option;
    if (price !== undefined) {
      product.price = Number(price);
    }
    await product.save();

    await Purchase.updateMany(
      {
        itemCategory: oldCategory,
        productName: oldPName,
        option: oldOpt,
      },
      {
        itemCategory: product.itemCategory,
        productName: product.productName,
        option: product.option,
      }
    );

    return res.json({ message: "수정 완료", product });
  } catch (err) {
    console.error("updateProduct 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 품목 삭제
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "상품(옵션)을 찾을 수 없음" });
    }

    const purchaseExists = await Purchase.findOne({
      itemCategory: product.itemCategory,
      productName: product.productName,
      option: product.option,
    });
    if (purchaseExists) {
      return res.status(400).json({
        message: "구매 데이터가 존재하여 삭제할 수 없습니다.",
      });
    }

    await Product.findByIdAndDelete(id);
    return res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("deleteProduct 오류:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};
