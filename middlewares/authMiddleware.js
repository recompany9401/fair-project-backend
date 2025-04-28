const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "유효하지 않은 인증 형식입니다." });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("인증 미들웨어 오류:", error);
    return res
      .status(401)
      .json({ message: "유효하지 않은 토큰이거나 만료되었습니다." });
  }
};
