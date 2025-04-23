require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const businessRoutes = require("./routes/businessRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// DB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas 연결 성공"))
  .catch((err) => console.error("MongoDB Atlas 연결 실패:", err));

// 라우트
app.use("/api/businesses", businessRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/admin", adminRoutes);

// 테스트 라우트
app.get("/", (req, res) => {
  res.send("백엔드 서버 정상 동작 중!");
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
