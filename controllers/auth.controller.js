import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../library/hash.js";
import { generateAccessToken, generateRefreshToken } from "../library/jwt.js";
import generateOTP from "../library/otp.js";
import sendOTP from "../library/email.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
} from "../validators/auth.validator.js";

// Ro'yxatdan o'tish
const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email allaqachon royxatdan otgan" });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 daqiqa

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await user.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: "OTP emailga yuborildi" });
  } catch (error) {
    next(error);
  }
};

// OTP tekshirish
const verifyOtp = async (req, res, next) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== code || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Yaroqsiz yoki muddati tugagan OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Email tasdiqlandi" });
  } catch (error) {
    next(error);
  }
};

// Kirish
const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Notogri email yoki parol" });
    }

    if (user.otp) {
      return res.status(400).json({ message: "Email tasdiqlanmagan" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Refresh token kiritilishi shart" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Yaroqsiz refresh token" });
    }

    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

// Chiqish
const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: "Muvaffaqiyatli chiqildi" });
  } catch (error) {
    next(error);
  }
};

export { register, verifyOtp, login, refresh, logout };
