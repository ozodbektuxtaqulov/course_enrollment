import { verifyAccessToken } from "../library/jwt.js";
import User from "../models/user.model.js";

// Autentifikatsiya middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token topilmadi" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Foydalanuvchi topilmadi" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Yaroqsiz token" });
  }
};

export default authMiddleware;
