import Joi from "joi";

// Ro'yxatdan o'tish validatsiyasi
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Ism kiritilishi shart",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Yaroqli email kiritilishi shart",
    "string.empty": "Email kiritilishi shart",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Parol kamida 6 belgidan iborat bolishi kerak",
    "string.empty": "Parol kiritilishi shart",
  }),
});

// Kirish validatsiyasi
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Yaroqli email kiritilishi shart",
    "string.empty": "Email kiritilishi shart",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Parol kiritilishi shart",
  }),
});

// OTP tekshirish validatsiyasi
const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Yaroqli email kiritilishi shart",
    "string.empty": "Email kiritilishi shart",
  }),
  code: Joi.string().length(6).required().messages({
    "string.length": "OTP kodi 6 belgidan iborat bolishi kerak",
    "string.empty": "OTP kodi kiritilishi shart",
  }),
});

export { registerSchema, loginSchema, verifyOtpSchema };
